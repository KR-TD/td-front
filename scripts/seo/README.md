# SEO Automation Scripts

## 1) Weekly report from Search Console CSV

Run:

```bash
npm run seo:report
```

Default input/output:
- Input CSV: `data/seo/gsc-weekly.csv`
- Output MD: `docs/seo-reports/weekly-seo-report-<week>.md`

Environment variables:
- `SEO_GSC_CSV`: custom input CSV path
- `SEO_REPORT_DIR`: custom output directory
- `SEO_SITE`: report site label

Example:

```bash
SEO_GSC_CSV=data/seo/gsc-2026-02-21.csv SEO_SITE=haru2end.com npm run seo:report
```

## 2) Required CSV columns

The parser supports these headers (case-insensitive):
- `query`
- `page` (or `url`)
- `clicks`
- `impressions`
- `ctr` (percent or decimal)
- `position`
- `date` (optional)

## 3) Recommended weekly flow

1. Export query report from Search Console as CSV
2. Save to `data/seo/gsc-weekly.csv`
3. Run `npm run seo:report`
4. Review quick-win sections:
   - High Impression + Low CTR
   - Good Position + Low CTR
   - Content Expansion Candidates
5. Move top 3 actions into `docs/seo-growth-plan.md` progress log
