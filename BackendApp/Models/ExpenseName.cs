using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models;

public class ExpenseName
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? UserId { get; set; } // Assuming Identity User

    public DateTime CreatedOn { get; set; } = DateTime.Now;
}