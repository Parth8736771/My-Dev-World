import { useState, useEffect } from "react";
import {
    Table,
    Button,
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Badge,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner,
} from "reactstrap";
import * as XLSX from "xlsx";
import { expenseService } from "../utils/expensesService";
import type { ExpenseData } from "../Modal/Modals";
import "./ExpensesList.css";

interface Props {
    expenses: ExpenseData[];
    onDelete: (id: number) => Promise<void>;
    isLoading?: boolean;
}

const ExpensesList = ({ expenses, onDelete, isLoading = false }: Props) => {
    const [filteredExpenses, setFilteredExpenses] = useState<ExpenseData[]>(
        expenses ?? [],
    );
    const [filterType, setFilterType] = useState<string>("All");
    const [filterPeriod, setFilterPeriod] = useState<string>("All");
    const [filterName, setFilterName] = useState<string>("All");
    const [expenseNames, setExpenseNames] = useState<string[]>([]);
    const [exportModal, setExportModal] = useState<boolean>(false);
    const [exportType, setExportType] = useState<string>("current");
    const [selectedMonth, setSelectedMonth] = useState<number>(
        new Date().getMonth() + 1,
    );
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear(),
    );

    useEffect(() => {
        filterExpenses();
        loadExpenseNames();
    }, [expenses, filterType, filterPeriod, filterName]);

    const loadExpenseNames = async () => {
        try {
            const names = await expenseService.getNames();
            setExpenseNames(names);
        } catch (error) {
            console.error("Error loading expense names:", error);
        }
    };

    const filterExpenses = () => {
        let filtered = [...expenses];

        // Filter by type
        if (filterType !== "All") {
            filtered = filtered.filter((exp) => exp.type === filterType);
        }

        // Filter by period
        const now = new Date();
        if (filterPeriod === "Daily") {
            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
            );
            filtered = filtered.filter((exp) => new Date(exp.date) >= today);
        } else if (filterPeriod === "Weekly") {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter((exp) => new Date(exp.date) >= weekAgo);
        } else if (filterPeriod === "Monthly") {
            const monthAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate(),
            );
            filtered = filtered.filter((exp) => new Date(exp.date) >= monthAgo);
        } else if (filterPeriod === "Yearly") {
            const yearAgo = new Date(
                now.getFullYear() - 1,
                now.getMonth(),
                now.getDate(),
            );
            filtered = filtered.filter((exp) => new Date(exp.date) >= yearAgo);
        }

        // Filter by name
        if (filterName !== "All") {
            filtered = filtered.filter((exp) => exp.name === filterName);
        }

        setFilteredExpenses(filtered);
    };

    const exportToExcel = () => {
        let dataToExport: ExpenseData[] = [];

        if (exportType === "current") {
            dataToExport = filteredExpenses;
        } else if (exportType === "month") {
            dataToExport = expenses.filter((exp) => {
                const expDate = new Date(exp.date);
                return (
                    expDate.getMonth() + 1 === selectedMonth &&
                    expDate.getFullYear() === selectedYear
                );
            });
        } else if (exportType === "year") {
            dataToExport = expenses.filter((exp) => {
                const expDate = new Date(exp.date);
                return expDate.getFullYear() === selectedYear;
            });
        }

        // Prepare data for Excel
        const excelData = dataToExport.map((exp) => ({
            Date: new Date(exp.date).toLocaleDateString(),
            Name: exp.name,
            Type: exp.type,
            Description: exp.description || "",
            Amount: exp.amount,
            Category: exp.category || "",
        }));

        // Add summary row
        const totalIncome = dataToExport
            .filter((e) => e.type === "Income")
            .reduce((sum, e) => sum + e.amount, 0);
        const totalExpense = dataToExport
            .filter((e) => e.type === "Expense")
            .reduce((sum, e) => sum + e.amount, 0);
        const balance = totalIncome - totalExpense;

        excelData.push({
            Date: "",
            Name: "",
            Type: "SUMMARY",
            Description: "",
            Amount: 0,
            Category: "",
        });
        excelData.push({
            Date: "",
            Name: "",
            Type: "Total Income",
            Description: "",
            Amount: Number(totalIncome.toFixed(2)) ?? 0,
            Category: "",
        });
        excelData.push({
            Date: "",
            Name: "",
            Type: "Total Expense",
            Description: "",
            Amount: Number(totalExpense.toFixed(2)) ?? 0,
            Category: "",
        });
        excelData.push({
            Date: "",
            Name: "",
            Type: "Balance",
            Description: "",
            Amount: Number(balance.toFixed(2)) ?? 0,
            Category: "",
        });

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Auto-size columns
        const colWidths = [
            { wch: 12 },
            { wch: 20 },
            { wch: 10 },
            { wch: 30 },
            { wch: 12 },
            { wch: 15 },
        ];
        ws["!cols"] = colWidths;

        // Style header row
        const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
        for (let col = 0; col <= 5; col++) {
            const headerCellRef = XLSX.utils.encode_cell({ r: 0, c: col });
            if (ws[headerCellRef]) {
                ws[headerCellRef].s = {
                    fill: { fgColor: { rgb: "FF4F81BD" } },
                    font: { color: { rgb: "FFFFFFFF" }, bold: true },
                };
            }
        }

        for (let row = 1; row <= range.e.r; row++) {
            const typeCell = ws[XLSX.utils.encode_cell({ r: row, c: 2 })];
            if (typeCell && typeCell.v) {
                for (let col = 0; col <= 5; col++) {
                    const rowCellRef = XLSX.utils.encode_cell({
                        r: row,
                        c: col,
                    });
                    if (!ws[rowCellRef]) continue;

                    if (typeCell.v === "Expense") {
                        ws[rowCellRef].s = {
                            fill: { fgColor: { rgb: "FFFFE0E0" } },
                            font: { color: { rgb: "FF8B0000" } },
                        };
                    } else if (typeCell.v === "Income") {
                        ws[rowCellRef].s = {
                            fill: { fgColor: { rgb: "FFE0FFE0" } },
                            font: { color: { rgb: "FF006400" } },
                        };
                    } else if (
                        typeCell.v === "SUMMARY" ||
                        typeCell.v === "Total Income" ||
                        typeCell.v === "Total Expense" ||
                        typeCell.v === "Balance"
                    ) {
                        ws[rowCellRef].s = {
                            fill: { fgColor: { rgb: "FFE6E6FA" } },
                            font: { bold: true, color: { rgb: "FF4B0082" } },
                        };
                    }
                }
            }
        }

        let filename = "expenses.xlsx";
        if (exportType === "month") {
            filename = `expenses_${selectedYear}_${selectedMonth
                .toString()
                .padStart(2, "0")}.xlsx`;
        } else if (exportType === "year") {
            filename = `expenses_${selectedYear}.xlsx`;
        } else {
            filename = `expenses_filtered_${new Date().toISOString().split("T")[0]}.xlsx`;
        }

        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        XLSX.writeFile(wb, filename);
        setExportModal(false);
    };

    const totalIncome = filteredExpenses
        .filter((e) => e.type === "Income")
        .reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = filteredExpenses
        .filter((e) => e.type === "Expense")
        .reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    if (isLoading) {
        return (
            <div className="loading-container">
                <Spinner color="primary" />
                <p>Loading expenses...</p>
            </div>
        );
    }

    return (
        <div className="expenses-list-container">
            {/* Filters */}
            <Card className="filters-card">
                <CardBody>
                    <CardTitle>Filters</CardTitle>
                    <Row className="filter-row">
                        <Col md="4">
                            <FormGroup>
                                <Label for="filterType">Filter by Type</Label>
                                <Input
                                    type="select"
                                    id="filterType"
                                    value={filterType}
                                    onChange={(e) =>
                                        setFilterType(e.target.value)
                                    }
                                    className="form-input"
                                >
                                    <option value="All">All Types</option>
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                    <option value="Saving">Saving</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label for="filterPeriod">
                                    Filter by Period
                                </Label>
                                <Input
                                    type="select"
                                    id="filterPeriod"
                                    value={filterPeriod}
                                    onChange={(e) =>
                                        setFilterPeriod(e.target.value)
                                    }
                                    className="form-input"
                                >
                                    <option value="All">All Time</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label for="filterName">Filter by Name</Label>
                                <Input
                                    type="select"
                                    id="filterName"
                                    value={filterName}
                                    onChange={(e) =>
                                        setFilterName(e.target.value)
                                    }
                                    className="form-input"
                                >
                                    <option value="All">All Names</option>
                                    {expenseNames.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col className="text-end">
                            <Button
                                color="success"
                                onClick={() => setExportModal(true)}
                                className="btn-export"
                            >
                                📊 Export to Excel
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {/* Summary Cards */}
            <Row className="summary-row mb-4">
                <Col md="4">
                    <Card className="summary-card">
                        <CardBody>
                            <CardTitle className="summary-title">
                                Total Income
                            </CardTitle>
                            <p className="summary-amount income">
                                ${totalIncome.toFixed(2)}
                            </p>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="summary-card">
                        <CardBody>
                            <CardTitle className="summary-title">
                                Total Expense
                            </CardTitle>
                            <p className="summary-amount expense">
                                ${totalExpense.toFixed(2)}
                            </p>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="summary-card">
                        <CardBody>
                            <CardTitle className="summary-title">
                                Balance
                            </CardTitle>
                            <p
                                className={`summary-amount ${balance >= 0 ? "positive" : "negative"}`}
                            >
                                ${balance.toFixed(2)}
                            </p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Expenses Table */}
            <Card className="expenses-table-card">
                <CardBody>
                    <CardTitle>Recent Expenses</CardTitle>
                    {filteredExpenses.length > 0 ? (
                        <div className="table-responsive">
                            <Table striped hover className="expenses-table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExpenses.map((expense) => (
                                        <tr
                                            key={expense.id}
                                            className="expense-row"
                                        >
                                            <td>
                                                <Badge
                                                    color={
                                                        expense.type ===
                                                        "Income"
                                                            ? "success"
                                                            : "danger"
                                                    }
                                                    className="type-badge"
                                                >
                                                    {expense.type}
                                                </Badge>
                                            </td>
                                            <td className="amount">
                                                ${expense.amount.toFixed(2)}
                                            </td>
                                            <td className="name">
                                                {expense.name}
                                            </td>
                                            <td className="description">
                                                {expense.description || "-"}
                                            </td>
                                            <td className="category">
                                                {expense.category || "-"}
                                            </td>
                                            <td className="date">
                                                {new Date(
                                                    expense.date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="actions">
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        onDelete(expense.id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="no-data">
                            <p>No expenses found matching your filters.</p>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Export Modal */}
            <Modal
                isOpen={exportModal}
                toggle={() => setExportModal(!exportModal)}
            >
                <ModalHeader toggle={() => setExportModal(!exportModal)}>
                    Export Expenses to Excel
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="exportType">Export Type</Label>
                        <Input
                            type="select"
                            id="exportType"
                            value={exportType}
                            onChange={(e) => setExportType(e.target.value)}
                        >
                            <option value="current">
                                Current Filtered Data
                            </option>
                            <option value="month">Specific Month</option>
                            <option value="year">Specific Year</option>
                        </Input>
                    </FormGroup>

                    {exportType === "month" && (
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="selectedMonth">Month</Label>
                                    <Input
                                        type="select"
                                        id="selectedMonth"
                                        value={selectedMonth}
                                        onChange={(e) =>
                                            setSelectedMonth(
                                                parseInt(e.target.value),
                                            )
                                        }
                                    >
                                        {months.map((month, idx) => (
                                            <option key={idx} value={idx + 1}>
                                                {month}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="selectedYear">Year</Label>
                                    <Input
                                        type="number"
                                        id="selectedYear"
                                        value={selectedYear}
                                        onChange={(e) =>
                                            setSelectedYear(
                                                parseInt(e.target.value),
                                            )
                                        }
                                        min="2000"
                                        max={new Date().getFullYear() + 10}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    )}

                    {exportType === "year" && (
                        <FormGroup>
                            <Label for="selectedYearOnly">Year</Label>
                            <Input
                                type="number"
                                id="selectedYearOnly"
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(parseInt(e.target.value))
                                }
                                min="2000"
                                max={new Date().getFullYear() + 10}
                            />
                        </FormGroup>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={exportToExcel}>
                        Export
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() => setExportModal(false)}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default ExpensesList;
