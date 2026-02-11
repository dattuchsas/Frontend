using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace Banking.Frontend.Controllers
{
    public class DashboardController : BaseController
    {
        private readonly ILogger<DashboardController> _logger;
        private IDashboardService _dashboardService;

        private ISession session => HttpContext.Session;

        public DashboardController(ILogger<DashboardController> logger, IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _dashboardService = new DashboardService(_options);
            _logger = logger;
        }

        public IActionResult Index()
        {
            string appdate = "";
            var model = new DashboardModel();

            var queryString = HttpContext.Session.GetString(SessionConstants.QueryString);

            if (string.IsNullOrWhiteSpace(queryString) || queryString.Equals("record=$"))
            {
                model.AssignedModules = [];
                model.ErrorMessage = "No modules assigned. Please contact administrator.";
                return View(model);
            }

            if (!string.IsNullOrWhiteSpace(queryString))
            {
                string strMod = string.Empty;
                model.AssignedModules = [];

                if (queryString.Contains("record="))
                    queryString = queryString.Replace("record=", "").Replace("$", "");

                string[] modules = queryString.Split('|', StringSplitOptions.RemoveEmptyEntries);

                if (session.GetString(SessionConstants.ApplicationDate) != null)
                {
                    DateTime dt = Convert.ToDateTime(session.GetString(SessionConstants.ApplicationDate));
                    appdate = dt.ToShortDateString();
                }

                string[] moduleNames = Conversions.ToString(session.GetString(SessionConstants.ModNar)).Split("$", StringSplitOptions.RemoveEmptyEntries);

                moduleNames = moduleNames[0].Split(',', StringSplitOptions.RemoveEmptyEntries);

                DataTable recmod = null!;

                for (int i = 0; i < modules.Length; i++)
                {
                    if (modules[i].Equals("record=") || modules[i].Equals("$"))
                        break;

                    string[] moduleShortName = modules[i].Split(":");

                    if (moduleShortName[1].Equals("F"))
                    {
                        string form = moduleShortName[0] + "~" + (BankingExtensions.GetModuleRoute.ContainsKey(moduleShortName[0]) ? 
                            BankingExtensions.GetModuleRoute[moduleShortName[0]] : string.Empty);

                        strMod = string.Concat(strMod, moduleShortName[0], "|");

                        model.AssignedModules.Add(form, moduleNames[i]);
                    }
                }

                BankingExtensions.ReleaseMemory(recmod);

                session.SetString("DayBeginMod", strMod);
            }

            return View(model);
        }

        public async Task<IActionResult> SelectedModule(string moduleId = "")
        {
            DataTable recmod = null!;
            string vmod = string.Empty, strQuery, appDate;

            string[] vmodx = moduleId.Split("~", StringSplitOptions.RemoveEmptyEntries);

            if ((vmodx.Length - 1) > 0)
            {
                vmod = vmodx[0];
                session.SetString(SessionConstants.SelectedModule, vmod);
                session.SetString("moddir", vmodx[1]);
            }

            string mainstr = string.Empty;
            string usrid = session.GetString(SessionConstants.UserId) ?? string.Empty;
            string serverId = session.GetString(SessionConstants.ServerId) ?? string.Empty;

            DataTable recdtls = await _dashboardService.ProcessSingleRecordRequest(TableNames.ServerVirtualDirDtls,
                "machinename,virtualdir", "upper(trim(machinename))='" + serverId.ToUpper() + "'");

            if (recdtls.Rows.Count > 0)
            {
                string item0 = Conversions.ToString(recdtls.Rows[0].ItemArray[0]);
                string item1 = Conversions.ToString(recdtls.Rows[0].ItemArray[1]);

                mainstr = string.Concat(item0.Trim(), "/", item1.Trim(), "/", "~", mainstr.Trim());

                session.SetString("moduledir", item0 + "/" + item1);

                if (usrid == "")
                {
                    Redirect("http://" + item0 + "/" + item1.Trim() + "/useridscreen.aspx?record=" + "Your session is timeout. Please login again..");
                }
            }

            string strHOTrALWBrCode = await _dashboardService.GetHOTRALWBrCode();

            if (vmod.Equals("PAYROLL"))
            {
                strQuery = "SELECT USERID FROM GENUSERMST WHERE BRANCHCODE = '" + strHOTrALWBrCode + "' AND GROUPID = 'ADMIN' AND USERID = '" + usrid + "'";

                DataTable rsAuto = await _dashboardService.GetUserId(strQuery);

                if (rsAuto.Rows.Count == 0)
                {
                    var d = recdtls.Rows[0].ItemArray[0];
                    var d1 = recdtls.Rows[0].ItemArray[1];
                    // Response.Redirect("http://" + d + "/" + d1 + "/modulescr.aspx?record10=" + "Not Allowed To Open This Payroll Module Contact Head Office");
                }

                BankingExtensions.ReleaseMemory(rsAuto);
            }

            session.SetString("module", vmod.Trim());
            // session("servername") = Request.ServerVariables("SERVER_NAME")

            string valStr = ",";

            appDate = Convert.ToDateTime(session.GetString(SessionConstants.ApplicationDate)).ToShortDateString();

            valStr = valStr.Substring(1);
            string brcode = session.GetString(SessionConstants.BranchCode) ?? string.Empty;

            DataTable recdaybeg = null!;
            string daybeg = string.Empty;
            string daybegin1 = session.GetString(SessionConstants.DayBegin1) ?? string.Empty;
            if (daybegin1.Equals("over"))
            {
                recdaybeg = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenApplicationDateMaster,
                    "daybeginstatus,dayendstatus,PREDAYENDCHKYN",
                    "applicationdate='" + appDate + "' and branchcode='" + brcode + "'");

                if (recdaybeg.Rows.Count > 0)
                {
                    string val = Conversions.ToString(recdaybeg.Rows[0].ItemArray[0]);
                    string val1 = Conversions.ToString(recdaybeg.Rows[0].ItemArray[1]);
                    string val2 = Conversions.ToString(recdaybeg.Rows[0].ItemArray[2]);
                    if (val == "O" && val1 == "N" && val2 == "N")
                        daybeg = "Yes";
                }
            }

            daybeg = "No";
            recdtls = null!;

            string gcode = session.GetString(SessionConstants.GroupCode) ?? string.Empty;

            if (daybeg.Equals("Yes"))
            {
                recdtls = await _dashboardService.ProcessSingleRecordRequest("genmoduleidformsmst a",
                    "distinct a.menutitle,a.narration,a.forms,a.gendir,a.mainmenu,a.menuorder,a.FORMSORDER",
                    "(a.formsid in( select formsid from gengroupformsmst where groupcode='" +
                    gcode + "' and a.moduleid='" + vmod.Trim() + "' and status='R') or " +
                    "a.formsid in( select formsid from genuseridformsmst where " +
                    " userid='" + session.GetString(SessionConstants.UserId) + "' AND " +
                    " a.moduleid='" + vmod.Trim() + "' and status='R' and addoreliminate='A'))" +
                    " and a.formsid not in( select formsid from genuseridformsmst where " +
                    " moduleid='" + vmod.Trim() + "' and status='R' and addoreliminate='E'" +
                    " and userid='" + session.GetString(SessionConstants.UserId) + "')" +
                    "order by a.menuorder,a.FORMSORDER ");
            }
            else
            {
                recdtls = await _dashboardService.ProcessSingleRecordRequest("genmoduleidformsmst a",
                    "distinct a.menutitle,a.narration,a.forms,a.gendir,a.mainmenu,a.menuorder,a.FORMSORDER",
                    "(a.formsid in( select formsid from gengroupformsmst where groupcode='" +
                    gcode + "' and a.moduleid='" + vmod.Trim() + "' and status='R') or " +
                    "a.formsid in( select formsid from genuseridformsmst where " +
                    " userid='" + session.GetString(SessionConstants.UserId) + "' AND " +
                    " a.moduleid='" + vmod.Trim() + "' and status='R' and addoreliminate='A'))" +
                    " and a.formsid not in (select formsid from genuseridformsmst where " +
                    " moduleid='" + vmod.Trim() + "' and status='R' and addoreliminate='E'" +
                    " and userid='" + session.GetString(SessionConstants.UserId) + "') " +
                    " and a.formstatus ='A' order by a.menuorder,a.FORMSORDER ");
            }

            recmod = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenModuleMaster,
                "moduledir,narration", "moduleid='" + vmod.Trim() + "'");

            if (recmod.Rows.Count > 0)
                session.SetString("modulenarration", Conversions.ToString(recmod.Rows[0].ItemArray[1]));

            string chkstr = string.Empty;

            if (recdtls.Rows.Count > 0)
            {
                chkstr = Conversions.ToString(recdtls.Rows[0].ItemArray[0]);
                mainstr = chkstr;
            }

            foreach (DataRow row in recdtls.Rows)
            {
                string stdir = string.Empty;

                if (Convert.IsDBNull(row.ItemArray[3]).Equals(false))
                    stdir = Conversions.ToString(row.ItemArray[3]);
                else
                    stdir = Conversions.ToString(row.ItemArray[0]);

                if (Conversions.ToString(row.ItemArray[0]) == chkstr)
                    mainstr = mainstr + "," + Conversions.ToString(row.ItemArray[1]) + "*" + stdir + "/" +
                        Conversions.ToString(row.ItemArray[2]);
                else
                {
                    chkstr = Conversions.ToString(row.ItemArray[0]);
                    mainstr = mainstr + "|" + Conversions.ToString(row.ItemArray[0]) + "," + Conversions.ToString(row.ItemArray[1])
                        + "*" + stdir + "/" + Conversions.ToString(row.ItemArray[2]);
                }
            }

            recdtls = null!;

            recdtls = await _dashboardService.ProcessSingleRecordRequest(TableNames.ServerVirtualDirDtls,
                "machinename,virtualdir", "upper(trim(machinename))='" + serverId.ToUpper() + "'");

            if (recdtls.Rows.Count > 0)
            {
                string val = Conversions.ToString(recdtls.Rows[0].ItemArray[0]);
                string val1 = Conversions.ToString(recdtls.Rows[0].ItemArray[1]);
                mainstr = string.Concat(val.Trim(), "/", val1.Trim(), "/", "~", mainstr, "~", vmod.Trim());
                session.SetString("moduledir", string.Concat(val.Trim(), "/", val1.Trim()));
                session.SetString("menustring", mainstr);
            }

            // This code is Cash Module Denomination Purpose YN purpose. -- ADD by ramakrishna.
            string module = session.GetString("module") ?? string.Empty;

            if (module.Equals("CASH"))
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

            DataTable rsclg = null!;

            rsclg = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenBankBranchMaster, "CLGRETCHGSAUTOPOSTYN", "BRANCHCODE='" + brcode + "'");

            if (rsclg.Rows.Count > 0)
                session.SetString(SessionConstants.ClgRetChgsAutoYN, Conversions.ToString(rsclg.Rows[0].ItemArray[0]));

            BankingExtensions.ReleaseMemory(rsclg);

            return RedirectToAction("Index", vmodx[1]);
        }

        [HttpGet]
        public IActionResult SearchCustomer(string searchString)
        {
            string search = searchString.Split("|")[1];

            return Content("Test~Test", "text/plain");
        }
    }
}
