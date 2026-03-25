import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing"; // Ensure you created src/pages/Landing.jsx
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* This sets PrivyPrint as your main page */}
        <Route path="/" element={<Landing />} />

        {/* Future routes like /login or /dashboard can go here.
           Example: <Route path="/login" element={<Login />} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
