import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [files, setFiles] = useState([]);
  const backendUrl = "https://filebeam-backend-yqrd.onrender.com";

  useEffect(() => {
    axios.get(`${backendUrl}/admin/users`).then((res) => setUsers(res.data));
  }, []);

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
      <h3>👥 Użytkownicy:</h3>
      <ul>
        {users.map((user) => (
          <li key={user}>
            <button onClick={() => fetchFiles(user)}>{user}</button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <>
          <h3>📄 Pliki użytkownika: {selectedUser}</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file}
                <a
                  href={`${backendUrl}/files/${selectedUser}/${file}`}
                  download
                >
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
