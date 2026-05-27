# 백엔드 아키텍처

`apps/api` NestJS REST API 구조입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | NestJS 11 |
| HTTP | Express (@nestjs/platform-express) |
| DB | PostgreSQL 17 (Docker) |
| 테스트 | Jest + Supertest |
| 공유 타입 | `@repo/api` workspace 패키지 |

## 진입점

`apps/api/src/main.ts`:

```typescript
const app = await NestFactory.create(AppModule);
app.enableCors();
await app.listen(3000);
```

- 포트: **3000**
- CORS: 전체 허용 (개발용)

## 모듈 구조

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── links/
    ├── links.module.ts
    ├── links.controller.ts
    ├── links.service.ts
    └── dto/
```

현재 `links` 모듈은 CRUD 예제로 포함되어 있습니다.

## 공유 패키지 (@repo/api)

`packages/api/src/`:

```
links/
├── dto/
│   ├── create-link.dto.ts
│   └── update-link.dto.ts
└── entities/
    └── link.entity.ts
```

프론트엔드와 백엔드가 동일한 DTO/엔티티 타입을 공유합니다.

## 환경 변수

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `NODE_ENV` | `development` / `production` |

Docker dev 환경:

```
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/mydb
```

## Docker

- Dockerfile: `apps/api/Dockerfile.dev`
- DB healthcheck 후 api 기동 (`depends_on: condition: service_healthy`)

## 향후 확장 방향

현재 에디터는 localStorage 기반이지만, API는 다음 기능을 위해 준비됩니다:

- **문서 CRUD** — 캔버스 상태 서버 저장
- **협업** — 실시간 공유 (WebSocket/SSE)
- **인증** — 사용자별 문서 관리
- **내보내기** — JSON/PDF/이미지 export

## 테스트

```bash
pnpm --filter api test        # unit
pnpm --filter api test:e2e    # e2e
```

## 관련 문서

- [모노레포 구조](/architecture/monorepo)
- [Docker 개발](/guide/docker)
- [환경 변수](/reference/env)
