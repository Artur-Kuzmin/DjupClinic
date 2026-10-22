import type { CSSProperties } from "react";

export type PixelArtProps = {
  /** One string per row. Each character is one cell; unmapped characters are empty. */
  rows: readonly string[];
  /** Maps a character to a CSS colour, normally a token such as var(--color-text). */
  colors: Readonly<Record<string, string>>;
  /** Rendered size of one cell in px. CSS can override the SVG's width and height. */
  cell?: number;
  className?: string;
  style?: CSSProperties;
  /** Accessible name. Leave empty for decorative art, which is hidden from assistive tech. */
  label?: string;
};

/**
 * Renders a pixel grid as a crisp inline SVG: one path per colour,
 * horizontal runs merged, shape-rendering crispEdges.
 */
export function PixelArt({ rows, colors, cell = 2, className, style, label }: PixelArtProps) {
  const height = rows.length;
  const width = Math.max(...rows.map((row) => row.length));
  const paths = new Map<string, string>();

  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      if (!colors[char]) {
        x += 1;
        continue;
      }
      let run = 1;
      while (row[x + run] === char) run += 1;
      paths.set(char, `${paths.get(char) ?? ""}M${x} ${y}h${run}v1h-${run}z`);
      x += run;
    }
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width * cell}
      height={height * cell}
      className={className}
      style={style}
      shapeRendering="crispEdges"
      focusable="false"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {[...paths].map(([char, d]) => (
        <path key={char} d={d} style={{ fill: colors[char] }} />
      ))}
    </svg>
  );
}
