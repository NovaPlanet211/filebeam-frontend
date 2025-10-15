import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [adminPassword, setAdminPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [files, setFiles] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const backendUrl = "https://filebeam-backend-yqrd.onrender.com";
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/users`, {
        headers: { "x-admin-password": adminPassword }
      });
      setUsers(res.data);
      setSelectedUser("");
      setFiles([]);
    } catch {
      alert("Błędne hasło lub brak dostępu");
      setUsers([]);
    }
  }, [adminPassword]);

  const fetchFiles = async (userId) => {
    setSelectedUser(userId);
    try {
      const res = await axios.get(`${backendUrl}/files/${userId}`);
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
    } catch {
      alert("Błąd przy usuwaniu użytkownika");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="admin-panel">
      <h2>Panel administratora</h2>

      <input
        type="password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        placeholder="Hasło administratora"
      />
      <button onClick={fetchUsers}>Zaloguj</button>
      <button onClick={handleGoHome} className="go-home-button">
        ⬅ Powrót do strony głównej
      </button>

      {users.length > 0 && (
        <>
          <button
            onClick={() => setShowUserList(!showUserList)}
            style={{
              fontSize: "28px",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
              color: "#fff"
            }}
            title="Kliknij, aby wybrać użytkownika"
          >
            👤
          </button>

          {showUserList && (
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
          )}
        </>
      )}

      {selectedUser && (
        <>
          <h3 style={{ marginTop: "20px" }}>📄 Pliki użytkownika: {selectedUser}</h3>
          <button
            onClick={handleDeleteUser}
            style={{
              marginBottom: "10px",
              backgroundColor: "#f44336",
              color: "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px"
            }}
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
    </div>
  );
}
