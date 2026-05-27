# 개발 환경 설정

로컬에서 Canvas 프로젝트를 실행하기 위한 환경 설정 가이드입니다.

## 필수 요구사항

| 도구                    | 버전   | 용도                                |
| ----------------------- | ------ | ----------------------------------- |
| Node.js                 | ≥ 18   | 런타임                              |
| pnpm                    | 8.15.5 | 패키지 매니저 (packageManager 고정) |
| Docker & Docker Compose | 최신   | DB + web + api 통합 실행            |
| Git                     | 최신   | 버전 관리                           |

## 1. 저장소 클론

```bash
git clone <repository-url> canvas
cd canvas
```

## 2. 의존성 설치

```bash
pnpm install
```

pnpm workspace는 `apps/*`와 `packages/*`를 자동으로 연결합니다.

## 3. 환경 변수 설정

프로젝트 루트에 `.env.dev` 파일을 생성합니다:

```env
DB_PASSWORD=example_password
VITE_API_URL=http://localhost:3000
NODE_ENV=development
```

상세 설명은 [환경 변수 참조](/reference/env)를 참고하세요.

## 4-A. Docker Compose로 실행 (권장)

전체 스택(web, api, PostgreSQL)을 한 번에 띄웁니다:

```bash
pnpm docker:dev
# 또는 이미지 재빌드
pnpm docker:dev:build
```

| 서비스 | URL                   | 설명                  |
| ------ | --------------------- | --------------------- |
| web    | http://localhost:3001 | 캔버스 에디터         |
| api    | http://localhost:3000 | NestJS API            |
| docs   | (별도 실행)           | http://localhost:8000 |
| db     | localhost:5432        | PostgreSQL 17         |

종료:

```bash
pnpm docker:down
```

## 4-B. 개별 앱 실행 (Docker 없이)

API와 DB 없이 프론트엔드만 개발할 때:

```bash
pnpm --filter web dev      # http://localhost:3001
pnpm --filter docs dev     # http://localhost:8000
```

API 개발:

```bash
pnpm --filter api dev      # http://localhost:3000
```

## 5. IDE 설정

### VS Code / Cursor 추천 확장

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

### TypeScript 경로 별칭

web 앱은 `@/*` → `apps/web/src/*` 별칭을 사용합니다. IDE에서 경로 자동완성이 동작하는지 확인하세요.

## 6. 실행 확인

1. **web**: http://localhost:3001 → "Go to Canvas" → 캔버스 화면
2. **docs**: http://localhost:8000 → 이 문서 사이트
3. **api**: http://localhost:3000 → NestJS 헬스/엔드포인트

## 자주 겪는 문제

### `pnpm: command not found`

```bash
corepack enable
corepack prepare pnpm@8.15.5 --activate
```

### Docker 포트 충돌

3000, 3001, 5432 포트가 사용 중이면 해당 프로세스를 종료하거나 `docker-compose.dev.yml`의 포트 매핑을 변경하세요.

### node_modules 동기화 문제

```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

## 다음 단계

[코드베이스 투어 →](/onboarding/codebase-tour)
