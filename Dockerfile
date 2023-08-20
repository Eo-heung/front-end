# 1. node 이미지 사용
FROM node:14 AS build
WORKDIR /app

# 2. 패키지 우선 복사
COPY package.json package-lock.json ./
RUN     npm install


COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]