using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Banking.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using System.Data;

namespace Banking.Frontend.Controllers
{
    public class DashboardController : BaseController
    {
        private readonly ILogger<DashboardController> _logger;
        private IDashboardService _dashboardService;

        private ISession session => HttpContext.Session;

        public DashboardController(ILogger<DashboardController> logger, IConfiguration configuration) : base(configuration)
        {
            _dashboardService = new DashboardService(_options);
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            string appdate = "";
            var model = new DashboardModel();

            //var queryString = Convert.ToString(TempData["QueryString"]);

            var queryString = "record=SB:F|CA:F|DEP:F|LOAN:F|CC:F|BILLS:F|REM:F|CASH:F|CLG:F|LOCKER:F|GL:F|CUSTOMER:F|ADMIN:F|SHARES:F|HO:F|INV:F|ATM:F|PAYROLL:F|$";

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

                if (session.GetString("applicationdate") != null)
                {
                    DateTime dt = Convert.ToDateTime(session.GetString("applicationdate"));
                    appdate = dt.ToShortDateString();
                }

                // Welcome, session.GetString("userid") & " - " & session.GetString("userName")
                // AppDate

                string[] moduleNames = Convert.ToString(session.GetString("modnar") ?? string.Empty).Split("$", StringSplitOptions.RemoveEmptyEntries);

                moduleNames = moduleNames[0].Split(',', StringSplitOptions.RemoveEmptyEntries);

                DataTable recmod = null!;

                for (int i = 0; i < modules.Length; i++)
                {
                    if (modules[i].Equals("record=") || modules[i].Equals("$"))
                        break;

                    string[] moduleShortName = modules[i].Split(":");
                    string form = moduleShortName[0].ToLower();

                    if (moduleShortName[1].Equals("F"))
                    {
                        string modid = string.Empty;
                        string moddir = string.Empty;

                        recmod = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenModuleMaster, 
                            "moduleid,moduledir", "moduleid='" + moduleShortName[0].Trim() + "'");

                        strMod = string.Concat(strMod, moduleShortName[0], "|");

                        if (recmod.Rows.Count != 0)
                        {
                            modid = Convert.ToString(recmod.Rows[0].ItemArray[0]) ?? string.Empty;
                            moddir = Convert.ToString(recmod.Rows[0].ItemArray[1]) ?? string.Empty;
                            session.SetString("moddir", moddir);
                        }
                        else
                        {
                            recmod = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenModuleMaster,
                            "parentmoduleid", "parentmoduleid='" + moduleShortName[0].Trim() + "'");

                            if (recmod.Rows.Count != 0)
                            {
                                modid = Convert.ToString(recmod.Rows[0].ItemArray[0]) ?? string.Empty;
                                moddir = Convert.ToString(recmod.Rows[0].ItemArray[0]) ?? string.Empty;
                                session.SetString("moddir", moddir);
                            }
                        }

                        strMod = strMod + moduleShortName[0] + "|";

                        // flname = "commonmodule.aspx?record=" + modid + "~" + moddir;

                        model.AssignedModules.Add(form, moduleNames[i]);
                    }
                }

                BankingExtensions.ReleaseMemory(recmod);

                session.SetString("DayBeginMod", strMod);

                string vmod = string.Empty, strSql;
                string[] vmodx = queryString.Split("~", StringSplitOptions.RemoveEmptyEntries);

                if ((vmodx.Length - 1) > 0)
                {
                    vmod = vmodx[0];
                    session.SetString("moddir", vmodx[1]);
                }

                string usrid = session.GetString("userid") ?? string.Empty;

                string serverId = session.GetString("serverid") ?? string.Empty;

                DataTable recdtls = await _dashboardService.ProcessSingleRecordRequest(TableNames.ServerVirtualDirDtls, 
                    "machinename,virtualdir", "upper(trim(machinename))='" + serverId + "'");

                string mainstr = string.Empty;

                if (recdtls.Rows.Count > 0)
                {
                    string item0 = Convert.ToString(recdtls.Rows[0].ItemArray[0]) ?? string.Empty;
                    string item1 = Convert.ToString(recdtls.Rows[0].ItemArray[1]) ?? string.Empty;

                    mainstr = string.Concat(item0, "/", item1, "/", "~");

                    session.SetString("moduledir", item0 + "/" + item1);

                    if (usrid == "")
                    {
                        Redirect("http://" + item0 + "/" + item1.Trim() + "/useridscreen.aspx?record=" + "Your session is timeout. Please login again..");
                    }
                }

                string strHOTrALWBrCode = await _dashboardService.GetHOTRALWBrCode();

                if (vmod.Equals("PAYROLL"))
                {
                    strSql = "SELECT USERID FROM GENUSERMST WHERE BRANCHCODE = '" + strHOTrALWBrCode + "' AND GROUPID = 'ADMIN' AND USERID = '" + usrid + "'";

                    DataTable rsAuto = await _dashboardService.GetUserId(strSql);

                    if (rsAuto.Rows.Count == 0)
                    {
                        var d = recdtls.Rows[0].ItemArray[0];
                        var d1 = recdtls.Rows[0].ItemArray[1];
                        // Response.Redirect("http://" + d + "/" + d1 + "/modulescr.aspx?record10=" + "Not Allowed To Open This Payroll Module Contact Head Office");
                    }

                    BankingExtensions.ReleaseMemory(rsAuto);
                }

                session.SetString("module", vmod.Trim());
                //	session("servername")=Request.ServerVariables("SERVER_NAME")

                string valStr = ",";

                if (session.GetString("applicationdate") != null)
                {
                    DateTime dt = Convert.ToDateTime(session.GetString("applicationdate"));
                    appdate = dt.ToShortDateString();
                }

                valStr = valStr.Substring(1);
                string brcode = session.GetString("branchcode") ?? string.Empty;
                appdate = session.GetString("applicationdate") ?? string.Empty;

                DataTable recdaybeg = null!;
                string daybeg = string.Empty;
                string daybegin1 = session.GetString("daybegin1") ?? string.Empty;
                if (daybegin1.Equals("over"))
                {
                    recdaybeg = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenApplicationDateMaster, 
                        "daybeginstatus,dayendstatus,PREDAYENDCHKYN",
                        "applicationdate='" + appdate + "' and branchcode='" + brcode + "'");

                    if (recdaybeg.Rows.Count > 0)
                    {
                        string val = Convert.ToString(recdaybeg.Rows[0].ItemArray[0]) ?? string.Empty;
                        string val1 = Convert.ToString(recdaybeg.Rows[0].ItemArray[1]) ?? string.Empty;
                        string val2 = Convert.ToString(recdaybeg.Rows[0].ItemArray[2]) ?? string.Empty;
                        if (val == "O" && val1 == "N" && val2 == "N")
                            daybeg = "Yes";
                    }
                }

                daybeg = "No";
                recdtls = null!;

                string gcode = session.GetString("groupcode") ?? string.Empty;

                if (daybeg.Equals("Yes"))
                {
                    recdtls = await _dashboardService.ProcessSingleRecordRequest("genmoduleidformsmst a",
                        "distinct a.menutitle,a.narration,a.forms,a.gendir,a.mainmenu,a.menuorder,a.FORMSORDER",
                        "(a.formsid in( select formsid from gengroupformsmst where groupcode='" +
                        gcode + "' and a.moduleid='" + vmod.Trim() + "' and status='R') or " +
                        "a.formsid in( select formsid from genuseridformsmst where " +
                        " userid='" + session.GetString("userid") + "' AND " +
                        " a.moduleid='" + vmod.Trim() + "' and status='R' and addoreliminate='A'))" +
                        " and a.formsid not in( select formsid from genuseridformsmst where " +
                        " moduleid='" + vmod.Trim() + "' and status='R' and addoreliminate='E'" +
                        " and userid='" + session.GetString("userid") + "')" +
                        "order by a.menuorder,a.FORMSORDER ");
                }
                else
                {
                    recdtls = await _dashboardService.ProcessSingleRecordRequest("genmoduleidformsmst a",
                        "distinct a.menutitle,a.narration,a.forms,a.gendir,a.mainmenu,a.menuorder,a.FORMSORDER",
                        "(a.formsid in( select formsid from gengroupformsmst where groupcode='" +
                        gcode + "' and a.moduleid='" + vmod.Trim() + "' and status='R') or " +
                        "a.formsid in( select formsid from genuseridformsmst where " +
                        " userid='" + session.GetString("userid") + "' AND " +
                        " a.moduleid='" + vmod.Trim() + "' and status='R' and addoreliminate='A'))" +
                        " and a.formsid not in (select formsid from genuseridformsmst where " +
                        " moduleid='" + vmod.Trim() + "' and status='R' and addoreliminate='E'" +
                        " and userid='" + session.GetString("userid") + "') " +
                        " and a.formstatus ='A' order by a.menuorder,a.FORMSORDER ");
                }

                recmod = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenModuleMaster, 
                    "moduledir,narration", "moduleid='" + vmod.Trim() + "'");

                if (recmod.Rows.Count > 0)
                    session.SetString("modulenarration", Convert.ToString(recmod.Rows[0].ItemArray[1]) ?? string.Empty);

                string chkstr = string.Empty;

                if (recdtls.Rows.Count > 0)
                {
                    chkstr = Convert.ToString(recdtls.Rows[0].ItemArray[0]) ?? string.Empty;
                    mainstr = chkstr;
                }

                foreach (DataRow row in recdtls.Rows)
                {
                }

                do
                {
                    //			if isdbnull(recdtls(3).value)=false then
                    //				stdir=recdtls(3).value
                    //			else
                    //				stdir=recmod(0).value
                    //			end if
                    //			if recdtls(0).value=chkstr then
                    //				mainstr=mainstr & "," & recdtls(1).value & "*" & stdir & "/" & recdtls(2).value
                    //			else
                    //				chkstr=recdtls(0).value
                    //				mainstr=mainstr & "|" & recdtls(0).value & "," & recdtls(1).value & "*" & stdir & "/" & recdtls(2).value 
                    //			end if
                    //			recdtls.MoveNext

                } while (recdtls.Rows.Count > 0);

                recdtls = null!;

                recdtls = await _dashboardService.ProcessSingleRecordRequest(TableNames.ServerVirtualDirDtls, 
                    "machinename,virtualdir", "upper(trim(machinename))='" + serverId.ToUpper() + "'");

                if (recdtls.Rows.Count > 0)
                {
                    string val = Convert.ToString(recdtls.Rows[0].ItemArray[0]) ?? string.Empty;
                    string val1 = Convert.ToString(recdtls.Rows[0].ItemArray[1]) ?? string.Empty;
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
                        session.SetString("cashdenomyn", Convert.ToString(rs.Rows[0].ItemArray[0]) ?? string.Empty);
                        session.SetString("cashdenomtallyyn", Convert.ToString(rs.Rows[0].ItemArray[1]) ?? string.Empty);
                    }
                    BankingExtensions.ReleaseMemory(rs);
                }

                DataTable rsclg = null!;

                rsclg = await _dashboardService.ProcessSingleRecordRequest(TableNames.GenBankBranchMaster, "CLGRETCHGSAUTOPOSTYN", "BRANCHCODE='" + brcode + "'");

                if (rsclg.Rows.Count > 0)
                    session.SetString("clgretchgsautoyn", Convert.ToString(rsclg.Rows[0].ItemArray[0]) ?? string.Empty);

                BankingExtensions.ReleaseMemory(rsclg);
            }

            return View(model);
        }
    }
}
