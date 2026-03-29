import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import CustomerSignup from "./pages/CustomerSignup";
import UploadPage from "./pages/UploadPage";
import TokenPage from "./pages/TokenPage";
import LoginSelection from "./pages/LoginSelection";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminSignup from "./pages/Admin/AdminSignup";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPrintPanel from "./pages/Admin/AdminPrintPanel";
import PrintLogsPage from "./pages/Admin/PrintLogsPage";
import RequireAuth from "./components/RequireAuth";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/login-selection" element={<LoginSelection />} />

        {/* Customer Flow */}
        <Route path="/signup" element={<CustomerSignup />} />
        <Route
          path="/upload"
          element={
            <RequireAuth roles={["customer"]}>
              <UploadPage />
            </RequireAuth>
          }
        />
        <Route path="/token" element={<TokenPage />} />
        <Route path="/home" element={<Home />} />

        {/* Admin Flow */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
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
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Home from "./pages/Home";
// import CustomerSignup from "./pages/CustomerSignup";
// import UploadPage from "./pages/UploadPage";
// import TokenPage from "./pages/TokenPage";
// import LoginSelection from "./pages/LoginSelection";
// import AdminLogin from "./pages/Admin/AdminLogin";
// import AdminSignup from "./pages/Admin/AdminSignup";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import AdminPrintPanel from "./pages/Admin/AdminPrintPanel";
// import PrintLogsPage from "./pages/Admin/PrintLogsPage";
// import RequireAuth from "./components/RequireAuth";
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* This sets PrivyPrint as your main page */}
//         <Route path="/" element={<Landing />} />
//         <Route path="/login-selection" element={<LoginSelection />} />

//         {/* Customer flow */}
//         <Route path="/signup" element={<CustomerSignup />} />
//         <Route
//           path="/upload"
//           element={
//             <RequireAuth roles={["customer"]}>
//               <UploadPage />
//             </RequireAuth>
//           }
//         />
//         <Route path="/token" element={<TokenPage />} />
//         <Route path="/home" element={<Home />} />

//         {/* Admin flow */}
//         <Route path="/admin/signup" element={<AdminSignup />} />
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route
//           path="/admin/dashboard"
//           element={
//             <RequireAuth roles={["admin"]}>
//               <AdminDashboard />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/admin/print"
//           element={
//             <RequireAuth roles={["admin"]}>
//               <AdminPrintPanel />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/admin/logs"
//           element={
//             <RequireAuth roles={["admin"]}>
//               <PrintLogsPage />
//             </RequireAuth>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// //app .jsx file
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App;
