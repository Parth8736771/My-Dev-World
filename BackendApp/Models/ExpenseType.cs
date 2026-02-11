using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models
{
    /// <summary>
    /// Represents a custom expense type (e.g., Rent, Food, Entertainment)
    /// </summary>
    public class ExpenseType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Color { get; set; } // For UI representation

        [StringLength(50)]
        public string? Icon { get; set; } // Icon name for UI

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedDate { get; set; }

        [StringLength(100)]
        public string? CreatedBy { get; set; }

        [StringLength(100)]
        public string? UpdatedBy { get; set; }
    }
}
