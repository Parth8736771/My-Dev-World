using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Dtos
{
    public class QuestionCategoryDto
    {
        public int QuestionCategoryId { get; set; }

        [Required]
        public string QuestionCategoryName { get; set; } = string.Empty;

        public string? QuestionCategoryDescription { get; set; }
    }
}