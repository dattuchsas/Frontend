using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class CustomerController : BaseController
    {
        private readonly ILogger<LoginController> _logger;
        private ICustomerService _customerService;

        private ISession session => HttpContext.Session;

        public CustomerController(ILogger<LoginController> logger, IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _logger = logger;
            _customerService = new CustomerService(_options);
        }

        public async Task<IActionResult> Index(string custId = "")
        {
            var customerModel = await _customerService.GetCustomerDetails(session, custId);

            return View(customerModel);
        }

        public async Task<IActionResult> NewCustomer()
        {
            var customerModel = await _customerService.NewCustomer(session);

            return View(customerModel);
        }

        [HttpPost]
        public async Task<IActionResult> NewCustomer(CustomerModel customerModel, List<KYC> kycDocuments)
        {
            var result = await _customerService.SaveCustomer(session, customerModel, kycDocuments, "New");

            return View(customerModel);
        }

        public async Task<string> GetCustomerListByName(string customerName)
        {
            return await _customerService.GetCustomerListByName(customerName);
        }
    }
}
