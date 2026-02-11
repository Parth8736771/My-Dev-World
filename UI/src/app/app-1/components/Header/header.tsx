import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import ThemeToggle from "../../../../components/Theme/ThemeToggle";
import "./header.css";

const header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isAdmin = user?.roles.includes("Admin");

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="header-left">
                        <h1 className="app-title">
                            <Link
                                to="/"
                                style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                }}
                            >
                                📁 My World App
                            </Link>
                        </h1>
                    </div>

                    <div className="header-center">
                        <div className="search-box">
                            <input
                                type="text"
                                id="searchInput"
                                className="search-input"
                                placeholder="Search files..."
                            />
                            <span className="search-icon">🔍</span>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="header-controls">
                            <ThemeToggle />

                            {isAuthenticated && user ? (
                                <div className="user-section">
                                    <button
                                        className="user-button"
                                        onClick={() =>
                                            setShowUserMenu(!showUserMenu)
                                        }
                                    >
                                        <span className="user-avatar">
                                            {user.firstName.charAt(0)}
                                            {user.lastName.charAt(0)}
                                        </span>
                                        <span className="user-name">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <span
                                            className={`dropdown-arrow ${
                                                showUserMenu ? "open" : ""
                                            }`}
                                        >
                                            ▼
                                        </span>
                                    </button>

                                    {showUserMenu && (
                                        <div className="user-dropdown">
                                            <div className="dropdown-header">
                                                <div className="user-info">
                                                    <p className="user-email">
                                                        {user.email}
                                                    </p>
                                                    <p className="user-role">
                                                        {user.roles.join(", ")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="dropdown-divider"></div>

                                            {isAdmin && (
                                                <>
                                                    <a
                                                        href="/expenses"
                                                        className="dropdown-item admin-item"
                                                    >
                                                        <span>💰</span>
                                                        <span>
                                                            Expense Tracker
                                                        </span>
                                                        <span className="admin-badge">
                                                            Admin
                                                        </span>
                                                    </a>
                                                    <div className="dropdown-divider"></div>
                                                </>
                                            )}

                                            <button
                                                className="dropdown-item logout-item"
                                                onClick={handleLogout}
                                            >
                                                <span>🚪</span>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <Link
                                        to="/login"
                                        className="auth-button login"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="auth-button register"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default header;
