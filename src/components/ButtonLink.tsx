import Link from "next/link";
import type { ReactNode } from "react";
import { PixelArrow, PixelMail } from "./pixel/icons";
import styles from "./ButtonLink.module.css";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: "arrow" | "mail";
  /** Extra words read by screen readers only, such as "opens your email app". */
  hint?: string;
  /** Stretches the link's hit area over its nearest positioned ancestor (a card). */
  stretched?: boolean;
  className?: string;
};

/**
 * Square pixel button: 2px border, hard offset shadow that collapses on press.
 * The outer anchor stays untransformed so a stretched hit area keeps working;
 * the inner face carries the visual state.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon = "arrow",
  hint,
  stretched = false,
  className,
}: ButtonLinkProps) {
  const classes = [styles.button, styles[variant], stretched && styles.stretched, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <span className={styles.face}>
      <span>{children}</span>
      {hint ? <span className="visually-hidden">, {hint}</span> : null}
      {icon === "mail" ? <PixelMail className={styles.icon} /> : <PixelArrow className={styles.icon} />}
    </span>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}
