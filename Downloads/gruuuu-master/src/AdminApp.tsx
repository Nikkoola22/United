import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NewsList from "./pages/NewsList";
import AdminNews from "./pages/AdminNews";
import AdminInfo from "./pages/AdminInfo";

const AdminApp: React.FC = () => {
  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <nav style={{ 
          padding: "1rem", 
          background: "#2c3e50", 
          color: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "2rem" }}>
            <h1 style={{ margin: 0, fontSize: "1.5rem" }}>🔧 Administration CFDT</h1>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link 
                to="/news" 
                style={{ 
                  color: "white", 
                  textDecoration: "none", 
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.1)"
                }}
              >
                📰 Actualités
              </Link>
              <Link 
                to="/admin-news" 
                style={{ 
                  color: "white", 
                  textDecoration: "none", 
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.1)"
                }}
              >
                ⚙️ Actualités API
              </Link>
              <Link 
                to="/admin-info" 
                style={{ 
                  color: "white", 
                  textDecoration: "none", 
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.1)"
                }}
              >
                📋 NEWS FPT
              </Link>
            </div>
          </div>
        </nav>

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
          <Routes>
            <Route path="/news" element={<NewsList />} />
            <Route path="/admin-news" element={<AdminNews />} />
            <Route path="/admin-info" element={<AdminInfo />} />
            <Route path="*" element={<AdminInfo />} /> {/* redirection par défaut vers admin-info */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AdminApp;
