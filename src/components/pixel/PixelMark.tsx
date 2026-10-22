import { PixelArt } from "./PixelArt";

/**
 * The Djup Clinic mark: a framed square whose interior dithers from empty
 * at the surface to solid at the bottom. Colours follow the section tone.
 */
const MARK = [
  "##########",
  "#........#",
  "#........#",
  "#f.f.f.f.#",
  "#...f...f#",
  "#f.f.f.f.#",
  "#.f.f.f.f#",
  "#ffffffff#",
  "#ffffffff#",
  "##########",
] as const;

const colors = { "#": "var(--color-text)", f: "var(--color-mark)" } as const;

export function PixelMark({ className, cell = 2 }: { className?: string; cell?: number }) {
  return <PixelArt rows={MARK} colors={colors} cell={cell} className={className} />;
}
