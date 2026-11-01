import { Layer, threshold } from "./pixel-grid";

/**
 * School Audits illustration: an AI assistant's answer, corrected by a
 * reviewer. A chat window (title bar, the question in a bubble, a
 * multi-line answer beside the assistant's sparkle, source chips) holds
 * the answer; one line is struck through in ink with a caret under it, and
 * a leader line runs out of the window to a correction note in the margin,
 * ringed in coral, the only coral in the drawing. The marks are a
 * reviewer's pen, outside the assistant's own colours.
 *
 * Drawn on a 160 x 88 grid at build time and split into layers so the
 * answer can type out, the marks can draw on and everything can dissolve.
 */
export const W = 160;
export const H = 88;

export type Colour = "page" | "bone" | "mist" | "pale" | "fjord" | "ink" | "muted" | "coral";
export type Paths = Partial<Record<Colour, string>>;

/** Typing and drawing move in steps of this many cells; the stylesheet's steps() counts rely on it. */
export const TYPE_STEPS = 8;

const WINDOW = { x0: 3, y0: 4, x1: 111, y1: 82 };
const TEXT_X = 18; // where answer lines start
const WORDS = [11, 6, 14, 5, 9, 12, 7, 15, 4, 10, 8, 13, 6, 9, 12];

function rect(layer: Layer<Colour>, x0: number, y0: number, x1: number, y1: number, colour: Colour) {
  for (let y = y0; y <= y1; y += 1) for (let x = x0; x <= x1; x += 1) layer.set(x, y, colour);
}

function box(layer: Layer<Colour>, x0: number, y0: number, x1: number, y1: number, colour: Colour, fill?: Colour) {
  if (fill) rect(layer, x0, y0, x1, y1, fill);
  rect(layer, x0, y0, x1, y0, colour);
  rect(layer, x0, y1, x1, y1, colour);
  rect(layer, x0, y0, x0, y1, colour);
  rect(layer, x1, y0, x1, y1, colour);
}

function sprite(layer: Layer<Colour>, rows: string[], x: number, y: number, colour: Colour) {
  rows.forEach((row, dy) => {
    [...row].forEach((ch, dx) => {
      if (ch === "#") layer.set(x + dx, y + dy, colour);
    });
  });
}

/** A line of text as word bars two cells tall, no wider than `width`. Returns the last column drawn. */
function text(layer: Layer<Colour>, x: number, y: number, width: number, colour: Colour, seed: number) {
  let cx = x;
  for (let i = seed; ; i += 1) {
    const w = WORDS[i % WORDS.length];
    if (cx + w > x + width) break;
    rect(layer, cx, y, cx + w - 1, y + 1, colour);
    cx += w + 2;
  }
  return cx - 3;
}

const SPARKLE = ["...#...", "...#...", "..###..", "#######", "..###..", "...#...", "...#..."];
const SPARKLE_SMALL = ["..#..", ".###.", "#####", ".###.", "..#.."];

/** Answer lines: row and width; the third is the wrong one. */
const LINES: { y: number; width: number; seed: number }[] = [
  { y: 37, width: 86, seed: 0 },
  { y: 43, width: 80, seed: 3 },
  { y: 49, width: 72, seed: 5 },
  { y: 57, width: 82, seed: 9 },
  { y: 63, width: 56, seed: 11 },
];
const WRONG = 2;
const NOTE = { x0: 120, y0: 38, x1: 156, y1: 62 };

/** Columns a stepped clip reveals, padded so every step is a whole number of cells. */
export type Reveal = { from: number; to: number };
const reveal = (from: number, last: number): Reveal => ({
  from,
  to: from + Math.ceil((last + 1 - from) / TYPE_STEPS) * TYPE_STEPS,
});

function draw() {
  const base = new Layer<Colour>();
  const { x0, y0, x1, y1 } = WINDOW;

  // Window with a hard shadow, a title bar and three window buttons
  rect(base, x0 + 2, y0 + 2, x1 + 2, y1 + 2, "ink");
  box(base, x0, y0, x1, y1, "ink", "page");
  rect(base, x0 + 1, y0 + 1, x1 - 1, y0 + 8, "bone");
  rect(base, x0 + 1, y0 + 9, x1 - 1, y0 + 9, "ink");
  sprite(base, SPARKLE_SMALL, x0 + 4, y0 + 2, "fjord");
  text(base, x0 + 12, y0 + 4, 26, "muted", 1);
  for (const x of [x1 - 19, x1 - 13, x1 - 7]) box(base, x, y0 + 3, x + 3, y0 + 6, "ink");

  // The question, in a bubble at the right with a stepped tail
  const [bx0, by0, bx1, by1] = [46, 18, 105, 30];
  box(base, bx0, by0, bx1, by1, "ink", "mist");
  text(base, bx0 + 4, by0 + 3, 54, "muted", 2);
  text(base, bx0 + 4, by0 + 8, 36, "muted", 6);
  const [r, b] = [bx1, by1];
  rect(base, r - 10, b, r - 6, b, "mist");
  rect(base, r - 11, b, r - 11, b + 1, "ink");
  rect(base, r - 10, b + 1, r - 7, b + 1, "mist");
  rect(base, r - 6, b, r - 6, b + 4, "ink");
  base.set(r - 10, b + 2, "ink");
  rect(base, r - 9, b + 2, r - 7, b + 2, "mist");
  base.set(r - 9, b + 3, "ink");
  rect(base, r - 8, b + 3, r - 7, b + 3, "mist");
  rect(base, r - 8, b + 4, r - 7, b + 4, "ink");

  // The assistant's sparkle beside the answer, and two source chips under it
  sprite(base, SPARKLE, x0 + 4, LINES[0].y - 1, "fjord");
  for (const x of [TEXT_X, TEXT_X + 26, TEXT_X + 52]) {
    box(base, x, 71, x + 22, 77, "ink");
    base.set(x + 3, 74, "fjord");
    rect(base, x + 6, 74, x + 18, 74, "fjord");
  }

  // The answer, one layer per line so each can type out
  const lines = LINES.map(({ y, width, seed }, i) => {
    const layer = new Layer<Colour>();
    const last = text(layer, TEXT_X, y, width, i === WRONG ? "pale" : "fjord", seed);
    return { layer, reveal: reveal(TEXT_X, last) };
  });

  // The reviewer's marks: a strike through the wrong line, a caret under it,
  // and a leader line out of the window to the note
  const wrong = LINES[WRONG];
  const wrongEnd = lines[WRONG].reveal.to;
  const strike = new Layer<Colour>();
  rect(strike, TEXT_X - 2, wrong.y + 1, wrongEnd + 1, wrong.y + 1, "ink");
  const caret = new Layer<Colour>();
  sprite(caret, ["..#..", ".#.#.", "#...#"], TEXT_X + 17, wrong.y + 3, "ink");
  // Dotted, and a gap away from the strike, so the two read as separate marks
  const leader = new Layer<Colour>();
  for (let x = wrongEnd + 5; x < NOTE.x0; x += 2) leader.set(x, wrong.y + 1, "ink");

  // The correction note: a coral ring, then its text
  const ring = new Layer<Colour>();
  box(ring, NOTE.x0, NOTE.y0, NOTE.x1, NOTE.y1, "coral");
  const note = new Layer<Colour>();
  text(note, NOTE.x0 + 4, NOTE.y0 + 5, 28, "ink", 10);
  text(note, NOTE.x0 + 4, NOTE.y0 + 10, 24, "ink", 4);
  text(note, NOTE.x0 + 4, NOTE.y0 + 15, 16, "ink", 6);

  // The dissolve: page-coloured dither, a quarter of the cells at a time,
  // over the boxes the animated parts occupy. Every one sits on plain page;
  // the leader's dots over the window's border and shadow are ink on ink
  // and need no cover.
  const lastLine = LINES[LINES.length - 1];
  const veil: [number, number, number, number][] = [
    [TEXT_X - 2, LINES[0].y, WINDOW.x1 - TEXT_X + 2, lastLine.y + 2 - LINES[0].y],
    [WINDOW.x1 + 3, wrong.y + 1, NOTE.x0 - WINDOW.x1 - 3, 1],
    [NOTE.x0, NOTE.y0, NOTE.x1 - NOTE.x0 + 1, NOTE.y1 - NOTE.y0 + 1],
  ];

  return {
    base: base.strokes(),
    lines: lines.map(({ layer, reveal }) => ({ paths: layer.strokes(), reveal })),
    strike: { paths: strike.strokes(), reveal: reveal(TEXT_X - 2, wrongEnd + 1) },
    caret: caret.strokes(),
    leader: { paths: leader.strokes(), reveal: reveal(wrongEnd + 5, NOTE.x0 - 1) },
    ring: ring.strokes(),
    note: note.strokes(),
    veil,
  };
}

/** The four quarters of a 4-cell dither tile, by threshold: each dissolve step adds one. */
export const VEIL_TILES = [0, 1, 2, 3].map((quarter) => {
  let d = "";
  for (let y = 0; y < 4; y += 1) {
    for (let x = 0; x < 4; x += 1) if (Math.floor(threshold(x, y) * 4) === quarter) d += `M${x} ${y}h1v1h-1z`;
  }
  return d;
});

export const CARD_PATHS = draw();
