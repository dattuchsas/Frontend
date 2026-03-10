using Banking.Framework;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace Banking.Frontend.Controllers
{
    public class CommonController : BaseController
    {
        public CommonController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
            : base(configuration, httpContextAccessor)
        {
        }

        public async Task<IActionResult> Index(string moduleId = "")
        {
            string vmod = string.Empty;

            string[] vmodx = moduleId.Split("~", StringSplitOptions.RemoveEmptyEntries);

            if ((vmodx.Length - 1) > 0)
            {
                vmod = vmodx[0];
                session.SetString(SessionConstants.SelectedModule, vmod);
                session.SetString("moddir", vmodx[1]);
            }

            string brcode = session.GetString(SessionConstants.BranchCode) ?? string.Empty;

            DataTable recmod = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenModuleMaster, "moduledir,narration", "moduleid='" + vmod.Trim() + "'");

            if (recmod.Rows.Count > 0)
                session.SetString("modulenarration", Conversions.ToString(recmod.Rows[0].ItemArray[1]));

            // This code is Cash Module Denomination Purpose YN purpose. -- ADD by ramakrishna.
            if (vmod.Equals("CASH"))
            {
                DataTable rs = null!;
                rs = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenBankBranchMaster,
                    "CASHDENOMINATIONSREQUIREDYN,CASHDENOMTALLYYN", "BRANCHCODE='" + brcode + "'");
                if (rs.Rows.Count > 0)
                {
                    session.SetString(SessionConstants.CashDenomYN, Conversions.ToString(rs.Rows[0].ItemArray[0]));
                    session.SetString(SessionConstants.CashDenomTallyYN, Conversions.ToString(rs.Rows[0].ItemArray[1]));
                }
                BankingExtensions.ReleaseMemory(rs);
            }

            DataTable rsclg = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenBankBranchMaster, "CLGRETCHGSAUTOPOSTYN", "BRANCHCODE='" + brcode + "'");

            if (rsclg.Rows.Count > 0)
                session.SetString(SessionConstants.ClgRetChgsAutoYN, Conversions.ToString(rsclg.Rows[0].ItemArray[0]));

            BankingExtensions.ReleaseMemory(rsclg);

            return View();
        }
    }
}
