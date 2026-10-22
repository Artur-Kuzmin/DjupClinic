import { PixelArt } from "./PixelArt";

const ink = { "#": "currentColor" } as const;

/**
 * Small glyphs drawn on Departure Mono's own pixel grid: at an 11px label
 * size one cell is one screen pixel, so the icons match the type.
 * Sized in em so they scale with the label they sit in.
 */
const ARROW = [
  "...#...",
  "....#..",
  ".....#.",
  "#######",
  ".....#.",
  "....#..",
  "...#...",
] as const;

const MAIL = [
  "#########",
  "##.....##",
  "#.#...#.#",
  "#..#.#..#",
  "#...#...#",
  "#.......#",
  "#########",
] as const;

type IconProps = { className?: string };

export function PixelArrow({ className }: IconProps) {
  return (
    <PixelArt rows={ARROW} colors={ink} cell={1} className={className} style={{ width: "0.6364em", height: "0.6364em" }} />
  );
}

export function PixelMail({ className }: IconProps) {
  return (
    <PixelArt rows={MAIL} colors={ink} cell={1} className={className} style={{ width: "0.8182em", height: "0.6364em" }} />
  );
}
