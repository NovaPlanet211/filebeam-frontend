import React, { useEffect, useState } from "react";
import "./LoadingScreen.css"; // styl animacji

const LoadingScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish(); // powiadom rodzica że animacja się skończyła
    }, 2000); // 2 sekundy

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="loading-screen">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo-spin" />
        <p className="loading-text">Ładowanie Waltera...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
