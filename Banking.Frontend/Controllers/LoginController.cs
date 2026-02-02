using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Banking.Frontend.Controllers
{
    public class LoginController : BaseController
    {
        private readonly ILogger<LoginController> _logger;
        private ILoginService _loginService;

        public LoginController(ILogger<LoginController> logger, IConfiguration configuration, 
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _logger = logger;
            _loginService = new LoginService(_options);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            var loginModel = new LoginModel();
            _logger.LogInformation("Login Page");
            ViewData["Title"] = "Login Page";
            return View(loginModel);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="loginModel"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(LoginModel loginModel)
        {
            HttpContext.Session.SetString(SessionConstants.UserId, loginModel.Username);

            try
            {
                if (!ModelState.IsValid)
                {
                    return View(loginModel);
                }

                var result = await _loginService.GetEODProgress(loginModel.Username) ?? string.Empty;

                if (result.Equals("906"))
                {
                    loginModel.ErrorCode = "906";
                    loginModel.ErrorMessage = "HO Day End in Progress, please wait some time.";
                    return View(loginModel);
                }

                var data = await _loginService.LoginValidate(loginModel.Username) ?? string.Empty;

                string compPass1, compPass2;
                compPass1 = string.Concat(loginModel.Username, "1");
                compPass2 = string.Concat(loginModel.Username, "2");
                loginModel.Status = "Login";

                List<string> notOverList = new List<string> { "NoA", "NoL", "NoP", "Noo" };

                if (notOverList.Contains(data.Substring(0, 3)))
                {
                    loginModel.HdnDayBegin = "notover";
                    if (loginModel.Password1 == compPass1 && loginModel.Password2 == compPass2)
                    {
                        loginModel.ErrorMessage = "Change Your Default Passwords Then Login";
                        return View(loginModel);
                    }
                }
                else if (data.Substring(0, 3).Equals("Mes"))
                {
                    loginModel.HdnDayBegin = "over";
                    if (loginModel.Password1 == compPass1 && loginModel.Password2 == compPass2)
                    {
                        loginModel.ErrorMessage = "Change Your Default Passwords Then Login";
                        return View(loginModel);
                    }
                }
                else if (data.Substring(0, 3).Equals("DLL"))
                {
                    return View(loginModel);
                }
                else
                {
                    loginModel.HdnDayBegin = "over";
                    if (loginModel.Password1 == compPass1 && loginModel.Password2 == compPass2)
                    {
                        loginModel.ErrorMessage = "Change Your Default Passwords Then Login";
                        return View(loginModel);
                    }
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, loginModel.Username),
                    new Claim(ClaimTypes.NameIdentifier, "1"),
                    new Claim(ClaimTypes.Role, "Admin")
                };

                var identity = new ClaimsIdentity(
                    claims,
                    CookieAuthenticationDefaults.AuthenticationScheme
                );

                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    principal
                );

                string remoteHost = HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty;

                remoteHost = remoteHost.Equals("::1") ? "127.0.0.1" : remoteHost;

                string serverName = HttpContext.Request.Host.Host;

                RedirectModel commDict = await _loginService.LoginCheckProcess(HttpContext.Session, loginModel.Username, loginModel.Password1,
                    loginModel.Password2, loginModel.HdnDayBegin, loginModel.Status, remoteHost, serverName);

                if (commDict != null)
                {
                    string controller = commDict.ControllerName;
                    string actionName = commDict.ActionName;
                    string errorMessage = commDict.ErrorMessage ?? string.Empty;
                    Dictionary<string, string>? keyValuePairs = commDict.keyValuePairs;

                    if (!string.IsNullOrEmpty(errorMessage))
                    {
                        loginModel.ErrorMessage = errorMessage;
                        return View(loginModel);
                    }

                    if (!string.IsNullOrEmpty(actionName))
                    {
                        if (keyValuePairs != null && keyValuePairs.Count > 0)
                        {
                            string queryString = string.Join("&", keyValuePairs.Select(kvp => $"{kvp.Key}={kvp.Value}"));

                            HttpContext.Session.SetString(SessionConstants.QueryString, queryString);

                            return RedirectToAction(actionName, controller);
                        }
                        else
                        {
                            return RedirectToAction(actionName, controller, "");
                        }
                    }

                    return RedirectToAction(nameof(Index), controller, "");
                }

                return RedirectToAction(nameof(Index), "Login");
            }
            catch (Exception ex)
            {
                loginModel.ErrorMessage = ex.Message;
                return View(loginModel);
            }
        }

        /// <summary>
        /// Logout 
        /// </summary>
        /// <returns></returns>
        public async Task<ActionResult> Logout()
        {
            try
            {
                RedirectModel commDict = await _loginService.Logout(HttpContext.Session);

                HttpContext.Session.Clear();

                return RedirectToAction(commDict.ActionName, commDict.ControllerName);
            }
            catch (Exception ex)
            {
                return View();
            }
        }
    }
}
