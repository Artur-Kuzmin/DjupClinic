import { MARK } from "./mark";
import { PixelArt } from "./PixelArt";

/**
 * The Djup Clinic mark, drawn from the shared grid in ./mark.
 * Colours follow the section tone.
 */
const colors = { "#": "var(--color-text)", f: "var(--color-mark)" } as const;

export function PixelMark({ className, cell = 2 }: { className?: string; cell?: number }) {
  return <PixelArt rows={MARK} colors={colors} cell={cell} className={className} />;
}
