import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MARK } from "@/components/pixel/mark";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { ogSize } from "./og-config";

/**
 * Social card for Open Graph and Twitter, one per language (1200 x 630).
 * Wordmark and the welcome statement on bone, then an ordered-dither band
 * into the fjord band carrying the practice names. Copy comes from the
 * dictionaries, colours from tokens.css, the mark from the shared grid.
 */
const root = process.cwd();
const [geist, departure, tokensCss] = await Promise.all([
  readFile(join(root, "src/fonts/geist/Geist-Medium.ttf")),
  readFile(join(root, "src/fonts/departure-mono/DepartureMono-Regular.woff")),
  readFile(join(root, "src/styles/tokens.css"), "utf8"),
]);

function token(name: string): string {
  const match = tokensCss.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token --${name} not found in tokens.css`);
  return match[1];
}

const color = {
  bone: token("bone-0"),
  ink: token("ink"),
  mark: token("fjord-500"),
  deep: token("fjord-700"),
};

const CELL = 8; // one art pixel on the card
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

function markPaths() {
  let ink = "";
  let mark = "";
  MARK.forEach((row, y) => {
    [...row].forEach((char, x) => {
      const cell = `M${x} ${y}h1v1h-1z`;
      if (char === "#") ink += cell;
      if (char === "f") mark += cell;
    });
  });
  return { ink, mark };
}

function ditherPath(columns: number, rows: number) {
  let d = "";
  for (let y = 0; y < rows; y += 1) {
    const density = (y + 0.5) / rows;
    for (let x = 0; x < columns; x += 1) {
      if ((BAYER[y % 4][x % 4] + 0.5) / 16 < density) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
}

const MARK_PATHS = markPaths();
const DITHER_ROWS = 8;
const DITHER = ditherPath(ogSize.width / CELL, DITHER_ROWS);

/** Invisible typesetting characters have no glyph in the card fonts. */
function plain(text: string) {
  return text.replace(/⁠/g, "").replace(/ /g, " ");
}

export function renderOgImage(locale: Locale) {
  const dict = getDictionary(locale);
  const practices = plain(`${dict.practices.startups} · ${dict.practices.schools}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: color.bone,
          color: color.ink,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, padding: "64px 72px 0" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg width={60} height={60} viewBox="0 0 10 10" shapeRendering="crispEdges">
              <path d={MARK_PATHS.ink} fill={color.ink} />
              <path d={MARK_PATHS.mark} fill={color.mark} />
            </svg>
            <div style={{ marginLeft: 20, fontSize: 40, letterSpacing: "-0.01em" }}>{site.name}</div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 56,
              maxWidth: 1056,
              fontSize: 56,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              textWrap: "balance",
            }}
          >
            {plain(dict.home.statement)}
          </div>
        </div>
        <svg
          width={ogSize.width}
          height={DITHER_ROWS * CELL}
          viewBox={`0 0 ${ogSize.width / CELL} ${DITHER_ROWS}`}
          shapeRendering="crispEdges"
        >
          <path d={DITHER} fill={color.deep} />
        </svg>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 96,
            padding: "0 72px",
            background: color.deep,
            color: color.bone,
            fontFamily: "Departure Mono",
            fontSize: 22,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {practices}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: geist, weight: 500, style: "normal" },
        { name: "Departure Mono", data: departure, weight: 400, style: "normal" },
      ],
    },
  );
}
