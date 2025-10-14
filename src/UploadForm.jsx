import React, { useState, useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
}
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
      fetchFiles(); // odśwież listę po wysłaniu
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
    fetchFiles(); // odśwież listę
  } catch (err) {
    console.error("Błąd przy usuwaniu:", err);
    alert("Nie udało się usunąć pliku");
  }
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
  fetchFiles();
}, [fetchFiles]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📁 FileBeam Web</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />

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

      <br /><br />

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
        {isImage && (
         <div style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "Arial",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
              }}>
          </div>
        )}
        <a href={fileUrl} download>
          <button>Pobierz</button>
        </a>
        <button onClick={() => handleDelete(file)}>Usuń</button>
      </li>
    );
  })}
</ul>


    </div>
  );
}
