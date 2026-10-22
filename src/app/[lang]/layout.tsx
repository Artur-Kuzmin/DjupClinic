import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/config/site";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import "@/styles/tokens.css";
import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s · ${site.name}` },
    description: dict.meta.siteDescription,
    applicationName: site.name,
    formatDetection: { email: false, telephone: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f2eee6",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <a href="#main" className="skip-link">
          {dict.a11y.skipToContent}
        </a>
        <SiteHeader locale={lang} dict={dict} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter locale={lang} dict={dict} />
      </body>
    </html>
  );
}
