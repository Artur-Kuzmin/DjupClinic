import type { TrackKey } from "@/i18n/dictionaries/en";
import { PixelArt } from "./PixelArt";

/** A slide with rising bars: the investor deck. */
const DECK = [
  "################",
  "#..............#",
  "#.####.........#",
  "#..............#",
  "#..........ff..#",
  "#.......ff.ff..#",
  "#....ff.ff.ff..#",
  "#....ff.ff.ff..#",
  "#..............#",
  "################",
  ".......##.......",
  "......####......",
] as const;

/** A contact card: a named person and their details. */
const CARD = [
  "################",
  "#..............#",
  "#..ff...######.#",
  "#..ff..........#",
  "#.ffff..####...#",
  "#.ffff.........#",
  "#.ffff..#####..#",
  "#..............#",
  "#..............#",
  "################",
  "................",
  "................",
] as const;

const ICONS: Record<TrackKey, readonly string[]> = { investors: DECK, customers: CARD };
const colors = { "#": "var(--color-text)", f: "var(--color-mark)" } as const;

export function TrackIcon({ track, className }: { track: TrackKey; className?: string }) {
  return <PixelArt rows={ICONS[track]} colors={colors} cell={3} className={className} />;
}
