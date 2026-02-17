using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Serilog;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug() // Log Debug and above
    .Enrich.FromLogContext() // Adds context info automatically
    .WriteTo.File(
        path: "Logs/app-.txt",        // Logs folder + daily files
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();

// Add HttpClient for making HTTP requests to external APIs
builder.Services.AddHttpClient();

// Add HttpContextAccessor to access HttpContext in services
builder.Services.AddHttpContextAccessor();

//// Enable forwarded headers to correctly identify client IPs when behind a reverse proxy
//builder.Services.Configure<ForwardedHeadersOptions>(options =>
//{
//    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor;
//    options.ForwardLimit = 1;
//    options.KnownNetworks.Add(
//        new IPNetwork(System.Net.IPAddress.Parse("10.0.0.0"), 24));
//});

// Add distributed memory cache for session management
builder.Services.AddDistributedMemoryCache(); // Required to store session data

// Configure session options
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20); // Set session timeout
    options.Cookie.HttpOnly = true; // Make the session cookie inaccessible to client-side script
    options.Cookie.IsEssential = true; // Make the session cookie essential
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// Configure authentication using cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
{
    options.LoginPath = "/Login/Index";
    options.LogoutPath = "/Login/Logout";
    options.AccessDeniedPath = "/Login/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
    options.SlidingExpiration = false; // IMPORTANT for banking
});

// Add authorization services
builder.Services.AddAuthorization();

// Configure database settings
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("OracleSettings"));

// Application Services
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

// Add services to the container.
builder.Services.AddControllersWithViews();

// Common Services
builder.Services.AddScoped<IAutoNumberService, AutoNumberService>();
builder.Services.AddScoped<ICommonService, CommonService>();
builder.Services.AddScoped<IGeneralValidationService, GeneralValidationService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IGetDetailsService, GetDetailsService>();

builder.Services.AddSingleton(builder.Configuration);

var app = builder.Build();

// Define allowed IP addresses
var allowedIps = new HashSet<IPAddress>
{
    IPAddress.Parse("203.0.113.10"),
    IPAddress.Parse("198.51.100.25")
};

// Middleware to restrict access based on IP address
app.Use(async (context, next) =>
{
    var remoteIp = context.Connection.RemoteIpAddress;
    if (!allowedIps.Contains(remoteIp!))
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        await context.Response.WriteAsync("Forbidden: Your IP is not allowed.");
        return;
    }
    await next();
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Enforce HTTPS for all requests
app.UseHttpsRedirection();

// Serve static files (e.g., CSS, JavaScript, images)
app.UseStaticFiles();

// Enable routing
app.UseRouting();

// Enable authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Enable forwarded headers to correctly identify client IPs when behind a reverse proxy
app.UseForwardedHeaders();

// Enable session middleware
app.UseSession();

// Define the default route for controllers
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}");

// Start the application
app.Run();
