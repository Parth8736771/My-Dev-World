namespace BackendApp.Models.ExpenseTracker
{
    public class Category
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid? TransactionTypeId { get; set; } // Optional: link to Type for scoping
        public string Name { get; set; } = string.Empty; // "Food", "Salary"
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        public ApplicationUser User { get; set; } = null!;
        public TransactionType? TransactionType { get; set; }
        public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
