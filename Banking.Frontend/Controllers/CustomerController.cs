using Banking.Framework;
using Banking.Models;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class CustomerController : BaseController
    {
        public CustomerController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) 
            : base(configuration, httpContextAccessor)
        {
        }

        public async Task<IActionResult> Index(string custId = "")
        {
            custId = string.IsNullOrWhiteSpace(custId) ? custId : BankingExtensions.DecodeInput(custId);

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
            var result = await _customerService.SaveCustomer(session, customerModel, kycDocuments);

            if (result.Split("|")[0] == BankingConstants.TransactionSuccessful)
                return RedirectToAction("Index", "Customer", new { custId = result.Split("|")[1] });

            return View(customerModel);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCustomer(CustomerModel customerModel, List<KYC> kycDocuments, List<Relation> relations)
        {
            var result = await _customerService.UpdateCustomer(session, customerModel, kycDocuments, relations);
            if (result.Split("|")[0] == BankingConstants.TransactionSuccessful)
                return RedirectToAction("Index", "Customer", new { custId = result.Split("|")[1] });
            return View("Index", customerModel);
        }

        public async Task<string> GetCustomerListByName(string customerName)
        {
            return await _customerService.GetCustomerListByName(customerName);
        }

        public async Task<string> GetMemberNameById(string memberId)
        {
            return await _customerService.GetMemberNameById(memberId);
        }
    }
}
