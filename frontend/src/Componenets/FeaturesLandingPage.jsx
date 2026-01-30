import React from "react";
import { useNavigate } from "react-router-dom";
import "../Cssfiles/FeaturesLandingPage.css";

export default function FeaturesLanding() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Practice Pods",
      points: ["Frontend, Backend, HR", "Basic / Medium / Hard levels"],
    },
    {
      title: "Timed MCQ Flow",
      points: ["Pick config → Start → Timer", "Submit / Auto-submit on timeout"],
    },
    {
      title: "Huge Question Bank",
      points: ["9 JSON banks (category × level)", "Random questions by questionCount"],
    },
    {
      title: "Smart Evaluation",
      points: ["Compares option index with answerIndex", "Shows correct answer + explanation"],
    },
    {
      title: "Save & Resume",
      points: ["Saves attempt in localStorage", "Resume later with timeLeft"],
    },
    {
      title: "Recent Interviews",
      points: ["Attempts list", "Resume/View + Delete"],
    },
    {
      title: "Dashboard Analytics",
      points: ["Stats cards + practice time", "Score Trend (Chart.js)"],
    },
    {
      title: "Preparation Sheet",
      points: ["Search + filters", "Pagination + debounce"],
    },
  ];

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page">
      {/* Top Nav */}
      <header className="nav">
        <div className="nav__brand">PDJ AI Mock Interview</div>
        <div className="nav__actions">
          <button className="btn btn--ghost" onClick={scrollToFeatures}>
            Explore Features
          </button>
          <button className="btn btn--primary" onClick={() => navigate("/signin")}>
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero__left">
          <h1>AI Mock Interview Practice Platform</h1>
          <p className="muted">
            Frontend • Backend • HR | Basic • Medium • Hard | Timed MCQ practice with
            evaluation, resume, and analytics.
          </p>

          <div className="hero__cta">
            <button className="btn btn--primary" onClick={() => navigate("/signin")}>
              Sign in to access all features
            </button>
            <button className="btn btn--ghost" onClick={scrollToFeatures}>
              View features
            </button>
          </div>

          <div className="badges">
            <span className="badge">Objective MCQ</span>
            <span className="badge">Timer</span>
            <span className="badge">LocalStorage Resume</span>
            <span className="badge">Chart.js Dashboard</span>
          </div>
        </div>

        {/* Locked Preview */}
        <div className="hero__right">
          <div className="card preview">
            <div className="preview__top">
              <div className="preview__title">Quick Setup (Locked)</div>
              <div className="chip chip--lock">Sign in required</div>
            </div>

            <div className="preview__row">
              <label>Category</label>
              <div className="seg">
                <span className="seg__item active">Frontend</span>
                <span className="seg__item">Backend</span>
                <span className="seg__item">HR</span>
              </div>
            </div>

            <div className="preview__row">
              <label>Level</label>
              <div className="seg">
                <span className="seg__item active">Basic</span>
                <span className="seg__item">Medium</span>
                <span className="seg__item">Hard</span>
              </div>
            </div>

            <div className="preview__row">
              <label>Time</label>
              <div className="seg">
                <span className="seg__item active">10 min</span>
                <span className="seg__item">20 min</span>
                <span className="seg__item">30 min</span>
              </div>
            </div>

            <button className="btn btn--disabled" disabled>
              Start Interview (Sign in)
            </button>

            <div className="preview__note muted">
              This is a preview. Sign in to start and save interviews.
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div className="section__head">
          <h2>Website Features</h2>
          <p className="muted">
            Everything you need for real interview-style practice, from question banks
            to analytics.
          </p>
        </div>

        <div className="grid">
          {features.map((f) => (
            <div key={f.title} className="card feature">
              <h3>{f.title}</h3>
              <ul>
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section section--alt">
        <div className="section__head">
          <h2>How it works</h2>
        </div>

        <div className="steps">
          <div className="card step">
            <div className="step__num">1</div>
            <div>
              <h3>Choose Setup</h3>
              <p className="muted">Select Category, Level, and Time (10/20/30 mins).</p>
            </div>
          </div>
          <div className="card step">
            <div className="step__num">2</div>
            <div>
              <h3>Attempt MCQs</h3>
              <p className="muted">Timer runs. Submit anytime or auto-submit on timeout.</p>
            </div>
          </div>
          <div className="card step">
            <div className="step__num">3</div>
            <div>
              <h3>Review & Track</h3>
              <p className="muted">See answers + explanations and track trends on dashboard.</p>
            </div>
          </div>
        </div>

        <div className="ctaStrip">
          <div>
            <h3>Ready to practice?</h3>
            <p className="muted">Sign in to access questions, resume attempts, and analytics.</p>
          </div>
          <button className="btn btn--primary" onClick={() => navigate("/signin")}>
            Sign in
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="muted">© {new Date().getFullYear()} PDJ AI Mock Interview</div>
      </footer>
    </div>
  );
}
