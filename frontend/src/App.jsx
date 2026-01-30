import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import InterviewSection from "./Componenets/InterviewSection";
import Frontend from "./Componenets/Frontend";
import Backend from "./Componenets/Backend";
import Hr from "./Componenets/Hr";
import InterviewStart from "./Componenets/InterviewStart";
import RecentInterviews from "./Componenets/RecentInterviews";
import Dashboard from "./Componenets/Dashboard";
import ChartRepresent from "./Componenets/ChartRepresent";
import PreparationSheet from "./Componenets/PreparationSheet";
import FeaturesLanding from "./Componenets/FeaturesLandingPage";
import SignUpWithEmail from "./Componenets/SignUpWithEmail";
import PrivateComponent from "./Componenets/PrivateComponent";
import LandingPage from "./Componenets/LandingPage";
import Layout from "./Componenets/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateComponent />}>
          <Route element={<Layout />}>
            <Route path="/prep" element={<PreparationSheet />} />
            <Route path="/recent-interviews" element={<RecentInterviews />} />
            <Route path="/chart" element={<ChartRepresent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interviewStart" element={<InterviewStart />} />
            <Route path="/interview/:category" element={<InterviewStart />} />
            <Route path="/ais" element={<InterviewSection />}>
              <Route index element={<Frontend />} />
              <Route path="backend" element={<Backend />} />
              <Route path="hr" element={<Hr />} />
            </Route>
          </Route>
        </Route>
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/signin" element={<LandingPage />} />
        <Route path="/" element={<FeaturesLanding />} />
        <Route path="/signUpWithEmail" element={<SignUpWithEmail />} />
      </Routes>
    </>
  );
}

export default App;
