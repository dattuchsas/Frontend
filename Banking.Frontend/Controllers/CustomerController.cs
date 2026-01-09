using Banking.Models;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class CustomerController : Controller
    {
        public IActionResult Index()
        {
            var customerModel = new CustomerModel();
            return View(customerModel);
        }
    }
}
