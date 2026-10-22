import { cacheLife } from "next/cache";

/** Current year, cached so pages stay prerendered under Cache Components. */
export async function copyrightYear(): Promise<number> {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}
