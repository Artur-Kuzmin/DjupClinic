import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/pages/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/mentions-legales">): Promise<Metadata> {
  const { lang } = await params;
  return legalMetadata(lang, "mentions-legales");
}

export default async function Page({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  return <LegalPage lang={lang} slug="mentions-legales" />;
}
