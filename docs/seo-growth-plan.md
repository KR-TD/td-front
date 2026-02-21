# SEO Growth Plan (Diary App)

Last Updated: 2026-02-21
Owner: Frontend
Goal: `일기 사이트` 계열 키워드의 비브랜드 검색 유입 확대

## 1) Current Snapshot
- Done
  - 다국어 메타/OG/Twitter/hreflang/canonical 적용
  - `?lang=` 기반 언어 분기 메타 적용
  - sitemap에 언어별 URL 추가
  - 랜딩 페이지 2개 추가
    - `/diary-site`
    - `/online-diary`
  - FAQ/Breadcrumb/SoftwareApplication 구조화 데이터 일부 적용
- In Progress
  - 랜딩 페이지 간 내부링크 네트워크 확장
  - 키워드 클러스터(미들/롱테일) 확장
- Pending
  - Search Console/GA 기준 KPI 대시보드 운영
  - 외부 링크(언급/리뷰/디렉토리) 확보
  - CWV/LCP/INP 개선

## 2) KPI (8~12 weeks)
- Top priority keyword group
  - `일기 사이트`, `온라인 일기장`, `감성 일기`
- KPI
  - 비브랜드 클릭수 +30% 이상
  - 클러스터 키워드 Top10 진입 20개+
  - 랜딩페이지 CTR 5%+
  - 랜딩페이지 평균 체류시간 20%+

## 3) Backlog
### Phase A (Now ~ 2 weeks)
- [x] `/diary-site` 랜딩 추가
- [x] `/online-diary` 랜딩 추가
- [x] `/emotional-diary` 랜딩 추가
- [x] `/private-diary` 랜딩 추가
- [ ] 각 랜딩 FAQ 5개 이상으로 확장

### Phase B (2 ~ 6 weeks)
- [ ] 블로그/가이드 8~12개 발행
  - 일기 잘 쓰는 법
  - 감정 기록 템플릿
  - 모바일 일기 루틴
  - 디지털 일기 보안
- [ ] 내부링크 허브 구조 적용
  - 허브: `/diary-site`
  - 스포크: 각 롱테일 랜딩

### Phase C (6 ~ 12 weeks)
- [ ] 외부 언급/링크 확보 20개+
- [ ] 비교/추천 SERP 대응 페이지 제작
- [ ] 성과 낮은 페이지 메타/타이틀 AB 테스트

## 4) Weekly Ops
- 월: Search Console 쿼리/페이지 성과 확인
- 화: 메타 타이틀/설명 개선 2개
- 수: 신규 콘텐츠 1개 발행
- 목: 내부링크 최적화
- 금: 인덱싱/커버리지/CWV 점검

## 4.1) Automation
- `npm run seo:report`
  - 입력: `data/seo/gsc-weekly.csv`
  - 출력: `docs/seo-reports/weekly-seo-report-<week>.md`
  - 자동 생성 섹션:
    - Top Queries by Clicks
    - High Impression + Low CTR
    - Good Position + Low CTR
    - Content Expansion Candidates
- 스크립트 문서: `scripts/seo/README.md`

## 5) Progress Log
- 2026-02-21
  - 다국어 SEO 메타 시스템 적용
  - `diary-site`, `online-diary` 랜딩 제작
  - sitemap 확장
  - `emotional-diary`, `private-diary` 랜딩 제작
  - 랜딩 구조화데이터(FAQ/Breadcrumb/SoftwareApplication) 강화
  - SEO 주간 리포트 자동 생성 스크립트 추가

## 6) Next Action (Immediate)
1. 각 랜딩 FAQ를 5문항 이상으로 확장
2. 랜딩별 실제 제품 화면 캡처 섹션 추가
3. Search Console 기준 랜딩 CTR 개선(타이틀/설명 A/B)
