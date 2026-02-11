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
    [Route("api/workspaces")]
    public class WorkspacesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkspacesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkspaceDto>>> GetWorkspaces()
        {
            return Ok(await _context.Workspaces.Include(w => w.Projects)
                .Select(w => new WorkspaceDto
                {
                    Id = w.Id,
                    Name = w.Name,
                    Description = w.Description,
                    CategoryId = w.CategoryId,
                    Tag = w.Tag,
                    Priority = w.Priority,
                    CreatedDate = w.CreatedDate,
                    Projects = w.Projects.Select(p => new ProjectDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        CategoryId = p.CategoryId,
                        Tag = p.Tag,
                        Priority = p.Priority,
                        CreatedDate = p.CreatedDate
                    }).ToList()
                }).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorkspaceDto>> GetWorkspace(int id)
        {
            var workspace = await _context.Workspaces.Include(w => w.Projects).FirstOrDefaultAsync(w => w.Id == id);

            if (workspace == null) return NotFound();
            WorkspaceDto workspaceDto = new WorkspaceDto
            {
                Id = workspace.Id,
                Name = workspace.Name,
                Description = workspace.Description,
                CategoryId = workspace.CategoryId,
                Tag = workspace.Tag,
                Priority = workspace.Priority,
                CreatedDate = workspace.CreatedDate,
                Projects = workspace.Projects.Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    CategoryId = p.CategoryId,
                    Tag = p.Tag,
                    Priority = p.Priority,
                    CreatedDate = p.CreatedDate,
                }).ToList()
            };
            return workspaceDto;
        }

        [HttpPost]
        public async Task<ActionResult<Workspace>> CreateWorkspace(WorkspaceDto workspaceDto)
        {
            var workspace = new Workspace
            {
                Id = workspaceDto.Id,
                Name = workspaceDto.Name,
                Description = workspaceDto.Description,
                CategoryId = workspaceDto.CategoryId,
                Tag = workspaceDto.Tag,
                Priority = workspaceDto.Priority,
                CreatedDate = workspaceDto.CreatedDate,
            };
            _context.Workspaces.Add(workspace);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWorkspace), new { id = workspace.Id }, workspace);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkspace(int id, WorkspaceDto workspaceDto)
        {
            if (id != workspaceDto.Id) return BadRequest();

            var workspace = new Workspace
            {
                Id = workspaceDto.Id,
                Name = workspaceDto.Name,
                Description = workspaceDto.Description,
                CategoryId = workspaceDto.CategoryId,
                Tag = workspaceDto.Tag,
                Priority = workspaceDto.Priority,
                CreatedDate = workspaceDto.CreatedDate,
            };

            _context.Entry(workspace).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkspace(int id)
        {
            var workspace = await _context.Workspaces.FindAsync(id);
            if (workspace == null) return NotFound();
            _context.Workspaces.Remove(workspace);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}