import { AmbientLoop } from "./AmbientLoop";
import styles from "./AnswerCard.module.css";

/**
 * School Audits illustration: an AI answer card. A sparkle marks the
 * assistant; one line of the answer is struck through, the corrected line
 * beneath it is underlined in coral (the one key highlight), and two source
 * chips sit at the foot. Drawn on a 44 x 38 grid at build time.
 */
const W = 44;
const H = 38;

type Cell = "ink" | "mark" | "strike" | "correction" | "accent" | "cursor";

function draw(): Record<Cell, string> {
  const cells = new Map<string, Cell>();
  const set = (x: number, y: number, cell: Cell) => cells.set(`${x},${y}`, cell);
  const rect = (x0: number, y0: number, x1: number, y1: number, cell: Cell) => {
    for (let y = y0; y <= y1; y += 1) for (let x = x0; x <= x1; x += 1) set(x, y, cell);
  };

  // Card frame, open at the bottom left for the speech tail
  const base = H - 5;
  rect(0, 0, W - 1, 0, "ink");
  rect(0, 0, 0, base, "ink");
  rect(W - 1, 0, W - 1, base, "ink");
  rect(0, base, 4, base, "ink");
  rect(8, base, W - 1, base, "ink");
  // Speech tail, drawn as an outline below the gap in the frame
  for (let y = base + 1; y < H; y += 1) set(4, y, "ink");
  set(7, base + 1, "ink");
  set(6, base + 2, "ink");
  set(5, base + 3, "ink");

  // Header: a four-point sparkle for the assistant, and a short label bar
  ["...#...", "...#...", "..###..", "#######", "..###..", "...#...", "...#..."].forEach((row, dy) => {
    [...row].forEach((ch, dx) => ch === "#" && set(2 + dx, 2 + dy, "mark"));
  });
  rect(12, 5, 21, 5, "ink");

  // Answer text
  rect(3, 11, 37, 12, "mark");
  rect(3, 15, 31, 16, "mark");

  // The wrong line: faded, with an ink strike running past both ends
  for (let x = 3; x <= 34; x += 1) {
    if (x % 2 === 0) set(x, 19, "mark");
    if (x % 2 === 1) set(x, 21, "mark");
  }
  rect(2, 20, 35, 20, "strike");

  // The correction, underlined, and the cursor after it
  rect(3, 24, 26, 25, "correction");
  rect(3, 27, 26, 27, "accent");
  rect(28, 23, 28, 26, "cursor");

  // Two source chips
  for (const x0 of [3, 15]) {
    rect(x0, 29, x0 + 9, 29, "ink");
    rect(x0, 31, x0 + 9, 31, "ink");
    rect(x0, 30, x0, 30, "ink");
    rect(x0 + 9, 30, x0 + 9, 30, "ink");
    rect(x0 + 2, 30, x0 + 6, 30, "mark");
  }

  const paths: Record<Cell, string> = { ink: "", mark: "", strike: "", correction: "", accent: "", cursor: "" };
  for (const [position, cell] of cells) {
    const [x, y] = position.split(",").map(Number);
    paths[cell] += `M${x} ${y}h1v1h-1z`;
  }
  return paths;
}

const PATHS = draw();

/**
 * The card and each mark are stacked SVGs, so every mark can be revealed
 * with a clip on its own box (clip shapes on SVG child elements are not
 * handled reliably).
 */
export function AnswerCard({ label, className }: { label: string; className?: string }) {
  const viewBox = `0 0 ${W} ${H}`;
  const layer = (children: React.ReactNode, extra?: string) => (
    <svg
      viewBox={viewBox}
      className={[styles.layer, extra].filter(Boolean).join(" ")}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
  return (
    <AmbientLoop role="img" aria-label={label} className={[styles.art, className].filter(Boolean).join(" ")}>
      {layer(
        <>
          <path d={PATHS.mark} className={styles.mark} />
          <path d={PATHS.ink} className={styles.ink} />
          <path d={PATHS.cursor} className={`${styles.ink} ${styles.cursor}`} />
        </>,
      )}
      {layer(<path d={PATHS.strike} className={styles.ink} />, styles.strike)}
      {layer(<path d={PATHS.correction} className={styles.mark} />, styles.correction)}
      {layer(<path d={PATHS.accent} className={styles.accent} />, styles.underline)}
    </AmbientLoop>
  );
}
