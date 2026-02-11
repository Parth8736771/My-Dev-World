import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Header from "../components/Header/header";
import Sidebar from "../components/Sidebar/sidebar";
import Container from "../components/Container/container";
import { MenuOption } from "../Modals/modals";

const layout = ({ children }: { children: React.ReactNode }) => {
    const [activeView, setActiveView] = useState<string>(MenuOption.ALL);
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // Check if current route is an auth route (login, register, etc.)
    const isAuthRoute =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/unauthorized";

    // Show sidebar only for authenticated users on protected routes
    const showSidebar = isAuthenticated && !isAuthRoute;

    return (
        <>
            <Header />
            <div style={{ display: "flex" }}>
                {/* {showSidebar && (
                    // <Sidebar
                    //     activeView={activeView}
                    //     setActiveView={setActiveView}
                    // />
                )} */}
                <div style={{ flex: 1 }}>{children}</div>
            </div>
        </>
    );
};

export default layout;
