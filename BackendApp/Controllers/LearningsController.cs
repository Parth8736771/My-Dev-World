using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BackendApp.Models;
using Microsoft.EntityFrameworkCore;
using BackendApp.Data;

namespace BackendApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearningsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LearningsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Learning>>> GetAll()
        {
            return Ok(await _context.Learnings.OrderByDescending(l => l.CreatedAt).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Learning>> Get(int id)
        {
            var item = await _context.Learnings.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Learning>> Create(Learning model)
        {
            _context.Learnings.Add(model);
            await _context.SaveChangesAsync();
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Learning model)
        {
            if (id != model.Id) return BadRequest();
            _context.Entry(model).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.Learnings.FindAsync(id);
            if (item == null) return NotFound();
            _context.Learnings.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
