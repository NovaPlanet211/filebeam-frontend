import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadForm from "./UploadForm";
import AdminPanel from "./AdminPanel";

function App() {
  const isLocal = window.location.hostname === "localhost";

  return (
    <Router basename={isLocal ? "/" : "/filebeam-frontend"}>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
