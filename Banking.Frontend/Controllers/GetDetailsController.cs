using Banking.Interfaces;
using Banking.Services;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class GetDetailsController : BaseController
    {
        private readonly ILogger<LoginController> _logger;
        private IGetDetailsService _getDetailsService;

        public GetDetailsController(ILogger<LoginController> logger, IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _logger = logger;
            _getDetailsService = new GetDetailsService(_options);
        }

        [HttpGet]
        public async Task<IActionResult> GetAadhaarDetails(string aadhaarNumber)
        {
            string aadhaarNo = aadhaarNumber.Split("|")[1];

            var result = await _getDetailsService.GetAadhaarDetails(aadhaarNo);

            return Content(result, "text/plain");
        }

        [HttpGet]
        public async Task<IActionResult> GetPANDetails(string panNumber)
        {
            string panNo = panNumber.Split("|")[1];

            var result = await _getDetailsService.GetPANDetails(panNumber);

            return Content(result, "text/plain");
        }

        [HttpGet]
        public async Task<IActionResult> SearchCustomer(string searchString)
        {
            string search = searchString.Split("|")[1];

            var result = await _getDetailsService.SearchCustomer(search);

            return Content(result, "text/plain");
        }

        [HttpGet]
        public async Task<IActionResult> GetPANDefunctInfo(string searchString)
        {
            string search = searchString.Split("|")[1];

            var result = await _getDetailsService.SearchCustomer(search);

            return Content(result, "text/plain");
        }
    }
}
