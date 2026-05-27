import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid(
  defineConfig({
    title: 'Canvas Docs',
    description: '프로젝트 의사결정을 돕는 시각적 프로토타입 에디터 — 문서 및 온보딩 가이드',
    lang: 'ko-KR',
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: [/^https?:\/\/localhost/],
    mermaid: {
      theme: 'default',
    },
    themeConfig: {
      logo: '/logo.svg',
      nav: [
        { text: '홈', link: '/' },
        { text: '온보딩', link: '/onboarding/welcome' },
        { text: '가이드', link: '/guide/getting-started' },
        { text: '아키텍처', link: '/architecture/overview' },
        { text: '참조', link: '/reference/commands' },
      ],
      sidebar: {
        '/onboarding/': [
          {
            text: '온보딩',
            items: [
              { text: '환영합니다', link: '/onboarding/welcome' },
              { text: '첫 주 체크리스트', link: '/onboarding/first-week' },
              { text: '개발 환경 설정', link: '/onboarding/setup' },
              { text: '코드베이스 투어', link: '/onboarding/codebase-tour' },
            ],
          },
        ],
        '/guide/': [
          {
            text: '가이드',
            items: [
              { text: '시작하기', link: '/guide/getting-started' },
              { text: '로컬 개발', link: '/guide/local-development' },
              { text: 'Docker 개발', link: '/guide/docker' },
              { text: '캔버스 사용법', link: '/guide/canvas-usage' },
              { text: '노드 추가하기', link: '/guide/adding-nodes' },
            ],
          },
        ],
        '/architecture/': [
          {
            text: '아키텍처',
            items: [
              { text: '개요', link: '/architecture/overview' },
              { text: '모노레포 구조', link: '/architecture/monorepo' },
              { text: '프론트엔드', link: '/architecture/frontend' },
              { text: '상태 관리', link: '/architecture/state-management' },
              { text: '노드 시스템', link: '/architecture/node-system' },
              { text: '백엔드', link: '/architecture/backend' },
            ],
          },
        ],
        '/reference/': [
          {
            text: '참조',
            items: [
              { text: '단축키 & 커맨드', link: '/reference/commands' },
              { text: '환경 변수', link: '/reference/env' },
              { text: '스크립트', link: '/reference/scripts' },
            ],
          },
        ],
      },
      socialLinks: [],
      footer: {
        message: 'Canvas — 시각적 프로토타입 에디터',
        copyright: 'Copyright © 2026',
      },
      search: {
        provider: 'local',
      },
    },
  }),
);
