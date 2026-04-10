import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, History, Bell, Wallet, User } from "lucide-react";

export default function CustomerDashboardTest() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-8">PrivyPrint</h2>
          
          <nav className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "upload", label: "Upload Print", icon: Upload },
              { id: "history", label: "History", icon: History },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "wallet", label: "Wallet", icon: Wallet },
              { id: "profile", label: "Profile", icon: User }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {activeSection === "dashboard" ? "Dashboard" : 
               activeSection === "upload" ? "Upload Print" :
               activeSection === "history" ? "History" :
               activeSection === "notifications" ? "Notifications" :
               activeSection === "wallet" ? "Wallet" : "Profile"}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Customer Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-500 p-6 rounded-xl text-white">
                  <h3 className="text-blue-100">Total Prints</h3>
                  <p className="text-3xl font-bold mt-2">24</p>
                </div>
                <div className="bg-amber-500 p-6 rounded-xl text-white">
                  <h3 className="text-amber-100">Pending Prints</h3>
                  <p className="text-3xl font-bold mt-2">3</p>
                </div>
                <div className="bg-green-500 p-6 rounded-xl text-white">
                  <h3 className="text-green-100">Completed Prints</h3>
                  <p className="text-3xl font-bold mt-2">21</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Welcome to Customer Dashboard!</h3>
                <p className="text-gray-600">This is a simplified test version to verify routing works.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {activeSection === "upload" && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Print</h2>
              <p className="text-gray-600">Upload functionality will be implemented here.</p>
            </div>
          )}

          {activeSection === "history" && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Print History</h2>
              <p className="text-gray-600">Your print history will appear here.</p>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h2>
              <p className="text-gray-600">Your notifications will appear here.</p>
            </div>
          )}

          {activeSection === "wallet" && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet</h2>
              <p className="text-gray-600">Your wallet information will appear here.</p>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
              <p className="text-gray-600">Your profile information will appear here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
