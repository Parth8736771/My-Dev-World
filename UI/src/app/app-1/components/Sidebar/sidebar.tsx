import React from "react";
import { Link } from "react-router-dom";
import { MenuOption } from "../../Modals/modals";
import { useAuth } from "../../../../contexts/AuthContext";
import "./sidebar.css";

const sidebar = ({
    activeView,
    setActiveView,
}: {
    activeView: string;
    setActiveView: (view: string) => void;
}) => {
    const { user } = useAuth();
    const isAdmin = user?.roles.includes("Admin");

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-section">
                    <h3 className="sidebar-title">Categories</h3>
                    <ul className="category-list">
                        <li>
                            <a
                                className={
                                    activeView === MenuOption.ALL
                                        ? "active category-item"
                                        : "category-item"
                                }
                                data-category="all"
                                onClick={() => setActiveView(MenuOption.ALL)}
                            >
                                <span className="category-icon">📋</span>
                                <span>All Files</span>
                            </a>{" "}
                        </li>
                        <li>
                            <a
                                className={
                                    activeView === MenuOption.WORKSPACE
                                        ? "active category-item"
                                        : "category-item"
                                }
                                data-category="workspaces"
                                onClick={() =>
                                    setActiveView(MenuOption.WORKSPACE)
                                }
                            >
                                <span className="category-icon">🏢</span>
                                <span>Workspaces</span>
                            </a>
                        </li>
                        <li>
                            <a
                                className={
                                    activeView === MenuOption.PROJECT
                                        ? "active category-item"
                                        : "category-item"
                                }
                                data-category="projects"
                                onClick={() =>
                                    setActiveView(MenuOption.PROJECT)
                                }
                            >
                                <span className="category-icon">📄</span>
                                <span>Projects</span>
                            </a>
                        </li>
                        <li>
                            <a
                                className={
                                    activeView === MenuOption.TASK
                                        ? "active category-item"
                                        : "category-item"
                                }
                                data-category="tasks"
                                onClick={() => setActiveView(MenuOption.TASK)}
                            >
                                <span className="category-icon">🖼️</span>
                                <span>Tasks</span>
                            </a>
                        </li>

                        {/* Admin Only - Expense Tracker */}
                        {isAdmin && (
                            <li>
                                <Link
                                    className="category-item admin-item"
                                    data-category="expenses"
                                    to="expenses"
                                    title="Admin only feature"
                                >
                                    <span className="category-icon">💰</span>
                                    <span>Expense Tracker</span>
                                    <span className="admin-badge-small">
                                        👑
                                    </span>
                                </Link>
                            </li>
                        )}

                        {/* All Users */}
                        <li>
                            <Link
                                className="category-item"
                                data-category="learnings"
                                to="learnings"
                            >
                                <span className="category-icon">📖</span>
                                <span>Learning App</span>
                            </Link>
                        </li>
                        {/* Expense Tracker */}
                        <li>
                            <Link
                                className="category-item"
                                data-category="expenses"
                                to="/expenses-v2"
                            >
                                <span className="category-icon">�</span>
                                <span>Expense Tracker</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Admin Features Section */}
                {isAdmin && (
                    <div className="sidebar-section admin-section">
                        <h3 className="sidebar-title">
                            <span>Admin Tools</span>
                            <span className="admin-indicator">👑</span>
                        </h3>
                        <div className="admin-info">
                            <p>You have admin access to exclusive features.</p>
                        </div>
                    </div>
                )}

                <div className="sidebar-section">
                    <h3 className="sidebar-title">Quick Actions</h3>
                    <button className="btn btn-primary" id="addFilesBtn">
                        <span>➕ Add Files</span>
                    </button>
                    <button className="btn btn-secondary" id="exportBtn">
                        <span>💾 Export List</span>
                    </button>
                    <button className="btn btn-secondary" id="openFolderBtn">
                        <span>📂 Open Folder</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default sidebar;
