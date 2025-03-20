FROM python:3.12-slim

WORKDIR /app

# Poetry 설치
RUN pip install poetry

# Poetry 가상환경 비활성화 (도커에서는 불필요)
RUN poetry config virtualenvs.create false

# 의존성 파일 복사
COPY pyproject.toml poetry.lock ./

# 의존성 설치
RUN poetry install --no-dev

# 소스코드 복사
COPY . .

# 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 