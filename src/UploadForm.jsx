import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./UploadForm.css";

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

  const backendUrl = "https://filebeam-backend-yqrd.onrender.com";

  const handleUpload = async () => {
    if (!file || !userId) return alert("Wybierz plik i użytkownika");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post(`${backendUrl}/upload/${userId}`, formData);
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
    if (!loginUsername || !loginPassword) {
      alert("Podaj login i hasło");
      return;
    }

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
        setShowLogin(false);
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
    if (!newLogin || !newPassword) {
      alert("Podaj login i hasło");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/register`, {
        username: newLogin,
        password: newPassword,
      });

      if (res.status === 200 || res.status === 201) {
        setUserId(newLogin);
        setIsLoggedIn(true);
        localStorage.setItem("userId", newLogin);
        localStorage.setItem("isLoggedIn", "true");
        setNewLogin("");
        setNewPassword("");
        setShowRegister(false);
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
      setFiles(res.data);
    } catch {
      console.error("Błąd przy pobieraniu plików");
    }
  }, [userId]);

  const fetchSuggestedUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/users`, {
        headers: { "x-admin-password": "BadMojo2008" },
      });
      setSuggestedUsers(res.data);
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

  return (
    <>
      {!isLoggedIn ? (
        <>
          {showRegister && (
            <div className="register-overlay">
              <div className="register-content">
                <button className="close-btn" onClick={() => setShowRegister(false)}>X</button>
                <h2>Rejestracja użytkownika</h2>
                <input
                  type="text"
                  value={newLogin}
                  onChange={(e) => setNewLogin(e.target.value)}
                  placeholder="Login"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Hasło"
                />
                <button onClick={handleRegister}>Zarejestruj</button>
              </div>
            </div>
          )}

          {showLogin && (
            <div className="register-overlay">
              <div className="register-content">
                <button className="close-btn" onClick={() => setShowLogin(false)}>X</button>
                <h2>Logowanie</h2>
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
            <div className="toggle-buttons">
              <button onClick={() => setShowRegister(true)}>Rejestracja</button>
              <button onClick={() => setShowLogin(true)}>Logowanie</button>
            </div>
            <p style={{ textAlign: "center", marginTop: "40px" }}>
              Zarejestruj się lub zaloguj, aby przesyłać pliki
            </p>
          </div>
        </>
      ) : (
        <div className={`upload-form ${darkMode ? "dark" : ""}`}>
          <div className="theme-toggle" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? "☀️ Tryb jasny" : "🌙 Tryb ciemny"}
            </button>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap:30 }}>
              Wyloguj
            </button>
          </div>

          <h2 className="neon-text">BIAŁY WŁODZIMIERZ</h2>

          <p style={{ marginTop: 10, fontWeight: "bold" }}>
            👤 Zalogowany jako: <span style={{ color: "#00e0ff" }}>{userId}</span>
          </p>

          <div className="toggle-buttons">
            <button onClick={() => setShowSuggestions((prev) => !prev)}>👥 Użytkownicy</button>
          </div>

          {showSuggestions && (
            <>
              <h3>👥 Wybierz istniejącego użytkownika:</h3>
              <div className="suggestions">
                {suggestedUsers.map((user) => (
                  <button key={user} onClick={() => setUserId(user)}>
                    {user}
                  </button>
                ))}
              </div>
            </>
          )}
          <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: "block", marginTop: 12 }} />

          <button onClick={handleUpload} disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Wysyłanie..." : "Wyślij"}
          </button>

          <h3 style={{ marginTop: 18 }}>📄 Pliki użytkownika 📄: {userId}</h3>
          <ul>
            {files.map((file, index) => {
              const fileUrl = `${backendUrl}/files/${userId}/${file}`;
              const isImage = /\.(jpg|jpeg|png)$/i.test(file);

              return (
                <li key={index}>
                  {file}
                  {isImage && <img src={fileUrl} alt={file} />}
                  <a href={fileUrl} download>
                    <button>Pobierz</button>
                  </a>
                  <button onClick={() => handleDelete(file)}>Usuń</button>
                </li>
              );
            })}
          </ul>

          <a href="#/admin">
            <button style={{ backgroundColor: "#f5084fff", marginTop: "30px" }}>
              Przejdź do panelu admina
            </button>
          </a>
        </div>
      )}
    </>
  );
}


