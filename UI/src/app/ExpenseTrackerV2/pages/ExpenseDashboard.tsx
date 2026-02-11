import React, { useState, useEffect } from "react";
import "../Expense.css";

// return <>

interface Transaction {
    id: number;
    type: "Expense" | "Income" | "Saving" | "Investment";
    amount: number;
    category: string;
    subcategory: string;
    date: string;
    balance: number;
}

const ExpenseDashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);
    const [formData, setFormData] = useState({
        type: "Expense" as "Expense" | "Income" | "Saving" | "Investment",
        amount: "",
        category: "",
        subcategory: "",
        date: "",
    });

    // Simulate API data fetch
    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [transactions]);

    const fetchTransactions = async () => {
        // Simulate API call

        const mockData: Transaction[] = [
            {
                id: 1,
                type: "Expense",
                amount: 2500,
                category: "Food",
                subcategory: "Groceries",
                date: "2026-02-09",
                balance: 45200,
            },
            {
                id: 2,
                type: "Income",
                amount: 50000,
                category: "Salary",
                subcategory: "Monthly",
                date: "2026-02-01",
                balance: 47700,
            },
            {
                id: 3,
                type: "Expense",
                amount: 1200,
                category: "Transport",
                subcategory: "Fuel",
                date: "2026-02-08",
                balance: 46500,
            },
            {
                id: 4,
                type: "Saving",
                amount: 10000,
                category: "Savings",
                subcategory: "Emergency Fund",
                date: "2026-02-05",
                balance: 47700,
            },
        ];
        setTransactions(mockData);
    };

    const calculateTotals = () => {
        const expense = transactions
            .filter((t) => t.type === "Expense")
            .reduce((sum, t) => sum + t.amount, 0);
        const income = transactions
            .filter((t) => t.type === "Income")
            .reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expense;

        setTotalExpense(expense);
        setTotalIncome(income);
        setTotalBalance(balance);
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTransaction) {
            // Update existing transaction
            setTransactions(
                transactions.map((t) =>
                    t.id === editingTransaction.id
                        ? { ...t, ...formData, amount: Number(formData.amount) }
                        : t,
                ),
            );
            setEditingTransaction(null);
        } else {
            // Add new transaction
            const newTransaction: Transaction = {
                id: Date.now(),
                ...formData,
                amount: Number(formData.amount),
                balance:
                    totalBalance +
                    Number(formData.amount) *
                        (formData.type === "Expense" ? -1 : 1),
            };
            setTransactions([newTransaction, ...transactions]);
        }
        setShowAddModal(false);
        setShowEditModal(false);
        setFormData({
            type: "Expense",
            amount: "",
            category: "",
            subcategory: "",
            date: "",
        });
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setFormData({
            type: transaction.type,
            amount: transaction.amount.toString(),
            category: transaction.category,
            subcategory: transaction.subcategory,
            date: transaction.date,
        });
        setShowEditModal(true);
    };

    const handleDelete = (id: number) => {
        setTransactions(transactions.filter((t) => t.id !== id));
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            Expense: "#EF4444",
            Income: "#10B981",
            Saving: "#F59E0B",
            Investment: "#8B5CF6",
        };
        return colors[type] || "#6B7280";
    };

    return (
        <div className="dashboard-container">
            {/* Main Content */}
            {/* <main className="main-content-expense"> */}
            <header className="page-header">
                <h1 className="expense-title">Dashboard</h1>
                <button
                    className="add-btn"
                    onClick={() => setShowAddModal(true)}
                >
                    + Add Transaction
                </button>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card expense-card">
                    <div className="stat-icon">↓</div>
                    <div className="stat-content">
                        <p>Total Expense</p>
                        <h3>₹{totalExpense.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="stat-card income-card">
                    <div className="stat-icon">↑</div>
                    <div className="stat-content">
                        <p>Total Income</p>
                        <h3>₹{totalIncome.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="stat-card balance-card">
                    <div className="stat-icon">⚖️</div>
                    <div className="stat-content">
                        <p>Total Balance</p>
                        <h3>₹{totalBalance.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>Recent Transactions</h2>
                    <span className="transaction-count">
                        {transactions.length} transactions
                    </span>
                </div>
                <div className="table-wrapper">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Date</th>
                                <th>Balance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr
                                    key={transaction.id}
                                    className="table-row"
                                    onClick={() => handleEdit(transaction)}
                                >
                                    <td>{index + 1}</td>
                                    <td>
                                        <span
                                            className="type-badge"
                                            style={{
                                                backgroundColor: getTypeColor(
                                                    transaction.type,
                                                ),
                                            }}
                                        >
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td
                                        className={`amount ${transaction.type === "Income" ? "income" : "expense"}`}
                                    >
                                        ₹{transaction.amount.toLocaleString()}
                                    </td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.subcategory}</td>
                                    <td>
                                        {new Date(
                                            transaction.date,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        ₹{transaction.balance.toLocaleString()}
                                    </td>
                                    <td className="action-buttons">
                                        <button
                                            className="edit-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(transaction);
                                            }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(transaction.id);
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* </main> */}

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                        setEditingTransaction(null);
                    }}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>
                            {editingTransaction
                                ? "Edit Transaction"
                                : "Add New Transaction"}
                        </h2>
                        <form
                            onSubmit={handleAddTransaction}
                            className="modal-form"
                        >
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            type: e.target.value as any,
                                        })
                                    }
                                    required
                                >
                                    <option value="Expense">Expense</option>
                                    <option value="Income">Income</option>
                                    <option value="Saving">Saving</option>
                                    <option value="Investment">
                                        Investment
                                    </option>
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                amount: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                date: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Subcategory</label>
                                <input
                                    type="text"
                                    value={formData.subcategory}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subcategory: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        setEditingTransaction(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    {editingTransaction ? "Update" : "Add"}{" "}
                                    Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// export default Dashboard;
//  </>
// };

export default ExpenseDashboard;
