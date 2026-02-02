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
        public List<Menu>? _userMenu;

        private IMenuService _menuService;

        public BaseController(IConfiguration configuration, 
            IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;

            _options = Options.Create(_configuration.GetSection("OracleSettings").Get<DatabaseSettings>() ?? new DatabaseSettings());

            _menuService = (IMenuService)new MenuService(_options);

            var controllerName = Conversions.ToString(httpContextAccessor.HttpContext?.Request.RouteValues["controller"]);

            httpContextAccessor.HttpContext!.Session.SetString(SessionConstants.ControllerName, controllerName);

            if (!controllerName.Equals(ControllerNames.Login) && !controllerName.Equals(ControllerNames.Dashboard))
                _userMenu = BuildMenuOrder(httpContextAccessor).GetAwaiter().GetResult();
        }

        public async Task<List<Menu>> BuildMenuOrder(IHttpContextAccessor httpContextAccessor)
        {
            ISession session = httpContextAccessor.HttpContext!.Session;

            string userId = Conversions.ToString(session.GetString(SessionConstants.UserId));
            string moduleId = Conversions.ToString(session.GetString(SessionConstants.SelectedModule));
            string groupCode = Conversions.ToString(session.GetString(SessionConstants.GroupCode));

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(moduleId) || string.IsNullOrWhiteSpace(groupCode))
                return new List<Menu>();

            return await _menuService.GetUserMenu(userId.ToUpper(), moduleId, groupCode);
        }
    }
}
