import { Layer, strokeCells, threshold } from "./pixel-grid";

/**
 * Startup Clinic illustration: a nautical chart in the engraved style. A
 * hatched mainland with a walled harbour, a headland with a lighthouse,
 * islands and skerries, depth contours stepping darker offshore (the two
 * deepest bands lightly dithered), soundings, buoys, a compass rose, a
 * scale bar and a ticked border. A dashed course runs from the harbour
 * mouth to a coral destination in deep water, a vessel at its head.
 *
 * Drawn on a 160 x 104 grid at build time and split into layers so the
 * course, the vessel and the lights can be animated by whole cells.
 */
export const W = 160;
export const H = 104;

export type Colour = "page" | "bone" | "mist" | "pale" | "fjord" | "deep" | "ink" | "muted" | "coral";
export type Paths = Partial<Record<Colour, string>>;

const INSET = 4; // the chart proper starts inside the border
const DASH = 4; // a course dash: two cells drawn, two skipped
/** Dashes in the plotted course; the stylesheet plots one per step. */
export const DASHES = 20;

const inChart = (x: number, y: number) => x >= INSET && y >= INSET && x < W - INSET && y < H - INSET;

/** A layer that drops cells outside the chart proper, except the border's. */
class ChartLayer extends Layer<Colour> {
  set(x: number, y: number, colour: Colour) {
    if (inChart(x, y)) super.set(x, y, colour);
  }

  border(x: number, y: number, colour: Colour) {
    super.set(x, y, colour);
  }
}

/** Page-coloured cells around a mark, so it reads cleanly over the contours. */
function halo(layer: Layer<Colour>, cells: [number, number][], r = 1) {
  for (const [x, y] of cells) {
    for (let dy = -r; dy <= r; dy += 1) for (let dx = -r; dx <= r; dx += 1) layer.set(x + dx, y + dy, "page");
  }
}

/** Sets the "#" cells of a small sprite, centred on x, its top row at y. */
function sprite(layer: ChartLayer, rows: string[], x: number, y: number, colour: Colour) {
  rows.forEach((row, dy) => {
    [...row].forEach((ch, dx) => {
      if (ch === "#") layer.set(x - (row.length >> 1) + dx, y + dy, colour);
    });
  });
}

// ---- Land --------------------------------------------------------------

const coastX = (y: number) => 30 + 5 * Math.sin(y / 15 + 0.3) + 2 * Math.sin(y / 4.7) - Math.max(0, y - 72) * 0.3;
const HARBOUR_Y = 44;
const HARBOUR_X = Math.round(coastX(HARBOUR_Y)); // where the basin meets the coast
const ISLANDS: [number, number, number, number][] = [
  [58, 70, 7, 4],
  [46, 84, 4, 2.5],
  [96, 30, 4, 2.5],
];

function island(x: number, y: number) {
  return ISLANDS.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1 + 0.25 * Math.sin(x * 1.7 + y));
}

function mainland(x: number, y: number) {
  if (Math.abs(y - HARBOUR_Y) <= 4 && x > HARBOUR_X - 12 && x <= HARBOUR_X + 1) return false; // the harbour basin
  if (x < coastX(y)) return true;
  if (y < 11 + 4 * Math.sin(x / 9) - Math.max(0, x - 100) * 0.12) return true; // the northern shore
  return ((x - 74) / 11) ** 2 + ((y - 4) / 19) ** 2 < 1; // the lighthouse headland
}

const land = (x: number, y: number) => inChart(x, y) && (mainland(x, y) || island(x, y));

// ---- Depth -------------------------------------------------------------

/** Chamfer distance (3 per cell) from the mainland, in both passes. */
function distanceFromMainland() {
  const dist = Array.from({ length: H }, (_, y) =>
    Array.from({ length: W }, (_, x) => (inChart(x, y) && mainland(x, y) ? 0 : Infinity)),
  );
  for (const s of [-1, 1]) {
    const ys = [...Array(H).keys()];
    const xs = [...Array(W).keys()];
    if (s > 0) {
      ys.reverse();
      xs.reverse();
    }
    for (const y of ys) {
      for (const x of xs) {
        const from = (dx: number, dy: number, w: number) => (dist[y + dy]?.[x + dx] ?? Infinity) + w;
        dist[y][x] = Math.min(dist[y][x], from(s, 0, 3), from(0, s, 3), from(s, s, 4), from(-s, s, 4));
      }
    }
  }
  return dist;
}

const DIST = distanceFromMainland();
const LEVELS = [6, 16, 30, 46, 64];
/** Contour colour per band, stepping darker offshore. */
const CONTOUR: Colour[] = ["mist", "pale", "pale", "fjord", "fjord", "deep"];
/** Dither tint per band: only the two deepest. */
const TINT = [0, 0, 0, 0, 1 / 16, 2 / 16];

/** Deepens away from the mainland and toward the south-east; islands make small shallows. */
function depth(x: number, y: number) {
  const offshore = DIST[y][x] * 0.3 + Math.max(0, x + y - 110) * 0.25 + 1.5 * Math.sin(x / 8) * Math.sin(y / 10);
  const shoal = Math.min(...ISLANDS.map(([cx, cy, rx, ry]) => Math.max(0, Math.hypot((x - cx) / rx, (y - cy) / ry) - 1)));
  return Math.min(offshore, 4 + shoal * 13);
}

const band = (x: number, y: number) => LEVELS.filter((level) => depth(x, y) >= level).length;
const SIDES: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

// ---- Course ------------------------------------------------------------

/**
 * Waypoints from the harbour mouth to the destination. Every leg runs
 * east at under 45°, so the course has one cell per column and the
 * stylesheet can plot it by clipping from the left, one dash per step.
 * Turning points sit two columns into a dash, so each appears whole.
 */
const COURSE_START = HARBOUR_X + 9;
const COURSE: [number, number][] = [
  [COURSE_START, HARBOUR_Y],
  [76, 52],
  [105, 64],
  [135, 85],
];
const DESTINATION = COURSE[COURSE.length - 1];

const COURSE_CELLS = COURSE.slice(1).flatMap((to, i) => strokeCells(COURSE[i], to).slice(i ? 1 : 0));

/** Geometry the stylesheet relies on, in cells: the plotted course runs between these columns. */
export const COURSE_COLUMNS = { from: COURSE_START, to: COURSE_START + DASHES * DASH } as const;

function nearCourse(x: number, y: number, r: number) {
  return COURSE.slice(1).some(([x1, y1], i) => {
    const [x0, y0] = COURSE[i];
    const t = Math.max(0, Math.min(1, ((x - x0) * (x1 - x0) + (y - y0) * (y1 - y0)) / ((x1 - x0) ** 2 + (y1 - y0) ** 2)));
    return Math.hypot(x - x0 - t * (x1 - x0), y - y0 - t * (y1 - y0)) < r;
  });
}

// ---- Textures ----------------------------------------------------------

/**
 * The land hatch and the deep-water tint are 4-cell pattern tiles laid
 * over one merged region path each, rather than thousands of single
 * cells, which keeps the page light. Tiles sit on the cell grid, so they
 * line up with every other mark.
 */
function tile(keep: (x: number, y: number) => boolean) {
  let d = "";
  for (let y = 0; y < 4; y += 1) for (let x = 0; x < 4; x += 1) if (keep(x, y)) d += `M${x} ${y}h1v1h-1z`;
  return d;
}

export const TILES = {
  /** Diagonal hatch on the land, in fjord pale over bone. */
  hatch: tile((x, y) => (x + y) % 4 === 0),
  /** Bayer dither of fjord on the two deepest bands. */
  tint: TINT.slice(-2).map((level) => tile((x, y) => threshold(x, y) < level)),
};

// ---- Layers ------------------------------------------------------------

const LIGHTHOUSE: [number, number] = [74, 18];
const BUOYS: [number, number][] = [
  [46, 38],
  [46, 50],
  [92, 54],
];

/**
 * The chart itself: everything that stays still. The land and the two
 * deepest bands come back as regions, to be filled with the tiles.
 */
function base() {
  const layer = new ChartLayer();
  const hatched = new ChartLayer();
  const deep = [new ChartLayer(), new ChartLayer()];

  // Water: contour lines on the outer edge of each band, tint in the deepest two
  for (let y = INSET; y < H - INSET; y += 1) {
    for (let x = INSET; x < W - INSET; x += 1) {
      if (land(x, y)) continue;
      const b = band(x, y);
      const edge = SIDES.some(([dx, dy]) => inChart(x + dx, y + dy) && !land(x + dx, y + dy) && band(x + dx, y + dy) < b);
      if (edge) layer.set(x, y, CONTOUR[b]);
      else if (TINT[b] > 0) deep[b - (TINT.length - 2)].set(x, y, "fjord");
    }
  }

  // Land: an ink coastline round the hatched region
  for (let y = INSET; y < H - INSET; y += 1) {
    for (let x = INSET; x < W - INSET; x += 1) {
      if (!land(x, y)) continue;
      const coast = SIDES.some(([dx, dy]) => inChart(x + dx, y + dy) && !land(x + dx, y + dy));
      if (coast) layer.set(x, y, "ink");
      else hatched.set(x, y, "bone");
    }
  }

  // Harbour: two moles closing to a narrow mouth, a quay and moored boats
  for (let x = HARBOUR_X - 11; x <= HARBOUR_X + 5; x += 1) {
    for (let y = HARBOUR_Y - 4; y <= HARBOUR_Y + 4; y += 1) if (!land(x, y)) layer.set(x, y, "page");
  }
  for (let x = HARBOUR_X - 1; x <= HARBOUR_X + 6; x += 1) {
    for (const dy of [-6, -5, 5, 6]) layer.set(x, HARBOUR_Y + dy, "ink");
  }
  for (let d = 2; d <= 4; d += 1) {
    layer.set(HARBOUR_X + 6, HARBOUR_Y - d, "ink");
    layer.set(HARBOUR_X + 6, HARBOUR_Y + d, "ink");
  }
  for (let y = HARBOUR_Y - 4; y <= HARBOUR_Y + 4; y += 1) layer.set(HARBOUR_X - 12, y, "ink");
  for (const [x, y] of [
    [HARBOUR_X - 9, HARBOUR_Y - 2],
    [HARBOUR_X - 9, HARBOUR_Y + 2],
    [HARBOUR_X - 5, HARBOUR_Y + 3],
  ]) {
    layer.set(x, y, "ink");
    layer.set(x + 1, y, "ink");
    layer.set(x + 2, y, "muted");
  }

  // Soundings on a loose staggered grid: dots in shallow water, small crosses offshore
  for (let y = INSET + 5; y < H - INSET - 3; y += 7) {
    for (let x = INSET + ((y / 7) % 2 ? 6 : 2); x < W - INSET - 3; x += 9) {
      const sx = x + Math.round(2 * Math.sin(x * 3.1 + y));
      const sy = y + Math.round(Math.sin(x + y * 2.3));
      let clear = !nearCourse(sx, sy, 4) && !(sx > 120 && sy < 40) && (sx + sy) % 3 !== 0;
      for (let dy = -3; dy <= 3 && clear; dy += 1) for (let dx = -3; dx <= 3; dx += 1) if (land(sx + dx, sy + dy)) clear = false;
      if (!clear) continue;
      if (band(sx, sy) >= 3) {
        if ((sx * 7 + sy) % 2) continue;
        halo(layer, [[sx, sy]]);
        sprite(layer, [".#.", "###", ".#."], sx, sy - 1, "deep");
      } else {
        halo(layer, [[sx, sy]]);
        layer.set(sx, sy, "muted");
      }
    }
  }

  // Skerries: the chart's rock symbol, a small ink cross
  for (const [x, y] of [
    [70, 64],
    [44, 64],
    [86, 36],
    [104, 38],
    [50, 76],
    [40, 92],
  ] as [number, number][]) {
    halo(layer, [[x, y]], 2);
    sprite(layer, ["#.#", ".#.", "#.#"], x, y - 1, "ink");
  }

  // Lighthouse: a clearing on the headland and a banded tower
  const [lx, ly] = LIGHTHOUSE;
  halo(
    layer,
    [
      [lx, ly - 2],
      [lx, ly + 2],
    ],
    2,
  );
  for (let dy = -6; dy <= 4; dy += 1) {
    for (let dx = -6; dx <= 6; dx += 1) if (Math.hypot(dx, dy + 1) < 5.5 && !land(lx + dx, ly + dy)) layer.set(lx + dx, ly + dy, "page");
  }
  sprite(layer, [".#.", "###", "#.#", "###", "#.#", "#.#", "###", "###"], lx, ly - 5, "ink");

  // Pillar buoys; their lights are a layer of their own
  for (const [x, y] of BUOYS) {
    halo(layer, [
      [x, y],
      [x, y - 2],
      [x, y - 4],
    ]);
    sprite(layer, [".#.", "###", "#.#", "###"], x, y - 3, "ink");
  }

  // Compass rose: a ring with the cardinal points marked, a long north arm
  const [rx, ry, r] = [136, 24, 12];
  halo(layer, [[rx, ry]], r + 1);
  for (let a = 0; a < 64; a += 1) {
    const t = (a / 64) * Math.PI * 2;
    layer.set(Math.round(rx + r * Math.cos(t)), Math.round(ry + r * Math.sin(t)), a % 4 === 0 ? "ink" : "fjord");
  }
  for (let i = -(r - 1); i <= 8; i += 1) layer.set(rx, ry + i, i < 0 ? "ink" : "fjord");
  for (let i = -8; i <= 8; i += 1) layer.set(rx + i, ry, "fjord");
  for (let i = 1; i <= 3; i += 1) {
    layer.set(rx - i, ry - (r - 1) + i * 2, "ink");
    layer.set(rx + i, ry - (r - 1) + i * 2, "ink");
  }
  for (let i = 1; i <= 4; i += 1) {
    for (const [sx, sy] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      layer.set(rx + sx * i, ry + sy * i, "fjord");
    }
  }
  layer.set(rx, ry, "ink");

  // Scale bar: alternating segments under a rule, ticks at the ends and middle
  const [bx, by] = [12, 92];
  halo(layer, [[bx + 12, by]], 2);
  for (let x = bx - 1; x <= bx + 24; x += 1) layer.set(x, by - 1, "page");
  for (let x = bx; x <= bx + 24; x += 1) {
    layer.set(x, by, "ink");
    layer.set(x, by + 1, Math.floor((x - bx) / 6) % 2 === 0 ? "ink" : "page");
  }
  for (const x of [bx, bx + 12, bx + 24]) layer.set(x, by - 1, "ink");

  // The destination: a coral ring and centre in deep water, the only coral on the chart
  const [tx, ty] = DESTINATION;
  halo(layer, [[tx, ty]], 5);
  for (let y = -4; y <= 4; y += 1) {
    for (let x = -4; x <= 4; x += 1) {
      const d = Math.hypot(x, y);
      if ((d > 3.2 && d <= 4.3) || d <= 1.5) layer.set(tx + x, ty + y, "coral");
    }
  }

  // Border: an ink frame, tick marks every 8 cells (longer every 32), a fjord neat line
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const ring = Math.min(x, y, W - 1 - x, H - 1 - y);
      const along = ring === x || ring === W - 1 - x ? y : x;
      if (ring === 0) layer.border(x, y, "ink");
      else if (ring === 1 && along % 8 === 0) layer.border(x, y, "ink");
      else if (ring === 2 && along % 32 === 0) layer.border(x, y, "ink");
      else if (ring === 3) layer.border(x, y, "fjord");
    }
  }
  return {
    strokes: layer.strokes(),
    land: hatched.paths().bone ?? "",
    deep: deep.map((band) => band.paths().fjord ?? ""),
  };
}

/** The lighthouse's beams: short rays either side of the lamp. */
function beams() {
  const layer = new ChartLayer();
  const [lx, ly] = LIGHTHOUSE;
  for (const [dx, dy] of [
    [-3, -4],
    [-4, -4],
    [3, -4],
    [4, -4],
    [-3, -6],
    [3, -6],
    [-3, -2],
    [3, -2],
  ]) {
    layer.set(lx + dx, ly + dy, "ink");
  }
  return layer.strokes();
}

/** Each buoy's light, one cell above its top mark. */
const buoyLights = () =>
  BUOYS.map(([x, y]) => {
    const layer = new ChartLayer();
    layer.set(x, y - 5, "ink");
    return layer.strokes();
  });

/**
 * The plotted course (dashes, turning points and their halo), split into
 * four layers by dither threshold so it can dissolve a quarter at a time.
 */
function course() {
  const cells = new ChartLayer();
  const plotted = COURSE_CELLS.slice(0, DASHES * DASH);
  halo(cells, plotted);
  for (const [x, y] of COURSE.slice(1, -1)) halo(cells, [[x, y]], 2);
  plotted.forEach(([x, y], i) => {
    if (i % DASH < 2) cells.set(x, y, "ink");
  });
  for (const [x, y] of COURSE.slice(1, -1)) {
    sprite(cells, ["###", "#.#", "###"], x, y - 1, "ink");
    cells.set(x, y, "page"); // hollow, even where a dash runs through
  }

  const quarters = [0, 1, 2, 3].map(() => new ChartLayer());
  for (const [x, y, colour] of cells.entries()) quarters[Math.floor(threshold(x, y) * 4)].set(x, y, colour);
  return quarters.map((quarter) => quarter.strokes());
}

/**
 * The vessel at the head of the course, one frame per plotting step: a
 * pointed hull rasterised along the course heading, drawn as an ink
 * outline round a bone deck, just ahead of the last dash. The last frame
 * is the finished picture. Frames share a handful of distinct hulls, so
 * each hull is drawn once around its own origin and every frame places
 * one at the head of the course.
 */
function vessel() {
  const sprites: Paths[] = [];
  const keys: string[] = [];
  const frames = Array.from({ length: DASHES + 1 }, (_, step) => {
    const layer = new Layer<Colour>();
    const head = step * DASH + 3;
    const [px, py] = COURSE_CELLS[head];
    const [hx, hy] = [0, 0];
    const [ax, ay] = COURSE_CELLS[Math.max(0, head - 6)];
    const angle = Math.atan2(py - ay, px - ax);
    const hull: [number, number][] = [];
    for (let y = -6; y <= 6; y += 1) {
      for (let x = -6; x <= 6; x += 1) {
        const u = x * Math.cos(angle) + y * Math.sin(angle);
        const v = -x * Math.sin(angle) + y * Math.cos(angle);
        const beam = u > 1.5 ? (2 * (5 - u)) / 3.5 : 2;
        if (u >= -4 && u <= 5 && Math.abs(v) <= beam) hull.push([hx + x, hy + y]);
      }
    }
    const inHull = (x: number, y: number) => hull.some(([hx, hy]) => hx === x && hy === y);
    halo(layer, hull);
    for (const [x, y] of hull) layer.set(x, y, SIDES.every(([dx, dy]) => inHull(x + dx, y + dy)) ? "bone" : "ink");
    const sprite = layer.strokes();
    const key = JSON.stringify(sprite);
    if (!keys.includes(key)) {
      keys.push(key);
      sprites.push(sprite);
    }
    return { sprite: keys.indexOf(key), x: px, y: py };
  });
  return { sprites, frames };
}

export const CHART_PATHS = {
  base: base(),
  beams: beams(),
  buoyLights: buoyLights(),
  course: course(),
  vessel: vessel(),
};
