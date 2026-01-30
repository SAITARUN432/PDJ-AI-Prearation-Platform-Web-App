import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import hrBasic from "../JSON_Files/HrBasicQuestions.json";
import hrMedium from "../JSON_Files/HrMediumQuestions.json";
import hrHard from "../JSON_Files/HrHardQuestions.json";

import feBasic from "../JSON_Files/BasicFrontendQuestions.json";
import feMedium from "../JSON_Files/MediumFrontendQuestions.json";
import feHard from "../JSON_Files/HardFrontendQuestions.json";

import beBasic from "../JSON_Files/BasicBackendQuestions.json";
import beMedium from "../JSON_Files/MediumBackendQuestions.json";
import beHard from "../JSON_Files/HardBackendQuestions.json";

import "../Cssfiles/InterviewStart.css";

const BANKS = {
  hr: { Basic: hrBasic, Medium: hrMedium, Hard: hrHard },
  frontend: { Basic: feBasic, Medium: feMedium, Hard: feHard },
  backend: { Basic: beBasic, Medium: beMedium, Hard: beHard },
};

export default function InterviewStart() {
  const location = useLocation();

  // when clicking Resume from RecentInterviews
  const attemptIdFromNav = location.state?.attemptId;

  const [attemptId, setAttemptId] = useState(null);

  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // ---------- Helpers ----------
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const makeAttemptId = (cfg) =>
    `attempt_${cfg.category}_${cfg.mode}_${cfg.time}_${Date.now()}`;

  // ---------- 1) RESTORE: if attemptId exists, load saved progress ----------
  useEffect(() => {
    const id =
      attemptIdFromNav || localStorage.getItem("lastInterviewAttemptId");
    if (!id) return;

    const saved = localStorage.getItem(`interview_progress_${id}`);
    if (!saved) return;

    try {
      const p = JSON.parse(saved);

      setAttemptId(p.attemptId);
      setConfig(p.config);
      setQuestions(p.questions || []);
      setAnswers(p.answers || {});
      setTimeLeft(typeof p.timeLeft === "number" ? p.timeLeft : 0);
      setSubmitted(!!p.submitted);
      setResult(p.result || null);

      // also update last id (important)
      localStorage.setItem("lastInterviewAttemptId", p.attemptId);
    } catch (e) {
      // ignore bad JSON
    }
  }, [attemptIdFromNav]);

  // ---------- 2) START NEW: only if NOT resuming and nothing loaded ----------
  useEffect(() => {
    // if we are resuming, don't create a new attempt
    if (attemptIdFromNav) return;

    // if already loaded (restored), don't override
    if (attemptId && config && questions.length > 0) return;

    const fromState = location.state?.config;
    const fromStorage = localStorage.getItem("interviewConfig");
    const parsedStorage = fromStorage ? JSON.parse(fromStorage) : null;

    const cfg = fromState || parsedStorage;
    if (!cfg) return;

    const bank = BANKS?.[cfg.category]?.[cfg.mode];
    if (!bank) {
      alert("Questions file not found for this category/mode");
      return;
    }

    const newId = makeAttemptId(cfg);
    setAttemptId(newId);
    localStorage.setItem("lastInterviewAttemptId", newId);

    setConfig(cfg);
    setQuestions(shuffle(bank).slice(0, cfg.questionCount));
    setTimeLeft(Number(cfg.time) * 60);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }, [location.state, attemptIdFromNav, attemptId, config, questions.length]);

  // ---------- 3) PERSIST: save progress ----------
  useEffect(() => {
    if (!attemptId || !config) return;

    const payload = {
      attemptId,
      config,
      questions,
      answers,
      timeLeft,
      submitted,
      result,
      updatedAt: Date.now(),
    };

    localStorage.setItem(
      `interview_progress_${attemptId}`,
      JSON.stringify(payload),
    );
  }, [attemptId, config, questions, answers, timeLeft, submitted, result]);

  // ---------- Timer ----------
  useEffect(() => {
    if (!config || submitted) return;
    if (timeLeft <= 0) return;

    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [config, submitted, timeLeft]);

  // Auto submit at 0
  useEffect(() => {
    if (!config || submitted) return;
    if (timeLeft === 0) handleSubmit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, config, submitted]);

  // ---------- Actions ----------
  const handleSelect = (qid, idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = (auto = false) => {
    if (submitted) return;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    for (const q of questions) {
      const qid = q.id ?? q.question;
      const picked = answers[qid];

      if (picked === undefined) unanswered++;
      else if (picked === q.answerIndex) correct++;
      else wrong++;
    }

    const res = {
      total: questions.length,
      correct,
      wrong,
      unanswered,
      auto,
    };

    setSubmitted(true);
    setResult(res);
  };

  if (!config) return <p>No config found</p>;

  return (
    <div className="interviewStartMainDiv">
      <div className="interviewStartMainDiv2">
        <h2 className="interviewStartMainDivh2">{config.title}</h2>

        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <p className="interviewStartMainDivp">
            {config.mode} | {config.time} mins | {config.questionCount}{" "}
            questions
          </p>

          <div className="time">⏳ {formatTime(timeLeft)}</div>
        </div>

        <button
          className="interviewStartMainDivButton"
          onClick={() => handleSubmit(false)}
          disabled={submitted}
          style={{ marginTop: 10, backgroundColor: "#4f46e5" }}
        >
          {submitted ? "Submitted" : "Submit"}
        </button>

        {result && (
          <div style={{ marginTop: 10 }}>
            <b>Score:</b> {result.correct}/{result.total} &nbsp;|&nbsp;
            <b>Wrong:</b> {result.wrong} &nbsp;|&nbsp;
            <b>Unanswered:</b> {result.unanswered}
            {result.auto ? <span> (Auto-submitted)</span> : null}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: "8px" }}>Questions</h3>

        {questions.map((q, i) => {
          const qid = q.id ?? q.question;
          const picked = answers[qid];

          const correctIndex = q.answerIndex;
          const isCorrect = picked !== undefined && picked === correctIndex;

          const yourAnswerText =
            picked === undefined ? null : q.options?.[picked];

          const correctAnswerText =
            correctIndex === undefined ? null : q.options?.[correctIndex];

          return (
            <div key={qid} className="mainDiv">
              <div>
                <p>
                  <b>{i + 1}.</b> {q.question}
                </p>

                {(q.options || []).map((opt, idx) => (
                  <label key={idx} style={{ display: "block" }}>
                    <input
                      type="radio"
                      name={`q_${qid}`}
                      checked={answers[qid] === idx}
                      onChange={() => handleSelect(qid, idx)}
                      disabled={submitted}
                      className="interviewStartMainInput"
                    />
                    {opt}
                  </label>
                ))}
              </div>

              <div className="secondMainDiv">
                {!submitted ? (
                  <p style={{ opacity: 0.7 }}>Submit to see answer</p>
                ) : (
                  <>
                    <p style={{ marginBottom: 6 }}>
                      <b>Your Answer:</b>{" "}
                      {yourAnswerText ?? (
                        <span style={{ opacity: 0.7 }}>Not answered</span>
                      )}
                    </p>

                    <p style={{ marginBottom: 6 }}>
                      <b>Correct Answer:</b>{" "}
                      {correctAnswerText ?? (
                        <span style={{ opacity: 0.7 }}>Missing</span>
                      )}
                    </p>

                    {q.explanation ? (
                      <p style={{ marginTop: 10, opacity: 0.9 }}>
                        <b>Explanation:</b> {q.explanation}
                      </p>
                    ) : null}

                    <p style={{ fontWeight: 700, marginTop: 10 }}>
                      {picked === undefined
                        ? "Unanswered"
                        : isCorrect
                          ? "Correct ✅"
                          : "Wrong ❌"}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
