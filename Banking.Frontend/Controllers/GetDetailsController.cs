using Banking.Framework;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class GetDetailsController : BaseController
    {
        public GetDetailsController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) 
            : base(configuration, httpContextAccessor)
        {
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

            var result = await _getDetailsService.PANDefuctInfo(search);

            return Content(result, "text/plain");
        }

        public string GetDateDifference(string searchString)
        {
            string[] str = searchString.Split('|');

            if (str.Length - 1 > 0)
            {
                if (str[0] == "txtChkDate")
                {
                    int diff = BankingExtensions.DateDifference("d", str[2], str[1]);
                    // dateDifferenceModel.Str1 = str[0];
                    return string.Concat(diff, "~");
                }
                else
                {
                    int diff = BankingExtensions.DateDifference("d", session.GetString(SessionConstants.ApplicationDate), str[0]);
                    int diff1 = BankingExtensions.DateDifference("y", str[0], session.GetString(SessionConstants.ApplicationDate));
                    // dateDifferenceModel.Str1 = str[1];
                    return string.Concat(diff, "~", diff1);
                }
            }

            return string.Empty;
        }
    }
}
