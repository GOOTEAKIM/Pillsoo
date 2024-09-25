# app/routers/recommend.py

import hashlib
import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db, r, mongo_collection
from ..crud import get_functionality_items, get_supplements_by_age
from ..similarity import calculate_similarity, preprocess_text
from typing import List, Dict, Any

# FastAPI 라우터 설정
router = APIRouter()

def generate_cache_key(text: str) -> str:
    # 입력 텍스트를 그대로 사용하여 캐시 키 생성
    return hashlib.md5(text.encode()).hexdigest()

@router.get("/api/v1/recommend/survey")
def recommend_supplements(client_text: str = Query(..., description="Client input text"), db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    # 캐시 키 생성
    cache_key = generate_cache_key(client_text)

    # 1. Redis에서 캐시된 결과 가져오기
    if r:
        cached_result = r.get(cache_key)
        if cached_result:
            return json.loads(cached_result)

    # 2. MongoDB에서 캐시된 결과 가져오기
    mongo_result = mongo_collection.find_one({"client_text": client_text})
    if mongo_result:
        # MongoDB에 결과가 있으면 Redis에 저장하고 반환
        if r:
            r.set(cache_key, json.dumps(mongo_result['result']), ex=600)
        return mongo_result['result']
    
    # 3. MySQL 데이터베이스에서 아이템 가져오기
    db_items = get_functionality_items(db)  # 여기서 PREPROCESSED_TEXT를 포함한 데이터 가져오기

    # 유사도 계산
    top_matches = calculate_similarity(client_text, db_items)

    # 결과 형식 변환
    result = [
        {
            "supplementSeq": item[0],       # supplementSeq
            "pill_name": item[1],           # pill_name
            "functionality": item[2],       # functionality
            "dose_guide": item[4],          # dose_guide
            "image_url" : item[5]           # image_url
        }
        for item in top_matches
    ]

    # 4. MongoDB와 Redis에 결과 저장
    if r:
        r.set(cache_key, json.dumps(result), ex=600)  # Redis에 저장
    mongo_collection.insert_one({"client_text": client_text, "result": result})  # MongoDB에 저장
    
    return result

@router.get("/api/v1/recommend")
def recommend_supplements_by_age(age: int, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    # 나이에 맞는 영양제 데이터를 가져옴
    db_items = get_supplements_by_age(db, age)

    # 반환할 형식으로 변환
    result = [
        {
            "supplementSeq": item.supplementSeq,
            "pill_name": item.pill_name,
            "functionality": item.functionality,
            "image_url": item.image_url,
            "dose_guide": item.dose_guide
        }
        for item in db_items
    ]

    return result
