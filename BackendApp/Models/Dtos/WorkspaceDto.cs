using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Dtos
{
    public class WorkspaceDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Tag { get; set; }
        public int? CategoryId { get; set; }
        public int Priority { get; set; } = 1;

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public List<ProjectDto> Projects { get; set; } = new List<ProjectDto>();
    }
}
