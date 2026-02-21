# Community Bookmark API Spec (for backend)

## 목적
- 커뮤니티 게시글 상세에서 북마크 버튼을 실제 동작시키기 위한 API 명세입니다.
- 프론트는 이미 아래 경로로 연동되어 있습니다.

## Base URL
- `https://code.haru2end.dedyn.io/api`

## 1) 북마크 추가
- `POST /board/bookmark/{boardId}`
- 인증: 필요 (`Authorization: Bearer <accessToken>`)
- 요청 바디: 없음
- 성공 응답:
  - `201 Created` 또는 `204 No Content`
- 실패 응답 예시:
```json
{
  "status": 404,
  "code": "BOARD_NOT_FOUND",
  "message": "게시글을 찾을 수 없습니다."
}
```

## 2) 북마크 해제
- `DELETE /board/bookmark/cancel/{boardId}`
- 인증: 필요 (`Authorization: Bearer <accessToken>`)
- 요청 바디: 없음
- 성공 응답:
  - `204 No Content` 또는 `200 OK`

## 3) 게시글 응답 필드 확장 (권장)
프론트에서 북마크 상태를 정확히 표시하려면, 로그인 사용자 기준으로 아래 필드가 필요합니다.

- 커뮤니티 목록 응답 (`GET /board/list`, `GET /board/popular/list`, `GET /board/mood/list`)
- 게시글 상세 응답 (`GET /board/{id}`)

추가 필드:
```json
{
  "bookmarked": true
}
```

비로그인(guest) 응답에서는 `false` 또는 필드 생략 중 하나로 통일해 주세요.

## 4) 북마크 목록 조회 (신규 탭용)
- `GET /board/bookmark/list?page={page}&limit={limit}`
- 인증: 필요 (`Authorization: Bearer <accessToken>`)
- 성공 응답 예시:
```json
{
  "totalPage": 3,
  "list": [
    {
      "id": 101,
      "title": "오늘의 기록",
      "profile": "https://...",
      "thumbnail": "https://...",
      "writer": "bear",
      "view": 15,
      "commentCount": 2,
      "loveCount": 5,
      "bookmarked": true,
      "mood": "JOY",
      "boardCreateTime": "2026-02-21T10:00:00"
    }
  ]
}
```

## 5) 상태 코드 권장
- `400` 잘못된 요청
- `401` 인증 실패/만료 토큰
- `403` 권한 없음
- `404` 게시글 없음
- `409` 이미 북마크/이미 해제된 상태(선택)
- `500` 서버 오류

## 6) 프론트 동작 방식 (현재 구현)
- 버튼 클릭 시 낙관적 UI 업데이트(즉시 색상 반영)
- API 실패 시 원상복구
- 미로그인 사용자는 로그인 다이얼로그 유도
- 401 발생 시 토큰 재발급(`POST /user/reissue?refreshToken=...`) 후 1회 재시도

## 7) 구현 참고 (백엔드 예시 시그니처)
```kotlin
@PostMapping("/board/bookmark/{boardId}")
fun createBookmark(@PathVariable boardId: Long): ResponseEntity<Void>

@DeleteMapping("/board/bookmark/cancel/{boardId}")
fun cancelBookmark(@PathVariable boardId: Long): ResponseEntity<Void>

@GetMapping("/board/bookmark/list")
fun getBookmarkedBoards(
    @RequestParam page: Int,
    @RequestParam limit: Int
): BoardListResponse
```
