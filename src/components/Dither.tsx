import type { CSSProperties } from "react";
import styles from "./Dither.module.css";

/** 4x4 Bayer matrix: the threshold order of an ordered dither. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

/** A one-tile mask (4 cells wide, `rows` tall) that fills denser row by row. */
function ditherMask(rows: number): string {
  let d = "";
  for (let y = 0; y < rows; y += 1) {
    const density = (y + 0.5) / rows;
    for (let x = 0; x < 4; x += 1) {
      if ((BAYER[y % 4][x] + 0.5) / 16 < density) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 ${rows}" shape-rendering="crispEdges"><path d="${d}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

type DitherProps = {
  /** Colour of the section above, as a token: "var(--depth-0)". */
  from: string;
  /** Colour of the section below. */
  to: string;
  /** Band height in cells. Cell size comes from --dither-cell. */
  rows?: number;
};

/**
 * Transition between two sections using an ordered-dither pixel pattern
 * instead of a smooth gradient. Pure CSS mask, no images.
 */
export function Dither({ from, to, rows = 8 }: DitherProps) {
  const style = {
    "--dither-from": from,
    "--dither-to": to,
    "--dither-rows": rows,
    "--dither-mask": ditherMask(rows),
  } as CSSProperties;
  return <div className={styles.dither} style={style} aria-hidden="true" />;
}
