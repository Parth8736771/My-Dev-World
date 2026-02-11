using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models;

public class Question
{
    public int QuestionId { get; set; }

    [Required]
    public string QuestionDescription { get; set; } = string.Empty;

    public int QuestionCategoryId { get; set; }
    public int QuestionTagId { get; set; }

    // Examples (up to 5)
    public string? QuestionExample1 { get; set; }
    public string? QuestionExample2 { get; set; }
    public string? QuestionExample3 { get; set; }
    public string? QuestionExample4 { get; set; }
    public string? QuestionExample5 { get; set; }

    // Options (up to 5)
    public string? QuestionOption1 { get; set; }
    public string? QuestionOption2 { get; set; }
    public string? QuestionOption3 { get; set; }
    public string? QuestionOption4 { get; set; }
    public string? QuestionOption5 { get; set; }

    // Answer
    public int? QuestionAnswerId { get; set; }
    public string? QuestionAnswerDescription { get; set; }

    // Programming language solutions (up to 5)
    public string? QuestionAnswerProgrammingLanguage1 { get; set; }
    public string? QuestionAnswerProgrammingLanguage2 { get; set; }
    public string? QuestionAnswerProgrammingLanguage3 { get; set; }
    public string? QuestionAnswerProgrammingLanguage4 { get; set; }
    public string? QuestionAnswerProgrammingLanguage5 { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.Now;

    // Navigation properties
    public QuestionCategory? QuestionCategory { get; set; }
    public QuestionTag? QuestionTag { get; set; }
}