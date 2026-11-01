import { useId, type CSSProperties, type ReactNode } from "react";
import { AmbientLoop } from "./AmbientLoop";
import { CARD_PATHS, H, VEIL_TILES, W, type Paths, type Reveal } from "./answer-card";
import styles from "./AnswerCard.module.css";

/** One stroked path of cell runs per colour (see Layer.strokes), in a fixed paint order. */
function Cells({ paths }: { paths: Paths }) {
  return (
    <>
      {(Object.keys(paths) as (keyof Paths)[]).map((colour) => (
        <path key={colour} d={paths[colour]} className={`${styles.runs} ${styles[colour]}`} />
      ))}
    </>
  );
}

function Layer({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={[styles.layer, className].filter(Boolean).join(" ")}
      style={style}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Right insets that clip a layer to the first and last column it reveals. */
const clip = ({ from, to }: Reveal) =>
  ({
    "--from": `${((W - from) / W) * 100}%`,
    "--to": `${((W - to) / W) * 100}%`,
  }) as CSSProperties;

/**
 * School Audits illustration: an AI answer corrected by a reviewer (see
 * answer-card.ts). The window and each moving part are stacked SVGs, so
 * every line and mark can be revealed with a clip on its own box (clip
 * shapes on SVG child elements are not handled reliably). Under reduced
 * motion the card holds its finished frame.
 */
export function AnswerCard({ label, className }: { label: string; className?: string }) {
  const id = useId();
  const { base, lines, strike, caret, leader, ring, note, veil } = CARD_PATHS;
  return (
    <AmbientLoop role="img" aria-label={label} className={[styles.art, className].filter(Boolean).join(" ")}>
      <Layer>
        <Cells paths={base} />
      </Layer>
      {lines.map((line, i) => (
        <Layer key={i} className={styles[`line${i}`]} style={clip(line.reveal)}>
          <Cells paths={line.paths} />
        </Layer>
      ))}
      <Layer className={styles.strike} style={clip(strike.reveal)}>
        <Cells paths={strike.paths} />
      </Layer>
      <Layer className={styles.leader} style={clip(leader.reveal)}>
        <Cells paths={leader.paths} />
      </Layer>
      <Layer>
        <g className={styles.caret}>
          <Cells paths={caret} />
        </g>
        <g className={styles.ring}>
          <Cells paths={ring} />
        </g>
        <g className={styles.note}>
          <Cells paths={note} />
        </g>
        <defs>
          {VEIL_TILES.map((d, i) => (
            <pattern key={i} id={`${id}veil${i}`} patternUnits="userSpaceOnUse" width="4" height="4">
              <path d={d} className={`${styles.fill} ${styles.page}`} />
            </pattern>
          ))}
        </defs>
        {VEIL_TILES.map((_, i) => (
          <g key={i} className={styles[`veil${i}`]} fill={`url(#${id}veil${i})`}>
            {veil.map(([x, y, width, height]) => (
              <rect key={`${x},${y}`} x={x} y={y} width={width} height={height} />
            ))}
          </g>
        ))}
      </Layer>
    </AmbientLoop>
  );
}
