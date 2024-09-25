# scripts/transfer_redis_to_mongo.py

from pymongo import MongoClient
import redis

# Redis 클라이언트 설정
try:
    r = redis.Redis(host='localhost', port=6379, db=0)
except redis.exceptions.ConnectionError as e:
    print("Redis 연결 실패:", e)
    exit(1)

# MongoDB 클라이언트 설정
mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["sos_db"]  # 데이터베이스 이름
mongo_collection = mongo_db["recommended"]  # 컬렉션 이름

def transfer_redis_to_mongodb():
    # Redis에서 모든 키 가져오기
    keys = r.keys()
    if not keys:
        print("Redis에 저장된 데이터가 없습니다.")
        return
    
    for key in keys:
        value = r.get(key)
        if value:
            # MongoDB에 저장
            mongo_collection.insert_one({"key": key.decode(), "value": value.decode()})
            # Redis에서 해당 키 삭제
            r.delete(key)
            print(f"Key {key.decode()}가 MongoDB로 이동되고 Redis에서 삭제되었습니다.")
    print(f"총 {len(keys)}개의 키가 MongoDB로 이동되었습니다.")

if __name__ == "__main__":
    transfer_redis_to_mongodb()
