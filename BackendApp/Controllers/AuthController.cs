using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BackendApp.Models;
using BackendApp.Services;
using Microsoft.AspNetCore.Identity;
using BackendApp.Models.Dtos;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BackendApp.Controllers
{
    /// <summary>
    /// API Controller for managing expenses
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Assign role (default to User if not specified)
                string role = string.IsNullOrEmpty(model.Role) ? "User" : model.Role;
                await _userManager.AddToRoleAsync(user, role);

                var token = await GenerateJwtToken(user);
                var roles = await _userManager.GetRolesAsync(user);
                
                var response = new AuthResponseDto
                {
                    Token = token,
                    Roles = roles.ToList(),
                    Email = user.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Success = true,
                    Message = "Registration successful"
                };
                
                return Ok(response);
            }

            return BadRequest(new AuthResponseDto 
            { 
                Success = false, 
                Message = "Registration failed",
                Roles = result.Errors.Select(e => e.Description).ToList()
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return Unauthorized("User not found");

                var token = await GenerateJwtToken(user);
                var roles = await _userManager.GetRolesAsync(user);
                
                var response = new AuthResponseDto
                {
                    Token = token,
                    Roles = roles.ToList(),
                    Email = user.Email,
                    FirstName = user.UserName?.Split('@')[0] ?? "User",
                    LastName = "",
                    Success = true,
                    Message = "Login successful"
                };
                
                return Ok(response);
            }

            return Unauthorized(new AuthResponseDto 
            { 
                Success = false, 
                Message = "Invalid login attempt" 
            });
        }

        [HttpPost("register-admin")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Assign Admin role
                await _userManager.AddToRoleAsync(user, "Admin");

                return Ok(new { Message = "Admin user created successfully" });
            }

            return BadRequest(result.Errors);
        }

        private async Task<string> GenerateJwtToken(IdentityUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyHere12345678901234567890"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "ReactDotNetApp",
                audience: _configuration["Jwt:Audience"] ?? "ReactDotNetApp",
                claims: claims,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}