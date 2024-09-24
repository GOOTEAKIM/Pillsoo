# app/routers/recommend.py

import hashlib
import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db, r
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

    # Redis에서 캐시된 결과 가져오기
    cached_result = None
    if r:
        cached_result = r.get(cache_key)
    
    if cached_result:
        # 캐시된 결과가 있을 경우 반환
        return json.loads(cached_result)
    
    # 데이터베이스에서 아이템 가져오기
    db_items = get_functionality_items(db)  # 여기서 PREPROCESSED_TEXT를 포함한 데이터 가져오기

    # 단어별 유사도 계산 (병렬 처리 적용)
    top_matches = calculate_similarity(client_text, db_items)

    # 결과 형식 변환
    result = [
        {
            "supplementSeq": item[0],       # supplementSeq
            "pill_name": item[1],           # pill_name
            "functionality": item[2],       # functionality
            "dose_guide": item[4]           # dose_guide
        }
        for item in top_matches
    ]

    # 결과를 Redis에 캐시 (1000분 동안) - 60000초
    if r:
        r.set(cache_key, json.dumps(result), ex=60000)
    
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

'''
# 9/23
# FastAPI 라우터 설정
router = APIRouter()

# Redis 클라이언트 설정
r = redis.Redis(host='localhost', port=6379, db=0)

def generate_cache_key(text: str) -> str:
    # 입력 텍스트를 그대로 사용하여 캐시 키 생성
    return hashlib.md5(text.encode()).hexdigest()

@router.get("/api/v1/recommend/survey")
def recommend_supplements(client_text: str = Query(..., description="Client input text"), db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    # 캐시 키 생성
    cache_key = generate_cache_key(client_text)
    
    # Redis에서 캐시된 결과 가져오기
    cached_result = r.get(cache_key)
    if cached_result:
        # 캐시된 결과가 있을 경우 반환
        return json.loads(cached_result)
    
    # 데이터베이스에서 아이템 가져오기
    db_items = get_functionality_items(db)
    
    # 단어별 유사도 계산 (병렬 처리 적용)
    top_matches = calculate_similarity(client_text, db_items)
    
    # 결과 형식 변환
    result = [
        {
            "supplementSeq": item[0],
            "pill_name": item[1],
            "functionality": item[2],
            "dose_guide": item[4]
        }
        for item in top_matches
    ]
    
    # 결과를 Redis에 캐시 (100분 동안)
    r.set(cache_key, json.dumps(result), ex=60000)
    
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
    
    return result'''
