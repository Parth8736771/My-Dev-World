import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../ThemeContext";
import "./auth.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { theme: currentTheme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        debugger;

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Login failed. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`auth-container ${currentTheme}`}>
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon">🔐</div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-alert alert-error">
                                <span className="alert-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔑</span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={isLoading}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="demo-credentials">
                            <p className="text-muted">Demo Accounts:</p>
                            <div className="demo-item">
                                <small>
                                    <strong>Admin:</strong> admin@example.com /
                                    Admin123!
                                </small>
                            </div>
                            <div className="demo-item">
                                <small>
                                    <strong>User:</strong> user@example.com /
                                    User123!
                                </small>
                            </div>
                        </div>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register" className="auth-link">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="auth-sidebar">
                    <div className="sidebar-content">
                        <h2>My World App</h2>
                        <p>Your ultimate productivity and tracking solution</p>
                        <div className="features-list">
                            <div className="feature-item">
                                <span className="feature-icon">📊</span>
                                <div>
                                    <strong>Expense Tracking</strong>
                                    <p>Monitor your spending efficiently</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📚</span>
                                <div>
                                    <strong>Learning Management</strong>
                                    <p>Track your educational progress</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📋</span>
                                <div>
                                    <strong>Project Management</strong>
                                    <p>Organize your work efficiently</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🎯</span>
                                <div>
                                    <strong>Task Management</strong>
                                    <p>Stay on top of your goals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
