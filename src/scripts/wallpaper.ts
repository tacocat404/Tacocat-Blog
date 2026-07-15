// 우주 배경 픽셀 렌더러 — "달 위의 외계고양이" (Alien Cat OS 배경 대개편 v4).
// 하늘 전체를 2px 논리픽셀 단위 ImageData로 그린다:
//   디더 그라데이션 + 노이즈 엣지 성운 + 은하수 + 별 2레이어(교차 블링크) +
//   계절 특수(여름 태양 / 겨울 오로라) + 원경 능선 달 지형 + 24×24 지구 + 인공위성.
// 마크업은 Wallpaper.astro, 스타일은 src/styles/wallpaper.css, 호출은 desktop.ts.

export type Season = "spring" | "summer" | "autumn" | "winter";

/* ===== 결정적 난수 + Bayer 디더 ===== */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

/* ===== 계절 설정 ===== */
type SkyPal = {
  bands: string[];
  nebula: { cx: number; cy: number; rx: number; ry: number; core: string; edge: string }[];
  starTint: string;
  mwDensity: number;
  sun?: boolean;
  aurora?: boolean;
};
const SKY: Record<Season, SkyPal> = {
  spring: { bands: ["#0d0a1e", "#161028", "#1f1533", "#2b1c42"], nebula: [
      { cx: .16, cy: .24, rx: .30, ry: .22, core: "#4a2a4e", edge: "#312040" },
      { cx: .86, cy: .55, rx: .26, ry: .20, core: "#3a2a5c", edge: "#291d44" } ],
    starTint: "#ffd9e4", mwDensity: .16 },
  summer: { bands: ["#040a1c", "#071129", "#0a1a3a", "#0e2450"], nebula: [
      { cx: .16, cy: .50, rx: .28, ry: .22, core: "#0e3a52", edge: "#0a2a40" },
      { cx: .80, cy: .20, rx: .24, ry: .18, core: "#274a6e", edge: "#173754" } ],
    starTint: "#d9f2ff", mwDensity: .14, sun: true },
  autumn: { bands: ["#100a08", "#1a110c", "#241610", "#301c12"], nebula: [
      { cx: .18, cy: .22, rx: .30, ry: .22, core: "#57301c", edge: "#3c2315" },
      { cx: .84, cy: .58, rx: .26, ry: .20, core: "#4c2418", edge: "#361a12" } ],
    starTint: "#ffe9c9", mwDensity: .15 },
  winter: { bands: ["#070c1a", "#0b1224", "#101a32", "#162442"], nebula: [
      { cx: .72, cy: .16, rx: .28, ry: .20, core: "#22375c", edge: "#182946" },
      { cx: .18, cy: .55, rx: .26, ry: .20, core: "#1c3050", edge: "#14243c" } ],
    starTint: "#cfe4ff", mwDensity: .18, aurora: true },
};
const EARTH_PAL: Record<Season, Record<string, string>> = {
  spring: { b: "#3d6fd9", B: "#2a4ea6", l: "#7dc95e", i: "#eaf6ff", c: "#ffffff" },
  summer: { b: "#2c8fe0", B: "#1e63b0", l: "#3f9e46", i: "#f2fbff", c: "#ffffff" },
  autumn: { b: "#3a5fae", B: "#283f7a", l: "#d98f3f", i: "#f0ecdf", c: "#ffe9c9" },
  winter: { b: "#6e8fc9", B: "#4a648f", l: "#dfe9f2", i: "#ffffff", c: "#cfe4ff" },
};
const MOON_TONES: Record<Season, string[]> = {
  spring: ["#d0d5e4", "#9aa1b8", "#6b7289", "#4a5065", "#2c3145"],
  summer: ["#d0d6e0", "#9aa2b6", "#6c748a", "#4b5266", "#2d3346"],
  autumn: ["#d8d0c8", "#a89e94", "#787066", "#524b43", "#332e29"],
  winter: ["#dde4f0", "#a8b2c9", "#77829c", "#525c76", "#303a52"],
};

/* ===== 지구 24×24 (b 바다 / B 바다그늘 / l 대륙 / i 빙하 / c 구름) ===== */
const EARTH = [
  "........iiiiiiii........", "......iiiiiiiiiiii......", "....bbiiiiiiiiiibbBB....",
  "...bbbllbbbbbbbbllbBB...", "..bbllllbbccbbbblllbbB..", ".bclllllbbbccbbbblllbBB.",
  ".bbllllllbbbbbbbblllbBB.", "bbbllllccbbbbbbbbllbbbBB", "bbbbllbbbbbbcccbbbbbbbBB",
  "bbbbbbbbbblbbbbbblllbbBB", "bccbbbbbbblllbbbbllllbBB", "bbbbbbbbblllllbbbllllbBB",
  "bbbllbbbbllllllbbblllBBB", "bbllllbbbblllllbccbllBBB", "bblllllbbbbllllbbbbblBBB",
  "bbbllllccbbblllbbbbbbBBB", "bbbbllbbbbbbblbbbbbbBBBB", ".bbbbbbbccbbbbbbbbbbBBB.",
  ".bbbbbbbbbbbbbbbbbBBBBB.", "..bbbbbbbbbbbbbbbBBBBB..", "...bbiibbbbbbbbBBBBBB...",
  "....biiiiiiiiiiiiBBB....", "......iiiiiiiiiiiB......", "........iiiiiiii........",
];
/* 인공위성 12×4 */
const SAT = [".....tt.....", "PPPttttttPPP", "PPPttttttPPP", ".....tt....."];
const SAT_PAL: Record<string, string> = { t: "#c9cdd8", P: "#4a6fd9" };

const hex2rgb = (h: string): [number, number, number] =>
  [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/* ===== 하늘 베이스 (그라데이션+성운+은하수+계절 특수) ===== */
function drawSkyBase(canvas: HTMLCanvasElement, pal: SkyPal, seed: number, W: number, H: number) {
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const data = img.data;
  const cache: Record<string, [number, number, number]> = {};
  const put = (x: number, y: number, hex: string) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const c = cache[hex] ?? (cache[hex] = hex2rgb(hex));
    const i = (y * W + x) * 4;
    data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255;
  };

  const rnd = lcg(seed);
  const n = pal.bands.length;
  for (let y = 0; y < H; y++) {
    const t = (y / H) * (n - 1);
    const i = Math.floor(t), frac = t - i;
    for (let x = 0; x < W; x++) {
      const th = (BAYER[y % 4][x % 4] + 0.5) / 16;
      put(x, y, pal.bands[Math.min(i + (frac > th ? 1 : 0), n - 1)]);
    }
  }
  const nrnd = lcg(seed ^ 0x9e3779b9);
  pal.nebula.forEach((nb, k) => {
    const cx = nb.cx * W, cy = nb.cy * H, rx = nb.rx * W, ry = nb.ry * H;
    for (let y = Math.max(0, cy - ry * 1.2) | 0; y < Math.min(H, cy + ry * 1.2); y++) {
      for (let x = Math.max(0, cx - rx * 1.2) | 0; x < Math.min(W, cx + rx * 1.2); x++) {
        const d = Math.hypot((x - cx) / rx, (y - cy) / ry) * (0.85 + nrnd() * 0.3);
        if (d > 1) continue;
        const a = 1 - d;
        const th = (BAYER[(y + k) % 4][x % 4] + 0.5) / 16;
        if (a > 0.55 && a * 0.9 > th) put(x, y, nb.core);
        else if (a * 0.7 > th) put(x, y, nb.edge);
      }
    }
  });
  // 은하수: 좌하 → 우상 대각 밴드
  const x1 = 0, y1 = H * 0.62, x2 = W, y2 = H * 0.10;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const bw = H * 0.16;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const d = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / len;
    if (d > bw) continue;
    const p = 1 - d / bw;
    const r = rnd();
    if (r < p * p * pal.mwDensity * 0.5) put(x, y, "#e8ecff");
    else if (r < p * p * pal.mwDensity) put(x, y, "#8890b8");
  }
  // 여름: 픽셀 태양 (8방향 광선)
  if (pal.sun) {
    const sx = (W * 0.60) | 0, sy = (H * 0.13) | 0, R = 9;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const d = Math.hypot(dx, dy);
      if (d > R) continue;
      if (d <= 4) put(sx + dx, sy + dy, "#fff7d9");
      else if (d <= 7) put(sx + dx, sy + dy, "#ffe98c");
      else if ((BAYER[(sy + dy + 40) % 4][(sx + dx + 40) % 4] + 0.5) / 16 < (R - d) / 2) put(sx + dx, sy + dy, "#f2cf4a");
    }
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    dirs.forEach(([ux, uy], di) => {
      const dlen = di < 4 ? 6 : 4;
      for (let k = R + 3; k < R + 3 + dlen; k++) put(sx + ux * k, sy + uy * k, "#ffe98c");
    });
  }
  // 겨울: 디더 오로라 커튼 (세로 결)
  if (pal.aurora) {
    const arnd = lcg(seed ^ 0x51ed270b);
    for (let x = 0; x < W; x++) {
      const base = H * 0.12 + Math.sin(x * 0.028) * 8 + Math.sin(x * 0.009 + 2) * 5;
      const colStrength = 0.35 + arnd() * 0.65;
      for (let k = 0; k < 22; k++) {
        const p = (1 - k / 22) * 0.5 * colStrength;
        if (arnd() < p) put(x, (base + k) | 0, k < 8 ? "#8ce8b8" : "#7ab8e8");
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

/* ===== 별 레이어 (2장 교차 블링크용, 투명 배경) ===== */
function drawStarLayer(canvas: HTMLCanvasElement, pal: SkyPal, seed: number, W: number, H: number) {
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const data = img.data;
  const put = (x: number, y: number, hex: string) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const c = hex2rgb(hex), i = (y * W + x) * 4;
    data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255;
  };
  const rnd = lcg(seed);
  const starN = Math.round((W * H) / 1440);
  for (let i = 0; i < starN; i++) {
    const x = (rnd() * W) | 0, y = (rnd() * (H * 0.94)) | 0;
    const r = rnd();
    const col = r < .18 ? pal.starTint : (r < .5 ? "#c8d6ff" : "#ffffff");
    if (r < .06) { put(x, y, col); put(x - 1, y, col); put(x + 1, y, col); put(x, y - 1, col); put(x, y + 1, col); }
    else if (r < .16) { put(x, y, col); put(x + 1, y, col); }
    else put(x, y, col);
  }
  ctx.putImageData(img, 0, 0);
}

/* ===== 달 표면 (원경 능선 + 주 지형 + 크레이터 + 자갈) ===== */
function drawMoon(canvas: HTMLCanvasElement, tones: string[], COLS: number) {
  const ROWS = 28;
  canvas.width = COLS; canvas.height = ROWS;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, COLS, ROWS);
  const put = (x: number, y: number, col: string) => {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, 1, 1);
  };
  const backAt = (x: number) => 5 + Math.round(Math.sin(x * 0.13 + 1) * 2.2 + Math.sin(x * 0.041) * 2.8);
  const mainAt = (x: number) => 11 + Math.round(Math.sin(x * 0.27) * 2.2 + Math.sin(x * 0.10 + 2) * 2.8);
  for (let x = 0; x < COLS; x++) {
    const b = Math.max(2, backAt(x));
    for (let y = b; y < ROWS; y++) put(x, y, tones[4]);
  }
  for (let x = 0; x < COLS; x++) {
    const t = Math.max(4, mainAt(x));
    for (let y = t; y < ROWS; y++) {
      let tone = y === t ? 0 : (y < t + 5 ? 1 : 2);
      if (tone === 2 && (x + y) % 2 === 0) tone = 3;
      if (tone === 1 && (x * 3 + y) % 11 === 0) tone = 2;
      put(x, y, tones[tone]);
    }
  }
  const crnd = lcg(777);
  for (let cx = 12; cx < COLS - 8; cx += 18 + ((crnd() * 12) | 0)) {
    const cy = 16 + ((crnd() * 6) | 0), r = 3 + ((crnd() * 4) | 0);
    for (let dx = -r; dx <= r; dx++) for (let dy = -Math.ceil(r / 2); dy <= Math.ceil(r / 2); dy++) {
      const v = (dx * dx) / (r * r) + (dy * dy) / ((r / 2) * (r / 2));
      if (v > 1) continue;
      put(cx + dx, cy + dy, tones[v > .5 ? 3 : 2]);
    }
    put(cx - r, cy - 1, tones[0]); put(cx + r, cy - 1, tones[0]);
    for (let dx = -r + 1; dx < r; dx++) put(cx + dx, cy + Math.ceil(r / 2), tones[3]);
  }
  const prnd = lcg(4242);
  for (let i = 0; i < COLS / 2; i++) {
    const x = (prnd() * COLS) | 0;
    const y = 13 + ((prnd() * (ROWS - 14)) | 0);
    put(x, y, prnd() < .5 ? tones[3] : tones[1]);
  }
}

/* ===== 도트맵 → 캔버스 ===== */
function drawGrid(canvas: HTMLCanvasElement, rows: string[], cell: number, pal: Record<string, string>) {
  const w = rows[0].length, h = rows.length;
  canvas.width = w * cell; canvas.height = h * cell;
  const ctx = canvas.getContext("2d")!;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const col = pal[rows[y][x]];
    if (!col) continue;
    ctx.fillStyle = col;
    ctx.fillRect(x * cell, y * cell, cell, cell);
  }
}

/* ===== 공개 API ===== */
let currentSeason: Season = "spring";
let lastW = 0, lastH = 0;

export function renderWallpaper(season: Season) {
  currentSeason = season;
  const root = document.querySelector<HTMLElement>(".wp-space");
  if (!root) return;
  const w = root.clientWidth, h = root.clientHeight;
  if (!w || !h) return;
  lastW = w; lastH = h;
  const W = Math.ceil(w / 2), H = Math.ceil(h / 2);
  const sky = root.querySelector<HTMLCanvasElement>(".wp-sky");
  const sA = root.querySelector<HTMLCanvasElement>(".wp-starsA");
  const sB = root.querySelector<HTMLCanvasElement>(".wp-starsB");
  const moon = root.querySelector<HTMLCanvasElement>(".wp-moon");
  const earth = root.querySelector<HTMLCanvasElement>(".wp-earth");
  const sat = root.querySelector<HTMLCanvasElement>(".wp-sat");
  if (sky) drawSkyBase(sky, SKY[season], 20260714, W, H);
  if (sA) drawStarLayer(sA, SKY[season], 11111, W, H);
  if (sB) drawStarLayer(sB, SKY[season], 22222, W, H);
  if (moon) drawMoon(moon, MOON_TONES[season], Math.ceil(w / 4));
  if (earth) drawGrid(earth, EARTH, 8, EARTH_PAL[season]);
  if (sat && !sat.dataset.drawn) { // 위성은 계절 무관 1회 (캔버스 기본 크기가 300×150이라 width로 판별 불가)
    drawGrid(sat, SAT, 3, SAT_PAL);
    sat.dataset.drawn = "1";
  }
}

/* 리사이즈: 크기가 실제로 바뀌었을 때만 다시 그림 (300ms 디바운스) */
let resizeTimer = 0;
export function initWallpaperResize() {
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const root = document.querySelector<HTMLElement>(".wp-space");
      if (!root) return;
      if (Math.abs(root.clientWidth - lastW) < 24 && Math.abs(root.clientHeight - lastH) < 24) return;
      renderWallpaper(currentSeason);
    }, 300);
  });
}
