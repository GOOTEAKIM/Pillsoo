
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from konlpy.tag import Okt
from typing import List, Tuple

import ray

ray.init(num_cpus=16, num_gpus=1, ignore_reinit_error=True)

# 전처리 함수 (명사 추출)
@ray.remote
def preprocess_text(text: str) -> str:
    okt = Okt()  # 각 Ray 작업자에서 Okt 인스턴스 생성
    nouns = okt.nouns(text)
    return ' '.join(nouns)

# 단일 단어에 대한 유사도 계산 함수 (Ray 병렬 처리)
@ray.remote
def calculate_similarity_for_word(word: str, db_items: List[Tuple[int, str, str, str, str]]) -> List[Tuple[int, str, str, str, str, float]]:
    # 이미 전처리된 PREPROCESSED_TEXT 사용
    db_texts = [item[3] for item in db_items]  # item[3]가 PREPROCESSED_TEXT라 가정

    # 입력된 단어와 DB의 PREPROCESSED_TEXT를 벡터화
    texts = [word] + db_texts
    vectorizer = TfidfVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()

    # 유사도 계산
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:])
    similarity_scores = list(enumerate(cosine_sim[0]))

    return similarity_scores


# 병렬 처리로 단어별 유사도 계산
def calculate_similarity(input_text: str, db_items: List[Tuple[int, str, str, str, str]]) -> List[Tuple[int, str, str, str, str]]:
    # 입력 텍스트를 명사로 추출 (Ray로 병렬 처리)
    preprocessed_text = ray.get(preprocess_text.remote(input_text))
    
    # 명사 추출된 텍스트를 단어로 분리
    words = preprocessed_text.split()

    # Ray를 사용한 병렬 처리
    futures = [calculate_similarity_for_word.remote(word, db_items) for word in words]
    results = ray.get(futures)

    # 결과를 저장할 딕셔너리
    combined_scores = {}

    # 유사도 점수를 합산
    for similarity_scores in results:
        for idx, score in similarity_scores:
            combined_scores[idx] = combined_scores.get(idx, 0) + score

    # 유사도 점수에 따라 상위 3개의 결과 정렬
    sorted_scores = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
    top_matches = sorted_scores[:3]

    return [db_items[i[0]] for i in top_matches]  # 상위 3개의 데이터 반환

if __name__ == "__main__":
    if not ray.is_initialized():
        ray.init(num_cpus=16, num_gpus=1, ignore_reinit_error=True)
