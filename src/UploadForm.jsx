import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./UploadForm.css";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  const backendUrl = "https://filebeam-backend-yqrd.onrender.com";

  const handleUpload = async () => {
    if (!file) return alert("Wybierz plik");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post(`${backendUrl}/upload/${userId}`, formData);
      alert("Plik wysłany!");
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error("Błąd:", err);
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
    } catch (err) {
      console.error("Błąd przy usuwaniu:", err);
      alert("Nie udało się usunąć pliku");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${backendUrl}/register`, { username: newUser });
      alert("Użytkownik utworzony!");
      setUserId(newUser);
      setNewUser("");
    } catch (err) {
      alert("Nie udało się utworzyć użytkownika");
    }
  };

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/files/${userId}`);
      setFiles(res.data);
    } catch (err) {
      console.error("Błąd przy pobieraniu plików:", err);
    }
  }, [backendUrl, userId]);

  useEffect(() => {
    if (userId) fetchFiles();
  }, [fetchFiles, userId]);

  return (
    <div className="upload-form">
      <h2>📁 FileBeam Web</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Wpisz nazwę użytkownika"
      />

      <h3>🔐 Rejestracja użytkownika</h3>
      <input
        type="text"
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
        placeholder="Nowa nazwa użytkownika"
      />
      <button onClick={handleRegister}>Zarejestruj</button>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Wysyłanie..." : "Wyślij"}
      </button>

      <h3>📄 Pliki użytkownika: {userId}</h3>
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
        <button style={{ backgroundColor: "#444", marginTop: "30px" }}>
          🔐 Przejdź do panelu admina
        </button>
      </a>
    </div>
  );
}
