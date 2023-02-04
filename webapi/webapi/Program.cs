using Microsoft.AspNetCore.Authentication.JwtBearer;
using BookStoreApi.Services;
using MongoDB.Driver;
using webapi.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build();
});

builder.Services.AddSingleton<IMongoClient>((settings) =>
{
    return new MongoClient(builder.Configuration.GetConnectionString("mongodb"));
});
builder.Services.AddSingleton<IDbContext, DbContext>();
builder.Services.AddSingleton<UsersService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSDevelopment", builder =>
    {
        builder
        .WithOrigins(
            "http://localhost:3000",
            "https://localhost:3000",
            "http://127.0.0.1:3000",
            "https://127.0.0.1:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });

    options.AddPolicy("CORSProduction", builder =>
    {
        builder.WithOrigins(new string[]
        {
        })
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseCors("CORSDevelopment");
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseCors("CORSProduction");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
