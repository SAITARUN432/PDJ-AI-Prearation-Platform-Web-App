import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { color } from "chart.js/helpers";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

export default function ScoreTrend() {
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const attempts = Object.keys(localStorage)
      .filter((k) => k.startsWith("interview_progress_"))
      .map((k) => JSON.parse(localStorage.getItem(k)))
      .filter((a) => a?.submitted === true && a?.result?.total)
      .sort((a, b) => a.updatedAt - b.updatedAt)
      .slice(-8);

    const newLabels = attempts.map((a) => {
      const d = new Date(a.updatedAt);

      const datePart = d.toLocaleDateString([], {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const timePart = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return [datePart, timePart]; // ✅ multiline tick
    });

    const newScores = attempts.map((a) =>
      Math.round((a.result.correct / a.result.total) * 100),
    );

    // console.log("attempts:", attempts);
    // console.log("newLabels:", newLabels);
    // console.log("newScores:", newScores);

    setLabels(newLabels);
    setScores(newScores);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Score %",
        data: scores,
        borderColor: "#6f31d9", // line color
        backgroundColor: "rgba(235, 235, 235, 0.15)",
        pointBackgroundColor: "#3B82F6", // dot color
        pointBorderColor: "#3B82F6",
        borderWidth: 3,
        pointRadius: 10, // bigger dot
        pointHoverRadius: 10,
        tension: 0.4,
        fill: false,
        showLine: scores.length > 1, // line only when 2+ points
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        titleFont: { size: 14, weight: "600", family: "Quicksand, sans-serif" }, // date text
        bodyFont: { size: 13 }, //score text
        padding: 12, // ✅ inside padding
        cornerRadius: 10, // ✅ rounded
        boxPadding: 6, // ✅ space between color box and text
        titleMarginBottom: 8,
        bodySpacing: 6,
        displayColors: true,
      },
      legend: { display: false },
    },
    layout: {
      padding: { bottom: 30 },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          padding: 10,
          font: { size: 14, family: "Quicksand, sans-serif", weight: "500" },
          color: "#f8f8f8",
        },
      },

      y: {
        min: 0,
        max: 100,
        ticks: {
          color: "#f8f8f8",
          font: { size: 16, family: "Quicksand, sans-serif", weight: "500" },
        }, // y text color
        grid: {
          color: "#242323", // ✅ vertical grid lines
          drawBorder: true,
          borderColor: "rgba(0,0,0,0.25)",
        }, // y grid
      },
    },
  };

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid #223",
        backgroundColor: "rgb(79, 70, 229)",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Score Graphical Represntation</h3>
      <div style={{ height: 480, width: "100%" }}>
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false, // IMPORTANT
            ...options,
          }}
        />
      </div>
    </div>
  );
}
