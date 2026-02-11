import { Route, Routes } from "react-router-dom";
import Home from "./app/app-1/pages/Home";
import WorkspaceDetail from "./app/app-1/pages/workspaceDetail";
import ProjectDetail from "./app/app-1/pages/projectDetail";
import TaskDetail from "./app/app-1/pages/TaskDetail";
import ExpenseHome from "./app/ExpenseTracker/expenses/pages/ExpensesHome";
import LearningsHome from "./app/Learnings/learnings/pages/LearningsHome";
import LearningCreate from "./app/Learnings/learnings/pages/LearningCreate";
import LearningEdit from "./app/Learnings/learnings/pages/LearningEdit";
import LearningView from "./app/Learnings/learnings/pages/LearningView";
import Login from "./app/auth/pages/Login";
import Register from "./app/auth/pages/Register";
import Unauthorized from "./app/error/pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import ExpenseDashboard from "./app/ExpenseTrackerV2/pages/ExpenseDashboard";
import IncomePage from "./app/ExpenseTrackerV2/pages/IncomePage";
import ReportPage from "./app/ExpenseTrackerV2/pages/ReportPage";
import ExportPage from "./app/ExpenseTrackerV2/pages/ExportPage";
import AnalyticsPage from "./app/ExpenseTrackerV2/pages/AnalyticsPage";
import Layout from "./app/ExpenseTrackerV2/components/Layout";
import ExpensePage from "./app/ExpenseTrackerV2/pages/ExpensePage";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId"
                    element={
                        <ProtectedRoute>
                            <WorkspaceDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId/projects/:projectId"
                    element={
                        <ProtectedRoute>
                            <ProjectDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId/projects/:projectId/tasks/:taskId"
                    element={
                        <ProtectedRoute>
                            <TaskDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/quiz"
                    element={
                        <ProtectedRoute>
                            <TaskDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/notes"
                    element={
                        <ProtectedRoute>
                            <TaskDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/expenses"
                    element={
                        <ProtectedRoute>
                            <TaskDetail />
                        </ProtectedRoute>
                    }
                />

                {/* Admin-Only Routes */}
                <Route
                    path="/expenses"
                    element={
                        <ProtectedRoute requiredRoles={["Admin"]}>
                            <ExpenseHome />
                        </ProtectedRoute>
                    }
                />

                {/* User Routes */}
                <Route
                    path="/learnings"
                    element={
                        <ProtectedRoute>
                            <LearningsHome />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/learnings/create"
                    element={
                        <ProtectedRoute>
                            <LearningCreate />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/learnings/edit/:id"
                    element={
                        <ProtectedRoute>
                            <LearningEdit />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/learnings/:id"
                    element={
                        <ProtectedRoute>
                            <LearningView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/expenses-v2"
                    element={
                        // <ProtectedRoute>
                        <Layout />
                        // </ProtectedRoute>
                    }
                >
                    <Route path="" element={<ExpenseDashboard />} />
                    <Route path="expense" element={<ExpensePage />} />
                    <Route path="income" element={<IncomePage />} />
                    <Route path="report" element={<ReportPage />} />
                    <Route path="export" element={<ExportPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                </Route>
            </Routes>
        </>
    );
};

export default AppRoutes;
