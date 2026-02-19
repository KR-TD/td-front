# Profile / Settings API Spec (for frontend integration)

Base URL:
- `https://code.haru2end.dedyn.io/api`

Auth:
- `Authorization: Bearer <accessToken>`
- JSON requests use `Content-Type: application/json`

## 1) Get current user (already used)
- `GET /user/info`
- Auth required: yes

Response example:
```json
{
  "id": 1,
  "name": "곰겜",
  "email": "beargame@example.com",
  "profileImageUrl": "https://cdn.example.com/profile/a.png"
}
```

## 2) Upload profile image (already used in signup, reused in profile edit)
- `POST /image/sign/user`
- Auth required: no (current frontend assumes no auth)
- Body: `multipart/form-data`
  - field name: `images` (single file)

Response example:
```json
{
  "url": "https://cdn.example.com/profile/new-image.png"
}
```

## 3) Update profile (new required endpoint)
- `PATCH /user/profile`
- Auth required: yes
- Request body:
```json
{
  "nickName": "새닉네임",
  "imageUrl": "https://cdn.example.com/profile/new-image.png"
}
```

Validation expected:
- `nickName`: 2~12 chars
- `imageUrl`: nullable allowed

Response options (either works for frontend):
1. `200 OK` + updated user object
2. `204 No Content`

Error response example:
```json
{
  "message": "닉네임은 2자 이상 12자 이하입니다."
}
```

## 4) Change password (new required endpoint)
- `PATCH /user/password`
- Auth required: yes
- Request body:
```json
{
  "currentPassword": "old-password",
  "newPassword": "New!Pass123",
  "newPasswordValid": "New!Pass123"
}
```

Validation expected:
- `newPassword`: regex `^(?=.*[a-zA-Z])(?=.*\\W).{8,16}$`
- `newPasswordValid` must match `newPassword`
- `currentPassword` must match account password

Response options:
1. `200 OK` + boolean/object
2. `204 No Content`

Error response example:
```json
{
  "message": "현재 비밀번호가 일치하지 않습니다."
}
```

## 5) Common error contract
Frontend currently reads `errorData.message`, so backend should return:
```json
{
  "message": "사람이 읽을 수 있는 오류 메시지"
}
```

Recommended status codes:
- `400 Bad Request`: validation failure
- `401 Unauthorized`: missing/invalid token
- `403 Forbidden`: no permission
- `404 Not Found`: user not found
- `409 Conflict`: duplicate nickname, etc.
- `500 Internal Server Error`: server failure

## 6) Forgot password flow from login (new required endpoint)
Frontend flow:
1. Send code
2. Verify code
3. Reset password

### 6-1) Send email code
- `POST /user/send/code`
- Auth required: no
- Request:
```json
{
  "email": "beargame@example.com"
}
```
- Response: `201 Created` (or `200 OK`)

### 6-2) Verify code
- `POST /user/code/check`
- Auth required: no
- Request:
```json
{
  "email": "beargame@example.com",
  "code": "123456"
}
```
- Response: `200 OK` + `true` / `false`

### 6-3) Reset password
- `PATCH /user/password/reset`
- Auth required: no
- Request:
```json
{
  "email": "beargame@example.com",
  "code": "123456",
  "password": "New!Pass123",
  "passwordValid": "New!Pass123"
}
```
- Response options:
1. `200 OK`
2. `204 No Content`

## Frontend files already wired to these endpoints
- `components/profile-settings-dialog.tsx`
- `components/user-menu.tsx`
- `components/mobile-menu-sheet.tsx`
- `diary-page.tsx`
- `contexts/auth-context.tsx`
