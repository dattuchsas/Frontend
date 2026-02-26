using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class TransferTransactionController : BaseController
    {
        public TransferTransactionController(ILogger<LoginController> logger, IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        public async Task<IActionResult> Index()
        {
            TransferTransactionModel model = new TransferTransactionModel();

            model = await _transferTransactionService.Get(session, model);

            model = await _transferTransactionService.GetDetails(session, model);

            return View(model);
        }
    }
}
