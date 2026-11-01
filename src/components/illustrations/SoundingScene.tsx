import { useId } from "react";
import { AmbientLoop } from "./AmbientLoop";
import { H, SCENE, SCENE_PATHS, W, type Paths } from "./sounding-scene";
import styles from "./SoundingScene.module.css";

/** One path per colour, in a fixed paint order. */
function Cells({ paths }: { paths: Paths }) {
  return (
    <>
      {(Object.keys(paths) as (keyof Paths)[]).map((colour) => (
        <path key={colour} d={paths[colour]} className={styles[colour]} />
      ))}
    </>
  );
}

/**
 * Welcome page illustration: a cross-section of a Nordic sea with a færing
 * sounding the depth (see sounding-scene.ts). Moving parts loop slowly by
 * whole cells; under reduced motion the scene holds its finished frame.
 */
export function SoundingScene({ label, className }: { label: string; className?: string }) {
  const id = useId();
  const { water } = SCENE_PATHS;
  const { particleClip } = SCENE;

  return (
    <AmbientLoop className={[styles.art, className].filter(Boolean).join(" ")}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        shapeRendering="crispEdges"
        role="img"
        aria-label={label}
        focusable="false"
      >
        <defs>
          {water.seams.map((seam, i) => (
            <pattern key={i} id={`${id}seam${i}`} patternUnits="userSpaceOnUse" x="0" y={seam.y} width="4" height={seam.height}>
              <rect width="4" height={seam.height} className={styles[seam.upper]} />
              <path d={seam.tile} className={styles[seam.lower]} />
            </pattern>
          ))}
          <pattern id={`${id}fade`} patternUnits="userSpaceOnUse" x={water.fade.x} y="0" width={water.fade.width} height="4">
            <path d={water.fade.tile} className={styles.page} />
          </pattern>
          <clipPath id={`${id}motes`}>
            <rect x="0" y={particleClip.y} width={W} height={particleClip.height} />
          </clipPath>
        </defs>

        <Cells paths={SCENE_PATHS.hills} />
        {water.bands.map((band) => (
          <rect key={band.y} x="0" y={band.y} width={W} height={band.height} className={styles[band.colour]} />
        ))}
        {water.seams.map((seam, i) => (
          <rect key={seam.y} x="0" y={seam.y} width={W} height={seam.height} fill={`url(#${id}seam${i})`} />
        ))}
        <rect x="0" y={water.surface} width={W} height="1" className={styles.fjord} />

        <g clipPath={`url(#${id}motes)`}>
          <g className={styles.motes}>
            <Cells paths={SCENE_PATHS.particles} />
          </g>
        </g>
        <g className={styles.school}>
          <Cells paths={SCENE_PATHS.fish} />
        </g>
        <g className={styles.waves}>
          <Cells paths={SCENE_PATHS.crests} />
        </g>
        <Cells paths={SCENE_PATHS.seabed} />
        {/* Over the water and the seabed alike, so the whole section dissolves */}
        <rect
          x={water.fade.x}
          y={water.fade.y}
          width={water.fade.width}
          height={water.fade.height}
          fill={`url(#${id}fade)`}
        />

        {SCENE_PATHS.line.map((frame, i) => (
          <g key={i} className={styles[`line${i}`]}>
            <Cells paths={frame} />
          </g>
        ))}
        <Cells paths={SCENE_PATHS.weight} />
        {/* The hull bobs under a still veil of water; the line rides on top */}
        <g className={styles.boat}>
          <Cells paths={SCENE_PATHS.boat} />
        </g>
        <Cells paths={SCENE_PATHS.veil} />
        <g className={styles.boat}>
          <Cells paths={SCENE_PATHS.rigging} />
        </g>
      </svg>
    </AmbientLoop>
  );
}
