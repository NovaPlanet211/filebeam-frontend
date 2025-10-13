import React, { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("dom");

  const handleUpload = async () => {
    if (!file) return alert("Wybierz plik");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `https://filebeam-backend.onrender.com/upload/${userId}`,
        formData
      );
      alert("Plik wysłany!");
    } catch (err) {
      alert("Błąd przy wysyłaniu");
    }
  };

  return (
    <div>
      <h2>FileBeam Web</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <select onChange={(e) => setUserId(e.target.value)}>
        <option value="dom">Komputer domowy</option>
        <option value="nova">Nova</option>
      </select>
      <button onClick={handleUpload}>Wyślij</button>
    </div>
  );
}
