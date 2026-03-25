import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import UploadPage from './pages/UploadPage';
import TokenPage from './pages/TokenPage';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import PrintPanel from './pages/PrintPanel';
import PrintLogs from './pages/PrintLogs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/token" element={<TokenPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/print-panel" element={<PrintPanel />} />
        <Route path="/logs" element={<PrintLogs />} />
      </Routes>
    </Router>
  );
}

export default App;