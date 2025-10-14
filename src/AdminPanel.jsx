import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [adminPassword, setAdminPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [files, setFiles] = useState([]);
  const backendUrl = "https://filebeam-backend-yqrd.onrender.com";

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/users`, {
        headers: { "x-admin-password": adminPassword }
      });
      setUsers(res.data);
    } catch {
      alert("Błędne hasło lub brak dostępu");
    }
  }, [adminPassword]);

  useEffect(() => {
    if (adminPassword) fetchUsers();
  }, [fetchUsers]);

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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🛠️ Panel administratora</h2>

      <input
        type="password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        placeholder="Hasło administratora"
      />
      <button onClick={fetchUsers}>Zaloguj</button>

      {users.length > 0 && (
        <>
          <h3>👥 Wybierz użytkownika:</h3>
          <select onChange={(e) => fetchFiles(e.target.value)} value={selectedUser}>
            <option value="">-- wybierz --</option>
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </>
      )}

      {selectedUser && (
        <>
          <h3>📄 Pliki użytkownika: {selectedUser}</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file}
                <a href={`${backendUrl}/files/${selectedUser}/${file}`} download>
                  <button>Pobierz</button>
                </a>
                <button onClick={() => handleDeleteFile(file)}>Usuń</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
