using System.ComponentModel.DataAnnotations;

namespace BackendApp.Models.Dtos
{
    public class ProjectDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Tag { get; set; }
        public int? CategoryId { get; set; }
        public int Priority { get; set; } = 1;

        public int WorkspaceId { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string? TaskLink { get; set; }

        public List<TaskDto> Tasks { get; set; } = new List<TaskDto>();
    }
}
