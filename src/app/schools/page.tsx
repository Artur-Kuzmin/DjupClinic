import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School Audits",
};

export default function SchoolsPage() {
  return (
    <main id="main" className="container">
      <p className="label">School Audits</p>
      <h1>School Audits</h1>
    </main>
  );
}
