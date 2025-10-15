import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";
import logo from "./assets/logo.png";

const LoadingScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (typeof onFinish === "function") {
        onFinish(); // powiadom rodzica że animacja się skończyła
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="loading-screen">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-pop" />
        <p className="loading-text">Ładowanie Waltera...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
