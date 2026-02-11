import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import ExpensesNavbar from "../components/ExpensesNavbar";
import ExpensesForm from "../components/ExpensesForm";
import { getExpenseById, updateExpense } from "../utils/expensesService";
import type { ExpenseData } from "../Modal/Modals";

const ExpensesEdit = () => {
    const { workspaceId, projectId, taskId, expenseId } = useParams();
    const taskIdNum = Number(taskId) ?? 0;
    const expenseIdNum = Number(expenseId) ?? 0;
    const navigate = useNavigate();
    const [expense, setExpense] = useState(null);

    const loadExpense = async () => {
        try {
            const exp = await getExpenseById(
                Number(taskId) ?? 0,
                Number(expenseId) ?? 0,
            );
            setExpense(exp);
        } catch (error) {
            console.error("Failed to load expense:", error);
        }
    };

    const handleSave = async (expenseData: Partial<ExpenseData>) => {
        try {
            await updateExpense(taskIdNum, expenseIdNum, expenseData);
            navigate(
                `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/expenses`,
            );
        } catch (error) {
            console.error("Failed to update expense:", error);
            alert("Failed to update expense. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate(
            `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/expenses`,
        );
    };

    const handleBack = () => {
        navigate(
            `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/expenses`,
        );
    };

    if (!expense) return <div>Loading...</div>;

    return (
        <div>
            <ExpensesNavbar onBack={handleBack} />
            <Container className="mt-4">
                <ExpensesForm
                    expense={expense}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </Container>
        </div>
    );
};

export default ExpensesEdit;
