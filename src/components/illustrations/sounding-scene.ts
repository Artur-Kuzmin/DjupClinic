/**
 * Welcome page scene: a cross-section of a Nordic sea, from the surface to
 * the seabed. A færing on the surface lets a sounding line down through
 * four depth bands to a coral lead weight resting among rocks and kelp.
 *
 * Drawn on a 128 x 96 grid at build time and split into layers so the
 * moving parts (waves, boat, line, fish, particles) can be animated by
 * whole cells. Every layer is a set of run-merged paths, one per colour.
 */
export const W = 128;
export const H = 96;

/** Animation geometry the stylesheet relies on, in cells. */
export const SCENE = {
  /** Vertical repeat of the particle field; particles rise this far per loop. */
  particlePeriod: 24,
  /** Clip box for the particle field: from the fjord band to the seabed. */
  particleClip: { y: 44, height: 46 },
} as const;

export type Colour = "bone" | "mist" | "fjord" | "deep" | "ink" | "coral";
export type Paths = Partial<Record<Colour, string>>;

const SURFACE = 26;
const BANDS: { colour: Colour; from: number }[] = [
  { colour: "mist", from: SURFACE + 1 },
  { colour: "fjord", from: 44 },
  { colour: "deep", from: 62 },
  { colour: "ink", from: 78 },
];
const SEAM_ROWS = 6; // ordered-dither rows between two bands
const FADE_COLUMNS = 16; // the water dissolves into the page at the right edge
const BOAT_X = 41;
const LINE_X = BOAT_X + 25;
/** Below this row the line is drawn light, against the dark bands. */
const LINE_LIGHT_FROM = 60;

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

function threshold(x: number, y: number) {
  return (BAYER[((y % 4) + 4) % 4][((x % 4) + 4) % 4] + 0.5) / 16;
}

/** Seabed height per column: gently uneven. */
function floor(x: number) {
  return 88 + Math.round(1.5 * Math.sin(x / 9) + Math.sin(x / 4.3));
}

class Layer {
  private cells = new Map<string, Colour>();

  set(x: number, y: number, colour: Colour) {
    this.cells.set(`${x},${y}`, colour);
  }

  /** One path per colour, horizontal runs merged. */
  paths(): Paths {
    const rows = new Map<number, Map<number, Colour>>();
    for (const [position, colour] of this.cells) {
      const [x, y] = position.split(",").map(Number);
      if (!rows.has(y)) rows.set(y, new Map());
      rows.get(y)!.set(x, colour);
    }
    const out: Paths = {};
    for (const [y, row] of [...rows].sort((a, b) => a[0] - b[0])) {
      const xs = [...row.keys()].sort((a, b) => a - b);
      let i = 0;
      while (i < xs.length) {
        const colour = row.get(xs[i])!;
        let run = 1;
        while (xs[i + run] === xs[i] + run && row.get(xs[i + run]) === colour) run += 1;
        out[colour] = `${out[colour] ?? ""}M${xs[i]} ${y}h${run}v1h-${run}z`;
        i += run;
      }
    }
    return out;
  }
}

/** Cells of one tile, as a path. */
function tile(width: number, height: number, y0: number, x0: number, keep: (x: number, y: number) => boolean) {
  const layer = new Layer();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) if (keep(x0 + x, y0 + y)) layer.set(x, y, "ink");
  }
  return layer.paths().ink ?? "";
}

/**
 * The water as geometry rather than cells: solid band rectangles, an
 * ordered-dither seam between each pair (a 4-cell pattern tile, the same
 * technique as the section transitions), and a tile of page-coloured cells
 * that dissolves the water into the page at the right edge.
 */
function water() {
  const bands = BANDS.map((band, i) => {
    const end = i + 1 < BANDS.length ? BANDS[i + 1].from - SEAM_ROWS : H;
    return { colour: band.colour, y: band.from, height: end - band.from };
  });
  const seams = BANDS.slice(1).map((band, i) => {
    const y = band.from - SEAM_ROWS;
    return {
      upper: BANDS[i].colour,
      lower: band.colour,
      y,
      height: SEAM_ROWS,
      tile: tile(4, SEAM_ROWS, y, 0, (x, ty) => threshold(x, ty) < (ty - y + 0.5) / SEAM_ROWS),
    };
  });
  const fadeX = W - FADE_COLUMNS;
  const fade = {
    x: fadeX,
    y: SURFACE,
    width: FADE_COLUMNS,
    height: H - SURFACE,
    tile: tile(FADE_COLUMNS, 4, 0, fadeX, (x, y) => threshold(x, y) >= (W - x - 0.5) / FADE_COLUMNS),
  };
  return { surface: SURFACE, bands, seams, fade };
}

function hills() {
  const layer = new Layer();
  for (let x = 0; x < W; x += 1) {
    const west = 10 * Math.exp(-(((x - 14) / 16) ** 2)) + 5 * Math.exp(-(((x - 36) / 9) ** 2));
    const east = 7 * Math.exp(-(((x - 108) / 13) ** 2)) + 3 * Math.exp(-(((x - 92) / 8) ** 2));
    for (let y = SURFACE - Math.round(Math.max(west, east)); y < SURFACE; y += 1) layer.set(x, y, "mist");
  }
  return layer;
}

/** Small crests above the surface line, one 12-cell pattern, drawn 2 cells wider to the left for the shift. */
function crests() {
  const layer = new Layer();
  for (let x = -2; x < W - FADE_COLUMNS - 2; x += 1) {
    const m = ((x % 12) + 12) % 12;
    if (m === 3 || m === 4 || m === 9) layer.set(x, SURFACE - 1, "fjord");
  }
  return layer;
}

function rock(layer: Layer, cx: number, base: number, rx: number, ry: number) {
  for (let y = base - ry; y <= base; y += 1) {
    for (let x = cx - rx; x <= cx + rx; x += 1) {
      const nx = (x - cx) / rx;
      const ny = (base - y) / ry;
      if (nx * nx + ny * ny > 1) continue;
      const above = (base - y + 1) / ry;
      let colour: Colour = "fjord";
      if (nx * nx + above * above > 1 && x <= cx) colour = "mist"; // lit upper-left rim
      else if (nx > 0.35 && threshold(x, y) < (nx - 0.35) * 1.6) colour = "deep";
      layer.set(x, y, colour);
    }
  }
}

function kelp(layer: Layer, x: number, base: number, height: number, phase: number) {
  for (let i = 0; i < height; i += 1) {
    const y = base - i;
    const cx = x + Math.round(Math.sin(i / 4 + phase) * 1.2);
    layer.set(cx, y, "fjord");
    if (i < height - 3) layer.set(cx + 1, y, "fjord");
    const side = Math.floor(i / 6) % 2 ? 2 : -1;
    if (i > 3 && i % 6 >= 2 && i % 6 <= 4) layer.set(cx + side, y, "fjord"); // blade
    if (i > 3 && i % 6 === 3) layer.set(cx + side + (side > 0 ? 1 : -1), y, "fjord");
  }
}

function seabed() {
  const layer = new Layer();
  kelp(layer, 7, 84, 24, 0);
  kelp(layer, 14, 82, 32, 1.6);
  kelp(layer, 21, 85, 19, 3);
  kelp(layer, 106, 85, 18, 0.8);
  kelp(layer, 96, 86, 12, 2.2);
  for (let x = 0; x < W; x += 1) {
    for (let y = floor(x); y < H; y += 1) {
      const d = y - floor(x);
      layer.set(x, y, d === 0 ? "mist" : threshold(x, y) < 0.55 - d * 0.1 ? "fjord" : "deep");
    }
  }
  rock(layer, 14, 90, 11, 8);
  rock(layer, 27, 91, 6, 4);
  rock(layer, 102, 90, 12, 6);
  rock(layer, 118, 91, 6, 4);
  rock(layer, 84, 92, 3, 2);
  return layer;
}

/**
 * The færing side on: clinker-built and double-ended. Per column of the
 * left half (mirrored), the sheer (top) and keel (bottom) row of the hull.
 * The ends stay full; the stem is the hull's leading edge, its head
 * curling out above the sheer.
 */
const SHEER = [14, 15, 16, 17, 18, 18, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20];
const KEEL = [14, 19, 21, 23, 25, 25, 26, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28];
const HULL_COLUMNS = [...SHEER.keys(), ...[...SHEER.keys()].reverse()];
/** Rows under the surface where the water veils the hull. */
const VEIL_ROWS = 4;

/** Cells from (x0, y0) to (x1, y1) (Bresenham). */
function stroke(layer: Layer, [x0, y0]: [number, number], [x1, y1]: [number, number], colour: Colour) {
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    layer.set(x0, y0, colour);
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

/**
 * The hull: an ink outline and stem posts, mist planking with a fjord lap
 * line along the sheer for the clinker strakes, so it reads light against
 * the water. It sits low, the waterline cutting the hull. One oar rests in
 * its tholepin, blade down in the water.
 */
function boat() {
  const layer = new Layer();
  const inHull = (dx: number, y: number) => {
    const c = HULL_COLUMNS[dx];
    return c !== undefined && y >= SHEER[c] && y <= KEEL[c];
  };
  HULL_COLUMNS.forEach((c, dx) => {
    for (let y = SHEER[c]; y <= KEEL[c]; y += 1) {
      const edge = c <= 1 || !inHull(dx - 1, y) || !inHull(dx + 1, y) || !inHull(dx, y - 1) || !inHull(dx, y + 1);
      layer.set(BOAT_X + dx, y, edge ? "ink" : y === SHEER[c] + 3 ? "fjord" : "mist");
    }
  });
  // Oar: the handle inboard above the gunwale, the loom out over the bow quarter
  stroke(layer, [BOAT_X + 19, 16], [BOAT_X - 2, 27], "ink");
  for (let x = BOAT_X - 6; x <= BOAT_X - 2; x += 1) {
    layer.set(x, 27, "ink");
    layer.set(x, 28, "ink");
  }
  return layer;
}

/**
 * The water over the submerged hull: a staggered dither of mist, one cell
 * in four for the first two rows and one in two below, that stays still
 * while the boat bobs beneath it, so the hull below the waterline shows
 * through, dimmed. (Every row keeps the same density, so the keel never
 * turns into a dotted line.)
 */
function veil() {
  const layer = new Layer();
  for (let y = SURFACE + 1; y <= SURFACE + VEIL_ROWS; y += 1) {
    const deep = y - SURFACE > 2;
    for (let x = BOAT_X - 6; x < BOAT_X + HULL_COLUMNS.length; x += 1) {
      const m = (x + 2 * y) % 4;
      if (m === 0 || (deep && m === 2)) layer.set(x, y, "mist");
    }
  }
  return layer;
}

/**
 * The sounding line going over the side: from just above the gunwale, down
 * across the hull and through the veil, so it stays crisp and joined to
 * the line below while the boat bobs.
 */
function rigging() {
  const layer = new Layer();
  const c = HULL_COLUMNS[LINE_X - BOAT_X];
  for (let y = SHEER[c] - 1; y <= SURFACE + VEIL_ROWS; y += 1) layer.set(LINE_X, y, "ink");
  return layer;
}

/** Weight: a bell of lead with an eye for the line. Its base rests on the seabed. */
const WEIGHT = ["..#..", ".#.#.", "..#..", ".###.", ".###.", "#####", "#####"];

function weight() {
  const layer = new Layer();
  const base = floor(LINE_X) - 1;
  WEIGHT.forEach((row, i) => {
    [...row].forEach((ch, dx) => {
      if (ch === "#") layer.set(LINE_X - 2 + dx, base - WEIGHT.length + 1 + i, "coral");
    });
  });
  return layer;
}

/** The line underwater, bowed by `bow` cells at its middle. */
function line(bow: number) {
  const layer = new Layer();
  const y0 = SURFACE + 1;
  const y1 = floor(LINE_X) - WEIGHT.length;
  for (let y = y0; y <= y1; y += 1) {
    const offset = Math.round(bow * Math.sin((Math.PI * (y - y0)) / (y1 - y0)));
    layer.set(LINE_X + offset, y, y < LINE_LIGHT_FROM ? "ink" : "mist");
  }
  return layer;
}

const FISH = ["#.###.", "######", "#.###."];
const FRY = ["#.##.", ".####"];
const SCHOOL: [number, number, boolean][] = [
  [70, 47, false],
  [77, 45, false],
  [76, 50, true],
  [84, 48, false],
  [83, 53, false],
  [91, 46, true],
  [90, 51, false],
  [97, 49, false],
  [72, 54, true],
];

/** The school twice, one scene-width apart, so it can drift right and wrap. */
function fish() {
  const layer = new Layer();
  for (const shift of [0, -W]) {
    for (const [x, y, small] of SCHOOL) {
      (small ? FRY : FISH).forEach((row, dy) => {
        [...row].forEach((ch, dx) => {
          if (ch === "#") layer.set(x + shift + dx, y + dy, "bone");
        });
      });
    }
  }
  return layer;
}

/** A field of single motes repeated three periods down, so it can rise and wrap. */
const MOTES: [number, number][] = [
  [40, 2], [58, 8], [34, 16], [76, 6], [92, 2], [66, 20], [104, 14], [24, 6], [50, 18], [86, 12], [12, 12],
];

function particles() {
  const layer = new Layer();
  const { y: top } = SCENE.particleClip;
  for (let copy = 0; copy < 3; copy += 1) {
    for (const [x, y] of MOTES) layer.set(x, top + y + copy * SCENE.particlePeriod, "mist");
  }
  return layer;
}

export const SCENE_PATHS = {
  hills: hills().paths(),
  water: water(),
  particles: particles().paths(),
  fish: fish().paths(),
  crests: crests().paths(),
  seabed: seabed().paths(),
  line: [line(0), line(-1.6), line(1.6)].map((l) => l.paths()),
  weight: weight().paths(),
  boat: boat().paths(),
  veil: veil().paths(),
  rigging: rigging().paths(),
};
