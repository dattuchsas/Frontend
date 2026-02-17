using Banking.Framework;
using Banking.Interfaces;
using Banking.Interfaces.IServices;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Banking.Frontend.Controllers
{
    [ApplicationSecurity]
    public class BaseController : Controller
    {
        protected IOptions<DatabaseSettings> _options;
        protected IConfiguration _configuration;
        protected ISession session;

        protected ILoginService _loginService;
        protected IGetDetailsService _getDetailsService;
        protected IDashboardService _dashboardService;
        protected ICustomerService _customerService;
        protected ITransferTransactionService _transferTransactionService;

        public BaseController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;

            if (session == null)
                session = httpContextAccessor.HttpContext!.Session;

            _options = Options.Create(_configuration.GetSection("OracleSettings").Get<DatabaseSettings>() ?? new DatabaseSettings());

            var controllerName = Conversions.ToString(httpContextAccessor.HttpContext?.Request.RouteValues["controller"]);

            session.SetString(SessionConstants.ControllerName, controllerName);

            session.SetString(SessionConstants.CurrencyCode, "INR");

            _loginService = _loginService ?? new LoginService(_options);
            _getDetailsService = _getDetailsService ?? new GetDetailsService(_options);
            _dashboardService = _dashboardService ?? new DashboardService(_options);
            _customerService = _customerService ?? new CustomerService(_options);
            _transferTransactionService = _transferTransactionService ?? new TransferTransactionService(_options);
        }
    }
}
