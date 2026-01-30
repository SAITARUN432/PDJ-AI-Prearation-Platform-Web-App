import { useMemo, useState, useEffect } from "react";
import "../Cssfiles/PreparationSheet.css";

import hrBasic from "../JSON_Files/HrBasicQuestions.json";
import hrMedium from "../JSON_Files/HrMediumQuestions.json";
import hrHard from "../JSON_Files/HrHardQuestions.json";

import feBasic from "../JSON_Files/BasicFrontendQuestions.json";
import feMedium from "../JSON_Files/MediumFrontendQuestions.json";
import feHard from "../JSON_Files/HardFrontendQuestions.json";

import beBasic from "../JSON_Files/BasicBackendQuestions.json";
import beMedium from "../JSON_Files/MediumBackendQuestions.json";
import beHard from "../JSON_Files/HardBackendQuestions.json";

const ALL = [
  ...hrBasic.map((q) => ({ ...q, category: "hr", level: "basic" })),
  ...hrMedium.map((q) => ({ ...q, category: "hr", level: "medium" })),
  ...hrHard.map((q) => ({ ...q, category: "hr", level: "hard" })),

  ...feBasic.map((q) => ({ ...q, category: "frontend", level: "basic" })),
  ...feMedium.map((q) => ({ ...q, category: "frontend", level: "medium" })),
  ...feHard.map((q) => ({ ...q, category: "frontend", level: "hard" })),

  ...beBasic.map((q) => ({ ...q, category: "backend", level: "basic" })),
  ...beMedium.map((q) => ({ ...q, category: "backend", level: "medium" })),
  ...beHard.map((q) => ({ ...q, category: "backend", level: "hard" })),
];

export default function PreparationSheet() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");

  const [page, setPage] = useState(1);
  const pageSize = 30;

  // ✅ Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  // ✅ Filter using debounced value
  const filtered = useMemo(() => {
    const s = debounced.trim().toLowerCase();

    return ALL.filter((q) => {
      const matchCategory = category === "all" || q.category === category;
      const matchLevel = level === "all" || q.level === level;

      const matchSearch =
        !s ||
        (q.question || "").toLowerCase().includes(s) ||
        (q.explanation || "").toLowerCase().includes(s) ||
        (q.options || []).some((opt) => (opt || "").toLowerCase().includes(s));

      return matchCategory && matchLevel && matchSearch;
    });
  }, [debounced, category, level]);

  // ✅ Reset page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debounced, category, level]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // ✅ Pagination (render only 30)
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }} className="mainPreparation">
      <h2 className="mainH2InPrep">Preparation Sheet</h2>

      {/* Controls */}
      <div className="preparationMainDiv">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search keyword (ex: flexbox, array, salary...)"
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ccc",
            width: "100%",
            color: "#242323",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ccc",
            color: "#242323",
          }}
        >
          <option value="all" style={{ color: "rgb(36, 35, 35)" }}>
            All Categories
          </option>
          <option value="frontend" style={{ color: "rgb(36, 35, 35)" }}>
            Frontend
          </option>
          <option value="backend" style={{ color: "rgb(36, 35, 35)" }}>
            Backend
          </option>
          <option value="hr" style={{ color: "rgb(36, 35, 35)" }}>
            HR
          </option>
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ccc",
            color: "#242323",
          }}
        >
          <option value="all" style={{ color: "rgb(36, 35, 35)" }}>
            All Levels
          </option>
          <option value="basic" style={{ color: "rgb(36, 35, 35)" }}>
            Basic
          </option>
          <option value="medium" style={{ color: "rgb(36, 35, 35)" }}>
            Medium
          </option>
          <option value="hard" style={{ color: "rgb(36, 35, 35)" }}>
            Hard
          </option>
        </select>
      </div>

      <p>
        Showing <b>{filtered.length}</b> questions
      </p>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            backgroundColor: "rgb(36, 35, 35)",
          }}
        >
          Prev
        </button>

        <div>
          Page <b>{page}</b> / {totalPages}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            backgroundColor: "rgb(36, 35, 35)",
          }}
        >
          Next
        </button>
      </div>

      {/* List (ONLY paged) */}
      {paged.map((q, i) => {
        const answerText =
          typeof q.answerIndex === "number" ? q.options?.[q.answerIndex] : "";

        // global index number (not just page index)
        const number = (page - 1) * pageSize + i + 1;

        return (
          <div
            key={`${q.category}_${q.level}_${q.id ?? number}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid #ccc",
                  fontSize: 12,
                  backgroundColor: "#4f46e5",
                  color: "white",
                }}
              >
                {q.category.toUpperCase()}
              </span>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid #ccc",
                  fontSize: 12,
                  backgroundColor: "#4f46e5",
                  color: "white",
                }}
              >
                {q.level.toUpperCase()}
              </span>
            </div>

            <p style={{ marginTop: 10 }}>
              <b style={{ color: "#4f46e5" }}>{number}. Question:</b>{" "}
              {q.question}
            </p>

            <p>
              <b style={{ color: "#4f46e5" }}>Answer:</b>{" "}
              <span style={{ color: "#41d980" }}>{answerText}</span>
            </p>

            {q.explanation ? (
              <p style={{ opacity: 0.9 }}>
                <b style={{ color: "#4f46e5" }}>Explanation:</b> {q.explanation}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
