namespace BackendApp.Models.ExpenseTracker
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty; // Updatable expense name
        public Guid? TransactionTypeId { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? SubcategoryId { get; set; }
        public string? Note { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false; // Soft delete for audit
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        public ApplicationUser User { get; set; } = null!;
        public TransactionType? TransactionType { get; set; }
        public Category? Category { get; set; }
        public Subcategory? Subcategory { get; set; }
    }
}
