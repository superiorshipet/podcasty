using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Dtos;
using podcasty.Interfaces;
using podcasty.Models;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepo;

    public CategoryController(ICategoryRepository categoryRepo)
    {
        _categoryRepo = categoryRepo;
    }
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDto dto)
    {
        var category = new Category { Name = dto.Name };
        var result = await _categoryRepo.AddAsync(category);
        return Ok(new CategoryDto { CategoryId = result.CategoryId, Name = result.Name });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryRepo.GetAllAsync();
        return Ok(categories.Select(c => new CategoryDto { CategoryId = c.CategoryId, Name = c.Name }));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var category = await _categoryRepo.GetByIdAsync(id);
        if (category == null) return NotFound();
        return Ok(new CategoryDto { CategoryId = category.CategoryId, Name = category.Name });
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _categoryRepo.DeleteAsync(id);
        if (!deleted)
            return NotFound();
        return Ok("Category deleted successfully.");
    }
    [Authorize (Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryCreateDto dto)
    {
        var category = new Category { CategoryId = id, Name = dto.Name };
        var updated = await _categoryRepo.UpdateAsync(category);
        if (!updated)
            return NotFound();
        return Ok("Category updated successfully.");
    }
}
