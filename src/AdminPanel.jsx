import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      setSelectedUser(""); 
      setFiles([]); 
    } catch {
      alert("Błędne hasło lub brak dostępu");
      setUsers([]);
    }
  }, [adminPassword]);


const AdminPanel = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    };
    navigate("/");
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🛠️ Panel administratora</h2>

      <input
        type="password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        placeholder="Hasło administratora"
        style={{ marginRight: "10px" }}
      />
     
      <button onClick={fetchUsers}>Zaloguj</button>

      {users.length > 0 && (
        <>
          <h3 style={{ marginTop: "20px" }}>👥 Wybierz użytkownika:</h3>
          <select onChange={(e) => fetchFiles(e.target.value)} value={selectedUser}>
            <option value="">-- wybierz --</option>
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </>
        
      )}
  return (
    <div className="admin-panel">
      <h1>Panel administratora</h1>
      {/* inne elementy panelu */}
      
      <button onClick={handleGoHome} className="go-home-button">
        ⬅ Powrót do strony głównej
      </button>
    </div>
  );
{selectedUser && (
  <>
    <h3 style={{ marginTop: "20px" }}>📄 Pliki użytkownika: {selectedUser}</h3>
    <button onClick={handleDeleteUser} style={{ marginBottom: "10px", backgroundColor: "#f44336", color: "white" }}>
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

};
export default AdminPanel;