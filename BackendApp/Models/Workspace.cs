using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models;

public class Workspace
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? Tag { get; set; }
    public int? CategoryId { get; set; }
    public int Priority { get; set; } = 1;

    public DateTime CreatedDate { get; set; } = DateTime.Now;

    public ICollection<Project> Projects { get; set; } = new List<Project>();
}