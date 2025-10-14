import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadForm from "./UploadForm";
import AdminPanel from "./AdminPanel";

function App() {
  return (
    <Router basename="/filebeam-frontend">
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
