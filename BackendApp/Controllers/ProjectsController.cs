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
    [Route("api/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            return Ok(await _context.Projects.Include(p => p.Tasks).Include(p => p.Workspace)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Tag = p.Tag,
                    CategoryId = p.CategoryId,
                    Priority = p.Priority,
                    CreatedDate = p.CreatedDate,
                    TaskLink = p.TaskLink,
                    WorkspaceId = p.WorkspaceId,
                    Tasks = p.Tasks.Select(t => new TaskDto
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Description = t.Description,
                        Tag = t.Tag,
                        CategoryId = t.CategoryId,
                        Priority = t.Priority,
                        CreatedDate = t.CreatedDate,
                        WorkspaceId = p.WorkspaceId,
                        ProjectId = t.ProjectId
                    }).ToList()
                }).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(int id)
        {
            var project = await _context.Projects.Include(p => p.Tasks).Include(p => p.Workspace).FirstOrDefaultAsync(p => p.Id == id);
            if (project == null) return NotFound();

            var projectDto = new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Tag = project.Tag,
                CategoryId = project.CategoryId,
                Priority = project.Priority,
                CreatedDate = project.CreatedDate,
                TaskLink = project.TaskLink,
                WorkspaceId = project.WorkspaceId,
                Tasks = project.Tasks.Select(t => new TaskDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    Tag = t.Tag,
                    CategoryId = t.CategoryId,
                    Priority = t.Priority,
                    CreatedDate = t.CreatedDate,
                    WorkspaceId = project.WorkspaceId,
                    ProjectId = t.ProjectId,
                }).ToList()
            };
            return projectDto;
        }

        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject(ProjectDto projectDto)
        {
            var project = new Project
            {
                Id = projectDto.Id,
                Name = projectDto.Name,
                Description = projectDto.Description,
                Tag = projectDto.Tag,
                CategoryId = projectDto.CategoryId,
                Priority = projectDto.Priority,
                CreatedDate = projectDto.CreatedDate,
                WorkspaceId = projectDto.WorkspaceId,
                TaskLink = projectDto.TaskLink,
            };
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectDto projectDto)
        {
            if (id != projectDto.Id) return BadRequest();
            var project = new Project
            {
                Id = projectDto.Id,
                Name = projectDto.Name,
                Description = projectDto.Description,
                Tag = projectDto.Tag,
                CategoryId = projectDto.CategoryId,
                Priority = projectDto.Priority,
                CreatedDate = projectDto.CreatedDate,
                TaskLink = projectDto.TaskLink,
                WorkspaceId = projectDto.WorkspaceId,
            };

            _context.Entry(project).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}