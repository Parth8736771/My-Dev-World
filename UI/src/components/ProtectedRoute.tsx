import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

/**
 * ProtectedRoute component that checks authentication and authorization
 * @param children - The component to render if authorized
 * @param requiredRoles - Optional array of roles required to access this route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles = [],
}) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        color: "white",
                    }}
                >
                    <div
                        style={{
                            fontSize: "48px",
                            marginBottom: "16px",
                            animation: "pulse 2s infinite",
                        }}
                    >
                        ⏳
                    </div>
                    <p style={{ fontSize: "16px" }}>Loading...</p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required roles
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) =>
            user?.roles.includes(role),
        );

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
