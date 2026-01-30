import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import questions from "../data/questions.json"; // your json

function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // if user directly opens /hr/start without clicking card
  if (!state?.config) return <p>No interview selected.</p>;

  const { config } = state; // { mode, time, questionCount ... }

  const selectedQuestions = useMemo(() => {
    return questions
      .filter((q) => q.mode === config.mode)
      .slice(0, config.questionCount);
  }, [config.mode, config.questionCount]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [showResult, setShowResult] = useState(false);

  const q = selectedQuestions[index];

  const choose = (qid, optIndex) => {
    setAnswers((p) => ({ ...p, [qid]: optIndex }));
  };

  const next = () => {
    if (index < selectedQuestions.length - 1) setIndex((i) => i + 1);
    else setShowResult(true);
  };

  if (showResult) {
    const result = selectedQuestions.map((q) => {
      const user = answers[q.id];
      return { ...q, user, isCorrect: user === q.correctIndex };
    });

    const score = result.filter((r) => r.isCorrect).length;

    return (
      <div>
        <h2>Result</h2>
        <p>
          Score: {score} / {result.length}
        </p>

        {result.map((r) => (
          <div key={r.id} style={{ marginBottom: 12 }}>
            <p>
              <b>{r.q}</b>
            </p>
            <p>
              Your answer:{" "}
              {r.user === undefined ? "Skipped" : r.options[r.user]}
            </p>
            <p>Correct answer: {r.options[r.correctIndex]}</p>
            <p>{r.isCorrect ? "✅ Correct" : "❌ Wrong"}</p>
          </div>
        ))}

        <button onClick={() => navigate("/hr")}>Back</button>
      </div>
    );
  }

  if (!q) return <p>No questions found for {config.mode}.</p>;

  return (
    <div>
      <h2>
        {config.mode.toUpperCase()} - {config.time} Minutes
      </h2>
      <p>
        Question {index + 1} / {selectedQuestions.length}
      </p>

      <h3>{q.q}</h3>

      {q.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => choose(q.id, i)}
          style={{ display: "block", margin: "8px 0" }}
        >
          {opt}
        </button>
      ))}

      <button onClick={next}>
        {index === selectedQuestions.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}

export default Interview;