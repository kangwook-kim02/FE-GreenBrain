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
