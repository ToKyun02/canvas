## 프로젝트 주제

프로젝트 의사결정을 돕는 시각적 프로토타입 에디터

## 실행방법

**Docker 기반입니다.**

**명령어와 파일 모두 프로젝트 루트 기반입니다.**

### 의존성 설치

```bash
pnpm i
```

### app build

```bash
pnpm build
```

### env 설정(.env.dev)

```env
DB_PASSWORD=example_password
VITE_API_URL=http://localhost:3000
NODE_ENV=development
```

### dev compose 실행

```bash
pnpm docker:dev
```

### dev compose 강제 이미지 빌드

```bash
pnpm docker:dev:build
```
