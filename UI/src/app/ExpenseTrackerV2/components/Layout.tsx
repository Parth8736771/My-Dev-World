import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../Expense.css";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const getActivePath = (path: string) =>
        location.pathname === path ? "active" : "";

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h2>Expense Tracker</h2>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <a
                            href="/expenses-v2"
                            className={getActivePath("/expenses-v2")}
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/expenses-v2/expense"
                            className={getActivePath("/expenses-v2/expense")}
                        >
                            Expense _test
                        </a>
                    </li>
                    <li>
                        <a
                            href="/expenses-v2/income"
                            className={getActivePath("/expenses-v2/income")}
                        >
                            Income
                        </a>
                    </li>
                    <li>
                        <a
                            href="/expenses-v2/report"
                            className={getActivePath("/expenses-v2/report")}
                        >
                            Report
                        </a>
                    </li>
                    <li>
                        <a
                            href="/expenses-v2/export"
                            className={getActivePath("/expenses-v2/export")}
                        >
                            Export
                        </a>
                    </li>
                    <li>
                        <a
                            href="/expenses-v2/analytics"
                            className={getActivePath("/expenses-v2/analytics")}
                        >
                            Analytics
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Main Content Area */}
            <main className="main-content-expense">
                <Outlet />
                {children}
            </main>
        </div>
    );
};

export default Layout;
