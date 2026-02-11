import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
import ExpensesNavbar from "../components/ExpensesNavbar";
import ExpensesList from "../components/ExpensesList";
import ExpensesDashboard from "../components/ExpenseDashboard";
import ExpensesForm from "../components/ExpensesForm";
import { expenseService } from "../utils/expensesService";
import { ExpenseTypeEnum, type ExpenseData } from "../Modal/Modals";
import "./ExpensesHome.css";

const STORAGE_KEYS = {
    THEME: "expense_tracker_theme",
};

const ThemeMode = {
    Light: "light",
    Dark: "dark",
    Rose: "rose",
} as const;

const ExpensesHome: React.FC = () => {
    const initialExpenseData: Partial<ExpenseData> = {
        id: 0,
        type: ExpenseTypeEnum.Expense,
        amount: 0,
        name: "",
        description: "",
        notes: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        taskId: 0,
    };

    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [editingExpense, setEditingExpense] =
        useState<Partial<ExpenseData> | null>(null);
    const [expenseType, setExpenseType] = useState<string>(
        ExpenseTypeEnum.Expense,
    );
    const [activeTab, setActiveTab] = useState<string>("list");
    const [isLoading, setIsLoading] = useState(true);

    const loadExpenses = async () => {
        try {
            setIsLoading(true);
            // Try to sync any pending offline items first
            await expenseService.syncPending?.();
            const data = await expenseService.getAll();
            setExpenses(data);
        } catch (error) {
            console.error("Failed to load expenses:", error);
            alert("Failed to load expenses. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
        initTheme();
    }, []);

    const initTheme = () => {
        const savedTheme =
            localStorage.getItem(STORAGE_KEYS.THEME) || ThemeMode.Light;
        document.documentElement.setAttribute("data-theme", savedTheme);
    };

    const handleThemeChange = (theme: string) => {
        document.documentElement.setAttribute("data-theme", theme);
    };

    const handleSave = async (
        formData: Partial<ExpenseData>,
        keepOpen: boolean = false,
    ) => {
        try {
            setIsLoading(true);
            if (editingExpense?.id && editingExpense.id > 0) {
                await expenseService.update(editingExpense.id, formData);
            } else {
                await expenseService.create(
                    formData as Omit<ExpenseData, "id">,
                );
            }

            await loadExpenses();

            if (!keepOpen) {
                toggleModal();
                setEditingExpense(null);
            } else {
                // If keeping open for quick multiple entries, reset editingExpense for the next create
                setEditingExpense({ ...formData, id: 0 });
            }
        } catch (error) {
            console.error("Failed to save expense:", error);
            alert("Failed to save expense. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                setIsLoading(true);
                await expenseService.delete(id);
                await loadExpenses();
            } catch (error) {
                console.error("Failed to delete expense:", error);
                alert("Failed to delete expense. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };
    const handleEdit = async (expense: ExpenseData) => {
        const expenseToEdit = expenses.find((e) => e.id === expense.id);
        console.log("Editing expense:", expenseToEdit);
        try {
            if (expenseToEdit) {
                debugger;
                setEditingExpense(expenseToEdit);
                console.log("Expense date:", expenseToEdit.date);
                setExpenseType(expenseToEdit.type || ExpenseTypeEnum.Expense);
                setModal(true);
            }
        } catch (error) {
            console.error("Failed to edit expense:", error);
            alert("Failed to edit expense. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleModal = () => {
        setModal(!modal);
        if (!modal) {
            setEditingExpense(null);
        }
    };

    const openCreateModal = (type: string) => {
        setEditingExpense(initialExpenseData);
        setExpenseType(type);
        setModal(true);
    };

    return (
        <div className="expenses-home">
            <ExpensesNavbar onThemeChange={handleThemeChange} />

            <Container fluid className="expenses-container">
                {/* Header Section */}
                <div className="expenses-header">
                    <div>
                        <h1 className="page-title">Expense Tracker</h1>
                        <p className="page-subtitle">
                            Manage your income and expenses efficiently
                        </p>
                    </div>
                    <div className="header-actions">
                        <Button
                            color="success"
                            className="btn-action income-btn"
                            onClick={() =>
                                openCreateModal(ExpenseTypeEnum.Income)
                            }
                        >
                            <span className="btn-icon">➕</span>
                            <span>Add Income</span>
                        </Button>
                        <Button
                            color="danger"
                            className="btn-action expense-btn"
                            onClick={() =>
                                openCreateModal(ExpenseTypeEnum.Expense)
                            }
                        >
                            <span className="btn-icon">➕</span>
                            <span>Add Expense</span>
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <Nav
                    tabs
                    className="expenses-tabs"
                    style={{ marginBottom: "20px" }}
                >
                    <NavItem>
                        <NavLink
                            className={activeTab === "list" ? "active" : ""}
                            onClick={() => setActiveTab("list")}
                        >
                            📊 Expenses List
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={
                                activeTab === "dashboard" ? "active" : ""
                            }
                            onClick={() => setActiveTab("dashboard")}
                        >
                            📈 Dashboard & Analytics
                        </NavLink>
                    </NavItem>
                </Nav>

                {/* Tab Content */}
                <div className="tab-content-wrapper">
                    {activeTab === "list" && (
                        <div className="tab-pane">
                            <ExpensesList
                                expenses={expenses}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                isLoading={isLoading}
                            />
                        </div>
                    )}

                    {activeTab === "dashboard" && (
                        <div className="tab-pane">
                            <ExpensesDashboard />
                        </div>
                    )}
                </div>
            </Container>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modal}
                toggle={toggleModal}
                size="lg"
                centered
                className="modal"
            >
                <ModalHeader toggle={toggleModal} className="modal-header">
                    <span className="modal-title-icon">
                        {editingExpense?.id ? "✏️" : "➕"}
                    </span>
                    {editingExpense?.id
                        ? "Edit Expense/Income"
                        : "Create New Expense/Income"}
                </ModalHeader>
                <ModalBody>
                    <ExpensesForm
                        expense={editingExpense || undefined}
                        onSave={handleSave}
                        onCancel={toggleModal}
                        expenseType={expenseType}
                    />
                </ModalBody>
            </Modal>
        </div>
    );
};

export default ExpensesHome;
