# 모노레포 구조

Turborepo + pnpm workspace 기반 모노레포 구성입니다.

## Workspace 설정

`pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## 앱 (apps/)

| 앱   | 패키지명 | 포트 | 역할              |
| ---- | -------- | ---- | ----------------- |
| web  | `web`    | 3001 | 캔버스 에디터 SPA |
| api  | `api`    | 3000 | NestJS REST API   |
| docs | `docs`   | 8000 | VitePress 문서    |

## 공유 패키지 (packages/)

| 패키지            | npm name                  | 용도             |
| ----------------- | ------------------------- | ---------------- |
| api               | `@repo/api`               | DTO, 엔티티      |
| eslint-config     | `@repo/eslint-config`     | ESLint presets   |
| jest-config       | `@repo/jest-config`       | Jest presets     |
| typescript-config | `@repo/typescript-config` | tsconfig presets |

## Turborepo 태스크

`turbo.json`:

| 태스크     | 설명                                 |
| ---------- | ------------------------------------ |
| `dev`      | 개발 서버 (cache: false, persistent) |
| `build`    | 빌드 (`dependsOn: ["^build"]`)       |
| `lint`     | ESLint                               |
| `test`     | 단위 테스트                          |
| `test:e2e` | E2E 테스트                           |

## workspace 의존성

```json
// apps/web/package.json
"devDependencies": {
  "@repo/api": "workspace:*",
  "@repo/eslint-config": "workspace:*",
  "@repo/typescript-config": "workspace:*"
}
```

`workspace:*` 프로토콜로 로컬 패키지를 참조합니다.

## Docker 빌드

web/api Dockerfile은 `turbo prune <app> --docker`로 해당 앱에 필요한 의존성만 추출합니다:

```
COPY . .
RUN turbo prune web --docker
→ out/json/ + out/pnpm-lock.yaml
→ pnpm install --frozen-lockfile
```

## 디렉터리 의존 방향

```
apps/web  ──→  packages/api (types)
apps/api  ──→  packages/api (types)
apps/docs ──→  (독립)

packages/eslint-config  ← apps/*
packages/typescript-config ← apps/*
```

**규칙**: apps → packages 방향만 허용. packages 간 순환 참조 금지.

## 새 앱 추가하기

1. `apps/<name>/package.json` 생성
2. `pnpm install` (workspace 자동 등록)
3. 필요 시 `turbo.json` 태스크 확인
4. Docker 사용 시 Dockerfile 추가

## 관련 문서

- [프론트엔드](/architecture/frontend)
- [백엔드](/architecture/backend)
