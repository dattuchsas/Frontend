using Banking.Frontend;
using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddHttpClient();

builder.Services.AddHttpContextAccessor();

//builder.Services.Configure<ForwardedHeadersOptions>(options =>
//{
//    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor;
//    options.ForwardLimit = 1;
//    options.KnownNetworks.Add(
//        new IPNetwork(System.Net.IPAddress.Parse("10.0.0.0"), 24));
//});

builder.Services.AddDistributedMemoryCache(); // Required to store session data
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20); // Set session timeout
    options.Cookie.HttpOnly = true; // Make the session cookie inaccessible to client-side script
    options.Cookie.IsEssential = true; // Make the session cookie essential
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
{
    options.LoginPath = "/Login/Index";
    options.LogoutPath = "/Login/Logout";
    options.AccessDeniedPath = "/Login/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
    options.SlidingExpiration = false; // IMPORTANT for banking
});

builder.Services.AddAuthorization();

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

app.UseAuthentication();

app.UseAuthorization();

app.UseForwardedHeaders();

app.UseSession(); // Enable session middleware

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}");

app.Run();
