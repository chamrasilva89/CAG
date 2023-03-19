import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <nav style={{ backgroundColor: "#063970" }}>
    <div className="nav-wrapper">
      <Link to={"/"} className="brand-logo">
        Pronto XI ChatBot
      </Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li>
          <Link to={"/about"}>About us</Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default Header;
