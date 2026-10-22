import { Geist } from "next/font/google";
import localFont from "next/font/local";

/** Geist: headings and body. */
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/** Departure Mono: pixel labels, section numbers, nav and buttons only. */
export const departureMono = localFont({
  src: "../fonts/departure-mono/DepartureMono-Regular.woff2",
  variable: "--font-departure",
  weight: "400",
  display: "swap",
});

export const fontVariables = `${geist.variable} ${departureMono.variable}`;
