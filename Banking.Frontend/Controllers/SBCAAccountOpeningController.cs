using Banking.Framework;
using Banking.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
        public async Task<IActionResult> NewAccountOpening(SBCAAccountOpeningModel accountopeningmodel, List<JntAcc> jntAccs, List<Guardian> guardians, List<Nominee> nominees)
        {
            var result = await _sbcaaccountopeningService.SaveSBCAAccountOpeningDetails(session, accountopeningmodel, jntAccs, guardians,  nominees);

            if (result.Split("|")[0] == BankingConstants.TransactionSuccessful)
                return RedirectToAction("SBCAAccountOpening", "SBCAAccountOpening");
            else
            {
                accountopeningmodel.ErrorMessage = "";
                return View(accountopeningmodel);
            }

            //  return View(accountopeningmodel);


        }       

        public async Task<IActionResult> SBCAAccountOpening(string brcode = "", string moduleid = "", string glcode = "", string accno = "")
        {
          
           // brcode = "";  moduleid = "";  glcode = "";  accno = "";-
            var sBCAAccountOpeningmodel = await _sbcaaccountopeningService.GetSBCAAccountOpeningDetails(session, brcode, moduleid, glcode, accno);
            return View(sBCAAccountOpeningmodel);
        }
    }
}
