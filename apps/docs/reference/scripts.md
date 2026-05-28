# 스크립트

프로젝트에서 사용 가능한 npm/pnpm 스크립트입니다.

## 루트 (package.json)

| 스크립트           | 명령                                  | 설명             |
| ------------------ | ------------------------------------- | ---------------- |
| `dev`              | `turbo run dev`                       | 모든 앱 dev 서버 |
| `build`            | `turbo run build`                     | 모든 앱 빌드     |
| `test`             | `turbo run test`                      | 전체 테스트      |
| `test:e2e`         | `turbo run test:e2e`                  | E2E 테스트       |
| `lint`             | `turbo run lint`                      | 전체 ESLint      |
| `format`           | `prettier --write "**/*.{ts,tsx,md}"` | 코드 포맷        |
| `docker:dev`       | `docker compose ... up`               | Docker dev 스택  |
| `docker:dev:build` | `docker compose ... up --build`       | 재빌드 후 실행   |
| `docker:prod`      | `docker compose ... up -d`            | 프로덕션 배포    |
| `docker:down`      | `docker compose down`                 | 컨테이너 종료    |

## web

| 스크립트      | 설명                        |
| ------------- | --------------------------- |
| `dev`         | Vite dev server (포트 3001) |
| `build`       | tsc + vite build            |
| `preview`     | 빌드 결과 미리보기          |
| `lint`        | ESLint                      |
| `check-types` | TypeScript 타입 체크        |

```bash
pnpm --filter web dev
pnpm --filter web build
```

## api

| 스크립트     | 설명              |
| ------------ | ----------------- |
| `dev`        | NestJS watch 모드 |
| `build`      | nest build        |
| `start`      | 프로덕션 시작     |
| `start:prod` | `node dist/main`  |
| `test`       | Jest unit test    |
| `test:e2e`   | Jest E2E          |
| `lint`       | ESLint            |

```bash
pnpm --filter api dev
pnpm --filter api test
```

## docs

| 스크립트  | 설명                      |
| --------- | ------------------------- |
| `dev`     | VitePress dev (포트 8000) |
| `build`   | VitePress 정적 빌드       |
| `preview` | 빌드 결과 미리보기        |

```bash
pnpm --filter docs dev
pnpm --filter docs build
```

### Firebase Hosting (CI)

docs 배포는 **GitHub Actions에서만** 자동 실행됩니다. `main` 브랜치에 `apps/docs/**` 변경이 push되면 `.github/workflows/hosting-docs.yml`이 빌드 후 Firebase Hosting에 배포합니다.

Firebase 설정: `apps/docs/firebase.json`

GitHub Secrets:

| Secret | 설명 |
|--------|------|
| `FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase 서비스 계정 JSON 전체 |

GitHub Actions 배포는 `FIREBASE_PROJECT_ID` secret으로 프로젝트를 지정합니다. 로컬에서 `firebase deploy`를 실행할 때는 `.firebaserc`를 추가하거나 `--project` 플래그를 사용하세요.

## Turbo 필터 문법

```bash
# 특정 앱만
pnpm --filter web <script>
pnpm --filter api <script>
pnpm --filter docs <script>

# 의존 패키지 포함 빌드
pnpm --filter web build   # ^build 자동 실행
```

## 관련 문서

- [로컬 개발](/guide/local-development)
- [시작하기](/guide/getting-started)
