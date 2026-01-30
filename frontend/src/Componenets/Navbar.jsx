import "../Cssfiles/Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import Img1 from "../assets/Logo.png";
import { Navigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const signOut = () => {
    localStorage.removeItem("token");
    navigate("/");
    alert("Logged Out!");
  };
  const closeMenu = () => setOpen(false);
  return (
    <nav className="navbar">
      {/* ✅ mobile menu button only */}
      <button
        className="menuBtn"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <img src={Img1} alt=""className="navbarImageMenu" />
      </button>
      <div className="logo" data-tip="Ai Practice Developer Job">
        <img src={Img1} alt="" className="navbarLogo" />
      </div>

      <div className="navLinks">
        <NavLink
          to="/dashboard"
          className="nav-link"
          data-tip="Go to Landing page"
        >
          Home
        </NavLink>
        <NavLink
          to="/ais"
          className="nav-link"
          data-tip="AI Interview's Section"
        >
          AI-INT
        </NavLink>
        <NavLink
          to="/recent-interviews"
          className="nav-link"
          data-tip="Resumed Interview's Section"
        >
          RD-INT
        </NavLink>
      </div>

      <div className="navActions">
        <button className="navbarButton" onClick={signOut}>
          Sign Out
        </button>
      </div>

      {/* ✅ mobile dropdown */}
      {open && (
        <div className="mobileMenu">
          <NavLink to="/dashboard" className="mobileLink" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/ais" className="mobileLink" onClick={closeMenu}>
            AI-INT
          </NavLink>
          <NavLink
            to="/recent-interviews"
            className="mobileLink"
            onClick={closeMenu}
          >
            RD-INT
          </NavLink>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
