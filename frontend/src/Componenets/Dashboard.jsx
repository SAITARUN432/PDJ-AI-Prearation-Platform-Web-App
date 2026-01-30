import Img1 from "../assets/Logo.png";
import Img2 from "../assets/ShakeHand.png";
import { Clock } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import { Star } from "lucide-react";
import { Timer } from "lucide-react";
import "../Cssfiles/Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChartRepresent from "../Componenets/ChartRepresent";
import Img3 from "../assets/Img3.png";

function InterviewCard({ data }) {
  const navigate = useNavigate();

  const cfg = data?.config || {};
  const category = cfg.category || "hr";
  const status = data?.submitted ? "Completed" : "In Progress";

  const total = data?.result?.total ?? cfg.questionCount ?? 0;
  const correct = data?.result?.correct ?? 0;
  const wrong = data?.result?.wrong ?? 0;
  const unanswered = data?.result?.unanswered ?? 0;

  const formatDate = (ms) => (ms ? new Date(ms).toLocaleString() : "-");

  return (
    <div
      style={{
        border: "0.5px solid #f4f3f44c",
        borderRadius: 16,
        padding: 16,
        maxWidth: 420,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            {cfg.title || `${category.toUpperCase()} Interview`}
          </div>
          <div style={{ opacity: 0.8, marginTop: 4 }}>
            {cfg.mode || "-"} | {cfg.time || "-"} mins |{" "}
            {cfg.questionCount || 0} questions
          </div>
        </div>

        <span
          style={{
            display: "inline-block",
            alignSelf: "flex-start", // or "center"
            whiteSpace: "nowrap",
            lineHeight: 1,
            padding: "6px 10px",
            borderRadius: 14,
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            background: data?.submitted ? "#079444" : "#94752c",
          }}
        >
          {status}
        </span>
      </div>

      <div style={{ marginTop: 10 }}>
        <b>Last Updated:</b> {formatDate(data?.updatedAt)}
      </div>

      {data?.submitted ? (
        <div style={{ marginTop: 10 }}>
          <b>Score:</b> {correct}/{total} &nbsp;|&nbsp; <b>Wrong:</b> {wrong}
          &nbsp;|&nbsp; <b>Unanswered:</b> {unanswered}
        </div>
      ) : (
        <div style={{ marginTop: 10, opacity: 0.85 }}>
          <b>Time Left:</b>{" "}
          {typeof data?.timeLeft === "number"
            ? `${Math.floor(data.timeLeft / 60)}m ${data.timeLeft % 60}s`
            : "-"}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button
          onClick={() =>
            navigate(`/interview/${category}`, {
              state: { attemptId: data.attemptId },
            })
          }
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "#4f46e5",
            color: "#fff",
            fontWeight: 700,
            flex: 1,
          }}
        >
          {data?.submitted ? "View" : "Resume"}
        </button>
      </div>
    </div>
  );
}

const getAttempts = () =>
  Object.keys(localStorage)
    .filter((k) => k.startsWith("interview_progress_"))
    .map((k) => JSON.parse(localStorage.getItem(k)))
    .filter(Boolean);

const calcStats = (attempts) => {
  const ongoing = attempts.filter((a) => a.submitted === false);
  const completed = attempts.filter((a) => a.submitted === true && a.result);

  // Success rate = avg score %
  const avgScore =
    completed.length === 0
      ? 0
      : Math.round(
          completed.reduce((sum, a) => {
            const total = a.result.total || 0;
            if (!total) return sum;
            return sum + (a.result.correct / total) * 100;
          }, 0) / completed.length,
        );

  // total practice time in minutes (spent = config.time - timeLeft)
  const totalMinutes = attempts.reduce((sum, a) => {
    const totalSec = Number(a?.config?.time || 0) * 60;
    const leftSec = typeof a?.timeLeft === "number" ? a.timeLeft : totalSec;
    const spentSec = Math.max(0, totalSec - leftSec);
    return sum + spentSec / 60;
  }, 0);

  return {
    ongoingCount: ongoing.length,
    completedCount: completed.length,
    successRate: avgScore, // %
    totalPracticeMinutes: Math.round(totalMinutes),
  };
};
export default function Dashboard() {
  const [items, setItems] = useState([]);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    ongoingCount: 0,
    completedCount: 0,
    successRate: 0,
    totalPracticeMinutes: 0,
  });

  useEffect(() => {
    const attempts = getAttempts();
    setStats(calcStats(attempts));
  }, []);

  const onDelete = (attemptId) => {
    localStorage.removeItem(`interview_progress_${attemptId}`);

    const last = localStorage.getItem("lastInterviewAttemptId");
    if (last === attemptId) localStorage.removeItem("lastInterviewAttemptId");

    setItems((prev) => prev.filter((x) => x.attemptId !== attemptId));
  };

  {
    items.length === 0 ? (
      <p>No interviews found.</p>
    ) : (
      <>{/* your full dashboard UI */}</>
    );
  }

  const handleNavigate = () => {
    navigate("/prep");
  };

  return (
    <section>
      <article className="bubbleBg">
        <div className="dashboardDiv">
          <div className="dashboardImgWrap">
            <img src={Img1} alt="" className="dashboardImg" />
          </div>
          <div>
            <h2 className="dashboardH2">{username || "Guest"}</h2>
            <p className="dashboardP">
              One interview a day can change your whole career.
            </p>
          </div>
        </div>
        <div className="imgGlow">
          <img src={Img2} alt="" className="dashboardImg2" />
        </div>
      </article>
      <article className="dashboardArticle2">
        <div className="dashboardArticle2Div">
          <h2>On Going Interviews</h2>
          <div className="dashboardArticle2Div1Div">
            <button className="dashboardArticle2Div1Button">
              <Clock size={34} />
            </button>
            <h1>{stats.ongoingCount}</h1>
          </div>
        </div>
        <div className="dashboardArticle2Div">
          <h2>Completed Interviews</h2>
          <div className="dashboardArticle2Div1Div">
            <button className="dashboardArticle2Div1Button">
              <CircleCheckBig size={34} />
            </button>
            <h1>{stats.completedCount}</h1>
          </div>
        </div>
        <div className="dashboardArticle2Div">
          <h2>Success Rate</h2>
          <div className="dashboardArticle2Div1Div">
            <button className="dashboardArticle2Div1Button">
              <Star size={34} />
            </button>
            <h1>{stats.successRate}%</h1>
          </div>
        </div>
        <div className="dashboardArticle2Div">
          <h2>Total Practice Time</h2>
          <div className="dashboardArticle2Div1Div">
            <button className="dashboardArticle2Div1Button">
              <Timer size={34} />
            </button>
            <h1>{stats.totalPracticeMinutes}&nbsp;min</h1>
          </div>
        </div>
      </article>
      <article className="dashboardArticle3">
        <h2>
          Continue Your Practice <span>&rarr;</span>
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "43px",
          }}
        >
          {items.map((it) => (
            <InterviewCard key={it.attemptId} data={it} onDelete={onDelete} />
          ))}
        </div>
      </article>
      <article className="dashboardArticle4">
        <ChartRepresent />
      </article>
      <article
        className="dashboardArticle5"
        style={{
          backgroundImage: `url(${Img3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "14px",
          padding: "10px",
        }}
      >
        <div className="dashboardArticle5Div">
          <h2 style={{ fontSize: "40px" }} >Start the Preparation Buddy!</h2>
          <p className="dashboardArticle5DivH4" style={{ fontSize: "18px", fontWeight: "bold" }} >
            Be clear about what you want for your career. <br />
            Get ready to face interviews—we’re here to help you.
          </p>
          <h4 className="dashboardArticle5DivH4" style={{ fontSize: "15px" }}>Are You Still Waiting?</h4>
          <h4 className="dashboardArticle5DivH4" style={{ fontSize: "10px" }}>Click on Right Side Button</h4>
        </div>
        <div>
          <button className="preparationButton" onClick={handleNavigate}>
            Let's Start
          </button>
        </div>
      </article>
    </section>
  );
}
