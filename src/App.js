import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Auth";
import "./styles.css";
import Dashboard from "./Dashboard";
import Navigation from "./Navigation";
import CategoryPage from "./CategoryPage";
import CreateAuction from "./CreateAuction";
import ViewAuctions from "./ViewAuctions";

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

const Welcome = () => {
    return (
        <div>
            <Navigation />
            <div style={{ textAlign: "center", padding: "50px" }}>
                <h1>Welcome to the Auction Platform</h1>
                <div className="auth-buttons">
                    <a href="/signup" className="auth-button">Signup</a>
                    <a href="/login" className="auth-button">Login</a>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/signup" element={<Auth type="signup" />} />
                <Route path="/login" element={<Auth type="login" />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <>
                                <Navigation />
                                <Dashboard />
                            </>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/auctions/:category" 
                    element={
                        <ProtectedRoute>
                            <>
                                <Navigation />
                                <CategoryPage />
                            </>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/create-auction/:category" 
                    element={
                        <ProtectedRoute>
                            <>
                                <Navigation />
                                <CreateAuction />
                            </>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/view-auctions/:category" 
                    element={
                        <ProtectedRoute>
                            <>
                                <Navigation />
                                <ViewAuctions />
                            </>
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;