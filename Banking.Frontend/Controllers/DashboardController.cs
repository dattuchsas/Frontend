using Banking.Models;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class DashboardController : BaseController
    {
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(ILogger<DashboardController> logger, IConfiguration configuration) : base(configuration)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            var queryString = Convert.ToString(TempData["QueryString"]);




            var model = new DashboardModel();
            model.AccountType = new List<string>();
            if (!string.IsNullOrWhiteSpace(queryString))
            {
                if (queryString.Contains("record="))
                    queryString = queryString.Replace("record=", "");
                model.AccountType = Convert.ToString(queryString).Split('|').ToList();
            }
            return View(model);
        }
    }
}
