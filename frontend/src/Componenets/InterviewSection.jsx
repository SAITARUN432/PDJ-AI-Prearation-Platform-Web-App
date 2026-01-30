import { Outlet, NavLink } from "react-router-dom";
import "../Cssfiles/InterviewSection.css";

function InterviewSection() {
  return (
    <>
      <section>
        <nav className="navbarinInterview">
          <div className="navbarinInterviewDiv1">
            <NavLink
              to="/ais"
              end
              className={({ isActive }) =>
                isActive
                  ? "interviewSectionLinks active"
                  : "interviewSectionLinks"
              }
            >
              Frontend
            </NavLink>
            <NavLink
              to="/ais/backend"
              className={({ isActive }) =>
                isActive
                  ? "interviewSectionLinks active"
                  : "interviewSectionLinks"
              }
            >
              Backend
            </NavLink>
            <NavLink
              to="/ais/hr"
              className={({ isActive }) =>
                isActive
                  ? "interviewSectionLinks active"
                  : "interviewSectionLinks"
              }
            >
              Hr
            </NavLink>
          </div>
        </nav>
      </section>

      <section className="interviewContent">
        <Outlet /> {/* renders below */}
      </section>
    </>
  );
}
export default InterviewSection;
