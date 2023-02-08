using Microsoft.AspNetCore.Authentication.JwtBearer;
using MongoDB.Driver;
using webapi.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using webapi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

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
    return new MongoClient(builder.Configuration.GetConnectionString("Mongodb"));
});
builder.Services.AddSingleton<IDbContext, DbContext>();
builder.Services.AddSingleton<TransactionService>();
builder.Services.AddSingleton<MachineryService>();
builder.Services.AddSingleton<CategoryService>();
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<PlotService>();
builder.Services.AddSingleton<FileService>();
builder.Services.AddSingleton<HarvestService>();

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
