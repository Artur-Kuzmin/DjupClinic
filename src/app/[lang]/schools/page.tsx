import type { Metadata } from "next";
import { SchoolsPage, schoolsMetadata } from "@/components/pages/SchoolsPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/schools">): Promise<Metadata> {
  const { lang } = await params;
  return schoolsMetadata(lang, "schools");
}

export default async function Page({ params }: PageProps<"/[lang]/schools">) {
  const { lang } = await params;
  return <SchoolsPage lang={lang} slug="schools" />;
}
