# 로컬 개발

Docker 없이 개별 앱을 로컬에서 실행하는 방법입니다.

## 전체 명령어

```bash
# 모든 앱 동시 실행 (turbo)
pnpm dev

# 개별 앱
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter docs dev
```

## web 앱 개발

```bash
pnpm --filter web dev
```

- 포트: **3001**
- HMR: Vite hot reload
- TanStack Router: `src/routes/` 파일 추가/수정 시 `routeTree.gen.ts` 자동 갱신

### 타입 체크 & 린트

```bash
pnpm --filter web check-types
pnpm --filter web lint
pnpm --filter web build
```

## api 앱 개발

PostgreSQL이 필요합니다. Docker로 DB만 띄우거나 로컬 Postgres를 사용하세요.

```bash
# DB만 Docker로
docker compose up db -d

# API 실행
DATABASE_URL=postgresql://postgres:example_password@localhost:5432/mydb \
  pnpm --filter api dev
```

- 포트: **3000**
- watch 모드: `nest start --watch`

## docs 앱 개발

```bash
pnpm --filter docs dev
```

- 포트: **8000**
- 마크다운 수정 시 즉시 반영

## 공유 packages 빌드

`@repo/api` 등 workspace 패키지 변경 시:

```bash
pnpm --filter @repo/api build
```

Turbo는 `build` 태스크에서 `dependsOn: ["^build"]`로 의존 패키지를 자동 빌드합니다.

## 개발 팁

### Dev Canvas API

개발 모드에서 Fabric Canvas 인스턴스가 `devCanvasRegistry`에 등록됩니다. 브라우저 콘솔에서 캔버스를 디버깅할 수 있습니다.

### TanStack Router Devtools

개발 빌드 하단에 Router Devtools 패널이 표시됩니다.

### Zustand Devtools

Redux DevTools Extension으로 `app-store` 상태를 inspect할 수 있습니다.

## 다음 단계

[Docker 개발 →](/guide/docker)
