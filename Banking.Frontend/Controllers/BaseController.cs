using Banking.Framework;
using Banking.Interfaces;
using Banking.Interfaces.IServices;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using System.Diagnostics;

namespace Banking.Frontend.Controllers
{
    [ApplicationSecurity]
    public class BaseController : Controller
    {
        protected IOptions<DatabaseSettings> _options;
        protected IConfiguration _configuration;
        protected ISession session;
        private Stopwatch _stopwatch;
        private LoggerModel _loggerModel;

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

            _stopwatch = new Stopwatch();
            _loggerModel = new LoggerModel();
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            _stopwatch.Start();
            GetReferrerUrl(context);
            base.OnActionExecuting(context);
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            _stopwatch.Stop();
            var elapsedTime = _stopwatch.ElapsedMilliseconds;
            var controllerName = Conversions.ToString(context.RouteData.Values["controller"]);
            var actionName = Conversions.ToString(context.RouteData.Values["action"]);
            LogInfo(controllerName, actionName);
            base.OnActionExecuted(context);
        }

        private void GetReferrerUrl(ActionExecutingContext context)
        {
            string? referrerUrl = context.HttpContext.Request.Headers["Referer"].ToString();
            if (!string.IsNullOrWhiteSpace(referrerUrl))
            {
                session.SetString(SessionConstants.ReferrerUrl, referrerUrl);
            }
        }

        private void LogInfo(string controllerName, string actionName)
        {
            LoggerModel loggerModel = new()
            {
                ControllerName = controllerName,
                ActionName = actionName,
                ResponseTime = _stopwatch.ElapsedMilliseconds
            };

            // TODO: Implement actual logging logic here, e.g., save to database or file
            // _loggerModel.LogInfo($"Executed {controllerName}.{actionName} in {elapsedTime} ms");
        }

        //TODO: Implement a method to log error, warning, or debug information as needed
    }
}
