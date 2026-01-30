import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Img1 from "../assets/Gemini_Generated_Image_sv9m1m-removebg-preview.png"; // optional

function SignUpWithEmail() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const sendingRef = useRef(false);
  const timerRef = useRef(null);

  const startCooldown = (sec = 10) => {
    setCooldown(sec);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const sendEmailOtp = async () => {
    if (!email) return alert("Please enter email");
    if (sendingRef.current || cooldown > 0) return;

    sendingRef.current = true;
    setLoading(true);

    try {
      await axios.post(
        "https://application-holding-clean.onrender.com/send-email-otp",
        { email },
      );
      alert("OTP sent to your email!");
      setOtpSent(true);
      startCooldown(10);
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!otp) return alert("Please enter OTP");

    try {
      const res = await axios.post(
        "https://application-holding-clean.onrender.com/verify-otp",
        {
          email,
          otp,
        },
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);
      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid OTP or Expired!");
    }
  };

  return (
    <div className="emailAuthPage">
      <div className="emailAuthCard">
        <div className="emailAuthHeader">
          <h1 className="emailAuthTitle">Email Login</h1>
          <p className="emailAuthSub">
            {otpSent
              ? "Enter the OTP we sent to your email"
              : "Get an OTP on your email to continue"}
          </p>
        </div>

        <div className="emailAuthForm">
          {/* Username */}
          <label className="emailAuthLabel">Username</label>
          <input
            className="emailAuthInput"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {!otpSent ? (
            <>
              {/* Email */}
              <label className="emailAuthLabel">Email</label>
              <input
                className="emailAuthInput"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                className="emailAuthBtn"
                onClick={sendEmailOtp}
                disabled={loading || cooldown > 0 || !email}
              >
                {loading
                  ? "Sending..."
                  : cooldown > 0
                    ? `Wait ${cooldown}s`
                    : "Send OTP"}
              </button>

              <p className="emailAuthHint">
                By continuing, you agree to our terms & privacy policy.
              </p>
            </>
          ) : (
            <>
              {/* OTP */}
              <label className="emailAuthLabel">OTP</label>
              <input
                className="emailAuthInput"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button className="emailAuthBtn" onClick={verifyEmailOtp}>
                Verify OTP
              </button>

              <button
                className="emailAuthBtn emailAuthBtnSecondary"
                onClick={sendEmailOtp}
                disabled={loading || cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUpWithEmail;
