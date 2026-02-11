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
    public class QuestionTagsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionTagsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionTagDto>>> GetQuestionTags()
        {
            return Ok(await _context.QuestionTags
                .Select(t => new QuestionTagDto
                {
                    QuestionTagId = t.QuestionTagId,
                    QuestionTagName = t.QuestionTagName,
                    QuestionTagDescription = t.QuestionTagDescription
                }).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionTagDto>> GetQuestionTag(int id)
        {
            var tag = await _context.QuestionTags.FindAsync(id);
            if (tag == null) return NotFound();

            return Ok(new QuestionTagDto
            {
                QuestionTagId = tag.QuestionTagId,
                QuestionTagName = tag.QuestionTagName,
                QuestionTagDescription = tag.QuestionTagDescription
            });
        }

        [HttpPost]
        public async Task<ActionResult<QuestionTagDto>> CreateQuestionTag(QuestionTagDto tagDto)
        {
            var tag = new QuestionTag
            {
                QuestionTagName = tagDto.QuestionTagName,
                QuestionTagDescription = tagDto.QuestionTagDescription
            };

            _context.QuestionTags.Add(tag);
            await _context.SaveChangesAsync();

            tagDto.QuestionTagId = tag.QuestionTagId;
            return CreatedAtAction(nameof(GetQuestionTag), new { id = tag.QuestionTagId }, tagDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestionTag(int id, QuestionTagDto tagDto)
        {
            if (id != tagDto.QuestionTagId) return BadRequest();

            var tag = await _context.QuestionTags.FindAsync(id);
            if (tag == null) return NotFound();

            tag.QuestionTagName = tagDto.QuestionTagName;
            tag.QuestionTagDescription = tagDto.QuestionTagDescription;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionTag(int id)
        {
            var tag = await _context.QuestionTags.FindAsync(id);
            if (tag == null) return NotFound();

            _context.QuestionTags.Remove(tag);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}