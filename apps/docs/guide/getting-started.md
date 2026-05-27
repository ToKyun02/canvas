# 시작하기

Canvas 프로젝트를 처음 접하는 개발자를 위한 빠른 시작 가이드입니다.

## 프로젝트 한 줄 요약

> **프로젝트 의사결정을 돕는 시각적 프로토타입 에디터**

웹 기반 캔버스에서 텍스트 등 UI 요소(노드)를 배치하고, 팀과 아이디어를 빠르게 공유합니다.

## 기술 스택

| 영역       | 기술                                              |
| ---------- | ------------------------------------------------- |
| 프론트엔드 | React 19, Vite 6, TanStack Router, Tailwind CSS 4 |
| 캔버스     | Fabric.js 7                                       |
| 상태 관리  | Zustand (persist + devtools)                      |
| UI         | shadcn/ui, Radix UI, Lucide Icons                 |
| 백엔드     | NestJS 11, Express                                |
| DB         | PostgreSQL 17                                     |
| 모노레포   | Turborepo + pnpm workspace                        |
| 문서       | VitePress                                         |

## 5분 빠른 시작

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 (루트에 .env.dev 생성)
cat > .env.dev << 'EOF'
DB_PASSWORD=example_password
VITE_API_URL=http://localhost:3000
NODE_ENV=development
EOF

# 3. Docker로 실행
pnpm docker:dev

# 4. 브라우저 접속
# - 에디터: http://localhost:3001
# - 문서:   pnpm --filter docs dev → http://localhost:8000
```

## 주요 URL

| 앱   | URL                   | 설명                      |
| ---- | --------------------- | ------------------------- |
| web  | http://localhost:3001 | 캔버스 에디터             |
| api  | http://localhost:3000 | REST API                  |
| docs | http://localhost:8000 | 프로젝트 문서 (이 사이트) |

## 다음 읽을 문서

- Docker 상세: [Docker 개발](/guide/docker)
- 에디터 사용: [캔버스 사용법](/guide/canvas-usage)
- 구조 이해: [아키텍처 개요](/architecture/overview)
