import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/pages/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal-notice">): Promise<Metadata> {
  const { lang } = await params;
  return legalMetadata(lang, "legal-notice");
}

export default async function Page({ params }: PageProps<"/[lang]/legal-notice">) {
  const { lang } = await params;
  return <LegalPage lang={lang} slug="legal-notice" />;
}
