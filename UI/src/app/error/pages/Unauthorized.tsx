import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../ThemeContext";
import "./error.css";

const Unauthorized: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className={`error-container ${theme}`}>
            <div className="error-content">
                <div className="error-icon">🔒</div>
                <h1>Access Denied</h1>
                <p>You don't have permission to access this resource.</p>
                <p className="error-details">
                    Only administrators can access this feature.
                </p>

                <Link to="/" className="error-button">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
