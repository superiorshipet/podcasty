using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using podcasty.Interfaces;
using podcasty.Dtos;

[ApiController]
[Route("api/admin/categories")]
[Authorize(Roles = "Admin")]
public class AdminCategoryController : ControllerBase
{
    private readonly ICategoryRepository _repo;
    public AdminCategoryController(ICategoryRepository repo) { _repo = repo; }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _repo.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryDto dto)
    {
        var category = await _repo.AddAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = category.CategoryId }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Edit(int id, [FromBody] CategoryDto dto)
    {
        var ok = await _repo.UpdateAsync(id, dto);
        return ok ? Ok("Category updated.") : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? Ok("Category deleted.") : NotFound();
    }
}
