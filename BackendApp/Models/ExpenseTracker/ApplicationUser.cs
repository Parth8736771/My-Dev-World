using Microsoft.AspNetCore.Identity;

namespace BackendApp.Models.ExpenseTracker
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty; // "My Wallet", "Parents Savings"
        public decimal CurrentBalance { get; set; }
        public string? ProfileColor { get; set; } // UI distinction
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<TransactionType> TransactionTypes { get; set; } = new List<TransactionType>();
    }
}
