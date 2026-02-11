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
  
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotesController(AppDbContext context) => _context = context;

        [HttpGet("task/{taskId}")]
        public async Task<ActionResult<IEnumerable<NoteDto>>> GetNotesByTask(int taskId)
        {
            return Ok(await _context.Notes
                .Where(n => n.TaskId == taskId)
                .Select(n => new NoteDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Description = n.Description,
                    Category = n.Category,
                    Tag = n.Tag,
                    TaskId = n.TaskId,
                    CreatedOn = n.CreatedOn,
                }).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NoteDto>> GetNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null) return NotFound();

            var noteDto = new NoteDto
            {
                Id = note.Id,
                Title = note.Title,
                Description = note.Description,
                Category = note.Category,
                Tag = note.Tag,
                TaskId = note.TaskId,
                CreatedOn = note.CreatedOn,
            };
            return noteDto;
        }

        [HttpPost]
        public async Task<ActionResult<NoteDto>> CreateNote(NoteDto noteDto)
        {
            var note = new Note
            {
                Title = noteDto.Title,
                Description = noteDto.Description,
                Category = noteDto.Category,
                Tag = noteDto.Tag,
                TaskId = noteDto.TaskId,
                CreatedOn = noteDto.CreatedOn,
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return Ok(noteDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, NoteDto noteDto)
        {
            if (id != noteDto.Id) return BadRequest();
            var note = new Note
            {
                Id = noteDto.Id,
                Title = noteDto.Title,
                Description = noteDto.Description,
                Category = noteDto.Category,
                Tag = noteDto.Tag,
                TaskId = noteDto.TaskId,
                CreatedOn = noteDto.CreatedOn,
            };

            _context.Entry(note).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null) return NotFound();
            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();
            return NoContent();
        }  
    }
}