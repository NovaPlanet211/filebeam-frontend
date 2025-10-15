import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import UploadForm from "./UploadForm";
import AdminPanel from "./AdminPanel";

function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingDone(true);
    }, 2000); // 2 sekundy animacji

    return () => clearTimeout(timer);
  }, []);

  if (!loadingDone) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;


