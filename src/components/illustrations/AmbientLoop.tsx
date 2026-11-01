"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import styles from "./AmbientLoop.module.css";

/**
 * Box for a looping illustration. Its CSS animations pause while it is
 * off-screen or the tab is hidden, so idle loops cost nothing.
 */
export function AmbientLoop({ className, children, ...props }: ComponentPropsWithoutRef<"span">) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let onScreen = true;
    const update = () => element.toggleAttribute("data-paused", !onScreen || document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <span ref={ref} className={[styles.loop, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </span>
  );
}
