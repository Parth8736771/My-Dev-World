using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models;

public class QuestionTag
{
    public int QuestionTagId { get; set; }

    [Required]
    public string QuestionTagName { get; set; } = string.Empty;

    public string? QuestionTagDescription { get; set; }

    // Navigation property
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}