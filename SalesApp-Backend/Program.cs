using Microsoft.EntityFrameworkCore;
using SalesApp_Backend.Application;
using SalesApp_Backend.Application.Interfaces;
using SalesApp_Backend.Application.Services;
using SalesApp_Backend.Infrastructure.Data;
using SalesApp_Backend.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Register Services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

// Add OpenAPI/Swagger
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Root endpoint
app.MapGet("/", () => new
{
    Name = "SalesApp Backend API",
    Version = "1.0.0",
    Status = "Running",
    Endpoints = new
    {
        Products = "/api/products",
        Customers = "/api/customers",
        OpenAPI = "/openapi/v1.json"
    },
    Timestamp = DateTime.UtcNow
})
.WithName("GetApiInfo")
.WithTags("Info");

app.Run();

