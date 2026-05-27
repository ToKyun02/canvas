---
layout: home

hero:
  name: Canvas
  text: 프로젝트 문서
  tagline: 프로젝트 의사결정을 돕는 시각적 프로토타입 에디터
  actions:
    - theme: brand
      text: 온보딩 시작
      link: /onboarding/welcome
    - theme: alt
      text: 빠른 시작
      link: /guide/getting-started

features:
  - title: 시각적 프로토타이핑
    details: Fabric.js 기반 캔버스에서 텍스트 등 노드를 배치하고, 아이디어를 빠르게 시각화합니다.
  - title: 명령 기반 UX
    details: 단축키와 커맨드 패턴으로 이동, 그리기, 선택, 줌 등 에디터 조작을 일관되게 제공합니다.
  - title: 확장 가능한 노드 시스템
    details: NodeDefinition 레지스트리 패턴으로 새 노드 타입을 선언적으로 추가할 수 있습니다.
  - title: Turborepo 모노레포
    details: web, api, docs 앱과 공유 packages를 pnpm workspace로 관리합니다.
---

## 문서 구성

| 섹션                               | 대상        | 설명                                         |
| ---------------------------------- | ----------- | -------------------------------------------- |
| [온보딩](/onboarding/welcome)      | 신규 팀원   | 첫 주 체크리스트, 환경 설정, 코드베이스 투어 |
| [가이드](/guide/getting-started)   | 모든 개발자 | 실행 방법, Docker, 캔버스 사용법             |
| [아키텍처](/architecture/overview) | 심화 학습   | 프론트/백엔드 설계, 상태 관리, 노드 시스템   |
| [참조](/reference/commands)        | 일상 참고   | 단축키, 환경 변수, npm 스크립트              |

## 빠른 실행

```bash
# 저장소 루트에서
pnpm install
pnpm --filter docs dev    # http://localhost:8000
pnpm --filter web dev     # http://localhost:3001
```

Docker로 전체 스택을 띄우려면 [Docker 개발 가이드](/guide/docker)를 참고하세요.
