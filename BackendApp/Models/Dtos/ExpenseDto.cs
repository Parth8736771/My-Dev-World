using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Dtos
{
    public class ExpenseDto
    {
        public int Id { get; set; }

        [Required]
        public string Type { get; set; } = "Expense";

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Notes { get; set; }
        public string? Category { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;

        public int TaskId { get; set; }

        public string? UserId { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.Now;
        // public decimal? Balance { get; set; } = 0;
    }
}