using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BackendApp.Models;
using BackendApp.Services;

namespace BackendApp.Controllers
{
    /// <summary>
    /// API Controller for managing expenses
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;
        private readonly ILogger<ExpensesController> _logger;

        public ExpensesController(IExpenseService expenseService, ILogger<ExpensesController> logger)
        {
            _expenseService = expenseService;
            _logger = logger;
        }

        /// <summary>
        /// Get all expenses
        /// </summary>
        /// <returns>List of all expenses</returns>
        [HttpGet]
        public async Task<ActionResult<List<Expense>>> GetAllExpenses()
        {
            try
            {
                var expenses = await _expenseService.GetAllExpensesAsync();
                return Ok(expenses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching expenses");
                return StatusCode(500, new { message = "Error fetching expenses", error = ex.Message });
            }
        }

        /// <summary>
        /// Get expense by ID
        /// </summary>
        /// <param name="id">Expense ID</param>
        /// <returns>Expense details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpenseById(int id)
        {
            try
            {
                var expense = await _expenseService.GetExpenseByIdAsync(id);
                if (expense == null)
                    return NotFound(new { message = $"Expense with id {id} not found" });

                return Ok(expense);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching expense");
                return StatusCode(500, new { message = "Error fetching expense", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new expense
        /// </summary>
        /// <param name="expense">Expense data</param>
        /// <returns>Created expense</returns>
        [HttpPost]
        public async Task<ActionResult<Expense>> CreateExpense([FromBody] Expense expense)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (expense.Date == default)
                    expense.Date = DateTime.UtcNow;

                var createdExpense = await _expenseService.CreateExpenseAsync(expense);
                return CreatedAtAction(nameof(GetExpenseById), new { id = createdExpense.Id }, createdExpense);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating expense");
                return StatusCode(500, new { message = "Error creating expense", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing expense
        /// </summary>
        /// <param name="id">Expense ID</param>
        /// <param name="expense">Updated expense data</param>
        /// <returns>Updated expense</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<Expense>> UpdateExpense(int id, [FromBody] Expense expense)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existingExpense = await _expenseService.GetExpenseByIdAsync(id);
                if (existingExpense == null)
                    return NotFound(new { message = $"Expense with id {id} not found" });

                var updatedExpense = await _expenseService.UpdateExpenseAsync(id, expense);
                return Ok(updatedExpense);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating expense");
                return StatusCode(500, new { message = "Error updating expense", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete an expense
        /// </summary>
        /// <param name="id">Expense ID</param>
        /// <returns>Success message</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExpense(int id)
        {
            try
            {
                var result = await _expenseService.DeleteExpenseAsync(id);
                if (!result)
                    return NotFound(new { message = $"Expense with id {id} not found" });

                return Ok(new { message = "Expense deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting expense");
                return StatusCode(500, new { message = "Error deleting expense", error = ex.Message });
            }
        }

        /// <summary>
        /// Get expenses filtered by type
        /// </summary>
        /// <param name="type">Expense type (Income, Expense, Saving)</param>
        /// <returns>List of expenses of specified type</returns>
        [HttpGet("by-type/{type}")]
        public async Task<ActionResult<List<Expense>>> GetExpensesByType(string type)
        {
            try
            {
                var expenses = await _expenseService.GetExpensesByTypeAsync(type);
                return Ok(expenses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching expenses by type");
                return StatusCode(500, new { message = "Error fetching expenses", error = ex.Message });
            }
        }

        /// <summary>
        /// Get expenses filtered by category
        /// </summary>
        /// <param name="category">Category name</param>
        /// <returns>List of expenses in category</returns>
        [HttpGet("by-category/{category}")]
        public async Task<ActionResult<List<Expense>>> GetExpensesByCategory(string category)
        {
            try
            {
                var expenses = await _expenseService.GetExpensesByCategoryAsync(category);
                return Ok(expenses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching expenses by category");
                return StatusCode(500, new { message = "Error fetching expenses", error = ex.Message });
            }
        }

        /// <summary>
        /// Get expenses within date range
        /// </summary>
        /// <param name="startDate">Start date (yyyy-MM-dd)</param>
        /// <param name="endDate">End date (yyyy-MM-dd)</param>
        /// <returns>List of expenses in date range</returns>
        [HttpGet("date-range")]
        public async Task<ActionResult<List<Expense>>> GetExpensesByDateRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                    return BadRequest(new { message = "Start date must be before end date" });

                var expenses = await _expenseService.GetExpensesByDateRangeAsync(startDate, endDate);
                return Ok(expenses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching expenses by date range");
                return StatusCode(500, new { message = "Error fetching expenses", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all unique expense names for filtering
        /// </summary>
        /// <returns>List of expense names</returns>
        [HttpGet("names/all")]
        public async Task<ActionResult<List<string>>> GetExpenseNames()
        {
            try
            {
                var names = await _expenseService.GetExpenseNamesAsync();
                return Ok(names);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching expense names");
                return StatusCode(500, new { message = "Error fetching expense names", error = ex.Message });
            }
        }

        /// <summary>
        /// Get analytics for expenses
        /// </summary>
        /// <param name="startDate">Start date (optional)</param>
        /// <param name="endDate">End date (optional)</param>
        /// <returns>Analytics data</returns>
        [HttpGet("analytics/summary")]
        public async Task<ActionResult<ExpenseAnalytics>> GetAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var analytics = await _expenseService.GetAnalyticsAsync(startDate, endDate);
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching analytics");
                return StatusCode(500, new { message = "Error fetching analytics", error = ex.Message });
            }
        }

        /// <summary>
        /// Get monthly summary for a specific year
        /// </summary>
        /// <param name="year">Year</param>
        /// <returns>Monthly summaries</returns>
        [HttpGet("analytics/monthly/{year}")]
        public async Task<ActionResult<List<MonthlySummary>>> GetMonthlySummary(int year)
        {
            try
            {
                var currentYear = DateTime.Now.Year;
                if (year < 2000 || year > currentYear + 10)
                    return BadRequest(new { message = "Invalid year" });

                var summaries = await _expenseService.GetMonthlySummaryAsync(year);
                return Ok(summaries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching monthly summary");
                return StatusCode(500, new { message = "Error fetching monthly summary", error = ex.Message });
            }
        }

        /// <summary>
        /// Get category breakdown
        /// </summary>
        /// <param name="startDate">Start date (optional)</param>
        /// <param name="endDate">End date (optional)</param>
        /// <returns>Category breakdown</returns>
        [HttpGet("analytics/categories")]
        public async Task<ActionResult<List<CategoryBreakdown>>> GetCategoryBreakdown(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var breakdown = await _expenseService.GetCategoryBreakdownAsync(startDate, endDate);
                return Ok(breakdown);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching category breakdown");
                return StatusCode(500, new { message = "Error fetching category breakdown", error = ex.Message });
            }
        }
    }
}
