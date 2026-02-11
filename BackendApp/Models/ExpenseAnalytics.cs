using System;
using System.Collections.Generic;

namespace BackendApp.Models
{
    /// <summary>
    /// Summary statistics for expenses
    /// </summary>
    public class ExpenseAnalytics
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal TotalSaving { get; set; }
        public decimal NetBalance { get; set; }
        public int TotalTransactions { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public Dictionary<string, decimal> ByType { get; set; } = new();
        public Dictionary<string, decimal> ByCategory { get; set; } = new();
        public Dictionary<string, decimal> ByMonth { get; set; } = new();
    }

    /// <summary>
    /// Monthly summary for dashboard
    /// </summary>
    public class MonthlySummary
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal NetAmount { get; set; }
        public int TransactionCount { get; set; }
    }

    /// <summary>
    /// Category breakdown
    /// </summary>
    public class CategoryBreakdown
    {
        public required string Category { get; set; }
        public decimal Amount { get; set; }
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }
}
