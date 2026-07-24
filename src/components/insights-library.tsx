"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Insight, InsightJobId } from "@/data/insights";
import { insightJobs } from "@/data/insights";

type FilterId = "all" | InsightJobId;

export function InsightsLibrary({ items }: { items: readonly Insight[] }) {
  const [activeJob, setActiveJob] = useState<FilterId>("all");
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");

    return items.filter((item) => {
      const matchesJob = activeJob === "all" || item.jobId === activeJob;
      const haystack = `${item.title} ${item.description} ${item.job} ${item.format}`.toLocaleLowerCase("ru");
      return matchesJob && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeJob, items, query]);

  return (
    <div className="insights-library">
      <div className="insights-tools">
        <label className="insights-search">
          <span>Найти ответ</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например: проверить вывод ИИ"
          />
        </label>

        <div className="insights-filters" aria-label="Отбор материалов по задаче">
          <button className={activeJob === "all" ? "is-active" : ""} type="button" onClick={() => setActiveJob("all")}>
            Все задачи
          </button>
          {insightJobs.map((job) => (
            <button className={activeJob === job.id ? "is-active" : ""} type="button" onClick={() => setActiveJob(job.id)} key={job.id}>
              {job.label}
            </button>
          ))}
        </div>
      </div>

      <p className="insights-result-count" aria-live="polite">
        {visibleItems.length > 0 ? `Материалов: ${visibleItems.length}` : "По этому запросу пока нет материала"}
      </p>

      <div className="insights-grid">
        {visibleItems.map((item, index) => (
          <Link className={`insight-card ${index === 0 ? "is-leading" : ""}`} href={`/chto-my-dumaem/${item.slug}`} key={item.slug}>
            <div className="insight-card-meta">
              <span>{item.format}</span>
              <time dateTime={item.publishedAt}>{item.publishedLabel}</time>
            </div>
            <p className="insight-card-job">{item.job}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="insight-card-footer">
              <span>{item.readingTime}</span>
              <strong aria-hidden="true">→</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
