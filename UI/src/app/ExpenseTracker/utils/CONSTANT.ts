// API configuration
export const API_BASE_URL = "https://localhost:5258/api"; // Adjust port based on your backend
// export const API_BASE_URL = "http://localhost:5258/api"; // Adjust port based on your backend
// export const API_BASE_URL = "https://localhost:7270/api"; // Adjust port based on your backend

// Local storage keys
export const STORAGE_KEYS = {
    THEME: "expense_tracker_theme",
    LAST_FILTER: "expense_tracker_last_filter",
    SIDEBAR_COLLAPSED: "expense_tracker_sidebar_collapsed",
};

// Data storage keys (for offline and dynamic lists)
export const DATA_STORAGE_KEYS = {
    TYPES: "expense_tracker_types",
    NAMES: "expense_tracker_names",
    CATEGORIES: "expense_tracker_categories",
    PENDING_EXPENSES: "expense_tracker_pending_expenses",
};

// Expense categories (default)
export const EXPENSE_CATEGORIES = [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Education",
    "Work",
    "Savings",
    "Investments",
    "Insurance",
    "Miscellaneous",
];

// Helpers to manage dynamic lists (persisted in localStorage)
const readList = (key: string) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const writeList = (key: string, list: string[]) => {
    try {
        localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
        console.error("Failed to write list to localStorage", e);
    }
};

export const getExpenseTypes = (): string[] => {
    const defaults = ["Expense", "Income", "Saving"];
    const stored = readList(DATA_STORAGE_KEYS.TYPES);
    return stored && Array.isArray(stored) && stored.length > 0
        ? stored
        : defaults;
};

export const addExpenseType = (type: string) => {
    const list = getExpenseTypes();
    if (!list.includes(type)) {
        const newList = [...list, type];
        writeList(DATA_STORAGE_KEYS.TYPES, newList);
        return newList;
    }
    return list;
};

export const getCommonNames = (): string[] => {
    const stored = readList(DATA_STORAGE_KEYS.NAMES);
    return stored && Array.isArray(stored) && stored.length > 0
        ? stored
        : COMMON_EXPENSE_NAMES;
};

export const addCommonName = (name: string) => {
    const list = getCommonNames();
    if (!list.includes(name)) {
        const newList = [...list, name];
        writeList(DATA_STORAGE_KEYS.NAMES, newList);
        return newList;
    }
    return list;
};

export const getCategories = (): string[] => {
    const stored = readList(DATA_STORAGE_KEYS.CATEGORIES);
    return stored && Array.isArray(stored) && stored.length > 0
        ? stored
        : EXPENSE_CATEGORIES;
};

export const addCategory = (cat: string) => {
    const list = getCategories();
    if (!list.includes(cat)) {
        const newList = [...list, cat];
        writeList(DATA_STORAGE_KEYS.CATEGORIES, newList);
        return newList;
    }
    return list;
};

// Expense names (common)
export const COMMON_EXPENSE_NAMES = [
    "Salary",
    "Rent",
    "Groceries",
    "Gas",
    "Electricity",
    "Water",
    "Internet",
    "Phone",
    "Car Payment",
    "Insurance",
    "Medical",
    "Dining Out",
    "Entertainment",
    "Shopping",
    "Bonus",
    "Side Income",
];

// Months for reference
export const MONTHS = [
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

// Theme colors
export const THEME_COLORS = {
    light: {
        primary: "#3b141c",
        secondary: "#f3961c",
        accent: "#2196f3",
        success: "#4caf50",
        danger: "#f44336",
        background: "#ffffff",
        surface: "#f5f5f5",
        text: "#333333",
    },
    dark: {
        primary: "#f3961c",
        secondary: "#3b141c",
        accent: "#2196f3",
        success: "#66bb6a",
        danger: "#ef5350",
        background: "#121212",
        surface: "#1e1e1e",
        text: "#ffffff",
    },
    rose: {
        primary: "#f43f5e",
        secondary: "#fb7185",
        accent: "#2196f3",
        success: "#4caf50",
        danger: "#f44336",
        background: "#fff1f4",
        surface: "#fff7f9",
        text: "#1f2937",
    },
};

export const STRING = {
    Theme: "theme_mode",
};

// Expense related constants and enums
export const ExpenseTypeEnum = {
    Expense: "Expense",
    Income: "Income",
    Saving: "Saving",
} as const;

export type ExpenseTypeKey = keyof typeof ExpenseTypeEnum;
export type ExpenseType = (typeof ExpenseTypeEnum)[ExpenseTypeKey];

export const FilterPeriod = {
    All: "All",
    Daily: "Daily",
    Weekly: "Weekly",
    Monthly: "Monthly",
    Yearly: "Yearly",
} as const;

export const ThemeMode = {
    Light: "light",
    Dark: "dark",
    Rose: "rose",
} as const;
