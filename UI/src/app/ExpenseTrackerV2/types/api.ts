export interface Transaction {
    id: number;
    type: "Expense" | "Income" | "Saving" | "Investment";
    amount: number;
    category: string;
    subcategory: string;
    date: string;
    balance: number;
}

export interface CreateTransactionData {
    type: "Expense" | "Income" | "Saving" | "Investment";
    amount: number;
    category: string;
    subcategory: string;
    date: string;
}
