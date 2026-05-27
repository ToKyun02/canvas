# 환경 변수

Canvas 프로젝트에서 사용하는 환경 변수입니다.

## .env.dev (개발)

프로젝트 **루트**에 `.env.dev` 파일을 생성합니다:

```env
DB_PASSWORD=example_password
VITE_API_URL=http://localhost:3000
NODE_ENV=development
```

| 변수 | 사용처 | 설명 |
|------|--------|------|
| `DB_PASSWORD` | Docker (db, api) | PostgreSQL 비밀번호 |
| `VITE_API_URL` | web (Vite) | API 베이스 URL |
| `NODE_ENV` | api | 실행 환경 |

## .env.prod (프로덕션)

```bash
pnpm docker:prod  # --env-file .env.prod
```

프로덕션 값은 배포 환경에 맞게 설정하세요.

## Docker Compose에서의 전달

### web

```yaml
environment:
  - VITE_API_URL=${VITE_API_URL}
```

Vite는 빌드/실행 시 `VITE_` 접두사 변수를 클라이언트에 주입합니다.

### api

```yaml
environment:
  DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/mydb
  NODE_ENV: ${NODE_ENV}
```

### db

```yaml
environment:
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: ${DB_PASSWORD}
  POSTGRES_DB: mydb
```

## web 앱에서 API URL 사용

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 로컬 API 개발 (Docker 없이)

```bash
DATABASE_URL=postgresql://postgres:example_password@localhost:5432/mydb \
  pnpm --filter api dev
```

## 보안 주의

- `.env.dev`, `.env.prod`는 git에 커밋하지 마세요
- 프로덕션 비밀번호는 secrets manager 사용 권장

## 관련 문서

- [개발 환경 설정](/onboarding/setup)
- [Docker 개발](/guide/docker)
