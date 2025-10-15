import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import UploadForm from "./UploadForm";
import AdminPanel from "./AdminPanel";

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
const [loadingDone, setLoadingDone] = useState(false);
 return (
    <>
      {!loadingDone && <LoadingScreen onFinish={() => setLoadingDone(true)} />}
      {loadingDone && <MainApp />}
    </>
  ); 
}

export default App;

