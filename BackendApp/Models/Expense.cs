using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models
{
    /// <summary>
    /// Represents an expense or income entry
    /// </summary>
    public class Expense
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = "Expense"; // Expense, Income, Saving

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public int TaskId { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedDate { get; set; }

        [StringLength(100)]
        public string? CreatedBy { get; set; }

        [StringLength(100)]
        public string? UpdatedBy { get; set; }
        // public decimal? Balance { get; set; } = 0;
    }
}
