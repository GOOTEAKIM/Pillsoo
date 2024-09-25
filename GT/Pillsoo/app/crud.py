from sqlalchemy.orm import Session
from .models import Supplement, Age_Prefer

def get_functionality_items(db: Session):
    return db.query(Supplement.supplementSeq,
                    Supplement.pill_name,
                    Supplement.functionality,
                    Supplement.preprocessed_text,
                    Supplement.dose_guide,
                    Supplement.image_url).all()

def get_supplements_by_age(db: Session, age: int, limit: int = 3):
    # 나이에 맞는 AGE_GROUPS 구하기
    if 10 <= age < 20:
        age_group = "10대"
    elif 20 <= age < 30:
        age_group = "20대"
    elif 30 <= age < 40:
        age_group = "30대"
    elif 40 <= age < 50:
        age_group = "40대"
    elif 50 <= age < 60:
        age_group = "50대"
    elif age >= 60:
        age_group = "60대 이상"
    
    # 해당 나이 그룹에 맞는 영양제를 가져옴
    return db.query(Supplement).join(Age_Prefer, Supplement.supplementSeq == Age_Prefer.PILL_pk).filter(Age_Prefer.AGE_GROUPS == age_group).limit(limit).all()