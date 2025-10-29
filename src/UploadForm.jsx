import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./UploadForm.css";
import "./AdminPanel.jsx";
  
export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRegister, setShowRegister] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [accountType, setAccountType] = useState("standardowe");
  const [verificationCode, setVerificationCode] = useState("");

  const backendUrl = "https://filebeam-backend-yqrd.onrender.com";

  const handleUpload = async () => {
    if (!file || !userId) return alert("Wybierz plik i użytkownika");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/upload/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Plik wysłany!");
      setFile(null);
      fetchFiles();
    } catch {
      alert("Błąd przy wysyłaniu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`${backendUrl}/files/${userId}/${fileName}`);
      alert("Plik usunięty!");
      fetchFiles();
    } catch {
      alert("Nie udało się usunąć pliku");
    }
  };

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) return alert("Podaj login i hasło");
    try {
      const res = await axios.post(`${backendUrl}/login`, {
        username: loginUsername,
        password: loginPassword,
      });
      if (res.status === 200) {
        setUserId(loginUsername);
        setIsLoggedIn(true);
        localStorage.setItem("userId", loginUsername);
        localStorage.setItem("isLoggedIn", "true");
        setLoginUsername("");
        setLoginPassword("");
        closeModalSmooth(setShowLogin);
        fetchFiles();
        alert("Zalogowano");
      } else {
        alert("Błąd logowania");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Nieprawidłowy login lub hasło");
      } else {
        alert("Nie udało się zalogować");
      }
    }
  };

  const handleRegister = async () => {
  if (!newLogin) return alert("Podaj login");
  if (accountType !== "anonimowe" && !newPassword) return alert("Podaj hasło");
  if (accountType === "zatwierdzane" && verificationCode.length !== 4) return alert("Podaj 4-cyfrowy kod");

  try {
    const res = await axios.post(`${backendUrl}/register`, {
      username: newLogin,
      password: accountType !== "anonimowe" ? newPassword : undefined,
      accountType,
      verificationCode: accountType === "zatwierdzane" ? verificationCode : undefined,
    });

    if (res.status === 200 || res.status === 201) {
      setUserId(newLogin);
      setIsLoggedIn(true);
      localStorage.setItem("userId", newLogin);
      localStorage.setItem("isLoggedIn", "true");
      setNewLogin("");
      setNewPassword("");
      setVerificationCode("");
      closeModalSmooth(setShowRegister);
      fetchSuggestedUsers();
      fetchFiles();
      alert("Użytkownik zarejestrowany!");
    } else {
      alert("Błąd rejestracji");
    }
  } catch (err) {
    if (err.response?.status === 409) {
      alert("Taki użytkownik już istnieje");
    } else {
      alert("Nie udało się zarejestrować");
    }
  }
};

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    setUserId("");
    setIsLoggedIn(false);
    setShowRegister(true);
    setFiles([]);
  };

  const fetchFiles = useCallback(async () => {
    if (!userId) {
      setFiles([]);
      return;
    }
    try {
      const res = await axios.get(`${backendUrl}/files/${userId}`);
      setFiles(res.data || []);
    } catch {
      console.error("Błąd przy pobieraniu plików");
    }
  }, [userId]);

  const fetchSuggestedUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/users`, {
        headers: { "x-admin-password": "BadMojo2008" },
      });
      setSuggestedUsers(res.data || []);
    } catch {
      console.error("Nie udało się pobrać użytkowników");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedUser && storedLogin === "true") {
      setUserId(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (userId) fetchFiles();
  }, [fetchFiles, userId]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const closeModalSmooth = (setter) => {
    setModalClosing(true);
    setTimeout(() => {
      setter(false);
      setModalClosing(false);
    }, 240);
  };

  return (
    <div className="main-content">
      {!isLoggedIn ? (
        <>
        {showRegister && (
  <div className="register-overlay">
    <div className={`register-content ${modalClosing ? "closing" : ""}`}>
      <button className="close-btn" onClick={() => closeModalSmooth(setShowRegister)}>✕</button>
      <h2 style={{ fontSize: "clamp(18px, 2.4vw, 22px)" }}> Rejestracja użytkownika </h2>

      <label style={{ display: "block", marginTop: 12 }}>
        Rodzaj konta :   
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          style={{ marginTop: 6, padding: 8, borderRadius: 6 }}
        >
          <option value="anonimowe"> Amon </option>
          <option value="standardowe"> Klasyczne </option>
          <option value="zatwierdzane"> Zweryfikowane (z kodem)</option>
        </select>
      </label>

      <input
        type="text"
        value={newLogin}
        onChange={(e) => setNewLogin(e.target.value)}
        placeholder="Login"
      />

      {accountType !== "anonimowe" && (
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Hasło"
        />
      )}

      {accountType === "zatwierdzane" && (
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Kod weryfikacyjny (4 cyfry)"
          maxLength={4}
        />
      )}

      <button onClick={handleRegister}> Zarejestruj </button>
    </div>
  </div>
)}
  


          {showLogin && (
            <div className="register-overlay">
              <div className={`register-content ${modalClosing ? "closing" : ""}`}>
                <button className="close-btn" onClick={() => closeModalSmooth(setShowLogin)}>
                  ✕
                </button>
                <h2 style={{ fontSize: "clamp(18px, 2.4vw, 22px)" }}>Logowanie</h2>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Login"
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Hasło"
                />
                <button onClick={handleLogin}>Zaloguj</button>
              </div>
            </div>
          )}

          <div className="upload-form">
            <div
              className="toggle-buttons"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <button onClick={() => setShowRegister(true)}>Rejestracja</button>
              <button onClick={() => setShowLogin(true)}>Logowanie</button>
              <a href="#/admin">
            <button style={{ backgroundColor: "#f5084f", marginTop: 20, color: "#9a10f7ff" }}>
              Przejdź do panelu admina
            </button>
          </a>
            </div>
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Zarejestruj się lub zaloguj, aby przesyłać pliki
            </p>
          </div>
        </>
      ) : (
        <div className={`upload-form ${darkMode ? "dark" : ""}`}>
          <div
            className="theme-toggle"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <button onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? "Tryb jasny" : "Tryb ciemny"}
            </button>
            <button onClick={handleLogout}>Wyloguj</button>
          </div>

          <h2 style={{ fontSize: "clamp(18px, 2.2vw, 28px)", textAlign: "center" }}>
            <span className="rainbow-text">Mr. ERROR</span>
          </h2>

          <p style={{ marginTop: 10, fontWeight: "bold", color: darkMode ? "#dff" : undefined }}>
            👤 Zalogowany jako: <span style={{ color: "#ff0000ff" }}>{userId}</span>
          </p>

          <div
            className="toggle-buttons"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <button onClick={() => setShowSuggestions((prev) => !prev)}>👥 Użytkownicy</button>
          </div>

          {showSuggestions && (
            <>
              <h3 style={{ marginTop: 8 }}>👥 Wybierz istniejącego użytkownika:</h3>
              <div className="suggestions" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                {suggestedUsers.map((user) => (
                  <button key={user} onClick={() => setUserId(user)}>
                    {user}
                  </button>
                ))}
              </div>
            </>
          )}

          <input
            type="file"
            onChange={(e) => setFile(e.target.files && e.target.files[0])}
            style={{ display: "block", marginTop: 12 }}
          />
          <button onClick={handleUpload} disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Wysyłanie..." : "Wyślij"}
          </button>

          <h3 style={{ marginTop: 18 }}>📄 Pliki użytkownika 📄: {userId}</h3>
          <ul className="files-list" style={{ padding: 0, marginTop: 12 }}>
            {files.map((fileName, index) => {
              const fileUrl = `${backendUrl}/files/${userId}/${fileName}`;
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
              return (
                <li
                  key={index}
                  className="file-item"
                  style={{
                    listStyle: "none",
                    padding: 12,
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    className="file-info"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <span className="file-name" style={{ wordBreak: "break-word", color: darkMode ? "#fff" : "#333" }}>
                      {fileName}
                    </span>
                    {isImage && (
                      <img
                        src={fileUrl}
                        alt={fileName}
                        className="preview"
                        style={{ maxWidth: "100%", height: "auto", borderRadius: 8, marginTop: 8 }}
                      />
                    )}
                  </div>

                  <div
                    className="file-actions"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      justifyContent: "center",
                      marginTop: 6,
                    }}
                  >
                    <a href={fileUrl} download>
                      <button className="btn-download">Pobierz</button>
                    </a>
                    <button className="btn-delete" onClick={() => handleDelete(fileName)}>
                      Usuń
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <a href="#/admin">
            <button style={{ backgroundColor: "#f5084f", marginTop: 20, color: "#9a10f7ff" }}>
              Przejdź do panelu admina
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
