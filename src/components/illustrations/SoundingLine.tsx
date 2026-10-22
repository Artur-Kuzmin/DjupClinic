import styles from "./SoundingLine.module.css";

/**
 * Welcome page illustration: a sounding line and its lead weight dropping
 * into water that dithers darker with depth and fades out to the left.
 * Drawn on a 36 x 52 grid, computed once at build time.
 * Three colours: ink (line, weight), fjord (water), bone (glint and halo).
 */
const W = 36;
const H = 52;
const SURFACE = 22; // the solid surface row
const LINE_X = 25;
const WEIGHT_TOP = 38;
const FADE_COLUMNS = 10;

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

type Cell = "water" | "halo" | "ink" | "glint";

function threshold(x: number, y: number) {
  return (BAYER[y % 4][x % 4] + 0.5) / 16;
}

function edgeFade(x: number) {
  return Math.min(1, (x + 0.5) / FADE_COLUMNS);
}

function waterDensity(y: number) {
  if (y === SURFACE) return 1;
  const t = (y - SURFACE) / (H - 1 - SURFACE);
  return Math.min(1, 0.14 + 0.98 * Math.pow(t, 1.25));
}

/** Water is static; the line, weight, glint and halo move together. */
function draw(): { water: Map<string, Cell>; drop: Map<string, Cell> } {
  const grid = new Map<string, Cell>();
  const drop = new Map<string, Cell>();
  const key = (x: number, y: number) => `${x},${y}`;

  // Water, left edge dissolving into the page
  for (let y = SURFACE; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (threshold(x, y) < waterDensity(y) * edgeFade(x)) grid.set(key(x, y), "water");
    }
  }
  // Small crests on the surface
  for (const x of [7, 8, 18, 19, 30, 31]) {
    if (threshold(x, SURFACE - 1) < edgeFade(x)) grid.set(key(x, SURFACE - 1), "water");
  }

  // Line with two leather markers, then the bell-shaped lead weight
  const ink: [number, number][] = [];
  for (let y = -16; y < WEIGHT_TOP; y += 1) ink.push([LINE_X, y]);
  for (const y of [7, 14]) ink.push([LINE_X - 1, y], [LINE_X + 1, y]);
  const bell: [number, number][] = [[1, 1], [2, 2], [2, 2], [3, 3], [3, 3], [3, 3], [4, 4], [4, 4]];
  bell.forEach(([left, right], i) => {
    for (let x = LINE_X - left; x <= LINE_X + right; x += 1) ink.push([x, WEIGHT_TOP + i]);
  });

  // A one-cell halo in the page colour travels with the weight, so the line
  // and weight read cleanly against the dither wherever they are
  for (const [x, y] of ink) {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) drop.set(key(x + dx, y + dy), "halo");
    }
  }
  for (const [x, y] of ink) drop.set(key(x, y), "ink");
  for (const y of [WEIGHT_TOP + 2, WEIGHT_TOP + 3, WEIGHT_TOP + 4]) drop.set(key(LINE_X - 1, y), "glint");
  drop.set(key(LINE_X - 2, WEIGHT_TOP + 6), "glint");

  return { water: grid, drop };
}

function toPaths(...grids: Map<string, Cell>[]): Record<Cell, string> {
  const paths: Record<Cell, string> = { water: "", halo: "", ink: "", glint: "" };
  for (const grid of grids) {
    for (const [position, cell] of grid) {
      const [x, y] = position.split(",").map(Number);
      paths[cell] += `M${x} ${y}h1v1h-1z`;
    }
  }
  return paths;
}

const { water, drop } = draw();
const PATHS = toPaths(water, drop);

export function SoundingLine({ label, className }: { label: string; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={[styles.art, className].filter(Boolean).join(" ")}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <path d={PATHS.water} className={styles.water} />
      <g className={styles.drop}>
        <path d={PATHS.halo} className={styles.highlight} />
        <path d={PATHS.ink} className={styles.line} />
        <path d={PATHS.glint} className={styles.highlight} />
      </g>
    </svg>
  );
}
