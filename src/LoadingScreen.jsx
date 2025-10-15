import React, { useEffect, useState } from "react";
import "./LoadingScreen.css"; // styl animacji
import logo from "./assets/logo.png"; // dostosuj ścieżkę jeśli jesteś głębiej

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-pop" />
        <p className="loading-text">Ładowanie Waltera...</p>
      </div>
    </div>
  );
};

 useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish(); // powiadom rodzica że animacja się skończyła
    }, 2000); // 2 sekundy

    return () => clearTimeout(timer);
  }, [onFinish]);


export default LoadingScreen;
