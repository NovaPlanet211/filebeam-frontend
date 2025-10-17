import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css"; // upewnij się, że to wskazuje na plik z Twoim CSS-em

export default function AdminPanel() {
  const [adminPassword, setAdminPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [files, setFiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const backendUrl = "https://filebeam-backend-yqrd.onrender.com";
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/users`, {
        headers: { "x-admin-password": adminPassword }
      });
      setUsers(res.data);
      setIsLoggedIn(true);
    } catch {
      alert("Błędne hasło lub brak dostępu");
      setUsers([]);
      setIsLoggedIn(false);
    }
  }, [adminPassword]);

  const fetchPendingUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/pending-users`, {
        headers: { "x-admin-password": adminPassword }
      });
      setPendingUsers(res.data);
    } catch {
      console.error("Nie udało się pobrać kont oczekujących");
    }
  }, [adminPassword]);

  const fetchFiles = async (userId) => {
    setSelectedUser(userId);
    try {
      const res = await axios.get(`${backendUrl}/files/${userId}?viewer=${userId}`);
      setFiles(res.data);
    } catch {
      setFiles([]);
    }
  };

  const handleDeleteFile = async (fileName) => {
    try {
      await axios.delete(`${backendUrl}/files/${selectedUser}/${fileName}`);
      fetchFiles(selectedUser);
    } catch {
      alert("Błąd przy usuwaniu pliku");
    }
  };

  const handleDeleteUser = async (usernameParam) => {
    const username = usernameParam || selectedUser;
    if (!username) return;
    const confirmDelete = window.confirm(`Na pewno chcesz usunąć użytkownika "${username}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/admin/users/${username}`, {
        headers: { "x-admin-password": adminPassword }
      });
      alert("Użytkownik usunięty");
      fetchUsers();
      fetchPendingUsers();
      if (username === selectedUser) {
        setSelectedUser("");
        setFiles([]);
      }
    } catch {
      alert("Błąd przy usuwaniu użytkownika");
    }
  };

  const handleApproveUser = async (username) => {
    try {
      await axios.post(`${backendUrl}/admin/approve/${username}`, null, {
        headers: { "x-admin-password": adminPassword }
      });
      alert(`Zatwierdzono konto: ${username}`);
      fetchPendingUsers();
      fetchUsers();
    } catch {
      alert("Nie udało się zatwierdzić konta");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setUsers([]);
    setPendingUsers([]);
    setSelectedUser("");
    setFiles([]);
    navigate("/");
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchPendingUsers();
      fetchUsers();
    }
  }, [isLoggedIn, fetchPendingUsers, fetchUsers]);

  return (
    <div className="admin-panel">
      {/* Pasek górny */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h2>🛡️ Panel administratora</h2>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              padding: 6
            }}
            aria-label="menu"
          >
            ☰
          </button>

          {menuOpen && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "110%",
              backgroundColor: "rgba(51,51,51,0.95)",
              border: "1px solid rgba(68,68,68,0.6)",
              borderRadius: 8,
              overflow: "hidden",
              minWidth: 160,
              zIndex: 20
            }}>
              <button
                onClick={() => { navigate("/"); setMenuOpen(false); }}
                style={menuItemStyle}
              >
                🏠 Powrót
              </button>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={menuItemStyle}
              >
                🔓 Wyloguj
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logowanie admina */}
      {!isLoggedIn && (
        <>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Hasło administratora"
          />
          <button onClick={fetchUsers}>Zaloguj</button>
        </>
      )}

      {/* Zawartość panelu */}
      {isLoggedIn && (
        <>
          <h3 style={{ marginTop: 18 }}>👥 Wybierz użytkownika:</h3>
          <select
            onChange={(e) => fetchFiles(e.target.value)}
            value={selectedUser}
            className="user-dropdown"
          >
            <option value="">-- wybierz --</option>
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>

          {selectedUser && (
            <>
              <h3 style={{ marginTop: 18 }}>📄 Pliki użytkownika: {selectedUser}</h3>
              <div style={{ marginBottom: 10 }}>
                <button onClick={() => handleDeleteUser()} className="fade-button">🗑️ Usuń użytkownika</button>
              </div>

              {files.length === 0 ? (
                <p>Brak plików</p>
              ) : (
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "60%" }}>{file}</span>
                      <div>
                        <a href={`${backendUrl}/files/${selectedUser}/${file}`} download>
                          <button className="fade-button">Pobierz</button>
                        </a>
                        <button onClick={() => handleDeleteFile(file)} className="fade-button">Usuń</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <h3 style={{ marginTop: 24 }}>⏳ Konta oczekujące na zatwierdzenie:</h3>
          {pendingUsers.length === 0 ? (
            <p>Brak kont do zatwierdzenia</p>
          ) : (
            <ul>
              {pendingUsers.map((user) => (
                <li key={user}>
                  <strong>{user}</strong>
                  <div>
                    <button onClick={() => handleApproveUser(user)} className="fade-button">✅ Zatwierdź</button>
                    <button onClick={() => handleDeleteUser(user)} className="fade-button" style={{ marginLeft: 8 }}>🗑️ Usuń</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

const menuItemStyle = {
  display: "block",
  width: "100%",
  padding: "10px 16px",
  background: "none",
  border: "none",
  color: "#fff",
  textAlign: "left",
  cursor: "pointer",
  borderBottom: "1px solid rgba(68,68,68,0.4)"
};
