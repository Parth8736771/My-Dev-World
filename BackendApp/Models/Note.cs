using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models;

public class Note
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Tag { get; set; }

    public int TaskId { get; set; }
    public Task? Task { get; set; }

    public DateTime CreatedOn { get; set; } = DateTime.Now;
}