using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Dtos
{
    public class QuestionTagDto
    {
        public int QuestionTagId { get; set; }

        [Required]
        public string QuestionTagName { get; set; } = string.Empty;

        public string? QuestionTagDescription { get; set; }
    }
}