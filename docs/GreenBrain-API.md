## 유저

### 유저 조회
- 설명: 현재 로그인한 사용자 조회
- 메서드: GET
- URL: /api/users/me

### Request

없음

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| id | 사용자 ID | String(UUID) |  | X | `"7f1a2c2e-4a9a-4f0e-8f6b-9d3d8f8c1111"` |
| email | 사용자 이메일 | String |  | X | `"user@example.com"` |
| nickname | 사용자 닉네임 | String |  | O | `"green_user"` |
| profile_image_url | 프로필 이미지 URL | String(URL) |  | O | `"<https://example.com/profile.png>"` |
| onboarding_completed | 온보딩 완료 여부 | Boolean |  | X | `true` |
| profile | 온보딩 프로필 | Object | 온보딩 미완료 시 null | O | `{ "transport_mode": "transit", "diet_type": "omnivore", "housing_type": "apartment" }` |
| profile.transport_mode | 주 교통수단 | String | `car`, `transit`, `walk`, `bike`, `mixed` | O | `"transit"` |
| profile.diet_type | 식단 유형 | String | `omnivore`, `vegetarian`, `vegan`, `flexitarian` | O | `"omnivore"` |
| profile.housing_type | 주거 형태 | String | `apartment`, `house`, `studio`, `dorm`, `other` | O | `"apartment"` |
| today_tokens | 오늘 토큰 요약 | Object |  | X | `{ "date": "2026-05-13", "tokens_remaining": 150.0 }` |
| today_tokens.date | KST 기준 날짜 | String(Date) | `YYYY-MM-DD` | X | `"2026-05-13"` |
| today_tokens.tokens_remaining | 남은 탄소 토큰 | Number | gCO2eq 단위 | X | `150.0` |

**Example**

```json
{
  "id": "7f1a2c2e-4a9a-4f0e-8f6b-9d3d8f8c1111",
  "email": "user@example.com",
  "nickname": "green_user",
  "profile_image_url": "<https://example.com/profile.png>",
  "onboarding_completed": true,
  "profile": {
    "transport_mode": "transit",
    "diet_type": "omnivore",
    "housing_type": "apartment"
  },
  "today_tokens": {
    "date": "2026-05-13",
    "tokens_remaining": 150.0
  }
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 사용자 조회 성공 |
| 401 | 인증되지 않은 사용자 |

### 유저 수정
- 설명: 현재 로그인한 사용자의 기본정보 수정한다.
- 메서드: PATCH
- URL: /api/users/me

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| nickname | 사용자 닉네임 | String | 1자 이상 | O | `"green_user"` |
| profile_image_url | 프로필 이미지 URL | String(URL) |  | O | `"<https://example.com/profile.png>"` |

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| id | 사용자 ID | String(UUID) |  | X | `"7f1a2c2e-4a9a-4f0e-8f6b-9d3d8f8c1111"` |
| email | 사용자 이메일 | String |  | X | `"user@example.com"` |
| nickname | 사용자 닉네임 | String |  | O | `"green_user"` |
| profile_image_url | 프로필 이미지 URL | String(URL) |  | O | `"<https://example.com/profile.png>"` |
| updated_at | 수정 시각 | String(DateTime) | ISO 8601 | X | `"2026-05-13T00:00:00Z"` |

**Example**

```json
{
  "id": "7f1a2c2e-4a9a-4f0e-8f6b-9d3d8f8c1111",
  "email": "user@example.com",
  "nickname": "green_user",
  "profile_image_url": "<https://example.com/profile.png>",
  "updated_at": "2026-05-13T00:00:00Z"
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 사용자 기본 프로필 수정 성공 |
| 401 | 인증되지 않은 사용자 |
| 422 | 요청 형식 오류 |

### 생활습관 프로필 조회
- 설명: 사용자의 생활습관 정보를 조회한다
- 메서드: GET
- URL: /api/users/profile

### Request

없음

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| transport_mode | 주 교통수단 | String | `car`, `transit`, `walk`, `bike`, `mixed` | X | `"transit"` |
| diet_type | 식단 유형 | String | `omnivore`, `vegetarian`, `vegan`, `flexitarian` | X | `"omnivore"` |
| housing_type | 주거 형태 | String | `apartment`, `house`, `studio`, `dorm`, `other` | X | `"apartment"` |
| updated_at | 수정 시각 | String(DateTime) | ISO 8601 | O | `"2026-05-13T00:00:00Z"` |

**Example**

```json
{
  "transport_mode": "transit",
  "diet_type": "omnivore",
  "housing_type": "apartment",
  "updated_at": "2026-05-13T00:00:00Z"
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 생활 습관 프로필 조회 성공 |
| 401 | 인증되지 않은 사용자 |
| 404 | 생활 습관 프로필 없음 |

### 생활습관 프로필 수정
- 설명: 사용자의 생활습관 정보를 수정한다.
- 메서드: PATCH
- URL: /api/users/profile

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| transport_mode | 주 교통수단 | String | `car`, `transit`, `walk`, `bike`, `mixed` | O | `"transit"` |
| diet_type | 식단 유형 | String | `omnivore`, `vegetarian`, `vegan`, `flexitarian` | O | `"omnivore"` |
| housing_type | 주거 형태 | String | `apartment`, `house`, `studio`, `dorm`, `other` | O | `"apartment"` |

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| transport_mode | 주 교통수단 | String | `car`, `transit`, `walk`, `bike`, `mixed` | X | `"transit"` |
| diet_type | 식단 유형 | String | `omnivore`, `vegetarian`, `vegan`, `flexitarian` | X | `"omnivore"` |
| housing_type | 주거 형태 | String | `apartment`, `house`, `studio`, `dorm`, `other` | X | `"apartment"` |
| updated_at | 수정 시각 | String(DateTime) | ISO 8601 | X | `"2026-05-13T00:00:00Z"` |

**Example**

```json
{
  "transport_mode": "transit",
  "diet_type": "omnivore",
  "housing_type": "apartment",
  "updated_at": "2026-05-13T00:00:00Z"
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 생활 습관 프로필 수정 성공 |
| 401 | 인증되지 않은 사용자 |
| 404 | 생활 습관 프로필 없음 |
| 422 | 요청 형식 오류 |



## 인증

### 회원가입
- 설명: 회원가입
- 메서드: POST
- URL: /api/auth/signup

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| email | 회원가입 이메일 | String | 이메일 형식 | X | `"user@example.com"` |
| password | 회원가입 비밀번호 | String | 최소 8자, 대문자/소문자/숫자 포함 | X | `"Password1"` |

**Query parameter**

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| id | 사용자 ID | String(UUID) |  | X | `"7f1a2c2e-4a9a-4f0e-8f6b-9d3d8f8c1111"` |
| email | 사용자 이메일 | String |  | X | `"user@example.com"` |
| onboarding_completed | 온보딩 완료 여부 | Boolean |  | X | `false` |
| created_at | 사용자 생성 시각 | String(DateTime) | ISO 8601 | X | `"2026-05-11T00:00:00Z"` |

**Example**

```jsx

```jsx
{
  "id": "7f1a2c2e-4a9a-4f0e-8f6b-9d3d8f8c1111",
  "email": "user@example.com",
  "onboarding_completed": false,
  "created_at": "2026-05-11T00:00:00Z"
}
```

```

### Status

| status | response content |
| --- | --- |
| 201 | 회원가입 성공 |
| 400 | 이미 가입된 이메일 |
| 423 | 로그인 5회 실패 |
| 422 | 요청 형식 오류 |

### 로그인
- 설명: 로그인 API. 성공 시 JWT를 access_token HttpOnly 쿠키로 발급한다.
- 메서드: POST
- URL: /api/auth/login

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| email | 로그인 이메일 | String | 이메일 형식 | X | "[user@example.com](mailto:user@example.com)" |
| password | 로그인 비밀번호 | String |  | X | "Password1" |

Query parameter

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| message | 응답 메시지 | String |  | X | "Login successful" |

Example

```python
{
"message": "Login successful"
}
```

### Cookie

| name | 설명 | 옵션 |
| --- | --- | --- |
| access_token | JWT 인증 토큰 | HttpOnly, Secure, SameSite=Strict, Max-Age=604800 |

### Status

| status | response content |
| --- | --- |
| 200 | 로그인 성공 |
| 401 | 이메일 또는 비밀번호 오류 |
| 429 | 로그인 5회 초과 실패로 일시 잠금 |
| 422 | 요청 형식 오류 |

### 로그아웃
- 설명: 로그아웃 API. `access_token` 쿠키를 만료 처리한다.
- 메서드: POST
- URL: /api/auth/logout
### Request

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| message | 응답 메시지 | String |  | X | "Logout successful" |
|  |  |  |  |  |  |

### Example

```python
{
	"message": "Logout successful"
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 로그아웃 성공 |

## 채팅

### 채팅 전송
- 설명: 사용자 메시지를 전송하고 AI 응답, 탄소량, 토큰 잔여량을 반환한다.
- 메서드: POST
- URL: api/chat/sessions/{session_id}/messages

## 

메시지 전송 및 AI 응답 수신

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| message | 전송할 메시지 (공백 불가) | string | - | false | 오늘 탄소 절약 방법 알려줘 |
| model_id | 사용할 AI 모델 ID | string | `provider/model-name` 형식, optional, 기본값 `openai/gpt-5.5` | true | `"openai/gpt-5.5"` |

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| message_id | 유저 메시지 UUID | string | - | false | uuid |
| response_message_id | AI 응답 메시지 UUID | string | - | false | uuid |
| response | AI 응답 텍스트 | string | - | false | 오늘은 대중교통을... |
| carbon_gco2eq | 탄소 배출량 (gCO2eq) | float | - | true | 0.0012 |
| tokens_remaining | 남은 토큰 | float | - | false | 950.0 |
| exhausted | 토큰 소진 여부 | boolean | - | false | false |
| session_title | 자동 생성된 세션 제목 | string | - | true | 탄소 절약 방법 |

**Example**

```json
{
  "message_id": "uuid",
  "response_message_id": "uuid",
  "response": "오늘은 대중교통을 이용하거나 자전거를 타보세요!",
  "carbon_gco2eq": 0.0012,
  "tokens_remaining": 950.0,
  "exhausted": false,
  "session_title": "탄소 절약 방법"
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 전송 성공 |
| 401 | Authentication required |
| 403 | Daily chat tokens are exhausted |
| 404 | Chat session not found |
| 502 | AI provider failed to generate a response |

### 채팅 메시지 조회
- 설명: 한 세션 내 메시지 조회
- 메서드: GET
- URL: api/chat/sessions/{session_id}/messages

## 

메시지 목록 조회 (커서 페이지네이션, created_at 기준 오래된 순 반환)

### Request

**Query parameter**

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| limit | 한 페이지 최대 개수 (1~100) | integer | optional | - | 20 |
| cursor | 다음 페이지 커서 | string | optional | - | 2026-05-14T00:00:00Z |

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| items | 메시지 목록 | array | - | false | [...] |
| items[].id | 메시지 UUID | string | - | false | uuid |
| items[].session_id | 세션 UUID | string | - | false | uuid |
| items[].role | 발신자 역할 | string | user / assistant | false | user |
| items[].content | 메시지 내용 | string | - | false | 안녕하세요 |
| items[].carbon_gco2eq | 탄소 배출량 | float | - | true | 0.0012 |
| items[].created_at | 생성 시각 | string (ISO 8601) | - | false | 2026-05-14T00:00:00Z |
| next_cursor | 다음 페이지 커서 | string | - | true | 2026-05-13T00:00:00Z |

**Example**

```json
{
  "items": [
    {
      "id": "uuid",
      "session_id": "uuid",
      "role": "user",
      "content": "오늘 탄소 절약 방법 알려줘",
      "carbon_gco2eq": null,
      "created_at": "2026-05-14T00:00:00Z"
    },
    {
      "id": "uuid",
      "session_id": "uuid",
      "role": "assistant",
      "content": "오늘은 대중교통을 이용하거나 자전거를 타보세요!",
      "carbon_gco2eq": 0.0012,
      "created_at": "2026-05-14T00:00:00Z"
    }
  ],
  "next_cursor": null
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 조회 성공 |
| 401 | Authentication required |
| 404 | Chat session not found |

### 채팅 세션 생성
- 설명: 새 채팅 세션 생성
- 메서드: POST
- URL: /api/chat/sessions

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| id | 세션 UUID | string | - | false | uuid |
| title | 세션 제목 | string | - | true | null |
| created_at | 생성 시각 | string (ISO 8601) | - | false | 2026-05-14T00:00:00Z |
| updated_at | 수정 시각 | string (ISO 8601) | - | false | 2026-05-14T00:00:00Z |

**Example**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": null,
  "created_at": "2026-05-14T00:00:00Z",
  "updated_at": "2026-05-14T00:00:00Z"
}
```

### Status

| status | response content |
| --- | --- |
| 201 | 세션 생성 성공 |
| 401 | Authentication required |


### 채팅 세션 조회
- 설명: 현재 로그인한 사용자 조회
- 메서드: GET
- URL: /api/chat/sessions

세션 목록 조회 (커서 페이지네이션, updated_at 기준 최신순)

### Request

**Query parameter**

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| limit | 한 페이지 최대 개수 (1~100) | integer | optional | - | 20 |
| cursor | 다음 페이지 커서 | string | optional | - | 2026-05-14T00:00:00Z |

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| items | 세션 목록 | array | - | false | [...] |
| next_cursor | 다음 페이지 커서 | string | - | true | 2026-05-13T00:00:00Z |

**Example**

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "탄소 절약 방법",
      "created_at": "2026-05-14T00:00:00Z",
      "updated_at": "2026-05-14T00:00:00Z"
    }
  ],
  "next_cursor": null
}
```

### Status

### 채팅 세션 수정
- 설명: 세션 제목 수정
- 메서드: PATCH
- URL: /api/chat/sessions/{session_id}
### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| title | 세션 제목 (최대 120자) | string | optional | true | 나의 채팅 |

### Response

`POST /chat/sessions` 응답과 동일

**Example**

```json
{
  "id": "uuid",
  "title": "나의 채팅",
  "created_at": "2026-05-14T00:00:00Z",
  "updated_at": "2026-05-14T00:00:00Z"
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 수정 성공 |
| 401 | Authentication required |
| 404 | Chat session not found |

### 채팅 세션 삭제
- 설명: 세션 삭제(메시지 포함 cascade 삭제)
- 메서드: DELETE
- URL: /api/chat/sessions/{session_id}

### Request

없음

### Response

없음 (No Content)

### Status

| status | response content |
| --- | --- |
| 204 | 삭제 성공 |
| 401 | Authentication required |
| 404 | Chat session not found |

## 토큰

### 토큰 조회
- 설명: KST 기준 오늘의 토큰 상태를 조회한다. 오늘 상태가 없으면 기본값으로 생성한다.
- 메서드: GET
- URL: /api/tokens/today

### Request

없음

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| date | KST 기준 날짜 | String(Date) | `YYYY-MM-DD` | X | `"2026-05-13"` |
| tokens_remaining | 남은 탄소 토큰 | Number | gCO2eq 단위, 0 이상 150 이하 | X | `150.0` |
| upload_reward_given | 오늘 사진 업로드 보상 지급량 | Number | gCO2eq 단위 | X | `20.0` |
| like_reward_given | 오늘 좋아요 보상 지급량 | Number | gCO2eq 단위, 최대 60 | X | `0.0` |
| total_reward_given | 오늘 총 보상 지급량 | Number | gCO2eq 단위 | X | `20.0` |
| challenge_count | 오늘 생성된 챌린지 수 | Number | 최대 3 | X | `1` |
| updated_at | 수정 시각 | String(DateTime) | ISO 8601 | X | `"2026-05-13T00:00:00Z"` |

**Example**

```json
{
  "date": "2026-05-13",
  "tokens_remaining": 150.0,
  "upload_reward_given": 20.0,
  "like_reward_given": 0.0,
  "total_reward_given": 20.0,
  "challenge_count": 1,
  "updated_at": "2026-05-13T00:00:00Z"
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 오늘 토큰 상태 조회 성공 |
| 401 | 인증되지 않은 사용자 |


---
# 신규(20260515)
**2026-05-15 신규 추가**

## 챌린지

### 챌린지 조회
- 설명: 현재 사용자의 진행 중 챌린지를 조회한다.
- 메서드: GET
- URL: /api/challenges/current

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| 없음 | 요청 body 없음 | - | - | - | - |
|  |  |  |  |  |  |

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| challenge | 현재 진행 중 챌린지 정보 | object | - | O | {...} |
| challenge.id | 챌린지 ID | string(UUID) | - | X | "c1a2..." |
| challenge.category | 챌린지 카테고리 | string | transport, diet, energy | X | "energy" |
| challenge.title | 챌린지 제목 | string | - | X | "오늘 에어컨 1시간 줄이기" |
| challenge.description | 챌린지 설명 | string | - | X | "오늘 하루 에어컨 사용 시간을 줄여보세요." |
| challenge.difficulty | 난이도 | integer | 1~3 | X | 1 |
| challenge.status | 챌린지 상태 | string | pending_acceptance, active, completed | X | "active" |
| challenge.created_at | 생성 시각 | string(datetime) | ISO 8601 | X | "2026-05-04T12:00:00Z" |
| challenge.completed_at | 완료 시각 | string(datetime) | ISO 8601 | O | null |

**Example**

```jsx
{
  "challenge": {
    "id": "c1a2b3d4-1111-2222-3333-444455556666",
    "category": "energy",
    "title": "오늘 에어컨 1시간 줄이기",
    "description": "오늘 하루 에어컨 사용 시간을 평소보다 1시간 줄여보세요.",
    "difficulty": 1,
    "status": "active",
    "created_at": "2026-05-04T12:00:00Z",
    "completed_at": null
  }
}
```

```jsx
// 진행 중 챌린지가 없는 경우
{
  "challenge": null
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 현재 진행 중 챌린지 조회 성공 |
| 401 | 로그인하지 않은 사용자 |

### 챌린지 생성
- 설명: 토큰 소진 시 개인 맞춤 챌린지를 생성한다.
- 메서드: POST
- URL: /api/challenges/generate

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| 없음 | 요청 body 없음 | - | - | - | - |
|  |  |  |  |  |  |

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| challenge | 생성되었거나 기존에 존재하는 챌린지 | object | - | X | {...} |
| challenge.id | 챌린지 ID | string(UUID) | - | X | "c1a2..." |
| challenge.category | 챌린지 카테고리 | string | transport, diet, energy | X | "transport" |
| challenge.title | 챌린지 제목 | string | - | X | "가까운 거리는 도보로 이동하기" |
| challenge.description | 챌린지 설명 | string | - | X | "오늘 1km 이내 이동은 걸어서 이동해보세요." |
| challenge.difficulty | 난이도 | integer | 1~3 | X | 1 |
| challenge.status | 챌린지 상태 | string | pending_acceptance | X | "pending_acceptance" |
| challenge.created_at | 생성 시각 | string(datetime) | ISO 8601 | X | "2026-05-04T12:00:00Z" |
| challenge.completed_at | 완료 시각 | string(datetime) | ISO 8601 | O | null |
| created | 새로 생성되었는지 여부 | boolean | - | X | true |

**Example**

```jsx
{
  "challenge": {
    "id": "c1a2b3d4-1111-2222-3333-444455556666",
    "category": "transport",
    "title": "가까운 거리는 도보로 이동하기",
    "description": "오늘 1km 이내 이동은 자동차 대신 걸어서 이동해보세요.",
    "difficulty": 1,
    "status": "pending_acceptance",
    "created_at": "2026-05-04T12:00:00Z",
    "completed_at": null
  },
  "created": true
}
```

```jsx
// 이미 진행 중인 챌린지가 있는 경우
{
  "challenge": {
    "id": "c1a2b3d4-1111-2222-3333-444455556666",
    "category": "transport",
    "title": "가까운 거리는 도보로 이동하기",
    "description": "오늘 1km 이내 이동은 자동차 대신 걸어서 이동해보세요.",
    "difficulty": 1,
    "status": "pending_acceptance",
    "created_at": "2026-05-04T12:00:00Z",
    "completed_at": null
  },
  "created": false
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 기존 진행 중 챌린지 반환 |
| 201 | 새 챌린지 생성 성공 |
| 401 | 로그인하지 않은 사용자 |
| 409 | 토큰이 아직 남아 있어 챌린지 생성 불가 |
| 429 | 하루 챌린지 생성 횟수 초과 |
| 500 | 챌린지 생성 실패 |

### 챌린지 수락
- 설명: 생성된 챌린지를 수락하고 active 상태로 변경한다.
- 메서드: POST
- URL: /api/challenges/{id}/accept

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| id | 챌린지 ID | string(UUID) | path parameter | X | "c1a2b3d4-1111-2222-3333-444455556666" |
|  |  |  |  |  |  |

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| challenge | 수락된 챌린지 정보 | object | - | X | {...} |
| challenge.id | 챌린지 ID | string(UUID) | - | X | "c1a2..." |
| challenge.category | 챌린지 카테고리 | string | transport, diet, energy | X | "energy" |
| challenge.title | 챌린지 제목 | string | - | X | "오늘 에어컨 1시간 줄이기" |
| challenge.description | 챌린지 설명 | string | - | X | "오늘 하루 에어컨 사용 시간을 줄여보세요." |
| challenge.difficulty | 난이도 | integer | 1~3 | X | 1 |
| challenge.status | 챌린지 상태 | string | active | X | "active" |
| challenge.created_at | 생성 시각 | string(datetime) | ISO 8601 | X | "2026-05-04T12:00:00Z" |
| challenge.completed_at | 완료 시각 | string(datetime) | ISO 8601 | O | null |

**Example**

```jsx
{
  "challenge": {
    "id": "c1a2b3d4-1111-2222-3333-444455556666",
    "category": "energy",
    "title": "오늘 에어컨 1시간 줄이기",
    "description": "오늘 하루 에어컨 사용 시간을 평소보다 1시간 줄여보세요.",
    "difficulty": 1,
    "status": "active",
    "created_at": "2026-05-04T12:00:00Z",
    "completed_at": null
  }
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 챌린지 수락 성공 |
| 401 | 로그인하지 않은 사용자 |
| 404 | 챌린지가 존재하지 않거나 본인 챌린지가 아님 |
| 409 | pending_acceptance 상태가 아니어서 수락 불가 |

### 챌린지 사진 업로드
- 설명: 챌린지 인증 사진을 업로드하고 업로드 보상을 지급한다.
- 메서드: POST 
- URL: /api/challenges/{id}/photo

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| id | 챌린지 ID | string(UUID) | path parameter | X | "c1a2b3d4-1111-2222-3333-444455556666" |
| file | 인증 사진 파일 | File | form-data | X | challenge.jpg |

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| photo_id | 업로드된 사진 ID | string(UUID) | - | X | "p1a2..." |
| challenge_id | 챌린지 ID | string(UUID) | - | X | "c1a2..." |
| photo_url | 사진 접근 URL | string | public URL 또는 signed URL | X | "https://..." |
| tokens_remaining | 업로드 보상 반영 후 남은 토큰 | number | 0~150 | X | 120.0 |
| reward_amount | 실제 지급된 보상 토큰 | number | 0~20 | X | 20.0 |
| status | 변경된 챌린지 상태 | string | completed | X | "completed" |

**Example**

```jsx
{
  "photo": {
    "id": "photo_uuid",
    "challenge_id": "challenge_uuid",
    "file_url": "https://...",
    "created_at": "2026-05-15T12:00:00Z"
  },
  "challenge": {
    "id": "challenge_uuid",
    "status": "completed",
    "completed_at": "2026-05-15T12:00:00Z"
  },
  "reward": {
    "type": "upload_reward",
    "reward_amount": 20.0,
    "tokens_remaining": 120.0
  }
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 사진 업로드 성공 |
| 400 | 파일 형식 오류, 파일 크기 초과, 이미지 처리 실패 |
| 401 | 로그인하지 않은 사용자 |
| 404 | 챌린지가 존재하지 않거나 본인 챌린지가 아님 |
| 409 | 챌린지가 active 상태가 아니거나 이미 사진이 업로드됨 |
| 500 | 파일 저장 실패 |


## 피드

### 챌린지 피드 조회
- 설명: 삭제되지 않은 인증 피드 목록을 최신순으로 조회한다.
- 메서드: GET
- URL: /api/challenges/feed

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| 없음 | 요청 body 없음 | - | - | - | - |
|  |  |  |  |  |  |

**Query parameter**

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| limit | 조회할 피드 개수 | integer | 기본값 20 | O | `20` |
| offset | 조회 시작 위치 | integer | 기본값 0 | O | `0` |

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| items | 피드 목록 | array | - | X | [{...}] |
| items[].photo_id | 사진 ID | string(UUID) | - | X | "p1a2..." |
| items[].challenge_id | 챌린지 ID | string(UUID) | - | X | "c1a2..." |
| items[].user_id | 업로더 ID | string(UUID) | - | X | "u1a2..." |
| items[].nickname | 업로더 닉네임 | string | - | O | "GreenUser" |
| items[].profile_image_url | 업로더 프로필 이미지 | string | URL | O | "https://..." |
| items[].title | 챌린지 제목 | string | - | X | "오늘 에어컨 1시간 줄이기" |
| items[].category | 챌린지 카테고리 | string | transport, diet, energy | X | "energy" |
| items[].photo_url | 인증 사진 URL | string | URL | X | "https://..." |
| items[].like_count | 좋아요 수 | integer | 0 이상 | X | 4 |
| items[].liked_by_me | 현재 사용자의 좋아요 여부 | boolean | - | X | true |
| items[].carbon_saved_gco2eq | 예상 탄소 절감량 | number | gCO2eq | O | 120.0 |
| items[].created_at | 피드 생성 시각 | string(datetime) | ISO 8601 | X | "2026-05-04T13:00:00Z" |
| total | 전체 피드 개수 | integer | - | O | 42 |
| limit | 요청한 limit | integer | - | X | 20 |
| offset | 요청한 offset | integer | - | X | 0 |

**Example**

```jsx
{
  "items": [
    {
      "photo_id": "p1a2b3d4-1111-2222-3333-444455556666",
      "challenge_id": "c1a2b3d4-1111-2222-3333-444455556666",
      "user_id": "u1a2b3d4-1111-2222-3333-444455556666",
      "nickname": "GreenUser",
      "profile_image_url": "https://example.com/profile.png",
      "title": "오늘 에어컨 1시간 줄이기",
      "category": "energy",
      "photo_url": "https://supabase-storage-url/challenge-photos/p1a2b3d4.jpg",
      "like_count": 4,
      "liked_by_me": true,
      "carbon_saved_gco2eq": 120.0,
      "created_at": "2026-05-04T13:00:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 피드 조회 성공 |
| 400 | query parameter 형식 오류 |
| 401 | 로그인하지 않은 사용자 |

### 피드 게시물 삭제
- 설명: 본인이 업로드한 인증 피드 게시물을 soft delete 처리한다.
- 메서드: DELETE
- URL: /api/challenge-photos/{photo_id}

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| photo_id | 삭제할 인증 사진 ID | string(UUID) | path parameter | X | "p1a2b3d4-1111-2222-3333-444455556666" |
|  |  |  |  |  |  |

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| deleted | 삭제 처리 여부 | boolean | - | X | true |
| photo_id | 삭제된 사진 ID | string(UUID) | - | X | "p1a2..." |
| deleted_at | 삭제 시각 | string(datetime) | ISO 8601 | X | "2026-05-04T14:00:00Z" |

**Example**

```jsx
{
  "deleted": true,
  "photo_id": "p1a2b3d4-1111-2222-3333-444455556666",
  "deleted_at": "2026-05-04T14:00:00Z"
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 피드 게시물 삭제 성공 |
| 401 | 로그인하지 않은 사용자 |
| 404 | 사진이 존재하지 않거나 본인 게시물이 아님 |
| 409 | 이미 삭제된 게시물 |

## 좋아요

### 피드 좋아요
- 설명: 인증 사진에 좋아요를 누르고, 3개 단위 도달 시 토큰 보상을 지급한다.
- 메서드: POST
- URL: /api/challenge-photos/{photo_id}/like

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| photo_id | 좋아요를 누를 인증 사진 ID | string(UUID) | path parameter | X | "p1a2b3d4-1111-2222-3333-444455556666" |

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| liked | 좋아요 등록 여부 | boolean | - | X | true |
| photo_id | 사진 ID | string(UUID) | - | X | "p1a2..." |
| like_count | 현재 좋아요 수 | integer | 0 이상 | X | 3 |
| reward_given | 보상 지급 여부 | boolean | - | X | true |
| reward_amount | 실제 지급된 보상 토큰 | number | 0~20 | X | 20.0 |
| tokens_remaining | 업로더의 보상 후 남은 토큰 | number | 0~150 | O | 120.0 |

**Example**

```jsx
{
  "liked": true,
  "photo_id": "p1a2b3d4-1111-2222-3333-444455556666",
  "like_count": 3,
  "reward_given": true,
  "reward_amount": 20.0,
  "tokens_remaining": 120.0
}
```

```jsx
// milestone에 도달하지 않은 경우
{
  "liked": true,
  "photo_id": "p1a2b3d4-1111-2222-3333-444455556666",
  "like_count": 2,
  "reward_given": false,
  "reward_amount": 0.0,
  "tokens_remaining": null
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 좋아요 등록 성공 |
| 400 | 삭제된 사진이거나 좋아요 불가 상태 |
| 401 | 로그인하지 않은 사용자 |
| 404 | 사진이 존재하지 않음 |
| 409 | 이미 좋아요를 누른 사진 또는 본인 사진 좋아요 시도 |
| 429 | 신규 계정 제한 또는 일일 보상 한도 초과 |

### 좋아요 사용자 목록 조회
- 설명: 해당 사진에 좋아요를 누른 사용자 목록을 조회한다. 이메일은 노출하지 않는다.
- 메서드: GET
- URL: /api/challenge-photos/{photo_id}/likes

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| photo_id | 인증 사진 ID | string(UUID) | path parameter | X | "p1a2b3d4-1111-2222-3333-444455556666" |

**Query parameter**

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| limit | 조회할 사용자 수 | integer | 기본값 20 | O | `20` |
| offset | 조회 시작 위치 | integer | 기본값 0 | O | `0` |

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| items | 좋아요 사용자 목록 | array | - | X | [{...}] |
| items[].user_id | 좋아요를 누른 사용자 ID | string(UUID) | - | X | "u1a2..." |
| items[].nickname | 사용자 닉네임 | string | - | O | "GreenUser" |
| items[].profile_image_url | 사용자 프로필 이미지 | string | URL | O | "https://..." |
| items[].liked_at | 좋아요를 누른 시각 | string(datetime) | ISO 8601 | X | "2026-05-04T13:10:00Z" |
| total | 전체 좋아요 사용자 수 | integer | - | O | 3 |
| limit | 요청한 limit | integer | - | X | 20 |
| offset | 요청한 offset | integer | - | X | 0 |

**Example**

```jsx
{
  "items": [
    {
      "user_id": "u1a2b3d4-1111-2222-3333-444455556666",
      "nickname": "GreenUser",
      "profile_image_url": "https://example.com/profile.png",
      "liked_at": "2026-05-04T13:10:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 좋아요 사용자 목록 조회 성공 |
| 400 | query parameter 형식 오류 |
| 401 | 로그인하지 않은 사용자 |
| 404 | 사진이 존재하지 않거나 삭제된 사진 |

---
## API update(260519)

## 유저

### 온보딩
- 설명: 온보딩 생활습관 프로필을 저장한다.
- 메서드: POST
- URL: /api/users/onboarding

### Request

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| transport_mode | 주요 이동 수단 | string |  | No | “car” |
| diet_type | 식단 유형 | string |  | No | “omnivore” |
| housing_type | 주거 유형 | string |  | No | “apartment” |

**Query parameter**

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| transport_mode | 주요 이동 수단 | string |  | No | “car” |
| diet_type | 식단 유형 | string |  | No | “omnivore” |
| housing_type | 주거 유형 | string |  | No | “apartment” |
|  |  |  |  |  |  |

**Example**

```jsx
{
      "transport_mode": "car",
      "diet_type": "omnivore",
      "housing_type": "apartment"
}
```

### Status

| status | response content |
| --- | --- |
| 201 | 생성 또는 업데이트 |
| 400 | 인증 필요 |


## 20260520 update

## 채팅

### 모델 조회
- 설명: 선택 가능한 모델을 배열(리스트) 형태로 전달 받는다.
- 메서드: GET
- URL: /api/chat/models
### Request

없음

**Query parameter**

없음

### Response

| key | 설명 | value 타입 | 옵션 | Nullable | 예시 |
| --- | --- | --- | --- | --- | --- |
| items | runyourai가 제공하는 모델 리스트 | array of string |  | false  | ["openai/gpt-4.1-2025-04-14"] |

**Example**

```jsx
{
  "items": [
    "runyour/free",
    "openai/gpt-5.5-2026-04-23",
    "openai/gpt-5.5-pro-2026-04-23",
    "openai/gpt-5.4-2026-03-05",
    "openai/gpt-5.4-pro-2026-03-05",
    "openai/gpt-5.4-mini-2026-03-17",
    "openai/gpt-5.4-nano-2026-03-17",
    "openai/gpt-5.3-codex",
    "openai/gpt-5.2",
    "openai/gpt-5.1",
    "openai/gpt-5",
    "openai/gpt-5-mini-2025-08-07",
    "openai/gpt-5-nano-2025-08-07",
    "openai/gpt-4.1-2025-04-14",
    "openai/gpt-image-1.5",
    "anthropic/claude-opus-4-7",
    "anthropic/claude-opus-4-6",
    "anthropic/claude-opus-4-5",
    "anthropic/claude-sonnet-4-6",
    "anthropic/claude-sonnet-4-5",
    "anthropic/claude-haiku-4-5",
    "gemini/gemini-3.1-pro-preview",
    "gemini/gemini-3-flash-preview",
    "gemini/gemini-2.5-pro",
    "gemini/gemini-2.5-flash",
    "gemini/gemini-2.5-flash-lite",
    "gemini/gemini-3-pro-image-preview",
    "gemini/gemini-3.1-flash-image-preview",
    "deepseek/deepseek-chat",
    "upstage/solar-pro3",
    "upstage/solar-pro2"
  ]
}
```

### Status

| status | response content |
| --- | --- |
| 200 | 조회 성공 |
| 400 | 인증 필요 |
| 502  | RunyourAI 프로파이더 오류 |


---
## 응답 형식 update 20260524

### 유저 조회
**Example**

```json
{
  "success": true,
  "message": "조회 성공",
  "data": {
    "id": "42e6399d-5532-4162-a9e0-dd53f645260b",
    "email": "taehwan011@gmail.com",
    "nickname": "hwaaaan",
    "profile_image_url": "/uploads/profile-images/42e6399d-5532-4162-a9e0-dd53f645260b/f9e1bea5-52c1-47db-bac7-31ff3f462392.webp",
    "onboarding_completed": true,
    "profile": {
      "transport_mode": "transit",
      "diet_type": "omnivore",
      "housing_type": "apartment"
    },
    "today_tokens": {
      "date": "2026-05-24",
      "tokens_remaining": 150
    }
  }
}

```

### 유저 수정
**Example**

```json
{
  "success": true,
  "message": "수정되었습니다.",
  "data": {
    "id": "42e6399d-5532-4162-a9e0-dd53f645260b",
    "email": "taehwan011@gmail.com",
    "nickname": "hwaaaan",
    "profile_image_url": "/uploads/profile-images/42e6399d-5532-4162-a9e0-dd53f645260b/5cdb6507-5aa4-456d-8b7b-8723c46400ea.webp",
    "updated_at": "2026-05-23T15:07:32.985903Z"
  }
}
```

### 생활습관 프로필 조회
**Example**

```json
{
  "success": true,
  "message": "조회 성공",
  "data": {
    "transport_mode": "car",
    "diet_type": "omnivore",
    "housing_type": "apartment",
    "updated_at": "2026-05-23T15:15:19.807301Z"
  }
}
```

### 생활습관 프로필 수정
**Example**

```json
{
  "success": true,
  "message": "수정되었습니다.",
  "data": {
    "transport_mode": "car",
    "diet_type": "omnivore",
    "housing_type": "apartment",
    "updated_at": "2026-05-23T15:15:19.807301Z"
  }
}
```

### 온보딩
**Example**

```jsx
{
  "success": true,
  "message": "온보딩이 완료되었습니다.",
  "data": {
    "transport_mode": "car",
    "diet_type": "omnivore",
    "housing_type": "apartment",
    "updated_at": "2026-05-23T15:15:19.807301Z"
  }
}
```

### 회원가입
**Example**

```jsx
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "id": "ea3a4d4e-379b-4eb8-afc5-034da98cddae",
    "email": "taehwan12@gmail.com",
    "onboarding_completed": false,
    "created_at": "2026-05-23T14:50:39.401293Z"
  }
}
```

### 로그인
Example

```python
{
  "success": true,
  "message": "로그인되었습니다.",
  "data": {
    "onboarding_completed": true
  }
}
```

### 로그아웃
### Example

```python
{
  "success": true,
  "message": "로그아웃되었습니다.",
  "data": null
}
```


### 채팅 전송
**Example**

```json
{
  "message_id": "35393d67-7ad4-42c3-8c44-dac661f0d48e",
  "response_message_id": "87914fc1-1ff0-42b7-8bdd-d486917c2eea",
  "response": "안녕하세요 🙂  \n오늘은 무슨 이야기를 나눠볼까요?",
  "carbon_gco2eq": 0.00790069079248988,
  "tokens_remaining": 149.5738076049075,
  "exhausted": false,
  "session_title": null,
  "model_id": "openai/gpt-5.4-mini-2026-03-17"
}
```

### 채팅 메시지 조회
**Example**

```json
{
  "items": [
    {
      "id": "3131fffd-d126-4b24-a6a9-e9f03035854f",
      "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
      "role": "user",
      "content": "안녕",
      "carbon_gco2eq": null,
      "model_id": null,
      "created_at": "2026-05-19T05:06:23.933874Z"
    },
    {
      "id": "f1e0ad87-8005-48b5-928c-710939fd8c0e",
      "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
      "role": "assistant",
      "content": "안녕하세요! 😊 반갑습니다! 무엇을 도와드릴까요?",
      "carbon_gco2eq": 0.0970438300553649,
      "model_id": "anthropic/claude-opus-4-6",
      "created_at": "2026-05-19T05:06:27.375700Z"
    },
  ],
  "next_cursor": null
}
```

### 채팅 세션 생성

**Example**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": null,
  "created_at": "2026-05-14T00:00:00Z",
  "updated_at": "2026-05-14T00:00:00Z"
}
```

### 채팅 세션 조회

**Example**

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "탄소 절약 방법",
      "created_at": "2026-05-14T00:00:00Z",
      "updated_at": "2026-05-14T00:00:00Z"
    }
  ],
  "next_cursor": null
}
```

### 채팅 세션 수정
**Example**

```json
{
  "id": "uuid",
  "title": "나의 채팅",
  "created_at": "2026-05-14T00:00:00Z",
  "updated_at": "2026-05-14T00:00:00Z"
}
```


### 모델 조회
**Example**

```jsx
{
  "items": [
    "runyour/free",
    "openai/gpt-5.5-2026-04-23",
    "openai/gpt-5.5-pro-2026-04-23",
    "openai/gpt-5.4-2026-03-05",
    "openai/gpt-5.4-pro-2026-03-05",
    "openai/gpt-5.4-mini-2026-03-17",
    "openai/gpt-5.4-nano-2026-03-17",
    "openai/gpt-5.3-codex",
    "openai/gpt-5.2",
    "openai/gpt-5.1",
    "openai/gpt-5",
    "openai/gpt-5-mini-2025-08-07",
    "openai/gpt-5-nano-2025-08-07",
    "openai/gpt-4.1-2025-04-14",
    "openai/gpt-image-1.5",
    "anthropic/claude-opus-4-7",
    "anthropic/claude-opus-4-6",
    "anthropic/claude-opus-4-5",
    "anthropic/claude-sonnet-4-6",
    "anthropic/claude-sonnet-4-5",
    "anthropic/claude-haiku-4-5",
    "gemini/gemini-3.1-pro-preview",
    "gemini/gemini-3-flash-preview",
    "gemini/gemini-2.5-pro",
    "gemini/gemini-2.5-flash",
    "gemini/gemini-2.5-flash-lite",
    "gemini/gemini-3-pro-image-preview",
    "gemini/gemini-3.1-flash-image-preview",
    "deepseek/deepseek-chat",
    "upstage/solar-pro3",
    "upstage/solar-pro2"
  ]
}
```

### 토큰 조회
**Example**

```json
{
  "success": true,
  "message": "조회 성공",
  "data": {
    "date": "2026-05-24",
    "tokens_remaining": 150,
    "upload_reward_given": 0,
    "like_reward_given": 0,
    "total_reward_given": 0,
    "challenge_count": 0,
    "updated_at": "2026-05-23T15:03:49.954264Z"
  }
}
```

## update 20260524

### 채팅 전송
**Example**

```json
{
    "success": true,
    "message": "메시지가 전송되었습니다.",
    "data": {
      "message_id": "uuid",
      "response_message_id": "uuid",
      "response": "오늘은 대중교통을...",
      "carbon_gco2eq": 0.0012,
      "tokens_remaining": 950.0,
      "exhausted": false,
      "session_title": "탄소 절약 방법",
      "model_id": "openai/gpt-4.1-2025-04-14"
    }
  }
```

### 채팅 메시지 조회
**Example**

```json
{
  "success": true,
  "message": "조회 성공",
  "data": {
    "items": [
      {
        "id": "3131fffd-d126-4b24-a6a9-e9f03035854f",
        "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
        "role": "user",
        "content": "안녕",
        "carbon_gco2eq": null,
        "model_id": null,
        "created_at": "2026-05-19T05:06:23.933874Z"
      },
      {
        "id": "f1e0ad87-8005-48b5-928c-710939fd8c0e",
        "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
        "role": "assistant",
        "content": "안녕하세요! 😊 반갑습니다! 무엇을 도와드릴까요?",
        "carbon_gco2eq": 0.0970438300553649,
        "model_id": "anthropic/claude-opus-4-6",
        "created_at": "2026-05-19T05:06:27.375700Z"
      },
      {
        "id": "b533841e-5b4b-49be-a114-356a7b97d2f6",
        "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
        "role": "user",
        "content": "안녕",
        "carbon_gco2eq": null,
        "model_id": null,
        "created_at": "2026-05-19T05:07:09.638661Z"
      },
      {
        "id": "688470e4-7503-445b-a2d1-4735fc2ccbc2",
        "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
        "role": "assistant",
        "content": "안녕하세요! 또 인사 주셨네요. 😊 오늘 하루는 어떻게 보내고 계신가요? 궁금한 점이 있으시거나, 함께 나누고 싶은 이야기가 있다면 언제든 말씀해 주세요.",
        "carbon_gco2eq": 0.254274860100079,
        "model_id": "gemini/gemini-3.1-flash-image-preview",
        "created_at": "2026-05-19T05:07:11.986377Z"
      },
      {
        "id": "cb8a03a1-17e2-46d4-a7ec-124510cc5a23",
        "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
        "role": "user",
        "content": "안녕",
        "carbon_gco2eq": null,
        "model_id": null,
        "created_at": "2026-05-19T05:07:34.639706Z"
      },
      {
        "id": "9b18ea4c-3bd6-4654-913e-5257aa39367a",
        "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
        "role": "assistant",
        "content": "안녕 🙂  \n세 번이나 인사해 줘서 고마워.\n\n나도 계속 대답해 줄 수 있어.  \n이번엔 인사 말고, 딱 한 가지만 알려줘:\n\n- 궁금한 거 하나  \n  또는  \n- 그냥 잡담하고 싶은 주제 하나\n\n예: 게임, 연애, 공부, 진로, 영화 추천, 아무거나!",
        "carbon_gco2eq": 0.0669730141448915,
        "model_id": "openai/gpt-5.1",
        "created_at": "2026-05-19T05:07:37.190885Z"
      },
      {
        "id": "35393d67-7ad4-42c3-8c44-dac661f0d48e",
        "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
        "role": "user",
        "content": "안녕",
        "carbon_gco2eq": null,
        "model_id": null,
        "created_at": "2026-05-19T05:08:12.291565Z"
      },
      {
        "id": "87914fc1-1ff0-42b7-8bdd-d486917c2eea",
        "session_id": "322890dd-2f1c-424b-8125-d3ce9f040281",
        "role": "assistant",
        "content": "안녕하세요 🙂  \n오늘은 무슨 이야기를 나눠볼까요?",
        "carbon_gco2eq": 0.00790069079248988,
        "model_id": "openai/gpt-5.4-mini-2026-03-17",
        "created_at": "2026-05-19T05:08:13.638656Z"
      }
    ],
    "next_cursor": null
  }
}
```

### 채팅 세션 생성
**Example**

```json
{
  "success": true,
  "message": "세션이 생성되었습니다.",
  "data": {
    "id": "f1cfd64f-ee4b-4d44-a3c1-18ac0eb2a9b9",
    "title": null,
    "created_at": "2026-05-23T16:54:33.522613Z",
    "updated_at": "2026-05-23T16:54:33.522613Z"
  }
}
```

### 채팅 세션 조회
**Example**

```json
{
  "success": true,
  "message": "조회 성공",
  "data": {
    "items": [
      {
        "id": "762e6006-c44b-4d66-a9ad-bd371acb5ad8",
        "title": "이름이 궁금해!",
        "created_at": "2026-05-14T05:47:29.934437Z",
        "updated_at": "2026-05-14T05:55:18.235418Z"
      },
      {
        "id": "0355fdfb-b493-4fbe-9978-2c39888ef49a",
        "title": "오늘의 날씨 정보",
        "created_at": "2026-05-14T03:25:26.128098Z",
        "updated_at": "2026-05-14T03:32:32.534241Z"
      },
      {
        "id": "0eab6d95-a6c4-4357-aed9-e7845c36e5ca",
        "title": null,
        "created_at": "2026-05-14T03:20:44.675490Z",
        "updated_at": "2026-05-14T03:20:44.675490Z"
      }
    ],
    "next_cursor": null
  }
}
```

### 채팅 세션 수정

**Example**

```json
{
  "success": true,
  "message": "수정되었습니다.",
  "data": {
    "id": "uuid",
    "title": "나의 채팅",
    "created_at": "2026-05-14T00:00:00Z",
    "updated_at": "2026-05-14T00:00:00Z"
   }
}
```

### 채팅 세션 삭제

#### Example

```python
{
    "success": true,
    "message": "세션이 삭제되었습니다.",
    "data": null
  }
```

### 모델 조회
**Example**

```jsx
{
  "success": true,
  "message": "조회 성공",
  "data": {
    "items": [
      "runyour/free",
      "openai/gpt-5.5-2026-04-23",
      "openai/gpt-5.5-pro-2026-04-23",
      "openai/gpt-5.4-2026-03-05",
      "openai/gpt-5.4-pro-2026-03-05",
      "openai/gpt-5.4-mini-2026-03-17",
      "openai/gpt-5.4-nano-2026-03-17",
      "openai/gpt-5.3-codex",
      "openai/gpt-5.2",
      "openai/gpt-5.1",
      "openai/gpt-5",
      "openai/gpt-5-mini-2025-08-07",
      "openai/gpt-5-nano-2025-08-07",
      "openai/gpt-4.1-2025-04-14",
      "openai/gpt-image-1.5",
      "anthropic/claude-opus-4-7",
      "anthropic/claude-opus-4-6",
      "anthropic/claude-opus-4-5",
      "anthropic/claude-sonnet-4-6",
      "anthropic/claude-sonnet-4-5",
      "anthropic/claude-haiku-4-5",
      "gemini/gemini-3.1-pro-preview",
      "gemini/gemini-3-flash-preview",
      "gemini/gemini-2.5-pro",
      "gemini/gemini-2.5-flash",
      "gemini/gemini-2.5-flash-lite",
      "gemini/gemini-3-pro-image-preview",
      "gemini/gemini-3.1-flash-image-preview",
      "deepseek/deepseek-chat",
      "upstage/solar-pro3",
      "upstage/solar-pro2"
    ]
  }
}
```

### 챌린지 조회
**Example**

```jsx
{
    "success": true,
    "message": "조회 성공",
    "data": {
      "challenge": {
        "id": "c1a2b3d4-1111-2222-3333-444455556666",
        "category": "energy",
        "title": "오늘 에어컨 1시간 줄이기",
        "description": "오늘 하루 에어컨 사용 시간을 평소보다 1시간 줄여보세요.",
        "difficulty": 1,
        "status": "active",
        "created_at": "2026-05-04T12:00:00Z",
        "completed_at": null
      }
    }
  }
```

```jsx
{
  "success": true,
  "message": "조회 성공",
  "data": {
    "challenge": null
  }
}
```

### 챌린지 생성

**Example**

```jsx
{
  "success": true,
  "message": "챌린지가 생성되었습니다.",
  "data": {
	  "challenge": {
	    "id": "c1a2b3d4-1111-2222-3333-444455556666",
	    "category": "transport",
	    "title": "가까운 거리는 도보로 이동하기",
	    "description": "오늘 1km 이내 이동은 자동차 대신 걸어서 이동해보세요.",
	    "difficulty": 1,
	    "status": "pending_acceptance",
	    "created_at": "2026-05-04T12:00:00Z",
	    "completed_at": null
	  },
	  "created": true
	} 
}
```

```jsx
// 이미 진행 중인 챌린지가 있는 경우
{
	"success": true,
  "message": "기존 챌린지를 반환합니다.",
  "data": {
	  "challenge": {
	    "id": "c1a2b3d4-1111-2222-3333-444455556666",
	    "category": "transport",
	    "title": "가까운 거리는 도보로 이동하기",
	    "description": "오늘 1km 이내 이동은 자동차 대신 걸어서 이동해보세요.",
	    "difficulty": 1,
	    "status": "pending_acceptance",
	    "created_at": "2026-05-04T12:00:00Z",
	    "completed_at": null
	  },
	  "created": false
	 }
}
```

### 챌린지 수락

**Example**

```jsx
{
    "success": true,
    "message": "챌린지를 수락했습니다.",
    "data": {
      "challenge": {
        "id": "c1a2b3d4-1111-2222-3333-444455556666",
        "category": "transport",
        "title": "가까운 거리는 도보로 이동하기",
        "description": "오늘 1km 이내 이동은 자동차 대신 걸어서 이동해보세요.",
        "difficulty": 1,
        "status": "active",
        "created_at": "2026-05-04T12:00:00Z",
        "completed_at": null
      }
    }
  }
```

### 챌린지 사진 업로드

**Example**

```jsx
 {
    "success": true,
    "message": "사진이 업로드되었습니다.",
    "data": {
      "photo": {
        "id": "photo_uuid",
        "challenge_id": "challenge_uuid",
        "file_url": "https://...",
        "created_at": "2026-05-15T12:00:00Z"
      },
      "challenge": {
        "id": "challenge_uuid",
        "status": "completed",
        "completed_at": "2026-05-15T12:00:00Z"
      },
      "reward": {
        "type": "upload_reward",
        "reward_amount": 20.0,
        "tokens_remaining": 120.0
      }
    }
  }
```

### 챌린지 피드 조회
**Example**

```jsx
{
    "success": true,
    "message": "조회 성공",
    "data": {
      "items": [
        {
          "photo_id": "p1a2b3d4-1111-2222-3333-444455556666",
          "challenge_id": "c1a2b3d4-1111-2222-3333-444455556666",
          "user_id": "u1a2b3d4-1111-2222-3333-444455556666",
          "nickname": "GreenUser",
          "profile_image_url": "https://example.com/profile.png",
          "title": "오늘 에어컨 1시간 줄이기",
          "category": "energy",
          "photo_url": "https://...",
          "like_count": 4,
          "liked_by_me": true,
          "carbon_saved_gco2eq": null,
          "created_at": "2026-05-04T13:00:00Z"
        }
      ],
      "total": 1,
      "limit": 20,
      "offset": 0
    }
  }
```
