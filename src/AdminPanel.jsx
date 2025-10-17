import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const adminPassword = "BadMojo2008";
  const backendUrl = "https://filebeam-backend-yqrd.onrender.com";

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/pending-users`, {
        headers: { "x-admin-password": adminPassword },
      });
      setPendingUsers(res.data);
    } catch {
      console.error("Nie udało się pobrać kont oczekujących");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/users`, {
        headers: { "x-admin-password": adminPassword },
      });
      setAllUsers(res.data);
    } catch {
      console.error("Nie udało się pobrać listy użytkowników");
    }
  };

  const approveUser = async (username) => {
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/admin/approve/${username}`, null, {
        headers: { "x-admin-password": adminPassword },
      });
      alert(`Zatwierdzono konto: ${username}`);
      fetchPendingUsers();
    } catch {
      alert("Nie udało się zatwierdzić konta");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (username) => {
    if (!window.confirm(`Czy na pewno usunąć konto: ${username}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`${backendUrl}/admin/users/${username}`, {
        headers: { "x-admin-password": adminPassword },
      });
      alert(`Usunięto konto: ${username}`);
      fetchPendingUsers();
      fetchAllUsers();
    } catch {
      alert("Nie udało się usunąć konta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    fetchAllUsers();
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🛡️ Panel administratora</h2>

      <h3>✅ Konta oczekujące na zatwierdzenie:</h3>
      {pendingUsers.length === 0 ? (
        <p>Brak kont do zatwierdzenia</p>
      ) : (
        <ul>
          {pendingUsers.map((user) => (
            <li key={user} style={{ marginBottom: "12px" }}>
              <strong>{user}</strong>
              <button onClick={() => approveUser(user)} disabled={loading} style={{ marginLeft: "12px" }}>
                Zatwierdź
              </button>
              <button onClick={() => deleteUser(user)} disabled={loading} style={{ marginLeft: "8px", backgroundColor: "#f44336", color: "#fff" }}>
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3 style={{ marginTop: "32px" }}>📋 Wszyscy użytkownicy:</h3>
      <ul>
        {allUsers.map((user) => (
          <li key={user} style={{ marginBottom: "8px" }}>{user}</li>
        ))}
      </ul>
    </div>
  );
}
