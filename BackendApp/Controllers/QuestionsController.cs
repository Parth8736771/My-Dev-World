using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BackendApp.Models;
using BackendApp.Services;
using BackendApp.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using BackendApp.Data;

namespace BackendApp.Controllers
{
    /// <summary>
    /// API Controller for managing expenses
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetQuestions()
        {
            return Ok(await _context.Questions
                .Include(q => q.QuestionCategory)
                .Include(q => q.QuestionTag)
                .Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    QuestionDescription = q.QuestionDescription,
                    QuestionCategoryId = q.QuestionCategoryId,
                    QuestionTagId = q.QuestionTagId,
                    QuestionExample1 = q.QuestionExample1,
                    QuestionExample2 = q.QuestionExample2,
                    QuestionExample3 = q.QuestionExample3,
                    QuestionExample4 = q.QuestionExample4,
                    QuestionExample5 = q.QuestionExample5,
                    QuestionOption1 = q.QuestionOption1,
                    QuestionOption2 = q.QuestionOption2,
                    QuestionOption3 = q.QuestionOption3,
                    QuestionOption4 = q.QuestionOption4,
                    QuestionOption5 = q.QuestionOption5,
                    QuestionAnswerId = q.QuestionAnswerId,
                    QuestionAnswerDescription = q.QuestionAnswerDescription,
                    QuestionAnswerProgrammingLanguage1 = q.QuestionAnswerProgrammingLanguage1,
                    QuestionAnswerProgrammingLanguage2 = q.QuestionAnswerProgrammingLanguage2,
                    QuestionAnswerProgrammingLanguage3 = q.QuestionAnswerProgrammingLanguage3,
                    QuestionAnswerProgrammingLanguage4 = q.QuestionAnswerProgrammingLanguage4,
                    QuestionAnswerProgrammingLanguage5 = q.QuestionAnswerProgrammingLanguage5,
                    CreatedDate = q.CreatedDate,
                    QuestionCategoryName = q.QuestionCategory != null ? q.QuestionCategory.QuestionCategoryName : null,
                    QuestionTagName = q.QuestionTag != null ? q.QuestionTag.QuestionTagName : null
                }).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionDto>> GetQuestion(int id)
        {
            var question = await _context.Questions
                .Include(q => q.QuestionCategory)
                .Include(q => q.QuestionTag)
                .FirstOrDefaultAsync(q => q.QuestionId == id);

            if (question == null) return NotFound();

            return Ok(new QuestionDto
            {
                QuestionId = question.QuestionId,
                QuestionDescription = question.QuestionDescription,
                QuestionCategoryId = question.QuestionCategoryId,
                QuestionTagId = question.QuestionTagId,
                QuestionExample1 = question.QuestionExample1,
                QuestionExample2 = question.QuestionExample2,
                QuestionExample3 = question.QuestionExample3,
                QuestionExample4 = question.QuestionExample4,
                QuestionExample5 = question.QuestionExample5,
                QuestionOption1 = question.QuestionOption1,
                QuestionOption2 = question.QuestionOption2,
                QuestionOption3 = question.QuestionOption3,
                QuestionOption4 = question.QuestionOption4,
                QuestionOption5 = question.QuestionOption5,
                QuestionAnswerId = question.QuestionAnswerId,
                QuestionAnswerDescription = question.QuestionAnswerDescription,
                QuestionAnswerProgrammingLanguage1 = question.QuestionAnswerProgrammingLanguage1,
                QuestionAnswerProgrammingLanguage2 = question.QuestionAnswerProgrammingLanguage2,
                QuestionAnswerProgrammingLanguage3 = question.QuestionAnswerProgrammingLanguage3,
                QuestionAnswerProgrammingLanguage4 = question.QuestionAnswerProgrammingLanguage4,
                QuestionAnswerProgrammingLanguage5 = question.QuestionAnswerProgrammingLanguage5,
                CreatedDate = question.CreatedDate,
                QuestionCategoryName = question.QuestionCategory != null ? question.QuestionCategory.QuestionCategoryName : null,
                QuestionTagName = question.QuestionTag != null ? question.QuestionTag.QuestionTagName : null
            });
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetQuestionsByCategory(int categoryId)
        {
            return Ok(await _context.Questions
                .Include(q => q.QuestionCategory)
                .Include(q => q.QuestionTag)
                .Where(q => q.QuestionCategoryId == categoryId)
                .Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    QuestionDescription = q.QuestionDescription,
                    QuestionCategoryId = q.QuestionCategoryId,
                    QuestionTagId = q.QuestionTagId,
                    QuestionExample1 = q.QuestionExample1,
                    QuestionExample2 = q.QuestionExample2,
                    QuestionExample3 = q.QuestionExample3,
                    QuestionExample4 = q.QuestionExample4,
                    QuestionExample5 = q.QuestionExample5,
                    QuestionOption1 = q.QuestionOption1,
                    QuestionOption2 = q.QuestionOption2,
                    QuestionOption3 = q.QuestionOption3,
                    QuestionOption4 = q.QuestionOption4,
                    QuestionOption5 = q.QuestionOption5,
                    QuestionAnswerId = q.QuestionAnswerId,
                    QuestionAnswerDescription = q.QuestionAnswerDescription,
                    QuestionAnswerProgrammingLanguage1 = q.QuestionAnswerProgrammingLanguage1,
                    QuestionAnswerProgrammingLanguage2 = q.QuestionAnswerProgrammingLanguage2,
                    QuestionAnswerProgrammingLanguage3 = q.QuestionAnswerProgrammingLanguage3,
                    QuestionAnswerProgrammingLanguage4 = q.QuestionAnswerProgrammingLanguage4,
                    QuestionAnswerProgrammingLanguage5 = q.QuestionAnswerProgrammingLanguage5,
                    CreatedDate = q.CreatedDate,
                    QuestionCategoryName = q.QuestionCategory != null ? q.QuestionCategory.QuestionCategoryName : null,
                    QuestionTagName = q.QuestionTag != null ? q.QuestionTag.QuestionTagName : null
                }).ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<QuestionDto>> CreateQuestion(QuestionDto questionDto)
        {
            var question = new Question
            {
                QuestionDescription = questionDto.QuestionDescription,
                QuestionCategoryId = questionDto.QuestionCategoryId,
                QuestionTagId = questionDto.QuestionTagId,
                QuestionExample1 = questionDto.QuestionExample1,
                QuestionExample2 = questionDto.QuestionExample2,
                QuestionExample3 = questionDto.QuestionExample3,
                QuestionExample4 = questionDto.QuestionExample4,
                QuestionExample5 = questionDto.QuestionExample5,
                QuestionOption1 = questionDto.QuestionOption1,
                QuestionOption2 = questionDto.QuestionOption2,
                QuestionOption3 = questionDto.QuestionOption3,
                QuestionOption4 = questionDto.QuestionOption4,
                QuestionOption5 = questionDto.QuestionOption5,
                QuestionAnswerId = questionDto.QuestionAnswerId,
                QuestionAnswerDescription = questionDto.QuestionAnswerDescription,
                QuestionAnswerProgrammingLanguage1 = questionDto.QuestionAnswerProgrammingLanguage1,
                QuestionAnswerProgrammingLanguage2 = questionDto.QuestionAnswerProgrammingLanguage2,
                QuestionAnswerProgrammingLanguage3 = questionDto.QuestionAnswerProgrammingLanguage3,
                QuestionAnswerProgrammingLanguage4 = questionDto.QuestionAnswerProgrammingLanguage4,
                QuestionAnswerProgrammingLanguage5 = questionDto.QuestionAnswerProgrammingLanguage5
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            questionDto.QuestionId = question.QuestionId;
            return CreatedAtAction(nameof(GetQuestion), new { id = question.QuestionId }, questionDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, QuestionDto questionDto)
        {
            if (id != questionDto.QuestionId) return BadRequest();

            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();

            question.QuestionDescription = questionDto.QuestionDescription;
            question.QuestionCategoryId = questionDto.QuestionCategoryId;
            question.QuestionTagId = questionDto.QuestionTagId;
            question.QuestionExample1 = questionDto.QuestionExample1;
            question.QuestionExample2 = questionDto.QuestionExample2;
            question.QuestionExample3 = questionDto.QuestionExample3;
            question.QuestionExample4 = questionDto.QuestionExample4;
            question.QuestionExample5 = questionDto.QuestionExample5;
            question.QuestionOption1 = questionDto.QuestionOption1;
            question.QuestionOption2 = questionDto.QuestionOption2;
            question.QuestionOption3 = questionDto.QuestionOption3;
            question.QuestionOption4 = questionDto.QuestionOption4;
            question.QuestionOption5 = questionDto.QuestionOption5;
            question.QuestionAnswerId = questionDto.QuestionAnswerId;
            question.QuestionAnswerDescription = questionDto.QuestionAnswerDescription;
            question.QuestionAnswerProgrammingLanguage1 = questionDto.QuestionAnswerProgrammingLanguage1;
            question.QuestionAnswerProgrammingLanguage2 = questionDto.QuestionAnswerProgrammingLanguage2;
            question.QuestionAnswerProgrammingLanguage3 = questionDto.QuestionAnswerProgrammingLanguage3;
            question.QuestionAnswerProgrammingLanguage4 = questionDto.QuestionAnswerProgrammingLanguage4;
            question.QuestionAnswerProgrammingLanguage5 = questionDto.QuestionAnswerProgrammingLanguage5;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}