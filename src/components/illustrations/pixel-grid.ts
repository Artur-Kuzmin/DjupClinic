/**
 * Shared helpers for the pixel illustrations drawn on a cell grid at build
 * time: the ordered-dither threshold, a layer of cells that becomes one
 * run-merged path per colour, and a straight stroke between two cells.
 */

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

/** Ordered-dither threshold of a cell, in (0, 1). */
export function threshold(x: number, y: number) {
  return (BAYER[((y % 4) + 4) % 4][((x % 4) + 4) % 4] + 0.5) / 16;
}

export class Layer<C extends string> {
  private cells = new Map<string, C>();

  set(x: number, y: number, colour: C) {
    this.cells.set(`${x},${y}`, colour);
  }

  has(x: number, y: number) {
    return this.cells.has(`${x},${y}`);
  }

  get(x: number, y: number): C | undefined {
    return this.cells.get(`${x},${y}`);
  }

  /** Every cell, as [x, y, colour]. */
  *entries(): Generator<[number, number, C]> {
    for (const [position, colour] of this.cells) {
      const [x, y] = position.split(",").map(Number);
      yield [x, y, colour];
    }
  }

  /** Horizontal runs of one colour, row by row: [x, y, length]. */
  private runs(): Map<C, [number, number, number][]> {
    const rows = new Map<number, Map<number, C>>();
    for (const [x, y, colour] of this.entries()) {
      if (!rows.has(y)) rows.set(y, new Map());
      rows.get(y)!.set(x, colour);
    }
    const out = new Map<C, [number, number, number][]>();
    for (const [y, row] of [...rows].sort((a, b) => a[0] - b[0])) {
      const xs = [...row.keys()].sort((a, b) => a - b);
      let i = 0;
      while (i < xs.length) {
        const colour = row.get(xs[i])!;
        let run = 1;
        while (xs[i + run] === xs[i] + run && row.get(xs[i + run]) === colour) run += 1;
        if (!out.has(colour)) out.set(colour, []);
        out.get(colour)!.push([xs[i], y, run]);
        i += run;
      }
    }
    return out;
  }

  /** One filled path per colour, horizontal runs merged. */
  paths(): Partial<Record<C, string>> {
    const out: Partial<Record<C, string>> = {};
    for (const [colour, runs] of this.runs()) out[colour] = runs.map(([x, y, n]) => `M${x} ${y}h${n}v1h-${n}z`).join("");
    return out;
  }

  /**
   * One path per colour of horizontal lines through the middle of each
   * run, to be drawn with a 1-cell stroke: the same cells as paths() in
   * about half the characters. Runs on the same row continue with a
   * relative move.
   */
  strokes(): Partial<Record<C, string>> {
    const out: Partial<Record<C, string>> = {};
    for (const [colour, runs] of this.runs()) {
      let d = "";
      let pen: [number, number] | undefined;
      for (const [x, y, n] of runs) {
        d += pen && pen[1] === y ? `m${x - pen[0]} 0h${n}` : `M${x} ${y + 0.5}h${n}`;
        pen = [x + n, y];
      }
      out[colour] = d;
    }
    return out;
  }
}

/** Every cell from (x0, y0) to (x1, y1), in order (Bresenham). */
export function strokeCells([x0, y0]: [number, number], [x1, y1]: [number, number]): [number, number][] {
  const cells: [number, number][] = [];
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    cells.push([x0, y0]);
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
  return cells;
}
