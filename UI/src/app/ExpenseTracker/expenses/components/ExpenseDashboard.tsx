import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Spinner,
    Button,
} from "reactstrap";
import { expenseService } from "../utils/expensesService";
import type { ExpenseAnalytics, MonthlySummary } from "../Modal/Modals";
import { MONTHS } from "../../utils/CONSTANT";
// import "./ExpenseDashboard.css";

const ExpenseDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
    const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
    // categoryBreakdown from server is not used directly; compute stats from cached expenses instead
    // removed state to avoid unused-variable diagnostics
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Additional controls for category analytics
    const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>("All");
    const [categoryPeriodFilter, setCategoryPeriodFilter] =
        useState<string>("All");
    const [categoryViewByMonth, setCategoryViewByMonth] =
        useState<boolean>(false);
    const [allExpensesCache, setAllExpensesCache] = useState<any[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, [selectedYear]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [analyticsData, monthlySummaryData, allExp] =
                await Promise.all([
                    expenseService.getAnalytics(),
                    expenseService.getMonthlySummary(selectedYear),
                    // category breakdown available but not used here
                    expenseService.getAll(),
                ]);

            setAnalytics(analyticsData);
            setMonthlySummary(monthlySummaryData);
            // categoryData is available from API but we compute stats from cached expenses
            setAllExpensesCache(allExp);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Compute category totals and per-month counts based on filters
    const computeCategoryStats = () => {
        const now = new Date();
        let filtered = allExpensesCache.slice();

        if (categoryTypeFilter !== "All") {
            filtered = filtered.filter((e) => e.type === categoryTypeFilter);
        }

        if (categoryPeriodFilter === "Daily") {
            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
            );
            filtered = filtered.filter((e) => new Date(e.date) >= today);
        } else if (categoryPeriodFilter === "Weekly") {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter((e) => new Date(e.date) >= weekAgo);
        } else if (categoryPeriodFilter === "Monthly") {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            filtered = filtered.filter((e) => new Date(e.date) >= monthStart);
        } else if (categoryPeriodFilter === "Yearly") {
            const yearStart = new Date(now.getFullYear(), 0, 1);
            filtered = filtered.filter((e) => new Date(e.date) >= yearStart);
        }

        const totalsByCategory: Record<
            string,
            { amount: number; count: number; monthlyCounts: number[] }
        > = {};

        filtered.forEach((e: any) => {
            const cat = e.category || "Uncategorized";
            if (!totalsByCategory[cat]) {
                totalsByCategory[cat] = {
                    amount: 0,
                    count: 0,
                    monthlyCounts: new Array(12).fill(0),
                };
            }
            totalsByCategory[cat].amount += e.amount;
            totalsByCategory[cat].count += 1;
            const d = new Date(e.date);
            totalsByCategory[cat].monthlyCounts[d.getMonth()] += 1;
        });

        const totalAmount = Object.values(totalsByCategory).reduce(
            (s, v) => s + v.amount,
            0,
        );
        return Object.entries(totalsByCategory).map(([category, stats]) => ({
            category,
            amount: stats.amount,
            count: stats.count,
            monthlyCounts: stats.monthlyCounts,
            percentage:
                totalAmount > 0 ? (stats.amount / totalAmount) * 100 : 0,
        }));
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Spinner color="primary" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="expense-dashboard">
            <Container fluid className="dashboard-container">
                {/* Summary Cards */}
                <Row className="mb-4">
                    <Col lg="3" md="6" className="mb-3">
                        <Card className="summary-card income-card">
                            <CardBody>
                                <div className="card-icon">💰</div>
                                <CardTitle className="card-title">
                                    Total Income
                                </CardTitle>
                                <p className="card-amount">
                                    $
                                    {analytics?.totalIncome.toFixed(2) ||
                                        "0.00"}
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" className="mb-3">
                        <Card className="summary-card expense-card">
                            <CardBody>
                                <div className="card-icon">💸</div>
                                <CardTitle className="card-title">
                                    Total Expense
                                </CardTitle>
                                <p className="card-amount">
                                    $
                                    {analytics?.totalExpense.toFixed(2) ||
                                        "0.00"}
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" className="mb-3">
                        <Card className="summary-card saving-card">
                            <CardBody>
                                <div className="card-icon">🏦</div>
                                <CardTitle className="card-title">
                                    Total Saving
                                </CardTitle>
                                <p className="card-amount">
                                    $
                                    {analytics?.totalSaving.toFixed(2) ||
                                        "0.00"}
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" className="mb-3">
                        <Card
                            className={`summary-card balance-card ${
                                (analytics?.netBalance ?? 0) >= 0
                                    ? "positive"
                                    : "negative"
                            }`}
                        >
                            <CardBody>
                                <div className="card-icon">⚖️</div>
                                <CardTitle className="card-title">
                                    Net Balance
                                </CardTitle>
                                <p className="card-amount">
                                    $
                                    {analytics?.netBalance.toFixed(2) || "0.00"}
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Monthly Summary Section */}
                <Row className="mb-4">
                    <Col lg="12">
                        <Card className="data-card">
                            <CardBody>
                                <div className="card-header">
                                    <CardTitle>
                                        Monthly Summary - {selectedYear}
                                    </CardTitle>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) =>
                                            setSelectedYear(
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="year-selector"
                                    >
                                        {[
                                            selectedYear - 2,
                                            selectedYear - 1,
                                            selectedYear,
                                            selectedYear + 1,
                                        ].map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="monthly-grid">
                                    {monthlySummary.map((month, idx) => (
                                        <div key={idx} className="monthly-item">
                                            <h5 className="month-name">
                                                {MONTHS[month.month - 1]}
                                            </h5>
                                            <div className="month-stats">
                                                <div className="stat">
                                                    <span className="stat-label">
                                                        Income
                                                    </span>
                                                    <span className="stat-value income">
                                                        $
                                                        {month.totalIncome.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="stat">
                                                    <span className="stat-label">
                                                        Expense
                                                    </span>
                                                    <span className="stat-value expense">
                                                        $
                                                        {month.totalExpense.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="stat">
                                                    <span className="stat-label">
                                                        Net
                                                    </span>
                                                    <span
                                                        className={`stat-value ${
                                                            month.netAmount >= 0
                                                                ? "positive"
                                                                : "negative"
                                                        }`}
                                                    >
                                                        $
                                                        {month.netAmount.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Category Breakdown */}
                <Row>
                    <Col lg="12">
                        <Card className="data-card">
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center">
                                    <CardTitle>Category Breakdown</CardTitle>
                                    <div className="d-flex gap-2 align-items-center">
                                        <select
                                            value={categoryTypeFilter}
                                            onChange={(e) =>
                                                setCategoryTypeFilter(
                                                    e.target.value,
                                                )
                                            }
                                            className="year-selector"
                                            title="Filter by type"
                                        >
                                            <option value="All">
                                                All Types
                                            </option>
                                            {Object.keys(
                                                analytics?.byType || {},
                                            )
                                                .filter((v) => v !== "")
                                                .map((t) => (
                                                    <option key={t} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                        </select>

                                        <select
                                            value={categoryPeriodFilter}
                                            onChange={(e) =>
                                                setCategoryPeriodFilter(
                                                    e.target.value,
                                                )
                                            }
                                            className="year-selector"
                                            title="Period"
                                        >
                                            <option value="All">
                                                All Time
                                            </option>
                                            <option value="Daily">Daily</option>
                                            <option value="Weekly">
                                                Weekly
                                            </option>
                                            <option value="Monthly">
                                                Monthly
                                            </option>
                                            <option value="Yearly">
                                                Yearly
                                            </option>
                                        </select>

                                        <Button
                                            color="secondary"
                                            size="sm"
                                            onClick={() =>
                                                setCategoryViewByMonth(
                                                    !categoryViewByMonth,
                                                )
                                            }
                                        >
                                            {categoryViewByMonth
                                                ? "Totals"
                                                : "Monthly"}
                                        </Button>
                                    </div>
                                </div>
                                {computeCategoryStats().length > 0 ? (
                                    <div className="category-list">
                                        {computeCategoryStats().map(
                                            (category, idx) => (
                                                <div
                                                    key={idx}
                                                    className="category-item"
                                                >
                                                    <div className="category-info">
                                                        <h6 className="category-name">
                                                            {category.category}
                                                        </h6>
                                                        <span className="category-count">
                                                            {category.count}{" "}
                                                            transaction
                                                            {category.count !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </span>
                                                    </div>
                                                    <div className="category-bar">
                                                        <div
                                                            className="category-progress"
                                                            style={{
                                                                width: `${category.percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="category-amount">
                                                        <span className="amount">
                                                            $
                                                            {category.amount.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                        <span className="percentage">
                                                            {category.percentage.toFixed(
                                                                1,
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="no-data">
                                        No category data available
                                    </p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Category Monthly Details */}
                {categoryViewByMonth && (
                    <Row className="mt-3">
                        <Col lg="12">
                            <Card className="data-card">
                                <CardBody>
                                    <CardTitle>
                                        Category - Month Wise Usage (
                                        {selectedYear})
                                    </CardTitle>
                                    <div className="monthly-aggregate-grid">
                                        {computeCategoryStats().map(
                                            (c, idx) => (
                                                <div
                                                    key={idx}
                                                    className="monthly-aggregate-item"
                                                >
                                                    <h6>{c.category}</h6>
                                                    <div className="monthly-compact-bar d-flex gap-1 align-items-end">
                                                        {c.monthlyCounts.map(
                                                            (m, mi) => (
                                                                <div
                                                                    key={mi}
                                                                    className="compact-bar-item"
                                                                    title={`${MONTHS[mi]}: ${m}`}
                                                                >
                                                                    <div
                                                                        className="compact-bar-fill"
                                                                        style={{
                                                                            height: `${Math.min(100, m * 10)}%`,
                                                                        }}
                                                                    />
                                                                    <div className="compact-label">
                                                                        {m}
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default ExpenseDashboard;
