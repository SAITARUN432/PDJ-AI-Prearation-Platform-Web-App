import Img1 from "../assets/hr.png";
import Img2 from "../assets/Medium.png";
import Img3 from "../assets/Hard.png";
import { useNavigate } from "react-router-dom";

function Hr() {
  const navigate = useNavigate();

  const startInterview = (card) => {
    const config = { ...card, category: "hr" };

    localStorage.setItem("interviewConfig", JSON.stringify(config));
    navigate("/interview/hr", { state: { config } });
  };

  const cards = [
    {
      id: 1,
      title: "Interview with Hr",
      mode: "Basic",
      time: 10,
      questionCount: 25,
      img: Img1,
    },
    {
      id: 2,
      title: "Interview with Hr",
      mode: "Basic",
      time: 20,
      questionCount: 40,
      img: Img1,
    },
    {
      id: 3,
      title: "Interview with Hr",
      mode: "Basic",
      time: 30,
      questionCount: 60,
      img: Img1,
    },

    {
      id: 4,
      title: "Interview with Hr",
      mode: "Medium",
      time: 10,
      questionCount: 25,
      img: Img2,
    },
    {
      id: 5,
      title: "Interview with Hr",
      mode: "Medium",
      time: 20,
      questionCount: 40,
      img: Img2,
    },
    {
      id: 6,
      title: "Interview with Hr",
      mode: "Medium",
      time: 30,
      questionCount: 60,
      img: Img2,
    },

    {
      id: 7,
      title: "Interview with Hr",
      mode: "Hard",
      time: 10,
      questionCount: 25,
      img: Img3,
    },
    {
      id: 8,
      title: "Interview with Hr",
      mode: "Hard",
      time: 20,
      questionCount: 40,
      img: Img3,
    },
    {
      id: 9,
      title: "Interview with Hr",
      mode: "Hard",
      time: 30,
      questionCount: 60,
      img: Img3,
    },
  ];

  return (
    <section className="interviewSection">
      {cards.map((card) => (
        <article className="interviewSectionArticle" key={card.id}>
          <img
            src={card.img}
            alt={card.title}
            className="interviewSectionImg"
          />
          <div className="interviewSectionDiv">
            <h3 className="interviewSectionDivH3">{card.title}</h3>
            <p className="interviewSectionDivp">
              {`${card.mode} | ${card.time} Minutes | ${card.questionCount} Questions `}
            </p>
            <button
              onClick={() => startInterview(card)}
              className="interviewSectionStartButton"
            >
              Let's Start
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
export default Hr;
