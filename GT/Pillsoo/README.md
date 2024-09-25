# FastAPI 서버 실행 방법

- GT/ Pillsoo로 이동

- if 가상환경이 없다:

- 가상환경 생성 (초기에 한 번만 생성하면 된다)

  - python -m venv venv

- 가상환경 실행

  - source venv/Scripts/activate

- 라이브러리 설치 (초기에 한 번만 하면 된다)

  - pip install -r requirements.txt

- FastAPI 서버 실행

  - uvicorn app.main:app --reload

## 설치 라이브러리

- fastapi
- uvicorn
- sqlalchemy
- pymysql
- scikit-learn
- requests
- konlpy (jdk를 사용하므로 jdk 17 버전으로 설치해야한다.)
- redis
- ray
- pymongo
