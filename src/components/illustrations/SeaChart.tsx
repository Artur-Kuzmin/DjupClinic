import { AmbientLoop } from "./AmbientLoop";
import styles from "./SeaChart.module.css";

/**
 * Startup Clinic illustration: a fragment of sea chart. A neat-line border
 * with graduated edges, shaded land behind a coastline, depth contours
 * stepping out from it, spot soundings, a compass rose, and a dashed course
 * with waypoints heading for deeper water. Drawn on a 56 x 36 grid at build
 * time. Two colours and the page: ink (border, coast, course, rose), fjord
 * (graduation, contours, soundings), mist (land).
 */
const W = 56;
const H = 36;
const INSET = 3; // the chart proper starts inside the border
const LEVELS = [0, 0.5, 1.1, 1.8];
const COURSE: [number, number][] = [
  [10, 16],
  [21, 22],
  [34, 18],
  [47, 27],
];
const TARGET = COURSE[COURSE.length - 1];
const ROSE_AT: [number, number] = [45, 5];
const ROSE = ["...#...", "...#...", "...#...", "..#.#..", "###.###", "..#.#..", "...#...", "...#..."];
/** The dashes march one cell per frame; four frames make a full dash period. */
const DASH_FRAMES = 4;
const NEIGHBOURS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

type Cell = "coast" | "mark" | "land" | "halo" | "course" | "ping";

/** Distance out from the coast, which curves around the top-left corner. */
function depth(x: number, y: number) {
  return Math.hypot((x - INSET + 0.5) / 17, (y - INSET + 0.5) / 10) - 1;
}

function band(x: number, y: number) {
  const d = depth(x, y);
  return LEVELS.filter((level) => d >= level).length;
}

/** Inside the neat line. */
function inChart(x: number, y: number) {
  return x >= INSET && y >= INSET && x < W - INSET && y < H - INSET;
}

/** Every cell of the course, waypoint to waypoint (Bresenham). */
function courseCells(): [number, number][] {
  const cells: [number, number][] = [];
  for (let i = 0; i < COURSE.length - 1; i += 1) {
    let [x0, y0] = COURSE[i];
    const [x1, y1] = COURSE[i + 1];
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      if (cells.length === 0 || x0 !== cells[cells.length - 1][0] || y0 !== cells[cells.length - 1][1]) {
        cells.push([x0, y0]);
      }
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

function toPaths(cells: Map<string, Cell>) {
  const paths: Partial<Record<Cell, string>> = {};
  for (const [position, cell] of cells) {
    const [x, y] = position.split(",").map(Number);
    paths[cell] = `${paths[cell] ?? ""}M${x} ${y}h1v1h-1z`;
  }
  return paths;
}

function draw() {
  const chart = new Map<string, Cell>();
  const key = (x: number, y: number) => `${x},${y}`;

  // Neat line: an ink frame, then a graduated band of alternating fjord
  // segments, then a fjord inner line
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const ring = Math.min(x, y, W - 1 - x, H - 1 - y);
      const along = x === 1 || x === W - 2 ? y : x;
      if (ring === 0) chart.set(key(x, y), "coast");
      else if (ring === 1 && Math.floor((along - 2) / 4) % 2 === 0) chart.set(key(x, y), "mark");
      else if (ring === 2) chart.set(key(x, y), "mark");
    }
  }

  // Land (shaded), coastline (ink) and contours (fjord): the outer edge of each depth band
  for (let y = INSET; y < H - INSET; y += 1) {
    for (let x = INSET; x < W - INSET; x += 1) {
      const b = band(x, y);
      const onEdge = NEIGHBOURS.some(([dx, dy]) => inChart(x + dx, y + dy) && band(x + dx, y + dy) < b);
      if (onEdge) chart.set(key(x, y), b === 1 ? "coast" : "mark");
      else if (b === 0) chart.set(key(x, y), "land");
    }
  }

  // Spot soundings on a loose grid
  for (let y = INSET + 3; y < H - INSET; y += 5) {
    for (let x = y % 2 ? INSET + 4 : INSET + 1; x < W - INSET; x += 7) {
      if (depth(x, y) > 0.2 && !chart.has(key(x, y))) chart.set(key(x, y), "mark");
    }
  }

  // Course, waypoints and rose sit on a one-cell halo in the page colour,
  // so they read cleanly over the contours
  const course = courseCells();
  const [start, turnA, turnB] = COURSE;
  const fixed = [
    ...waypoint(start[0], start[1], 1, "filled"),
    ...waypoint(turnA[0], turnA[1], 1, "hollow"),
    ...waypoint(turnB[0], turnB[1], 1, "hollow"),
    ...waypoint(TARGET[0], TARGET[1], 2, "target"),
  ];
  ROSE.forEach((row, dy) => {
    [...row].forEach((ch, dx) => {
      if (ch === "#") fixed.push([ROSE_AT[0] + dx, ROSE_AT[1] + dy]);
    });
  });
  for (const [x, y] of [...course, ...fixed]) {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (inChart(x + dx, y + dy)) chart.set(key(x + dx, y + dy), "halo");
      }
    }
  }
  for (const [x, y] of fixed) chart.set(key(x, y), "course");

  // The dashes, once per frame, each frame one cell further along. They stop
  // a cell short of every waypoint, so the marks stay clean.
  const clear = ([x, y]: [number, number]) =>
    COURSE.every(([cx, cy], i) => Math.max(Math.abs(x - cx), Math.abs(y - cy)) > (i === COURSE.length - 1 ? 3 : 2));
  const dashes = Array.from({ length: DASH_FRAMES }, (_, frame) => {
    const cells = new Map<string, Cell>();
    course.forEach(([x, y], step) => {
      if ((step - frame + DASH_FRAMES) % DASH_FRAMES < 2 && clear([x, y])) cells.set(key(x, y), "course");
    });
    return toPaths(cells).course ?? "";
  });

  // A ring that pings around the target
  const ping = new Map<string, Cell>();
  for (const [x, y] of waypoint(TARGET[0], TARGET[1], 4, "hollow")) {
    if (inChart(x, y)) ping.set(key(x, y), "ping");
  }

  return { chart: toPaths(chart), dashes, ping: toPaths(ping).ping ?? "" };
}

const PATHS = draw();

export function SeaChart({ label, className }: { label: string; className?: string }) {
  const { chart, dashes, ping } = PATHS;
  return (
    <AmbientLoop className={[styles.art, className].filter(Boolean).join(" ")}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} shapeRendering="crispEdges" role="img" aria-label={label} focusable="false">
        <path d={chart.land} className={styles.land} />
        <path d={chart.mark} className={styles.mark} />
        <path d={chart.halo} className={styles.halo} />
        <path d={chart.coast} className={styles.ink} />
        <path d={chart.course} className={styles.ink} />
        {dashes.map((d, i) => (
          <path key={i} d={d} className={[styles.ink, styles.dash, i > 0 && styles.dashLater].filter(Boolean).join(" ")} style={{ animationDelay: `calc(var(--duration-loop) / -16 * ${(DASH_FRAMES - i) % DASH_FRAMES})` }} />
        ))}
        <path d={ping} className={`${styles.ink} ${styles.ping}`} />
      </svg>
    </AmbientLoop>
  );
}
