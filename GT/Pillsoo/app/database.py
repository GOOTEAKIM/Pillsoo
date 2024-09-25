from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker
import redis
from pymongo import MongoClient


# MySQL 데이터베이스 URL 설정
DATABASE_URL = "mysql+pymysql://root:ssafypasswordj11e205@j11e205.p.ssafy.io:30306/SOS"

# SQLAlchemy 엔진과 세션 설정
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
    
# Redis 클라이언트 설정 (원격 서버로 변경)
try:
    r = redis.Redis(host='j11e205.p.ssafy.io', port=30379, db=0)
except redis.exceptions.ConnectionError as e:
    r = None  # Redis가 사용 불가한 경우 None으로 설정    

# MongoDB 설정
mongo_client = MongoClient("mongodb://j11e205.p.ssafy.io:30017/")
mongo_db = mongo_client["sos_db"]  # MongoDB 데이터베이스
mongo_collection = mongo_db["recommended"]  # MongoDB 컬렉션

# MongoDB 설정
mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["sos_db"]  # MongoDB 데이터베이스
mongo_collection = mongo_db["recommended"]  # MongoDB 컬렉션

# DB 세션을 반환하는 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
