import type { Metadata } from "next";
import { SchoolsPage, schoolsMetadata } from "@/components/pages/SchoolsPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/ecoles">): Promise<Metadata> {
  const { lang } = await params;
  return schoolsMetadata(lang, "ecoles");
}

export default async function Page({ params }: PageProps<"/[lang]/ecoles">) {
  const { lang } = await params;
  return <SchoolsPage lang={lang} slug="ecoles" />;
}
