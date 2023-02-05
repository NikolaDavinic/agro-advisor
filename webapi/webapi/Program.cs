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
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<CategoryService>();
builder.Services.AddSingleton<TransactionService>();

var DevelopmentOrigins = "CORSDevelopment";
var ProductionOrigins = "CORSProduction";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: DevelopmentOrigins, policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://localhost:3000",
            "http://127.0.0.1:3000",
            "https://127.0.0.1:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });

    options.AddPolicy(name: ProductionOrigins, policy =>
    {
        policy
        .WithOrigins()
        .AllowAnyHeader()
        .AllowAnyMethod();
});
});

var app = builder.Build();

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseCors(DevelopmentOrigins);
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseCors(ProductionOrigins);
}


app.UseAuthorization();

app.MapControllers();

app.Run();
