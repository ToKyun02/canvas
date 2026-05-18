## ERD (축소안)

필수 도메인만 유지. **모든 캔버스 계열 엔티티는 공통 `NODE` 한 줄을 가진 뒤**, 종류에 따라 **확장 테이블이 같은 `node_id`로 1:1로 붙는** 구조

- **PROJECT_NODE** = `NODE` + 프로젝트(워크스페이스 내 최상위) 메타
- **PAGE_NODE** = `NODE` + 어느 프로젝트에 속하는지(`project_node_id` → 프로젝트 쪽 `NODE.id`)
- **GROUND_NODE** = `NODE` + 어느 페이지에 속하는지(`page_node_id` → 페이지 쪽 `NODE.id`) 및 보드 레이아웃
- 일반 도형·텍스트 등은 **`NODE`만** 두고, `parent_id`로 트리를 구성(루트는 보통 해당 **GROUND**의 `node_id`를 부모로 둠).

멤버십·권한은 **workspace_member**, 초대는 **invitation**, 스타일·자산은 **node_style**, **image** 로 둔다.

```mermaid
erDiagram
    USER ||--o{ WORKSPACE_MEMBER : belongs_to
    WORKSPACE ||--o{ WORKSPACE_MEMBER : has
    WORKSPACE ||--o{ INVITATION : has
    WORKSPACE ||--o{ NODE : scopes
    WORKSPACE ||--o{ IMAGE : stores

    NODE ||--o| PROJECT_NODE : extends
    NODE ||--o| PAGE_NODE : extends
    NODE ||--o| GROUND_NODE : extends

    NODE ||--o{ NODE : child_of
    NODE ||--o| NODE_STYLE : styled_by
    NODE }o--o| IMAGE : references

    PAGE_NODE }o--|| NODE : under_project
    GROUND_NODE }o--|| NODE : under_page

    USER {
        uuid id PK
        string email UK
        string username
        string password_hash
        timestamp created_at
        timestamp updated_at
    }

    WORKSPACE {
        uuid id PK
        string name
        string slug UK
        uuid owner_id FK
        timestamp created_at
        timestamp updated_at
    }

    WORKSPACE_MEMBER {
        uuid id PK
        uuid workspace_id FK
        uuid user_id FK
        string role
        timestamp joined_at
    }

    INVITATION {
        uuid id PK
        uuid workspace_id FK
        string email
        string role
        string token UK
        timestamp expires_at
    }

    NODE {
        uuid id PK
        uuid workspace_id FK
        uuid parent_id FK
        string kind
        string name
        json properties
        json transform
        int z_index
        uuid image_id FK
        timestamp created_at
        timestamp updated_at
    }

    PROJECT_NODE {
        uuid node_id PK_FK
        int sort_order
        json metadata
    }

    PAGE_NODE {
        uuid node_id PK_FK
        uuid project_node_id FK
        int sort_order
        json canvas_settings
    }

    GROUND_NODE {
        uuid node_id PK_FK
        uuid page_node_id FK
        float x
        float y
        float width
        float height
        json properties
    }

    NODE_STYLE {
        uuid id PK
        uuid node_id FK
        json fill
        json stroke
        json effects
        json typography
    }

    IMAGE {
        uuid id PK
        uuid workspace_id FK
        string name
        string url
        string mime_type
        int file_size
        timestamp created_at
    }
```

### 권한(permissions)

별도 `permission` 테이블 없이 **workspace_member.role** 으로 1차 통합. (예: `owner`, `admin`, `editor`, `viewer`.) 행 단위·리소스 단위 ACL이 필요해지면 그때 `permission` / `role_permission` 등을 추가.

### 주요 테이블

| 테이블           | 역할                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| USER             | 계정                                                                   |
| WORKSPACE        | 워크스페이스(팀)                                                       |
| WORKSPACE_MEMBER | 멤버십 + 역할(권한)                                                    |
| INVITATION       | 워크스페이스 초대                                                      |
| NODE             | 공통 노드(식별자·트리·공통 필드). `kind`로 역할 구분                   |
| PROJECT_NODE     | **NODE 1:1 확장** — 프로젝트 전용 필드                                 |
| PAGE_NODE        | **NODE 1:1 확장** — 페이지 전용 필드 + 소속 프로젝트 `NODE` 참조       |
| GROUND_NODE      | **NODE 1:1 확장** — 그라운드(보드) 전용 필드 + 소속 페이지 `NODE` 참조 |
| NODE_STYLE       | 노드 스타일(fill, stroke 등)                                           |
| IMAGE            | 업로드 자산(노드가 참조 가능)                                          |

#### 계층과 확장 규칙

- **프로젝트 / 페이지 / 그라운드** 행은 반드시 같은 `id`를 가진 `NODE` 행이 있어야 하고, 각각 `PROJECT_NODE` / `PAGE_NODE` / `GROUND_NODE`에 한 행씩만 대응(1:1).
- **도형·그룹 등** 은 확장 테이블 없이 `NODE`만 사용합니다. `kind`로 구분합니다.
- **PAGE_NODE.project_node_id**, **GROUND_NODE.page_node_id** 는 각각 “소속”을 가리키는 `NODE.id`이며, 애플리케이션에서 해당 `NODE`가 프로젝트/페이지 노드인지 검증

#### JSON 필드

- **NODE.properties** / **NODE.transform**: 타입별 가변 속성·배치.
- 협업·버전·댓글·디자인 토큰 등은 이후 단계에서 스키마 확장

#### 실시간 협업 (참고)

- DB에는 스냅샷 위주, 실시간은 Redis + WebSocket 등으로 보완
