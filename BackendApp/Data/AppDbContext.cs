//using Microsoft.AspNetCore.Identity;
using BackendApp.Models;
using BackendApp.Models.ExpenseTracker;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BackendApp.Data
{

    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Workspace> Workspaces { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<BackendApp.Models.Task> Tasks { get; set; }
        public DbSet<QuestionCategory> QuestionCategories { get; set; }
        public DbSet<QuestionTag> QuestionTags { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<ExpenseName> ExpenseNames { get; set; }
        public DbSet<Learning> Learnings { get; set; }
        public DbSet<Expense> Expenses { get; set; }

        /// Expense Tracker
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionType> TransactionTypes { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }
    }

}