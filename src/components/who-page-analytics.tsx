"use client";

import { useEffect } from "react";

type AnalyticsPayload = Record<string, string | number> & { event: string };

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
  }
}

function emitWhoEvent(event: string, parameters: Record<string, string | number> = {}) {
  const payload: AnalyticsPayload = { event, ...parameters };
  window.dataLayer?.push(payload);
  window.dispatchEvent(new CustomEvent("aivel:analytics", { detail: payload }));
}

export function WhoPageAnalytics() {
  useEffect(() => {
    const firedDepths = new Set<number>();
    const depths = [25, 50, 75, 100] as const;

    const reportDepth = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));

      depths.forEach((depth) => {
        if (progress >= depth && !firedDepths.has(depth)) {
          firedDepths.add(depth);
          emitWhoEvent(`who_scroll_${depth}`);
        }
      });
    };

    const reportClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const eventTarget = target.closest<HTMLElement>("[data-who-event]");
      const eventName = eventTarget?.dataset.whoEvent;
      if (!eventTarget || !eventName) return;

      const parameters: Record<string, string> = {};
      Object.entries(eventTarget.dataset).forEach(([key, value]) => {
        if (key !== "whoEvent" && value) parameters[key] = value;
      });
      emitWhoEvent(eventName, parameters);
    };

    emitWhoEvent("who_page_view");
    reportDepth();
    window.addEventListener("scroll", reportDepth, { passive: true });
    document.addEventListener("click", reportClick);

    return () => {
      window.removeEventListener("scroll", reportDepth);
      document.removeEventListener("click", reportClick);
    };
  }, []);

  return null;
}
