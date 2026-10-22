/**
 * The Djup Clinic pixel mark: a framed square whose interior dithers from
 * empty at the surface to solid at the bottom.
 * "#" frame (text colour), "f" dither (mark colour), "." ground.
 *
 * Also read by scripts/generate-icons.mjs, which builds the favicon,
 * the Apple touch icon and icon.svg from these grids.
 */
export const MARK = [
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

/** An 8 x 8 cut of the mark for 16px favicons, two screen pixels per cell. */
export const MARK_SMALL = [
  "########",
  "#......#",
  "#f.f.f.#",
  "#.f.f.f#",
  "#f.f.f.#",
  "#ffffff#",
  "#ffffff#",
  "########",
] as const;
