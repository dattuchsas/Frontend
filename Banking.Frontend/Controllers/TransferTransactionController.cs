using Banking.Framework;
using Banking.Models;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class TransferTransactionController : BaseController
    {
        public TransferTransactionController(ILogger<LoginController> logger, IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        public async Task<IActionResult> Index(string accountNumber = "")
        {
            accountNumber = string.IsNullOrWhiteSpace(accountNumber) ? accountNumber : BankingExtensions.DecodeInput(accountNumber);

            TransferTransactionModel model = new TransferTransactionModel();

            model = await _transferTransactionService.Get(session, model);

            model = await _transferTransactionService.GetDetails(session, model);

            return View(model);
        }
    }
}
