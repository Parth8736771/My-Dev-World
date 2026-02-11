using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
        {
            return await _context.Tasks
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    Tag = t.Tag,
                    CategoryId = t.CategoryId,
                    Priority = t.Priority,
                    ProjectId = t.ProjectId,
                    WorkspaceId = t.WorkspaceId,
                    Status = "To Do" // Default status
                }).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            var taskDto = new TaskDto
            {
                Id = task.Id,
                Name = task.Name,
                Description = task.Description,
                Tag = task.Tag,
                CategoryId = task.CategoryId,
                Priority = task.Priority,
                ProjectId = task.ProjectId,
                WorkspaceId = task.WorkspaceId,
                Status = "To Do",
                TaskLink = task.TaskLink,
            };
            return taskDto;
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(TaskDto taskDto)
        {
            var task = new BackendApp.Models.Task
            {
                Name = taskDto.Name,
                Description = taskDto.Description,
                Tag = taskDto.Tag,
                CategoryId = taskDto.CategoryId,
                Priority = taskDto.Priority,
                ProjectId = taskDto.ProjectId,
                WorkspaceId = taskDto.WorkspaceId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            taskDto.Id = task.Id;
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, taskDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskDto taskDto)
        {
            if (id != taskDto.Id) return BadRequest();

            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Name = taskDto.Name;
            task.Description = taskDto.Description;
            task.Tag = taskDto.Tag;
            task.CategoryId = taskDto.CategoryId;
            task.Priority = taskDto.Priority;
            task.ProjectId = taskDto.ProjectId;
            task.WorkspaceId = taskDto.WorkspaceId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}