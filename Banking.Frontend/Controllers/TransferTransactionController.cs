using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class TransferTransactionController : BaseController
    {
        public TransferTransactionController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) 
            : base(configuration, httpContextAccessor)
        {
        }

        public async Task<IActionResult> Index()
        {
            //accountNumber = string.IsNullOrWhiteSpace(accountNumber) ? accountNumber : BankingExtensions.DecodeInput(accountNumber);

            var model = await _transferTransactionService.Get(session);

            model = await _transferTransactionService.GetDetails(session, model);

            return View(model);
        }
    }
}
