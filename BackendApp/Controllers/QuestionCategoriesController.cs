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
    public class QuestionCategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionCategoriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionCategoryDto>>> GetQuestionCategories()
        {
            return Ok(await _context.QuestionCategories
                .Select(c => new QuestionCategoryDto
                {
                    QuestionCategoryId = c.QuestionCategoryId,
                    QuestionCategoryName = c.QuestionCategoryName,
                    QuestionCategoryDescription = c.QuestionCategoryDescription
                }).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionCategoryDto>> GetQuestionCategory(int id)
        {
            var category = await _context.QuestionCategories.FindAsync(id);
            if (category == null) return NotFound();

            return Ok(new QuestionCategoryDto
            {
                QuestionCategoryId = category.QuestionCategoryId,
                QuestionCategoryName = category.QuestionCategoryName,
                QuestionCategoryDescription = category.QuestionCategoryDescription
            });
        }

        [HttpPost]
        public async Task<ActionResult<QuestionCategoryDto>> CreateQuestionCategory(QuestionCategoryDto categoryDto)
        {
            var category = new QuestionCategory
            {
                QuestionCategoryName = categoryDto.QuestionCategoryName,
                QuestionCategoryDescription = categoryDto.QuestionCategoryDescription
            };

            _context.QuestionCategories.Add(category);
            await _context.SaveChangesAsync();

            categoryDto.QuestionCategoryId = category.QuestionCategoryId;
            return CreatedAtAction(nameof(GetQuestionCategory), new { id = category.QuestionCategoryId }, categoryDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestionCategory(int id, QuestionCategoryDto categoryDto)
        {
            if (id != categoryDto.QuestionCategoryId) return BadRequest();

            var category = await _context.QuestionCategories.FindAsync(id);
            if (category == null) return NotFound();

            category.QuestionCategoryName = categoryDto.QuestionCategoryName;
            category.QuestionCategoryDescription = categoryDto.QuestionCategoryDescription;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionCategory(int id)
        {
            var category = await _context.QuestionCategories.FindAsync(id);
            if (category == null) return NotFound();

            _context.QuestionCategories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}