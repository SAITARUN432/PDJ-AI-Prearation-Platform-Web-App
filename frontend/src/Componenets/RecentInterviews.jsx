import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"

export default function RecentInterviews() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const list = Object.keys(localStorage)
      .filter((k) => k.startsWith("interview_progress_"))
      .map((k) => {
        try {
          return JSON.parse(localStorage.getItem(k));
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    setItems(list);
  }, []);

  const resume = (attemptId, category) => {
    localStorage.setItem("lastInterviewAttemptId", attemptId);

    // change route if you have different pages per category
    // example: /interview/hr, /interview/frontend, /interview/backend
    navigate(`/interview/${category}`, { state: { attemptId } });
  };

  const remove = (attemptId) => {
    localStorage.removeItem(`interview_progress_${attemptId}`);
    const last = localStorage.getItem("lastInterviewAttemptId");
    if (last === attemptId) localStorage.removeItem("lastInterviewAttemptId");

    setItems((prev) => prev.filter((x) => x.attemptId !== attemptId));
  };

  const formatDate = (ms) => {
    if (!ms) return "-";
    const d = new Date(ms);
    return d.toLocaleString();
  };

  if (items.length === 0)
    return (
      <h2
        style={{
          padding: "15px",
          textAlign: "center",
          fontSize: "80px",
          margin: "48px 0px",
        }}
      >
        No recent interviews <br />
        completed yet. Complete Then <br />
        revert here.
      </h2>
    );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Recent Interviews</h2>

      {items.map((it) => {
        const cfg = it.config || {};
        const category = cfg.category || "hr";
        const status = it.submitted ? "Completed" : "In Progress";

        const total = it.result?.total ?? cfg.questionCount ?? 0;
        const correct = it.result?.correct ?? 0;
        const wrong = it.result?.wrong ?? 0;
        const unanswered = it.result?.unanswered ?? 0;

        return (
          <div
            key={it.attemptId}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 260 }}>
              <div style={{ fontWeight: 800 }}>
                {cfg.title || `${category.toUpperCase()} Interview`}
              </div>

              <div style={{ opacity: 0.85, marginTop: 4 }}>
                {cfg.mode} | {cfg.time} mins | {cfg.questionCount} questions
              </div>

              <div style={{ marginTop: 6 }}>
                <b>Status:</b> {status}
              </div>

              <div style={{ marginTop: 4 }} className="recentInterviews">
                <b>Last Updated:</b> {formatDate(it.updatedAt)}
              </div>

              {it.submitted && it.result ? (
                <div style={{ marginTop: 6 }}>
                  <b>Score:</b> {correct}/{total} &nbsp;|&nbsp;
                  <b>Wrong:</b> {wrong} &nbsp;|&nbsp;
                  <b>Unanswered:</b> {unanswered}
                </div>
              ) : (
                <div style={{ marginTop: 6, opacity: 0.85 }}>
                  <b>Time Left:</b>{" "}
                  {typeof it.timeLeft === "number"
                    ? `${Math.floor(it.timeLeft / 60)}m ${it.timeLeft % 60}s`
                    : "-"}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => resume(it.attemptId, category)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#4f46e5",
                }}
              >
                {it.submitted ? "View" : "Resume"}
              </button>

              <button
                onClick={() => remove(it.attemptId)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  backgroundColor: "#d01919",
                  border: "none",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
