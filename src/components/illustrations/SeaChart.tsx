import styles from "./SeaChart.module.css";

/**
 * Startup Clinic illustration: a fragment of sea chart. A coastline, depth
 * contours stepping out from it, spot soundings, and a dashed course with
 * waypoints heading for deeper water. Drawn on a 48 x 30 grid at build time.
 * Two colours on bone: ink (coast, course) and fjord (contours, soundings).
 */
const W = 48;
const H = 30;
const LEVELS = [0, 0.5, 1.1, 1.8];
const COURSE: [number, number][] = [
  [7, 13],
  [18, 19],
  [31, 15],
  [43, 24],
];
const NEIGHBOURS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

type Cell = "ink" | "mark";

/** Distance out from the coast, which curves around the top-left corner. */
function depth(x: number, y: number) {
  return Math.hypot((x + 0.5) / 17, (y + 0.5) / 10) - 1;
}

function band(x: number, y: number) {
  const d = depth(x, y);
  return LEVELS.filter((level) => d >= level).length;
}

function inside(x: number, y: number) {
  return x >= 0 && y >= 0 && x < W && y < H;
}

/** Bresenham line between waypoints, keeping two cells in every four. */
function dashedCourse(): [number, number][] {
  const cells: [number, number][] = [];
  let step = 0;
  for (let i = 0; i < COURSE.length - 1; i += 1) {
    let [x0, y0] = COURSE[i];
    const [x1, y1] = COURSE[i + 1];
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      if (step % 4 < 2) cells.push([x0, y0]);
      step += 1;
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }
  return cells;
}

/** A square waypoint of radius r: filled, hollow, or hollow with a centre dot. */
function waypoint(cx: number, cy: number, r: number, style: "filled" | "hollow" | "target") {
  const cells: [number, number][] = [];
  for (let y = cy - r; y <= cy + r; y += 1) {
    for (let x = cx - r; x <= cx + r; x += 1) {
      const edge = Math.max(Math.abs(x - cx), Math.abs(y - cy));
      if (style === "filled" || edge === r || (style === "target" && edge === 0)) cells.push([x, y]);
    }
  }
  return cells;
}

function draw(): Record<Cell, string> {
  const cells = new Map<string, Cell>();
  const key = (x: number, y: number) => `${x},${y}`;

  // Coastline (ink) and contours (fjord): the outer edge of each depth band
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const b = band(x, y);
      const onEdge = NEIGHBOURS.some(([dx, dy]) => inside(x + dx, y + dy) && band(x + dx, y + dy) < b);
      if (onEdge) cells.set(key(x, y), b === 1 ? "ink" : "mark");
    }
  }

  // Spot soundings on a loose grid
  for (let y = 3; y < H; y += 5) {
    for (let x = y % 2 ? 4 : 1; x < W; x += 7) {
      if (depth(x, y) > 0.2 && !cells.has(key(x, y))) cells.set(key(x, y), "mark");
    }
  }

  const [start, turnA, turnB, end] = COURSE;
  const ink = [
    ...dashedCourse(),
    ...waypoint(start[0], start[1], 1, "filled"),
    ...waypoint(turnA[0], turnA[1], 1, "hollow"),
    ...waypoint(turnB[0], turnB[1], 1, "hollow"),
    ...waypoint(end[0], end[1], 2, "target"),
  ];

  // Clear a one-cell halo so the course reads over the contours
  for (const [x, y] of ink) {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) cells.delete(key(x + dx, y + dy));
    }
  }
  for (const [x, y] of ink) if (inside(x, y)) cells.set(key(x, y), "ink");

  const paths: Record<Cell, string> = { ink: "", mark: "" };
  for (const [position, cell] of cells) {
    const [x, y] = position.split(",").map(Number);
    paths[cell] += `M${x} ${y}h1v1h-1z`;
  }
  return paths;
}

const PATHS = draw();

export function SeaChart({ label, className }: { label: string; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={[styles.art, className].filter(Boolean).join(" ")}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <path d={PATHS.mark} className={styles.mark} />
      <path d={PATHS.ink} className={styles.ink} />
    </svg>
  );
}
