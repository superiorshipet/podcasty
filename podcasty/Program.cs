using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using podcasty.Interfaces;
using podcasty.Models;
using podcasty.Repos;
using System.Text;

internal class Program
{
    private const string MyAllowSpecificOrigins = "AllowFrontend";
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);


        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                // ✅ Use camelCase for JSON properties to match JavaScript conventions
                options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
                // ✅ Enums will be serialized as numbers by default (no converter needed)
            });
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("CS")));

        builder.Services.AddIdentity<User, IdentityRole<int>>(options =>
        {
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = true;
        })
        .AddEntityFrameworkStores<AppDbContext>();

        // Repository registrations
        builder.Services.AddScoped<IUserInteractionRepository, UserInteractionRepository>();
        builder.Services.AddScoped<IPodcastRepository, PodcastRepository>();
        builder.Services.AddScoped<IEpisodeRepository, EpisodeRepository>();
        builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
        builder.Services.AddScoped<ISortingRepository, SortingRepository>();
        builder.Services.AddScoped<IFilteringRepository, FilteringRepository>();
        builder.Services.AddScoped<IPlayHistoryRepository, PlayHistoryRepository>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<ISearchRepository, SearchRepository>();
        builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
        builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
        builder.Services.AddScoped<AppDbContext>();

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                ValidateAudience = true,
                ValidAudience = builder.Configuration["JWT:ValidAudience"],
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"] ?? "")
                ),
                ClockSkew = TimeSpan.Zero
            };
        });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(MyAllowSpecificOrigins, policy =>
            {
                policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "https://localhost:5173", "https://localhost:5174", "https://test.com")
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials();
            });
        });

        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "podcasty", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { /* ... Config ... */ });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement() { /* ... Config ... */ });
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        //app.UseHttpsRedirection();

        app.UseCors(MyAllowSpecificOrigins);

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}