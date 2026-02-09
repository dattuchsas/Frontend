using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Banking.Frontend.Controllers
{
    [ApplicationSecurity]
    public class BaseController : Controller
    {
        public IOptions<DatabaseSettings> _options;
        public IConfiguration _configuration;
        public ISession session;

        public BaseController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;

            if (session == null)
                session = httpContextAccessor.HttpContext!.Session;

            _options = Options.Create(_configuration.GetSection("OracleSettings").Get<DatabaseSettings>() ?? new DatabaseSettings());

            var controllerName = Conversions.ToString(httpContextAccessor.HttpContext?.Request.RouteValues["controller"]);

            session.SetString(SessionConstants.ControllerName, controllerName);

            session.SetString(SessionConstants.CurrencyCode, "INR");
        }
    }
}
