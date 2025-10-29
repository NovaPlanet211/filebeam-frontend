import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";
import logo from "./assets/logo.png";

const LoadingScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (typeof onFinish === "function") {
        onFinish(); 
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="loading-screen">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-pop" />
      </div>
    </div>
  );
};

export default LoadingScreen;
