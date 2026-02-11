import React, { useState, useEffect } from "react";
import { Container, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import ExpensesNavbar from "../components/ExpensesNavbar";
import ExpensesForm from "../components/ExpensesForm";
import { addExpense } from "../utils/expensesService";

import type { ExpenseData } from "../Modal/Modals";
import { CreateAPIEndPoints, EndPointsName } from "../../../app-1/Api/api";

const ExpensesCreate = () => {
    const { workspaceId, projectId, taskId } = useParams();
    const navigate = useNavigate();

    const handleSave = async (expenseData: Partial<ExpenseData>) => {
        try {
            //await addExpense(taskId, expenseData);
            await CreateAPIEndPoints(EndPointsName.expenses)
                .create(expenseData)
                .then((res: any) => {
                    console.log(res.data);
                });
            navigate(
                `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/expenses`,
            );
        } catch (error) {
            console.error("Failed to create expense:", error);
            alert("Failed to create expense. Please try again.");
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

    return (
        <div>
            <ExpensesNavbar onBack={handleBack} />
            <Container className="mt-4">
                <ExpensesForm onSave={handleSave} onCancel={handleCancel} />
            </Container>
        </div>
    );
};

export default ExpensesCreate;
