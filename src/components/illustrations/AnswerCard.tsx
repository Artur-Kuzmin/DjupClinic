import styles from "./AnswerCard.module.css";

/**
 * School Audits illustration: an AI answer card. One line is struck
 * through; the corrected line beneath it is underlined in coral, the one
 * key highlight. Drawn on a 44 x 32 grid at build time.
 */
const W = 44;
const H = 32;

type Cell = "ink" | "mark" | "accent";

function draw(): Record<Cell, string> {
  const cells = new Map<string, Cell>();
  const set = (x: number, y: number, cell: Cell) => cells.set(`${x},${y}`, cell);
  const rect = (x0: number, y0: number, x1: number, y1: number, cell: Cell) => {
    for (let y = y0; y <= y1; y += 1) for (let x = x0; x <= x1; x += 1) set(x, y, cell);
  };

  // Card frame
  rect(0, 0, W - 1, 0, "ink");
  rect(0, 0, 0, 27, "ink");
  rect(W - 1, 0, W - 1, 27, "ink");
  rect(0, 27, 4, 27, "ink");
  rect(8, 27, W - 1, 27, "ink");
  // Speech tail, drawn as an outline below the gap in the frame
  for (const y of [28, 29, 30, 31]) set(4, y, "ink");
  set(7, 28, "ink");
  set(6, 29, "ink");
  set(5, 30, "ink");

  // Header: avatar and a short label bar
  rect(3, 3, 5, 5, "mark");
  rect(8, 4, 17, 4, "ink");

  // Answer text
  rect(3, 9, 37, 10, "mark");
  rect(3, 13, 31, 14, "mark");

  // The wrong line: faded, with an ink strike running past both ends
  for (let x = 3; x <= 34; x += 1) {
    if (x % 2 === 0) set(x, 17, "mark");
    if (x % 2 === 1) set(x, 19, "mark");
  }
  rect(2, 18, 35, 18, "ink");

  // The correction, underlined
  rect(3, 22, 26, 23, "mark");
  rect(3, 25, 26, 25, "accent");

  const paths: Record<Cell, string> = { ink: "", mark: "", accent: "" };
  for (const [position, cell] of cells) {
    const [x, y] = position.split(",").map(Number);
    paths[cell] += `M${x} ${y}h1v1h-1z`;
  }
  return paths;
}

const PATHS = draw();

export function AnswerCard({ label, className }: { label: string; className?: string }) {
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
      <path d={PATHS.accent} className={styles.accent} />
    </svg>
  );
}
