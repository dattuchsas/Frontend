using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddHttpClient();

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor;
    options.ForwardLimit = 1;
    options.KnownNetworks.Add(
        new IPNetwork(System.Net.IPAddress.Parse("10.0.0.0"), 24));
});

builder.Services.AddDistributedMemoryCache(); // Required to store session data
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(2); // Set session timeout
    options.Cookie.HttpOnly = true; // Make the session cookie inaccessible to client-side script
    options.Cookie.IsEssential = true; // Make the session cookie essential
});

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("OracleSettings"));

// Application Services
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Database Services
//builder.Services.AddScoped<IDatabaseService, DatabaseService>();
// builder.Services.AddScoped<ITransactionalService, Transactional>();

// Common Services
builder.Services.AddScoped<IAutoNumberService, AutoNumberService>();
builder.Services.AddScoped<IGeneralValidationService, GeneralValidationService>();

builder.Services.AddSingleton(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseForwardedHeaders();

app.UseSession(); // Enable session middleware

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}");

app.Run();
