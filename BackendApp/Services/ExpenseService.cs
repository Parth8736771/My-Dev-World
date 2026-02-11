using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendApp.Models;

namespace BackendApp.Services
{
    /// <summary>
    /// Service for managing expenses with in-memory storage
    /// Can be replaced with database context later
    /// </summary>
    public interface IExpenseService
    {
        Task<List<Expense>> GetAllExpensesAsync();
        Task<Expense?> GetExpenseByIdAsync(int id);
        Task<Expense> CreateExpenseAsync(Expense expense);
        Task<Expense> UpdateExpenseAsync(int id, Expense expense);
        Task<bool> DeleteExpenseAsync(int id);
        Task<List<Expense>> GetExpensesByTypeAsync(string type);
        Task<List<Expense>> GetExpensesByCategoryAsync(string category);
        Task<List<Expense>> GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<ExpenseAnalytics> GetAnalyticsAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<List<MonthlySummary>> GetMonthlySummaryAsync(int year);
        Task<List<CategoryBreakdown>> GetCategoryBreakdownAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<List<string>> GetExpenseNamesAsync();
    }

    public class ExpenseService : IExpenseService
    {
        private static List<Expense> _expenses = new()
        {
            // new Expense
            // {
            //     Id = 1,
            //     Type = "Income",
            //     Amount = 5000,
            //     Name = "Salary",
            //     Description = "Monthly salary",
            //     Category = "Work",
            //     Date = new DateTime(2024, 1, 5),
            //     TaskId = 0,
            //     CreatedDate = new DateTime(2024, 1, 5)
            // },
            // new Expense
            // {
            //     Id = 2,
            //     Type = "Expense",
            //     Amount = 1200,
            //     Name = "Rent",
            //     Description = "Monthly rent",
            //     Category = "Housing",
            //     Date = new DateTime(2024, 1, 1),
            //     TaskId = 0,
            //     CreatedDate = new DateTime(2024, 1, 1)
            // },
            // new Expense
            // {
            //     Id = 3,
            //     Type = "Expense",
            //     Amount = 300,
            //     Name = "Groceries",
            //     Description = "Weekly grocery shopping",
            //     Category = "Food",
            //     Date = new DateTime(2024, 1, 8),
            //     TaskId = 0,
            //     CreatedDate = new DateTime(2024, 1, 8)
            // }
        };

        private static int _nextId = 4;

        public async Task<List<Expense>> GetAllExpensesAsync()
        {
            return await System.Threading.Tasks.Task.FromResult(_expenses.OrderByDescending(e => e.Date).ToList());
        }

        public async Task<Expense?> GetExpenseByIdAsync(int id)
        {
            return await System.Threading.Tasks.Task.FromResult(_expenses.FirstOrDefault(e => e.Id == id));
        }

        public async Task<Expense> CreateExpenseAsync(Expense expense)
        {
            expense.Id = _nextId++;
            expense.CreatedDate = DateTime.UtcNow;
            // var prevExpense = await GetExpenseByIdAsync(_nextId);
            //     if (prevExpense != null)
            //     {
            //         expense.Balance = prevExpense.Balance + (expense.Type.Equals("Income", StringComparison.OrdinalIgnoreCase) ? expense.Amount : -expense.Amount);
            //     }
            //     else
            //     {
            //         expense.Balance = expense.Type.Equals("Income", StringComparison.OrdinalIgnoreCase) ? expense.Amount : -expense.Amount;
            //     }

            _expenses.Add(expense);
            return await System.Threading.Tasks.Task.FromResult(expense);
        }

        public async Task<Expense> UpdateExpenseAsync(int id, Expense expense)
        {
            var existing = _expenses.FirstOrDefault(e => e.Id == id);
            if (existing == null)
                throw new KeyNotFoundException($"Expense with id {id} not found");

            existing.Type = expense.Type;
            existing.Amount = expense.Amount;
            existing.Name = expense.Name;
            existing.Description = expense.Description;
            existing.Notes = expense.Notes;
            existing.Category = expense.Category;
            existing.Date = expense.Date;
            existing.UpdatedDate = DateTime.UtcNow;
            // if (expense.Type.Equals("Income", StringComparison.OrdinalIgnoreCase))
            // {
            //     existing.Balance += expense.Amount - existing.Amount;
            // }
            // else
            // {
            //     existing.Balance -= expense.Amount - existing.Amount;
            // }
            

            return await System.Threading.Tasks.Task.FromResult(existing);
        }

        public async Task<bool> DeleteExpenseAsync(int id)
        {
            var expense = _expenses.FirstOrDefault(e => e.Id == id);
            if (expense == null)
                return await System.Threading.Tasks.Task.FromResult(false);

            _expenses.Remove(expense);
            return await System.Threading.Tasks.Task.FromResult(true);
        }

        public async Task<List<Expense>> GetExpensesByTypeAsync(string type)
        {
            return await System.Threading.Tasks.Task.FromResult(
                _expenses
                    .Where(e => e.Type.Equals(type, StringComparison.OrdinalIgnoreCase))
                    .OrderByDescending(e => e.Date)
                    .ToList()
            );
        }

        public async Task<List<Expense>> GetExpensesByCategoryAsync(string category)
        {
            return await System.Threading.Tasks.Task.FromResult(
                _expenses
                    .Where(e => !string.IsNullOrEmpty(e.Category) && 
                           e.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                    .OrderByDescending(e => e.Date)
                    .ToList()
            );
        }

        public async Task<List<Expense>> GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await System.Threading.Tasks.Task.FromResult(
                _expenses
                    .Where(e => e.Date >= startDate && e.Date <= endDate)
                    .OrderByDescending(e => e.Date)
                    .ToList()
            );
        }

        public async Task<ExpenseAnalytics> GetAnalyticsAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var start = startDate ?? new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var end = endDate ?? DateTime.UtcNow.AddDays(1);

            var filteredExpenses = _expenses
                .Where(e => e.Date >= start && e.Date <= end)
                .ToList();

            var analytics = new ExpenseAnalytics
            {
                PeriodStart = start,
                PeriodEnd = end,
                TotalTransactions = filteredExpenses.Count,
                TotalIncome = filteredExpenses
                    .Where(e => e.Type.Equals("Income", StringComparison.OrdinalIgnoreCase))
                    .Sum(e => e.Amount),
                TotalExpense = filteredExpenses
                    .Where(e => e.Type.Equals("Expense", StringComparison.OrdinalIgnoreCase))
                    .Sum(e => e.Amount),
                TotalSaving = filteredExpenses
                    .Where(e => e.Type.Equals("Saving", StringComparison.OrdinalIgnoreCase))
                    .Sum(e => e.Amount),
            };

            analytics.NetBalance = analytics.TotalIncome - analytics.TotalExpense - analytics.TotalSaving;

            // Group by type
            analytics.ByType = filteredExpenses
                .GroupBy(e => e.Type)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

            // Group by category - ensure non-nullable keys
            analytics.ByCategory = filteredExpenses
                .Where(e => !string.IsNullOrEmpty(e.Category))
                .GroupBy(e => e.Category ?? "Uncategorized")
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

            // Group by month
            analytics.ByMonth = filteredExpenses
                .GroupBy(e => e.Date.ToString("yyyy-MM"))
                .OrderBy(g => g.Key)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

            return await System.Threading.Tasks.Task.FromResult(analytics);
        }

        public async Task<List<MonthlySummary>> GetMonthlySummaryAsync(int year)
        {
            var yearExpenses = _expenses
                .Where(e => e.Date.Year == year)
                .ToList();

            var summaries = Enumerable.Range(1, 12)
                .Select(month =>
                {
                    var monthExpenses = yearExpenses
                        .Where(e => e.Date.Month == month)
                        .ToList();

                    return new MonthlySummary
                    {
                        Month = month,
                        Year = year,
                        TotalIncome = monthExpenses
                            .Where(e => e.Type.Equals("Income", StringComparison.OrdinalIgnoreCase))
                            .Sum(e => e.Amount),
                        TotalExpense = monthExpenses
                            .Where(e => e.Type.Equals("Expense", StringComparison.OrdinalIgnoreCase))
                            .Sum(e => e.Amount),
                        TransactionCount = monthExpenses.Count,
                    };
                })
                .ToList();

            foreach (var summary in summaries)
            {
                summary.NetAmount = summary.TotalIncome - summary.TotalExpense;
            }

            return await System.Threading.Tasks.Task.FromResult(summaries);
        }

        public async Task<List<CategoryBreakdown>> GetCategoryBreakdownAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var start = startDate ?? new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var end = endDate ?? DateTime.UtcNow.AddDays(1);

            var filtered = _expenses
                .Where(e => e.Date >= start && e.Date <= end && !string.IsNullOrEmpty(e.Category))
                .ToList();

            var total = filtered.Sum(e => e.Amount);

            var breakdown = filtered
                .GroupBy(e => e.Category)
                .Select(g => new CategoryBreakdown
                {
                    Category = g.Key ?? "Uncategorized",
                    Amount = g.Sum(e => e.Amount),
                    Count = g.Count(),
                    Percentage = total > 0 ? (g.Sum(e => e.Amount) / total) * 100 : 0
                })
                .OrderByDescending(c => c.Amount)
                .ToList();

            return await System.Threading.Tasks.Task.FromResult(breakdown);
        }

        public async Task<List<string>> GetExpenseNamesAsync()
        {
            return await System.Threading.Tasks.Task.FromResult(
                _expenses
                    .Select(e => e.Name)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToList()
            );
        }
    }
}
