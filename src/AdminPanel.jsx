import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    await axios.delete(`${backendUrl}/files/${selectedUser}/${fileName}`);
    fetchFiles(selectedUser);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const confirmDelete = window.confirm(`Na pewno chcesz usunąć użytkownika "${selectedUser}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/admin/users/${selectedUser}`, {
        headers: { "x-admin-password": adminPassword }
      });
      alert("Użytkownik usunięty");
      fetchUsers();
      fetchPendingUsers();
      setSelectedUser("");
      setFiles([]);
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
    }
  }, [isLoggedIn, fetchPendingUsers]);

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      {/* Pasek górny */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#222",
        color: "#fff",
        padding: "12px 20px"
      }}>
        <h2 style={{ margin: 0 }}>🛡️ Panel administratora</h2>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            ☰
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "100%",
              backgroundColor: "#333",
              border: "1px solid #444",
              borderRadius: "4px",
              overflow: "hidden",
              minWidth: "160px"
            }}>
              <button onClick={() => navigate("/")} style={menuItemStyle}>🏠 Powrót do głównej</button>
              <button onClick={handleLogout} style={menuItemStyle}>🔓 Wyloguj</button>
            </div>
          )}
        </div>
      </div>

      {/* Zawartość */}
      <div style={{ padding: "20px" }}>
        {!isLoggedIn && (
          <>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Hasło administratora"
              style={{ marginRight: "10px", padding: "6px" }}
            />
            <button onClick={fetchUsers} style={{ padding: "6px 12px" }}>Zaloguj</button>
          </>
        )}

        {isLoggedIn && (
          <>
            <h3 style={{ marginTop: "20px" }}>👥 Wybierz użytkownika:</h3>
            <select onChange={(e) => fetchFiles(e.target.value)} value={selectedUser}>
              <option value="">-- wybierz --</option>
              {users.map((user) => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>

            {selectedUser && (
              <>
                <h3 style={{ marginTop: "20px" }}>📄 Pliki użytkownika: {selectedUser}</h3>
                <button
                  onClick={handleDeleteUser}
                  style={{ marginBottom: "10px", backgroundColor: "#f44336", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px" }}
                >
                  🗑️ Usuń użytkownika
                </button>
                {files.length === 0 ? (
                  <p>Brak plików</p>
                ) : (
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>
                        {file}
                        <a href={`${backendUrl}/files/${selectedUser}/${file}`} download>
                          <button style={{ marginLeft: "10px" }}>Pobierz</button>
                        </a>
                        <button onClick={() => handleDeleteFile(file)} style={{ marginLeft: "5px" }}>
                          Usuń
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            <h3 style={{ marginTop: "30px" }}>⏳ Konta oczekujące na zatwierdzenie:</h3>
            {pendingUsers.length === 0 ? (
              <p>Brak kont do zatwierdzenia</p>
            ) : (
              <ul>
                {pendingUsers.map((user) => (
                  <li key={user} style={{ marginBottom: "10px" }}>
                    <strong>{user}</strong>
                    <button onClick={() => handleApproveUser(user)} style={{ marginLeft: "10px" }}>
                      ✅ Zatwierdź
                    </button>
                    <button onClick={() => {
                      setSelectedUser(user);
                      handleDeleteUser();
                    }} style={{ marginLeft: "5px", backgroundColor: "#f44336", color: "#fff" }}>
                      🗑️ Usuń
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
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
  borderBottom: "1px solid #444"
};
