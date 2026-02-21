# SEO 자동화 실행 가이드

Last Updated: 2026-02-21

## 1) 목적
- Search Console CSV를 넣으면 주간 SEO 리포트(`.md`)를 자동 생성합니다.

## 2) 한 줄 실행 (기본)
```bash
npm run seo:report
```

기본 경로:
- 입력 CSV: `data/seo/gsc-weekly.csv`
- 출력 리포트: `docs/seo-reports/weekly-seo-report-<week>.md`

## 3) 실제 사용 순서
1. Search Console에서 쿼리 리포트를 CSV로 export
2. 파일명을 `data/seo/gsc-weekly.csv`로 저장
3. 아래 실행:
```bash
npm run seo:report
```
4. 생성된 리포트 열기:
- `docs/seo-reports/weekly-seo-report-*.md`

## 4) 샘플로 테스트
```bash
SEO_GSC_CSV=data/seo/gsc-weekly.sample.csv npm run seo:report
```

## 5) 옵션(환경변수)
- `SEO_GSC_CSV`: 입력 CSV 경로
- `SEO_REPORT_DIR`: 출력 디렉터리
- `SEO_SITE`: 리포트 표시용 사이트명

예시:
```bash
SEO_GSC_CSV=data/seo/gsc-2026-02-21.csv SEO_SITE=haru2end.com npm run seo:report
```

## 6) CSV 컬럼 형식
필수/권장 컬럼(대소문자 무관):
- `query`
- `page` 또는 `url`
- `clicks`
- `impressions`
- `ctr`
- `position`
- `date` (권장)

## 7) 에러가 날 때
- `Input CSV not found`:
  - `data/seo/gsc-weekly.csv` 파일이 있는지 확인
  - 또는 `SEO_GSC_CSV=...`로 파일 경로 지정
- 컬럼 누락:
  - 최소 `query, clicks, impressions, ctr, position` 포함 필요

## 8) 주간 루틴 추천
1. 월요일 오전: CSV export + 리포트 생성
2. 리포트에서 아래 3개 섹션 우선 처리
  - High Impression + Low CTR
  - Good Position + Low CTR
  - Content Expansion Candidates
3. 상위 3개 액션을 `docs/seo-growth-plan.md` Progress Log에 기록
