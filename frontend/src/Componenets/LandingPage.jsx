import Img1 from "../Assets/Img.png";
import { useNavigate } from "react-router-dom";
import "../App.css";

function SignUp() {
  const navigate = useNavigate();
  return (
    <div className="landingAuthPage">
      <div className="landingAuthCard">
        <h1 className="landingAuthTitle">Hello Buddy 👋</h1>
        <p className="landingAuthSub">Please choose a sign in method</p>
        <button
          type="button"
          className="landingAuthBtn"
          onClick={() => navigate("/signUpWithEmail")}
        >
          Sign Up with Email
        </button>

        <p className="landingAuthHint">Secure OTP login • No password needed</p>
      </div>
    </div>
  );
}

export default SignUp;
