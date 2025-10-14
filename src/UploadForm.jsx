import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("dom");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${backendUrl}/files/${userId}`);
      setFiles(res.data);
    } catch (err) {
      console.error("Błąd przy pobieraniu plików:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [userId]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📁 FileBeam Web</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />

      <select value={userId} onChange={(e) => setUserId(e.target.value)}>
        <option value="dom">Komputer domowy</option>
        <option value="nova">Nova</option>
      </select>
      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Wysyłanie..." : "Wyślij"}
      </button>

      <h3>📄 Pliki użytkownika: {userId}</h3>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
}
