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

        public CustomerController(ILogger<LoginController> logger, IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _logger = logger;
            _customerService = new CustomerService(_options);
        }

        public async Task<IActionResult> Index(string custId = "")
        {
            var customerModel = await _customerService.GetCustomerDetails(custId);

            customerModel.MenuDetails = _userMenu;

            return View(customerModel);
        }

        [HttpPost]
        public IActionResult Get(string custId = "")
        {
            var customerModel = new CustomerModel();

            return RedirectToAction("Index", customerModel);
        }

        public IActionResult NewCustomer()
        {
            //strresult = Request.QueryString("result")
            //custid = Request.QueryString("custid")
            //record = Request.QueryString("record")
            //code = Request.QueryString("code")
            //st = request.querystring("main")

            var customerModel = new CustomerModel();

            // Saluation List

            // 

            return View();
        }
    }
}
