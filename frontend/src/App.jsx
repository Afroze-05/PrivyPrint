import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import CustomerSignup from "./pages/CustomerSignup";
import CustomerLogin from "./pages/CustomerLogin"; // Added back
import UploadPage from "./pages/UploadPage";
import TokenPage from "./pages/TokenPage";
import LoginSelection from "./pages/LoginSelection";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminSignup from "./pages/Admin/AdminSignup";
import AdminDashboard from "./pages/Admin/AdminDashboardNew";
import AdminPrintPanel from "./pages/Admin/AdminPrintPanel";
import AdminVerifyOtp from "./pages/Admin/AdminVerifyOtp";
import PrintLogsPage from "./pages/Admin/PrintLogsPage";
import RequireAuth from "./components/RequireAuth";
import VerifyOtp from "./pages/VerifyOtp"; // Added back
import RatingThankYou from "./pages/RatingThankYou";
import RatingPage from "./pages/RatingPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import VoicePrint from "./pages/VoicePrint";
import VoiceRequestsPage from "./pages/Admin/VoiceRequestsPage";
import "./App.css";
import "./theme.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ThemeToggle />
        <Routes>
          <Route
            path="/admin/voice-requests"
            element={
              <RequireAuth roles={["admin"]}>
                <VoiceRequestsPage />
              </RequireAuth>
            }
          />
          {/* Core Landing & Selection */}
          <Route path="/" element={<Landing />} />
          <Route path="/login-selection" element={<LoginSelection />} />

          {/* Auth & Security flow */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Customer flow */}
          <Route path="/signup" element={<CustomerSignup />} />
          <Route
            path="/upload"
            element={
              <RequireAuth>
                <UploadPage />
              </RequireAuth>
            }
          />
          <Route path="/voice-print" element={<VoicePrint />} />
          <Route path="/token" element={<TokenPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rating-thank-you" element={<RatingThankYou />} />
          <Route path="/rating" element={<RatingPage />} />

          {/* Admin flow (merged with Afroze's dashboard routes) */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/verify-otp" element={<AdminVerifyOtp />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth roles={["admin"]}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/print"
            element={
              <RequireAuth roles={["admin"]}>
                <AdminPrintPanel />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <RequireAuth roles={["admin"]}>
                <PrintLogsPage />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
