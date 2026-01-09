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

                for (int i = 0; i < modules.Length; i++)
                {
                    if (modules[i].Equals("record=") || modules[i].Equals("$"))
                        break;

                    string[] moduleShortName = modules[i].Split(":");
                    string form = moduleShortName[0].ToLower() + "module.aspx";

                    if (moduleShortName[1].Equals("F"))
                    {
                        string modid = string.Empty;
                        string moddir = string.Empty;

                        DataTable recmod = await _dashboardService.GetUserModuleList("moduleid,moduledir", "moduleid='" + moduleShortName[0].Trim() + "'");

                        strMod = string.Concat(strMod, moduleShortName[0], "|");

                        if (recmod.Rows.Count != 0)
                        {
                            modid = Convert.ToString(recmod.Rows[0].ItemArray[0]) ?? string.Empty;
                            moddir = Convert.ToString(recmod.Rows[0].ItemArray[1]) ?? string.Empty;
                            session.SetString("moddir", moddir);
                        }
                        else
                        {
                            recmod = await _dashboardService.GetUserModuleList("parentmoduleid", "parentmoduleid='" + moduleShortName[0].Trim() + "'");
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

                //session.SetString("DayBeginMod", strMod);

                //string[] vmodx = queryString.Split("~", StringSplitOptions.RemoveEmptyEntries);

                //if (vmodx.Length > 0)
                //{
                //    string vmod = vmodx[0];
                //    session.SetString("moddir", vmodx[1]);
                //}

                //string usrid = session.GetString("userid") ?? string.Empty;

                //string serverId = session.GetString("serverid") ?? string.Empty;
                //DataTable recdtls = await _dashboardService.GetServiceVirtualDirectoryDetails("machinename,virtualdir", "upper(trim(machinename))='" + serverId + "'");

                //if (recdtls.Rows.Count > 0)
                //{
                //    string item0 = Convert.ToString(recdtls.Rows[0].ItemArray[0]) ?? string.Empty;
                //    string item1 = Convert.ToString(recdtls.Rows[0].ItemArray[1]) ?? string.Empty;

                //    string mainstr = string.Concat(item0, "/", item1, "/", "~");

                //    session.SetString("moduledir", item0 + "/" + item1);

                //    if (usrid == "")
                //    {
                //        Redirect("http://" + item0 + "/" + item1.Trim() + "/useridscreen.aspx?record=" + "Your session is timeout. Please login again..");
                //    }
                //}

                //string strHOTrALWBrCode = await _dashboardService.GetHOTRALWBrCode();

                //if (vmod.Equal("PAYROLL"))
                //{
                //    strSql = "SELECT USERID FROM GENUSERMST WHERE BRANCHCODE = '" & strHOTrALWBrCode & "' AND GROUPID = 'ADMIN' AND USERID = '" & usrid & "'"
                //    rsAuto = objAuto.SingleSelectStat(strSql)
                //    if objAuto.ConnError = "Connected" then
                //        if not rsAuto.bof and not rsAuto.eof then
                //		else
                //			Response.Redirect ("http://" & recdtls(0).value & "/" & trim(recdtls(1).value) & "/modulescr.aspx?record10=" & "Not Allowed To Open This Payroll Module Contact Head Office")
                //		end if
                //	end if
                //	rsAuto =  nothing
                //}

                //if len(vmod)<=0 then  vmod=session("module")
                //	session("module")=trim(vmod)
                //	session("servername")=Request.ServerVariables("SERVER_NAME")
                //	session("module")=trim(vmod)
                //	objfetch=server.CreateObject ("queryrecordsets.fetchrecordsets")

                //string valstr = ",";

                //if (session.GetString("applicationdate") != null)
                //{
                //    DateTime dt = Convert.ToDateTime(session.GetString("applicationdate"));
                //    appdate = dt.ToShortDateString();
                //}

                //if (valstr.Length > 0)
                //{
                //		objfetch=server.CreateObject ("queryrecordsets.fetchrecordsets")
                //		valstr=right(valstr, len(valstr)-1)
                //		recdaybeg=server.CreateObject ("queryrecordsets.fetchrecordsets")
                //		brcode=session("branchcode")
                //		appdate=session("applicationdate")

                //		if session("daybegin1") = "over" then
                //			recdaybeg=objfetch.singlerecordset("genapplicationdatemst", "daybeginstatus,dayendstatus,PREDAYENDCHKYN","applicationdate='" & appdate & "' and branchcode='" & brcode & "'")
                //			if objfetch.ConnError="Connected" then
                //				if not recdaybeg.eof and not recdaybeg.bof then
                //					if recdaybeg(0).value="O" and recdaybeg(1).value="N" and recdaybeg(2).value="N" then
                //						daybeg="Yes"
                //					else
                //						daybeg="No"			
                //					end if
                //				else
                //					daybeg="No"			
                //				end if
                //			else
                //				daybeg="No"
                //			end if
                //		else		''session("daybegin") = "notover"
                //			daybeg="No"
                //		end if		''session("daybegin") = "over"

                //		recdtls=server.CreateObject("adodb.recordset")
                //		gcode=session("groupcode")

                //		if daybeg="Yes" then
                //			recdtls=objfetch.singlerecordset("genmoduleidformsmst a", _
                //				"distinct a.menutitle,a.narration,a.forms,a.gendir,a.mainmenu,a.menuorder,a.FORMSORDER", _
                //				"(a.formsid in( select formsid from gengroupformsmst where groupcode='" & _
                //				gcode & "' and a.moduleid='" & trim(vmod) &"' and status='R') or " & _
                //				"a.formsid in( select formsid from genuseridformsmst where " & _
                //				" userid='" & session("userid") & "' AND " & _
                //				" a.moduleid='" & trim(vmod) &"' and status='R' and addoreliminate='A'))" & _
                //				" and a.formsid not in( select formsid from genuseridformsmst where " & _
                //				" moduleid='" & trim(vmod) &"' and status='R' and addoreliminate='E'" & _
                //				" and userid='" & session("userid") & "')" & _
                //				"order by a.menuorder,a.FORMSORDER " )
                //		else
                //				recdtls=objfetch.singlerecordset("genmoduleidformsmst a", _
                //				"distinct a.menutitle,a.narration,a.forms,a.gendir,a.mainmenu,a.menuorder,a.FORMSORDER", _
                //				"(a.formsid in( select formsid from gengroupformsmst where groupcode='" & _
                //				gcode & "' and a.moduleid='" & trim(vmod) &"' and status='R') or " & _
                //				"a.formsid in( select formsid from genuseridformsmst where " & _
                //				" userid='" & session("userid") & "' AND " & _
                //				" a.moduleid='" & trim(vmod) &"' and status='R' and addoreliminate='A'))" & _
                //				" and a.formsid not in( select formsid from genuseridformsmst where " & _
                //				" moduleid='" & trim(vmod) &"' and status='R' and addoreliminate='E'" & _
                //				" and userid='" & session("userid") & "') " & _
                //				" and a.formstatus ='A' order by a.menuorder,a.FORMSORDER " )
                //		end if				

                //		recmod=server.CreateObject("adodb.recordset")
                //		recmod=objfetch.singlerecordset("genmodulemst", "moduledir,narration","moduleid='" & trim(vmod) &"'")

                //		if not recmod.EOF and not recmod.BOF then
                //			session("modulenarration")=recmod(1).value
                //		end if	

                //		if not recdtls.EOF or not recdtls.BOF then
                //			chkstr=recdtls(0).value
                //			mainstr=chkstr
                //		end if

                //		do while not recdtls.EOF 
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
                //		loop

                //		recdtls=objfetch.singlerecordset("servervirtualdirdtls","machinename,virtualdir", "upper(trim(machinename))='" & ucase(session("serverid")) & "'")

                //		if objfetch.ConnError="Connected" then
                //			if not recdtls.bof and not recdtls.eof then
                //				mainstr=trim(recdtls(0).value) & "/" & trim(recdtls(1).value) & "/" & "~" & mainstr & "~" & trim(vmod)
                //				session("moduledir")=trim(recdtls(0).value) &"/" & trim(recdtls(1).value) 
                //				session("menustring")=mainstr
                //			end if
                //		end if

                //		'This code is Cash Module Denomination Purpose YN purpose. -- ADD by ramakrishna.
                //		if ucase(trim(session("module")))="CASH" then
                //			Dim rs, obj
                //			rs=server.CreateObject ("adodb.recordset")
                //			obj=server.CreateObject("queryrecordsets.fetchrecordsets")
                //			'rs=obj.singlerecordset("GENBANKPARM","CASHDENOMYN","Bankcode='" & brcode & "'")
                //			rs=obj.singlerecordset("GENBANKBRANCHMST","CASHDENOMINATIONSREQUIREDYN,CASHDENOMTALLYYN","BRANCHCODE='" & brcode & "'")
                //			if rs.recordcount > 0 then
                //				session("cashdenomyn")=rs(0).value 
                //				session("cashdenomtallyyn") =rs(1).value 
                //			end if
                //			rs=nothing
                //		end if

                //		Dim rsclg, objclg
                //		rsclg=server.CreateObject ("adodb.recordset")
                //		objclg=server.CreateObject("queryrecordsets.fetchrecordsets")
                //		rsclg=objclg.singlerecordset("GENBANKBRANCHMST","CLGRETCHGSAUTOPOSTYN","BRANCHCODE='" & brcode & "'")
                //		if objclg.ConnError="Connected" then
                //			if not rsclg.bof and not rsclg.eof then
                //				if rsclg.recordcount > 0 then
                //					session("clgretchgsautoyn")=rsclg(0).value 
                //				end if
                //			end if
                //		end if
                //		rsclg=nothing
                //}
            }

            return View(model);
        }
    }
}
