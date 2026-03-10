using Banking.Framework;
using Banking.Models;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Emit;
using static System.Runtime.CompilerServices.RuntimeHelpers;

namespace Banking.Frontend.Controllers
{
    public class SBCAAccountOpeningController : BaseController
    {
        public SBCAAccountOpeningController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
            : base(configuration, httpContextAccessor)
        {
        }
        [HttpPost]
        public async Task<IActionResult> NewAccountOpening(SBCAAccountOpeningModel accountopeningmodel)
        {
            //var result = await _sbcaaccountopeningService.SaveAccountOpening (session, accountopeningmodel);

            //if (result.Split("|")[0] == BankingConstants.TransactionSuccessful)
            //    return RedirectToAction("SBCAAccountOpening", "AccountOpening");

            // return View(accountopeningmodel);

            return View();
        }

       

        public async Task<IActionResult> SBCAAccountOpening(string brcode = "101", string moduleid = "SB", string glcode = "102020", string accno = "4123")
        {
          
           // brcode = "";  moduleid = "";  glcode = "";  accno = "";-
            var sBCAAccountOpeningmodel = await _sbcaaccountopeningService.GetSBCAAccountOpeningDetails(session, brcode, moduleid, glcode, accno);
            return View(sBCAAccountOpeningmodel);
        }
    }
}
