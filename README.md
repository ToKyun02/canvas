## 프로젝트 주제

프로젝트 의사결정을 돕는 시각적 프로토타입 에디터

## 문서

상세 설명 및 온보딩 자료는 `apps/docs` (VitePress)에서 제공합니다.
[호스팅 링크](https://canvas-doc.web.app)

```bash
pnpm install
pnpm --filter docs dev   # http://localhost:8000
```

## 실행방법

### env 설정(.env.dev)

```env
DB_PASSWORD=example_password
VITE_API_URL=http://localhost:3000
NODE_ENV=development
```

### dev compose 실행

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev up
```

### dev compose 강제 이미지 빌드

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev up --build
```

### 종료

```bash
docker compose down
```
