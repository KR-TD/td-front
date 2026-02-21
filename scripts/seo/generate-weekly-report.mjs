import fs from "node:fs";
import path from "node:path";

const INPUT_PATH = process.env.SEO_GSC_CSV || "data/seo/gsc-weekly.csv";
const OUTPUT_DIR = process.env.SEO_REPORT_DIR || "docs/seo-reports";
const SITE = process.env.SEO_SITE || "haru2end.com";

function parseCsv(text) {
  const rows = [];
  let cur = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      row.push(cur);
      cur = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(cur);
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
      cur = "";
      continue;
    }

    cur += ch;
  }

  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    if (row.some((x) => x.trim() !== "")) rows.push(row);
  }

  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((r) => {
    const obj = {};
    header.forEach((key, idx) => {
      obj[key] = (r[idx] ?? "").trim();
    });
    return obj;
  });
}

function num(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/[%,$]/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function top(items, size, sortFn) {
  return [...items].sort(sortFn).slice(0, size);
}

function toMdTable(rows, columns) {
  if (rows.length === 0) return "_No data_\n";
  const header = `| ${columns.join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows
    .map((r) => `| ${columns.map((c) => String(r[c] ?? "")).join(" | ")} |`)
    .join("\n");
  return `${header}\n${divider}\n${body}\n`;
}

function normalizeRow(row) {
  const ctrRaw = row.ctr ?? row["site ctr"] ?? "0";
  const ctr = ctrRaw.includes("%") ? num(ctrRaw) : num(ctrRaw) * 100;

  return {
    query: row.query || "(unknown)",
    page: row.page || row.url || "(unknown)",
    clicks: num(row.clicks),
    impressions: num(row.impressions),
    ctr,
    position: num(row.position),
    date: row.date || row.day || "",
  };
}

function fmt(n, digits = 2) {
  return Number(n).toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function pickWeekLabel(rows) {
  const dates = rows.map((r) => r.date).filter(Boolean).sort();
  if (dates.length === 0) return new Date().toISOString().slice(0, 10);
  return `${dates[0]}_to_${dates[dates.length - 1]}`;
}

function main() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Input CSV not found: ${INPUT_PATH}`);
    console.error("Export Search Console query report CSV and set SEO_GSC_CSV or save to data/seo/gsc-weekly.csv");
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT_PATH, "utf8");
  const parsed = parseCsv(raw).map(normalizeRow);

  if (parsed.length === 0) {
    console.error("No rows parsed from CSV.");
    process.exit(1);
  }

  const weekLabel = pickWeekLabel(parsed);
  const totalClicks = parsed.reduce((sum, r) => sum + r.clicks, 0);
  const totalImpressions = parsed.reduce((sum, r) => sum + r.impressions, 0);
  const weightedCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgPosition = parsed.reduce((sum, r) => sum + r.position, 0) / parsed.length;

  const topByClicks = top(parsed, 15, (a, b) => b.clicks - a.clicks).map((r) => ({
    Query: r.query,
    Clicks: Math.round(r.clicks),
    Impressions: Math.round(r.impressions),
    CTR: `${fmt(r.ctr, 2)}%`,
    Position: fmt(r.position, 2),
  }));

  const highImpressionLowCtr = parsed
    .filter((r) => r.impressions >= 200 && r.ctr <= 2.0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15)
    .map((r) => ({
      Query: r.query,
      Impressions: Math.round(r.impressions),
      CTR: `${fmt(r.ctr, 2)}%`,
      Position: fmt(r.position, 2),
      Action: "Title/description rewrite",
    }));

  const goodPositionLowCtr = parsed
    .filter((r) => r.position > 0 && r.position <= 8 && r.ctr < 3.0)
    .sort((a, b) => a.position - b.position)
    .slice(0, 15)
    .map((r) => ({
      Query: r.query,
      Position: fmt(r.position, 2),
      CTR: `${fmt(r.ctr, 2)}%`,
      Impressions: Math.round(r.impressions),
      Action: "Snippet/intent alignment",
    }));

  const landingNeedsContent = parsed
    .filter((r) => r.impressions >= 80 && r.position >= 12)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 12)
    .map((r) => ({
      Query: r.query,
      Position: fmt(r.position, 2),
      Impressions: Math.round(r.impressions),
      Suggestion: "Create/expand landing section",
    }));

  const md = `# Weekly SEO Report\n\n` +
`- Site: ${SITE}\n` +
`- Week: ${weekLabel}\n` +
`- Rows: ${parsed.length}\n` +
`- Total Clicks: ${Math.round(totalClicks).toLocaleString("en-US")}\n` +
`- Total Impressions: ${Math.round(totalImpressions).toLocaleString("en-US")}\n` +
`- Weighted CTR: ${fmt(weightedCtr, 2)}%\n` +
`- Avg Position: ${fmt(avgPosition, 2)}\n\n` +
`## Top Queries by Clicks\n` +
`${toMdTable(topByClicks, ["Query", "Clicks", "Impressions", "CTR", "Position"])}\n` +
`## High Impression + Low CTR (Quick Win)\n` +
`${toMdTable(highImpressionLowCtr, ["Query", "Impressions", "CTR", "Position", "Action"])}\n` +
`## Good Position + Low CTR (Snippet Fix)\n` +
`${toMdTable(goodPositionLowCtr, ["Query", "Position", "CTR", "Impressions", "Action"])}\n` +
`## Content Expansion Candidates\n` +
`${toMdTable(landingNeedsContent, ["Query", "Position", "Impressions", "Suggestion"])}\n`;

  ensureDir(OUTPUT_DIR);
  const outPath = path.join(OUTPUT_DIR, `weekly-seo-report-${weekLabel}.md`);
  fs.writeFileSync(outPath, md, "utf8");
  console.log(`Report generated: ${outPath}`);
}

main();
