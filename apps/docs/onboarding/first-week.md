# 첫 주 체크리스트

신규 팀원이 첫 주에 완료하면 좋은 항목입니다. 각 항목을 체크하면서 진행하세요.

## Day 1 — 환경 & 실행

- [ ] 저장소 clone 및 `pnpm install` 완료
- [ ] Node.js 18+ 및 pnpm 8.15.5 설치 확인
- [ ] `.env.dev` 파일 생성 ([환경 변수 참조](/reference/env))
- [ ] Docker Compose로 web + api + db 기동 성공
- [ ] http://localhost:3001 에서 캔버스 에디터 접속
- [ ] http://localhost:8000 에서 이 문서 사이트 접속

## Day 2 — 코드베이스 이해

- [ ] [모노레포 구조](/architecture/monorepo) 읽기
- [ ] `apps/web/src/routes/` 라우팅 구조 확인
- [ ] `apps/web/src/stores/commands/` Zustand 스토어 구조 파악
- [ ] `apps/web/src/stores/nodes/` 노드 레지스트리 확인
- [ ] `apps/web/src/features/canvas/` 캔버스 기능 모듈 둘러보기

## Day 3 — 에디터 직접 사용

- [ ] 이동(V), 텍스트(T) 도구로 노드 배치
- [ ] 선택 · 삭제 동작 확인
- [ ] 줌 인/아웃, 화면에 맞추기·휠 줌/팬 사용
- [ ] 속성 패널(`Mod+/`) 및 노드 라벨(`Mod+.`) 토글
- [ ] 라벨 더블클릭으로 이름 변경, 라벨 드래그로 노드 이동
- [ ] 새로고침 후 localStorage 복원(persist) 확인
- [ ] (참고) 실행 취소/다시 실행 단축키는 등록되어 있으나 히스토리 미연결 상태

## Day 4 — 아키텍처 심화

- [ ] [프론트엔드 아키텍처](/architecture/frontend) 읽기
- [ ] [상태 관리](/architecture/state-management) 읽기
- [ ] [노드 시스템](/architecture/node-system) 읽기
- [ ] `Canvas` 컴포넌트의 hooks 조합 방식 이해

## Day 5 — 정리 & 검증

- [ ] `pnpm lint` / `pnpm build` 로컬에서 실행
- [ ] [노드 추가하기](/guide/adding-nodes) 흐름 복습
- [ ] 온보딩 체크리스트 전체 재점검

## 완료 기준

첫 주가 끝날 때 다음을 할 수 있으면 온보딩 성공입니다:

1. 로컬에서 web + api + docs를 독립적으로 실행
2. 캔버스 에디터의 주요 기능과 단축키 설명
3. 새 노드 타입을 어디에 추가하는지 설명
4. Zustand slice와 Fabric.js 동기화 흐름을 대략적으로 설명

## 다음 단계

[개발 환경 설정 →](/onboarding/setup)
