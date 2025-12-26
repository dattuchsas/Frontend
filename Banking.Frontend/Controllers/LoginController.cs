using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class LoginController : BaseController
    {
        private readonly ILogger<LoginController> _logger;
        private ILoginService _loginService;
       
        public LoginController(ILogger<LoginController> logger, IConfiguration configuration) : base(configuration)
        {
            _loginService = new LoginService(_options);
            _logger = logger;
        }

        public ActionResult Index()
        {
            var loginModel = new LoginModel
            {
                Username = string.Empty,
                Password1 = string.Empty,
                Password2 = string.Empty
            };
            _logger.LogInformation("Login Page");
            ViewData["Title"] = "Login Page";
            return View(loginModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(LoginModel loginModel)
        {
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

                IDictionary<string, string> commDict = await _loginService.LoginCheckProcess(HttpContext.Session, loginModel.Username, loginModel.Password1, loginModel.Password2, loginModel.HdnDayBegin, loginModel.Status);

                if (commDict != null)
                {
                    string controller = commDict.Keys.FirstOrDefault() ?? string.Empty;

                    loginModel.ErrorMessage = commDict[controller];
                
                    return RedirectToAction(nameof(Index), controller);
                }

                return RedirectToAction(nameof(Index), "Home");
            }
            catch
            {
                return View();
            }
        }
    }
}
