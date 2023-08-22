# Node 이미지 기반
FROM node:18.16.0 AS build

# 작업 디렉터리 설정
WORKDIR /usr/src/app

# 의존성 파일들을 도커 이미지 안에 복사
COPY package*.json ./

# 패키지 설치
RUN npm install

# 모든 소스 코드를 이미지에 복사
COPY . .

# React 앱 빌드
RUN npm run build

# 서버 실행을 위해 serve 패키지 전역 설치
RUN npm install -g serve

# 3000 포트에서 실행
CMD ["serve", "-s", "build", "-l", "3000"]
