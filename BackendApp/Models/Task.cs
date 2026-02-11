using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models;

public class Task
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? Tag { get; set; }
    public int CategoryId { get; set; } = 1;
    public int Priority { get; set; } = 1;

    public int ProjectId { get; set; }
    public int? WorkspaceId { get; set; }

    public Project? Project { get; set; }

    public string Status { get; set; } = "To Do";

    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public string? TaskLink { get; set; }
}