using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models;

public class QuestionCategory
{
    public int QuestionCategoryId { get; set; }

    [Required]
    public string QuestionCategoryName { get; set; } = string.Empty;

    public string? QuestionCategoryDescription { get; set; }

    // Navigation property
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}