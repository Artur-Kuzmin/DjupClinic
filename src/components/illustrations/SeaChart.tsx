import { useId, type CSSProperties, type ReactNode } from "react";
import { AmbientLoop } from "./AmbientLoop";
import { CHART_PATHS, COURSE_COLUMNS, DASHES, H, TILES, W, type Paths } from "./sea-chart";
import styles from "./SeaChart.module.css";

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

/** Right insets that clip the course to its first and last plotted column. */
const PLOT = {
  "--plot-from": `${((W - COURSE_COLUMNS.from) / W) * 100}%`,
  "--plot-to": `${((W - COURSE_COLUMNS.to) / W) * 100}%`,
} as CSSProperties;

/**
 * Startup Clinic illustration: a nautical chart (see sea-chart.ts). The
 * chart and each moving part are stacked SVGs, so the course can be
 * plotted with a clip on its own box (clip shapes on SVG child elements
 * are not handled reliably). Under reduced motion the chart holds its
 * finished frame: the course plotted, the vessel near the destination.
 */
export function SeaChart({ label, className }: { label: string; className?: string }) {
  const id = useId();
  const { base, beams, buoyLights, course, vessel } = CHART_PATHS;
  return (
    <AmbientLoop role="img" aria-label={label} className={[styles.art, className].filter(Boolean).join(" ")}>
      <Layer>
        <defs>
          <pattern id={`${id}hatch`} patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" className={`${styles.fill} ${styles.bone}`} />
            <path d={TILES.hatch} className={`${styles.fill} ${styles.pale}`} />
          </pattern>
          {TILES.tint.map((d, i) => (
            <pattern key={i} id={`${id}tint${i}`} patternUnits="userSpaceOnUse" width="4" height="4">
              <path d={d} className={`${styles.fill} ${styles.fjord}`} />
            </pattern>
          ))}
        </defs>
        <path d={base.land} fill={`url(#${id}hatch)`} />
        {base.deep.map((d, i) => (
          <path key={i} d={d} fill={`url(#${id}tint${i})`} />
        ))}
        <Cells paths={base.strokes} />
        <g className={styles.beams}>
          <Cells paths={beams} />
        </g>
        {buoyLights.map((light, i) => (
          <g key={i} className={styles[`buoy${i}`]}>
            <Cells paths={light} />
          </g>
        ))}
      </Layer>
      {course.map((quarter, i) => (
        <Layer key={i} className={styles[`dissolve${i}`]} style={PLOT}>
          <Cells paths={quarter} />
        </Layer>
      ))}
      <Layer>
        <defs>
          {vessel.sprites.map((sprite, i) => (
            <g key={i} id={`${id}vessel${i}`}>
              <Cells paths={sprite} />
            </g>
          ))}
        </defs>
        {vessel.frames.map((frame, step) => (
          <g
            key={step}
            className={step === DASHES ? styles.vesselLast : styles.vessel}
            style={step === DASHES ? undefined : { animationDelay: `calc(var(--chart-loop) * ${step / (2 * DASHES) - 1})` }}
          >
            <use href={`#${id}vessel${frame.sprite}`} x={frame.x} y={frame.y} />
          </g>
        ))}
      </Layer>
    </AmbientLoop>
  );
}
