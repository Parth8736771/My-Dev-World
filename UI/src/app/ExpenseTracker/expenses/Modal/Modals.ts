export interface ExpenseData {
    id: number;
    type: string;
    amount: number;
    name: string;
    description?: string;
    notes?: string;
    category?: string;
    date: string;
    taskId: number;
    createdDate?: string;
    updatedDate?: string;
    createdBy?: string;
    updatedBy?: string;
    balance?: number;
}

export interface ExpenseAnalytics {
    totalIncome: number;
    totalExpense: number;
    totalSaving: number;
    netBalance: number;
    totalTransactions: number;
    periodStart: string;
    periodEnd: string;
    byType: { [key: string]: number };
    byCategory: { [key: string]: number };
    byMonth: { [key: string]: number };
}

export interface MonthlySummary {
    month: number;
    year: number;
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
    transactionCount: number;
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
    count: number;
    percentage: number;
}

export interface ExpenseFilter {
    type?: string;
    category?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
}

export const ExpenseTypeEnum = {
    Expense: "Expense",
    Income: "Income",
    Saving: "Saving",
} as const;
