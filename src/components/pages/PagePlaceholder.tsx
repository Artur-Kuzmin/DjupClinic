import { Dither } from "@/components/Dither";
import { SectionLabel } from "@/components/SectionLabel";
import styles from "./PagePlaceholder.module.css";

/** Temporary hero for practice pages that are not built yet. */
export function PagePlaceholder({ label, title }: { label: string; title: string }) {
  return (
    <>
      <section className={styles.hero}>
        <div className="container grid">
          <div className={styles.head}>
            <SectionLabel>{label}</SectionLabel>
          </div>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </section>
      <Dither from="var(--depth-0)" to="var(--depth-4)" rows={12} />
    </>
  );
}
