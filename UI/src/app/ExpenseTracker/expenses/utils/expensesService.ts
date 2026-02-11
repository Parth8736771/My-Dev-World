import axios from "axios";
import { API_BASE_URL, DATA_STORAGE_KEYS } from "../../utils/CONSTANT";
import type {
    ExpenseData,
    ExpenseAnalytics,
    MonthlySummary,
    CategoryBreakdown,
} from "../Modal/Modals";

const API = axios.create({
    baseURL: `${API_BASE_URL}/expenses`,
});

/**
 * Service for managing expenses
 */
export const expenseService = {
    /**
     * Get all expenses
     */
    async getAll(): Promise<ExpenseData[]> {
        try {
            const response = await API.get("");
            return response.data;
        } catch (err) {
            // If server is not reachable, fallback to pending local items
            try {
                const raw = localStorage.getItem(
                    DATA_STORAGE_KEYS.PENDING_EXPENSES,
                );
                const list = raw ? JSON.parse(raw) : [];
                return list as ExpenseData[];
            } catch (e) {
                throw err;
            }
        }
    },

    /**
     * Get expense by ID
     */
    async getById(id: number): Promise<ExpenseData> {
        const response = await API.get(`/${id}`);
        return response.data;
    },

    /**
     * Create new expense
     */
    async create(expense: Omit<ExpenseData, "id">): Promise<ExpenseData> {
        try {
            const response = await API.post("", expense);
            return response.data;
        } catch (err) {
            // Offline fallback: store in localStorage pending queue
            try {
                const key = DATA_STORAGE_KEYS.PENDING_EXPENSES;
                const raw = localStorage.getItem(key);
                const list = raw ? JSON.parse(raw) : [];
                const tempId = Date.now();
                const item = { id: tempId, ...expense };
                list.push(item);
                localStorage.setItem(key, JSON.stringify(list));
                // Return the locally stored item so UI can show it immediately
                return item as ExpenseData;
            } catch (e) {
                console.error("Failed to save pending expense:", e);
                throw err;
            }
        }
    },

    /**
     * Update expense
     */
    async update(
        id: number,
        expense: Partial<ExpenseData>,
    ): Promise<ExpenseData> {
        const response = await API.put(`/${id}`, expense);
        return response.data;
    },

    /**
     * Delete expense
     */
    async delete(id: number): Promise<void> {
        await API.delete(`/${id}`);
    },

    /**
     * Get expenses by type
     */
    async getByType(type: string): Promise<ExpenseData[]> {
        const response = await API.get(`/by-type/${type}`);
        return response.data;
    },

    /**
     * Get expenses by category
     */
    async getByCategory(category: string): Promise<ExpenseData[]> {
        const response = await API.get(`/by-category/${category}`);
        return response.data;
    },

    /**
     * Get expenses by date range
     */
    async getByDateRange(
        startDate: string,
        endDate: string,
    ): Promise<ExpenseData[]> {
        const response = await API.get("/date-range", {
            params: { startDate, endDate },
        });
        return response.data;
    },

    /**
     * Get all unique expense names
     */
    async getNames(): Promise<string[]> {
        const response = await API.get("/names/all");
        return response.data;
    },

    /**
     * Get analytics summary
     */
    async getAnalytics(
        startDate?: string,
        endDate?: string,
    ): Promise<ExpenseAnalytics> {
        const response = await API.get("/analytics/summary", {
            params: { startDate, endDate },
        });
        return response.data;
    },

    /**
     * Get monthly summary
     */
    async getMonthlySummary(year: number): Promise<MonthlySummary[]> {
        const response = await API.get(`/analytics/monthly/${year}`);
        return response.data;
    },

    /**
     * Get category breakdown
     */
    async getCategoryBreakdown(
        startDate?: string,
        endDate?: string,
    ): Promise<CategoryBreakdown[]> {
        const response = await API.get("/analytics/categories", {
            params: { startDate, endDate },
        });
        return response.data;
    },

    /**
     * Try syncing any pending expenses saved locally when offline
     */
    async syncPending(): Promise<void> {
        try {
            const raw = localStorage.getItem(
                DATA_STORAGE_KEYS.PENDING_EXPENSES,
            );
            if (!raw) return;
            const list: any[] = JSON.parse(raw);
            if (!list || list.length === 0) return;

            const succeeded: number[] = [];
            for (const item of list) {
                try {
                    // remove local temp id when posting
                    const copy = { ...item };
                    delete copy.id;
                    const res = await API.post("", copy);
                    if (res && res.data) {
                        succeeded.push(item.id);
                    }
                } catch (e) {
                    console.warn(
                        "Sync failed for item, will retry later",
                        item,
                    );
                }
            }

            if (succeeded.length > 0) {
                const remaining = (JSON.parse(raw) as any[]).filter(
                    (i) => !succeeded.includes(i.id),
                );
                localStorage.setItem(
                    DATA_STORAGE_KEYS.PENDING_EXPENSES,
                    JSON.stringify(remaining),
                );
            }
        } catch (e) {
            console.error("Failed syncing pending expenses:", e);
        }
    },
};

// Legacy support for old API
export const getExpenses = async (_taskId: number) => {
    try {
        return await expenseService.getAll();
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
    }
};

export const addExpense = async (
    _taskId: number,
    expense: Omit<ExpenseData, "id">,
) => {
    try {
        return await expenseService.create(expense);
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
};

export const updateExpense = async (
    _taskId: number,
    id: number,
    expense: Partial<ExpenseData>,
) => {
    try {
        return await expenseService.update(id, expense);
    } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
    }
};

export const deleteExpense = async (_taskId: number, id: number) => {
    try {
        return await expenseService.delete(id);
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
};

// export const updateExpense = async (taskId, id, updatedExpense) => {
//     try {
//         await axios.put(`${API_BASE_URL}/${id}`, {
//             id,
//             ...updatedExpense,
//             taskId,
//         });
//         return updatedExpense;
//     } catch (error) {
//         console.error("Error updating expense:", error);
//         throw error;
//     }
// };

// export const deleteExpense = async (taskId, id) => {
//     try {
//         await axios.delete(`${API_BASE_URL}/${id}`);
//     } catch (error) {
//         console.error("Error deleting expense:", error);
//         throw error;
//     }
// };

export const getExpenseById = async (_taskId: number, id: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching expense:", error);
        return null;
    }
};

export const getExpenseNames = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/names`);
        return response.data;
    } catch (error) {
        console.error("Error fetching expense names:", error);
        return [];
    }
};
