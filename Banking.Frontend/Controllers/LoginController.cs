using Banking.Models;
using Microsoft.AspNetCore.Mvc;
using Banking.APIService.LoginService;

namespace Banking.Frontend.Controllers
{
    public class LoginController : BaseController
    {
        private readonly ILogger<LoginController> _logger;
        private LoginService _loginService;

        public LoginController(ILogger<LoginController> logger, IConfiguration configuration) : base(configuration)
        {
            _loginService = new LoginService(_bankingBaseService);
            _logger = logger;
        }

        public ActionResult Index()
        {
            var loginModel = new LoginModel();
            _logger.LogInformation("Login Page");
            ViewData["Title"] = "Login Page";
            return View(loginModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(LoginModel loginModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return View(loginModel);
                }

                var result = await _loginService.GetEODProgress(loginModel.Username) ?? string.Empty;

                if (result.Equals("906"))
                {
                    loginModel.ErrorCode = "906";
                    loginModel.ErrorMessage = "HO Day End in Progress, please wait some time.";
                    return View(loginModel);
                }

                var data = await _loginService.ValidateUser(loginModel.Username) ?? string.Empty;

                string compPass1, compPass2;
                compPass1 = string.Concat(loginModel.Username, "1");
                compPass2 = string.Concat(loginModel.Username, "2");

                List<string> notOverList = new List<string> { "NoA", "NoL", "NoP", "Noo" };

                if (notOverList.Contains(data))
                {
                    loginModel.HiddenStatus = "notover";
                    if (loginModel.Password1 == compPass1 && loginModel.Password2 == compPass2)
                    {
                        loginModel.ErrorMessage = "Change Your Default Passwords Then Login";
                        return View(loginModel);
                    }
                }
                else if (data.Equals("Mes"))
                {
                    loginModel.HiddenStatus = "over";
                    if (loginModel.Password1 == compPass1 && loginModel.Password2 == compPass2)
                    {
                        loginModel.ErrorMessage = "Change Your Default Passwords Then Login";
                        return View(loginModel);
                    }
                }
                else if (data.Equals("DLL"))
                {
                    return View(loginModel);
                }
                else
                {
                    loginModel.HiddenStatus = "over";
                    if (loginModel.Password1 == compPass1 && loginModel.Password2 == compPass2)
                    {
                        loginModel.ErrorMessage = "Change Your Default Passwords Then Login";
                        return View(loginModel);
                    }
                }

                return RedirectToAction(nameof(Index), "Home");

            }
            catch
            {
                return View();
            }
        }

        //private void LoginCheckProcess()
        //{

        //    //            dim ObjLogin, ObjWorkAllotment
        //    //dim UsrId, Paswd, bio
        //    //dim trans(0,4)
        //    //dim StrMsg, St, Status
        //    //dim recdaybegin
        //    //Dim rscnt, rsdate
        //    //Dim rs
        //    //dim rs1
        //    //Dim objchk
        //    //Dim objcnt
        //    //dim rsLogChk, rsBioChk, objfetch, Decodepswd
        //    //dim appdate
        //    //dim objErrlog
        //    //dim strquery
        //    //dim strerror

        //    //UsrId = Request.Form("txtUid")
        //    //Paswd = Request.Form("txtPwd")
        //    //bio = Request.Form("txtBio")
        //    //Status = Request.Form("status")
        //    //appdate = session("applicationdate")
        //    //UsrId = trim(ucase(UsrId))
        //    //session("daybegin1") = Request.Form("hdndaybegin")
        //    //'============================ SESSION TRACKING ==========================


        //    //if ucase(trim(Request.Form("txtUid"))) <> "" then

        //    //    session("userid") = ucase(trim(Request.Form("txtUid")))

        //    //    session("daybegin") = ""
        //    //else
        //    //                UsrId = session("userid")
        //    //end if

        //    //    sessid = session.SessionID

        //    //    'stx=usrid

        //    //    objErrlog = server.CreateObject("TrapError.ErrorDescription")

        //    //    rs = server.CreateObject("adodb.recordset")

        //    //    rs2 = server.CreateObject("adodb.recordset")

        //    //    rscust = server.CreateObject("adodb.recordset")

        //    //    rscnt = server.CreateObject("adodb.recordset")

        //    //    rsdate = server.CreateObject("adodb.recordset")

        //    //    obj = server.CreateObject("queryrecordsets.fetchrecordsets")

        //    //    objcnt = server.CreateObject("queryrecordsets.fetchrecordsets")

        //    //    objchk = server.CreateObject("queryrecordsets.fetchrecordsets")


        //    //    session("serverid") = Request.ServerVariables("SERVER_NAME")

        //    //    'session("machineid")=session("serverid") & "/" & Request.ServerVariables("REMOTE_HOST")	

        //    //    session("machineid") = Request.ServerVariables("REMOTE_HOST")


        //    //    rs1 = server.CreateObject("adodb.recordset")

        //    //    rs = objchk.singlerecordset("genusermst a, genbankbranchmst b", _

        //    //            "distinct(a.branchcode),a.accountstatus,b.branchname,a.groupid,a.abbuseryn,a.NAME", _

        //    //        "a.branchcode=b.branchcode and upper(a.userid)='" & cstr(ucase(usrid)) & "'")



        //    //    if objchk.ConnError<>"Connected" then


        //    //        'genusermst  - 1 
        //    //strquery = "select distinct(a.branchcode),a.accountstatus,b.branchname,a.groupid,a.abbuseryn from " & _
        //    //" genusermst a, genbankbranchmst b where a.branchcode=b.branchcode and upper(a.userid)=''" & cstr(ucase(usrid)) & "''"

        //    //strerror = objErrlog.ErrorProcess(1, "genusermst : " & objchk.ConnError, objchk.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))
        //    //objErrlog.LogError("LoginCheck", "genusermst", 1, objchk.ConnError & "  : SQL Query :  " & strquery)


        //    //        Response.Redirect("useridscreen.aspx?record=" & objchk.ConnError)

        //    //    end if


        //    //    if not rs.EOF and not rs.BOF then

        //    //        session("branchcode") = rs(0).value

        //    //        session("branchnarration") = rs(2).value

        //    //        session("groupcode") = rs(3).value

        //    //        session("Abbuser") = iif(isdbnull(rs(4).value), "N", rs(4).value)

        //    //        session("userName") = rs(5).value


        //    //        rsdate = objcnt.singlerecordset("GENAPPLICATIONDATEMST", "to_char(applicationdate,'dd-Mon-yyyy')", " branchcode='" & rs(0).value & "'")




        //    //        if objcnt.ConnError<>"Connected" then


        //    //        '' GENAPPLICATIONDATEMST - 2


        //    //        strquery = ""

        //    //        strquery = "select to_char(applicationdate,''dd-Mon-yyyy'') from GENAPPLICATIONDATEMST where branchcode=''" & rs(0).value & "''"


        //    //        strerror = objErrlog.ErrorProcess(2, "GENAPPLICATIONDATEMST : " & objcnt.ConnError, objcnt.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))


        //    //        objErrlog.LogError("LoginCheck", "GENAPPLICATIONDATEMST", 2, objcnt.ConnError & " : SQL Query : " & strquery)


        //    //            Response.Redirect("useridscreen.aspx?record=" & objcnt.ConnError)

        //    //        end if


        //    //        if not rsdate.EOF and not rsdate.BOF then session("applicationdate") = rsdate(0).value


        //    //            rs1 = objchk.singlerecordset("genbranchpmt a, gencurrencytypemst b", "distinct(a.currencycode),b.narration,b.PRECISION,a.CHEQUEVALIDPERIOD,a.CHEQUELENGTH", "a.branchcode='" & rs(0).value & "' and a.currencycode=b.currencycode")



        //    //                if objchk.ConnError<>"Connected" then


        //    //                        ' genbranchpmt - 3 		

        //    //        strquery = ""

        //    //                strquery = "select distinct(a.currencycode),b.narration,b.PRECISION,a.CHEQUEVALIDPERIOD,a.CHEQUELENGTH " & _

        //    //                " from genbranchpmt a, gencurrencytypemst b where a.branchcode=''" & rs(0).value & "'' and " & _

        //    //                " a.currencycode=b.currencycode"

        //    //        objErrlog.LogError("LoginCheck", "genbranchpmt", 3, objchk.ConnError & " : SQL Query : " & strquery)


        //    //        strerror = objErrlog.ErrorProcess(3, "genbranchpmt: " & objchk.ConnError, objchk.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))


        //    //                    Response.Redirect("useridscreen.aspx?record=" & objchk.ConnError)

        //    //                end if

        //    //            rs.close

        //    //            rs = Nothing


        //    //                if not rs1.EOF and not rs1.BOF then


        //    //                    session("currencycode") = rs1(0).value

        //    //                    session("currencynarration") = rs1(1).value

        //    //                    session("PRECISION") = len(rs1(2).value) - 1


        //    //                    'Cheque Validity Period

        //    //                    session("ChequeValidPeriod") = ""

        //    //                    if isdbnull(rs1(3).value) = false then

        //    //                        session("ChequeValidPeriod") = cstr(rs1(3).value)

        //    //                    end if


        //    //                    'Cheque LENGTH

        //    //                    session("ChequeLength") = ""

        //    //                    if isdbnull(rs1(4).value) = false then

        //    //                        session("ChequeLength") = cstr(rs1(4).value)

        //    //                    end if

        //    //                end if

        //    //                rs1.close

        //    //                rs1 = Nothing

        //    //                objcnt = nothing

        //    //                rscnt = objchk.singlerecordset("cashcountermst", "counterno", "cashierid='" & session("userid") & "'")



        //    //                if objchk.ConnError<>"Connected" then

        //    //                ' cashcountermst -4 

        //    //                strquery = ""

        //    //                strquery = "select counterno from cashcountermst where cashierid=''" & session("userid") & "''"

        //    //        objErrlog.LogError("LoginCheck", "cashcountermst", 4, objchk.ConnError & " : SQL Query : " & strquery)


        //    //        strerror = objErrlog.ErrorProcess(4, "cashcountermst: " & objchk.ConnError, objchk.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))


        //    //                    Response.Redirect("useridscreen.aspx?record=" & objchk.ConnError)

        //    //                end if


        //    //                if not rscnt.BOF and not rscnt.EOF then

        //    //                        session("counterno") = rscnt(0).value

        //    //                end if

        //    //                rscnt.close

        //    //                rscnt = nothing

        //    //        end if

        //    //rscust = objchk.singlerecordset("genbankparm", "NONCUSTOMERID")
        //    //if not rscust.eof and not rscust.bof then

        //    //    session("noncustomer") = rscust(0).value
        //    //end if
        //    //rscust.close
        //    //rscust = nothing

        //    //rs2 = obj.singlerecordset("genbankparm", "bankcode,bankname", "")
        //    //if not rs2.EOF and not rs2.BOF then
        //    //session("bankcode") = rs2(0).value
        //    //session("bankname") = rs2(1).value
        //    //end if
        //    //rs2.close
        //    //rs2 = nothing


        //    //'===========================================================================

        //    //    if session("daybegin") = "" then



        //    //        if (len(UsrId) <> 0 and len(PasWd)<> 0 and len(bio)<> 0) or(session("moduleid") = "xxxx") then


        //    //            '' New code


        //    //            ''' 1. Check whether The Entered User is valid or Not

        //    //            rsValid = server.CreateObject("adodb.recordset")

        //    //            objValid = server.CreateObject("queryrecordsets.fetchrecordsets")

        //    //            rsValid = objValid.singlerecordset("genuserMst", "userid", _

        //    //                    "upper(userid)='" & ucase(usrid) & "' and accountstatus='R'")


        //    //                    if objValid.ConnError<>"Connected" then

        //    //            ' genuserMst -5

        //    //                strquery = ""

        //    //                strquery = "select userid from genuserMst where upper(userid)=''" & ucase(usrid) & "'' and " & _

        //    //                "accountstatus=''R''"

        //    //        objErrlog.LogError("LoginCheck", "genuserMst", 5, objValid.ConnError & " : SQL Query : " & strquery)


        //    //    strerror = objErrlog.ErrorProcess(5, "genuserMst: " & objValid.ConnError, objValid.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))


        //    //                        Response.Redirect("useridscreen.aspx?record=" & objValid.ConnError)

        //    //                    end if


        //    //                    if not rsValid.EOF and not rsValid.BOF then


        //    //                    else
        //    //                Response.Redirect("useridscreen.aspx?record=" & _

        //    //                    ucase(usrid) & " Your account is temporarly disabled.Please contact your Administrator...")

        //    //                    end if

        //    //             rsValid = nothing


        //    //            '' 1.1 Password checking for default password

        //    //            ''(i) check the password without encrypting for default passwords


        //    //            '' added new code


        //    //            if status = "ChngPwd1"  then
        //    //                Paswd = Ucase(Paswd)

        //    //                bio = Ucase(bio)


        //    //                Paswd1 = EncodePWD(Paswd, UsrId)

        //    //                chkBio1 = EncodePWD(bio, UsrId)


        //    //                session("userid") = ucase(trim(Request.Form("txtUid")))

        //    //                rsLogChk = server.CreateObject("adodb.recordset")

        //    //                rsBioChk = server.CreateObject("adodb.recordset")

        //    //                objfetch = server.CreateObject("queryrecordsets.fetchrecordsets")


        //    //            rsLogChk = objfetch.singlerecordset("GENPROMOTIONSMST", "EMPPWD", "upper(EMPID)='" & UCase(usrid) & "'")


        //    //            rsBioChk = objfetch.singlerecordset("GENUSERMST", "BIOMETRICS,status", "upper(USERID)='" & UCase(usrid) & "'")


        //    //            if not rsLogChk.eof and not rsLogChk.bof then

        //    //             if Paswd = rsLogChk(0).value or Paswd1 = rsLogChk(0).value then

        //    //                if not rsBioChk.eof and not rsBioChk.bof

        //    //                    if bio = rsBioChk(0).value or chkBio1 = rsBioChk(0).value then

        //    //                       if rsBioChk(1).value = "A" then
        //    //                         StrMsg = "Successfully Loged in"

        //    //                       else
        //    //                StrMsg = "Not An Approved User..."

        //    //                         Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //                       end if

        //    //                    else
        //    //                    StrMsg = "Invalid password OR Username LogonDenied"

        //    //                        Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //                   end if

        //    //            else
        //    //                    StrMsg = "Not An Application User"

        //    //            Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //            end if

        //    //                else
        //    //                    StrMsg = "Invalid Username OR password LogonDenied"

        //    //            Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //               end if

        //    //            else
        //    //                    StrMsg = "Invalid Username OR Password LogonDenied"

        //    //                Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //            end if

        //    //                 Response.Redirect("confirmuseridscreen1.aspx")

        //    //            end if


        //    //            '' end of new code


        //    //            '' 2.Password checking for the existing userid

        //    //            '''  (i)  check with First Password

        //    //            '''  (ii) check with Second Password


        //    //            Paswd = Ucase(Paswd)

        //    //            bio = Ucase(bio)


        //    //            chkPwd = EncodePWD(Paswd, UsrId)

        //    //            chkBio = EncodePWD(bio, UsrId)


        //    //            ''rsLogChk = server.CreateObject("adodb.recordset")

        //    //            ''rsBioChk = server.CreateObject("adodb.recordset")

        //    //            objfetch = server.CreateObject("queryrecordsets.fetchrecordsets")


        //    //            rsLogChk = objfetch.singlerecordset("GENPROMOTIONSMST", "EMPPWD", "upper(EMPID)='" & UCase(usrid) & "'")


        //    //            rsBioChk = objfetch.singlerecordset("GENUSERMST", "BIOMETRICS,status", "upper(USERID)='" & UCase(usrid) & "'")


        //    //            if not rsLogChk.eof and not rsLogChk.bof then

        //    //             if chkPwd = rsLogChk(0).value then

        //    //                if not rsBioChk.eof and not rsBioChk.bof

        //    //                    if chkBio = rsBioChk(0).value then

        //    //                       if rsBioChk(1).value = "A" then
        //    //                         StrMsg = "Successfully Loged in"

        //    //                       else
        //    //                StrMsg = "Not An Approved User..."

        //    //                         Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //                       end if

        //    //                    else
        //    //                    StrMsg = "Invalid password OR Username LogonDenied"

        //    //                        Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //               end if

        //    //            else
        //    //                    StrMsg = "Not An Application User"

        //    //            Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //            end if

        //    //                else
        //    //                    StrMsg = "Invalid Username OR password LogonDenied"

        //    //            Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //               end if

        //    //            else
        //    //                    StrMsg = "Invalid Username OR password LogonDenied"

        //    //                Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //            end if

        //    //            rsLogChk.close

        //    //            rsLogChk = nothing

        //    //            rsBioChk.close
        //    //            rsBioChk = nothing


        //    //            '' 3.Checking whether UserId Locked OR Not
        //    //            rsLock = server.CreateObject("adodb.recordset")

        //    //            objLock = server.CreateObject("queryrecordsets.fetchrecordsets")

        //    //            rsLock = objLock.singlerecordset("GENUSERMST", "LOCKEDDATE", "upper(userid)='" & UCase(usrid) & "'")

        //    //                if objLock.ConnError = "Connected" then

        //    //                    if not rsLock.EOF and not rsLock.BOF then

        //    //                    if isdbnull(rsLock(0).value) = false then
        //    //                        StrMsg = "UserId Locked"

        //    //                        Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //                    end if

        //    //                    rsLock.close

        //    //                    rsLock = nothing

        //    //                end if

        //    //            end if


        //    //        '' 4.Checking whether User Expirydate is crossed the Applicationdate

        //    //        rsExpDt = server.CreateObject("adodb.recordset")

        //    //        objrsExpDt = server.CreateObject("queryrecordsets.fetchrecordsets")

        //    //        rsExpDt = objrsExpDt.singlerecordset("GENUSERMST", "EXPIRYDATE,sysdate", "upper(userid)='" & UCase(usrid) & "'")

        //    //        session("ExpiryUserid") = ""

        //    //        if objrsExpDt.ConnError = "Connected" then

        //    //            if not rsExpDt.EOF and not rsExpDt.BOF then

        //    //            if isdbnull(rsExpDt(0).value) = false then
        //    //                    days = datediff("D", session("applicationdate"), rsExpDt(0).value)

        //    //                    if cint(days) <= 10 then
        //    //                    Msg = "UserId Will Be Expired WithIn " & days & " day(s)"

        //    //                        if cint(days) = 0

        //    //                        Msg = "UserId Will Expire Today"

        //    //                        end if

        //    //                        if cint(days) < 0

        //    //                        Msg = "UserId Expired, Please Contact Administrator"

        //    //                        Response.Redirect("useridscreen.aspx?record=" & Msg)

        //    //                        end if

        //    //                    session("ExpiryUserid") = Msg

        //    //                    ''Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //                    end if

        //    //                end if

        //    //            end if

        //    //        rsExpDt.close

        //    //        rsExpDt = nothing

        //    //        end if


        //    //        '' 5.Checking Password ExpiryDate

        //    //        rsPwdDt = server.CreateObject("adodb.recordset")

        //    //        objPwdDt = server.CreateObject("queryrecordsets.fetchrecordsets")

        //    //        rsPwdDt = objPwdDt.singlerecordset("GENPROMOTIONSMST", "PWDEXPIRYDT,sysdate,GRACETIME", "upper(EMPID)='" & UCase(usrid) & "'")

        //    //         session("Expirypwd") = ""

        //    //         if objPwdDt.ConnError = "Connected" then

        //    //            if not rsPwdDt.EOF and not rsPwdDt.BOF then

        //    //                if isdbnull(rsPwdDt(0).value) = false then
        //    //                days = datediff("D", session("applicationdate"), rsPwdDt(0).value)

        //    //                    if cint(days) <= cint(rsPwdDt(2).value) then
        //    //                    Msg = "Your Password Will Be Expired WithIn " & days & " day(s)"

        //    //                        if cint(days) = 0 then
        //    //                        Msg = "Your Password Will Expire Today"

        //    //                        end if

        //    //                        if cint(days) < 0

        //    //                        Msg = "Password Expired, Please Contact Administrator"

        //    //                        Response.Redirect("useridscreen.aspx?record=" & Msg)

        //    //                        end if

        //    //                    session("Expirypwd") = Msg

        //    //                    ''Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //                    end if

        //    //                end if

        //    //            end if

        //    //            rsPwdDt.close

        //    //            rsPwdDt = nothing

        //    //        end if

        //    //        '' End of New code


        //    //            recdaybegin = server.CreateObject("adodb.recordset")


        //    //            if session("moduleid") = "xxxx" then
        //    //                StrMsg = "Successfully Loged in"

        //    //                status = "Login"

        //    //            end if


        //    //            if status = "Login" then

        //    //                if StrMsg = "Successfully Loged in" OR StrMsg = "Trans Completed" then
        //    //                    objquery = server.CreateObject("queryrecordsets.fetchrecordsets")

        //    //                    reccheck = server.CreateObject("adodb.recordset")

        //    //            reccheck = objquery.singlerecordset("genuserMst", "nvl(noofsessions,0), " & _

        //    //                    "nvl(usermachineid,'X'),groupid", _

        //    //                    "upper(userid)='" & ucase(usrid) & "' and accountstatus='R'")



        //    //                    if objquery.ConnError<>"Connected" then

        //    //            ' genuserMst -6

        //    //                strquery = ""

        //    //                strquery = "select nvl(noofsessions,0), nvl(usermachineid,''X''),groupid from genuserMst " & _

        //    //                " where upper(userid)=''" & ucase(usrid) & "'' and " & _

        //    //                "upper(userid)=''" & ucase(usrid) & "'' and accountstatus=''R''"


        //    //        objErrlog.LogError("LoginCheck", "genuserMst", 6, objquery.ConnError & " : SQL Query : " & strquery)


        //    //        strerror = objErrlog.ErrorProcess(6, "genuserMst : " & objquery.ConnError, objquery.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))


        //    //                        Response.Redirect("useridscreen.aspx?record=" & objquery.ConnError)

        //    //                    end if

        //    //                    if not reccheck.EOF and not reccheck.BOF then

        //    //                        sessions = reccheck(0).value

        //    //                        macid = reccheck(1).value

        //    //                        group1 = reccheck(2).value

        //    //                    else
        //    //                Response.Redirect("useridscreen.aspx?record=" & _

        //    //                    ucase(usrid) & " Your account is temporarly disabled.Please contact your Administrator...")

        //    //                    end if



        //    //                    if group1<>"ADMIN" then
        //    //                    reccheck = objquery.singlerecordset("genmachinedtls", "machineid", _

        //    //                        "upper(branchcode)='" & ucase(session("branchcode")) & "'" & _

        //    //                        " and machineipaddress='" & macid & "'")


        //    //                        if objquery.ConnError<>"Connected" then

        //    //            ' genmachinedtls -7

        //    //            strquery = ""

        //    //                strquery = "select machineid from genmachinedtls where " & _

        //    //                "upper(branchcode)=''" & ucase(session("branchcode")) & "'' and machineipaddress=''" & macid & "''"

        //    //            strerror = objErrlog.ErrorProcess(7, "genmachinedtls: " & objquery.ConnError, objquery.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))

        //    //        objErrlog.LogError("LoginCheck", "genmachinedtls", 7, objquery.ConnError & " : SQL Query : " & strquery)


        //    //                        Response.Redirect("useridscreen.aspx?record=" & objquery.ConnError)

        //    //                        end if


        //    //                        if not reccheck.eof and not reccheck.BOF then

        //    //                            if macid<>Request.ServerVariables("REMOTE_HOST")  then

        //    //                                if macid<>"X" then

        //    //                                    Response.Redirect("useridscreen.aspx?record=" & _

        //    //                                        usrid & " Please login from the machine alloted to u..")

        //    //                                end if

        //    //                            end if

        //    //                        else
        //    //                            if macid<>"X" then

        //    //                                Response.Redirect("useridscreen.aspx?record=" & _

        //    //                                    "This Machine(" & macid & ") is not identified in " & session("branchcode") & "  branch." & _

        //    //                                    " Please check the Machine and try again..")

        //    //                            else
        //    //                macid = Request.ServerVariables("REMOTE_HOST")

        //    //                                reccheck = objquery.singlerecordset("genmachinedtls", "machineid", _

        //    //                                    "upper(branchcode)='" & ucase(session("branchcode")) & "'" & _

        //    //                                    " and machineipaddress='" & macid & "'")

        //    //                                if not reccheck.EOF and not reccheck.BOF then

        //    //                                    x = 0

        //    //                                else
        //    //                Response.Redirect("useridscreen.aspx?record=" & _

        //    //                "This Machine(" & macid & ") is not identified in " & session("branchcode") & "  branch." & _

        //    //                " Please check the Machine and try again..")

        //    //                                end if



        //    //                            end if

        //    //                        end if

        //    //                    end if


        //    //                        reccheck = objquery.singlerecordset("genuserlogindtls", "machineid", "upper(userid)='" & ucase(usrid) & "' and upper(machineid)<>'" & ucase(session("machineid")) & "'")


        //    //                        if objquery.ConnError<>"Connected" then


        //    //                ' genuserlogindtls -8

        //    //                strquery = ""

        //    //                strquery = "select machineid from genuserlogindtls where upperupper(userid)=''" & ucase(usrid) & "'' and " & _

        //    //                " upper(machineid)<>''" & ucase(session("machineid")) & "''"


        //    //        objErrlog.LogError("LoginCheck", "genuserlogindtls", 8, objquery.ConnError & " : SQL Query : " & strquery)


        //    //        strerror = objErrlog.ErrorProcess(8, "genuserlogindtls: " & objquery.ConnError, objquery.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))



        //    //                            Response.Redirect("useridscreen.aspx?record=" & objquery.ConnError)

        //    //                        end if

        //    //                        if not reccheck.EOF and not reccheck.BOF then

        //    //                            if reccheck.RecordCount >= cint(sessions)  and group1 = "ADMIN" then

        //    //                        if sessions = 0 then
        //    //                         sessions = 1

        //    //                        end if

        //    //                Response.Redirect("useridscreen.aspx?record=" & ucase(usrid) & _

        //    //                " You have already opened " & sessions & " browsers." & _

        //    //                " Please logout from some browsers and try again...")


        //    //                            elseif group1<>"ADMIN" and ucase(reccheck(0).value)<> ucase(session("machineid")) then



        //    //                                Response.Redirect("useridscreen.aspx?record=" & ucase(usrid) & _

        //    //                                    " You have already opened one browser." & _

        //    //                                    " Please logout that and try again...")

        //    //                            end if

        //    //                        end if


        //    //                        reccheck.close

        //    //                        reccheck = nothing


        //    //                        objupdate = server.CreateObject("generaltransactions.dbtransactions")

        //    //                        trans(0, 0) = "U"

        //    //                        trans(0, 1) = "Genuserlogindtls"

        //    //                        trans(0, 2) = "userid,machineid,branchcode,loginsysdate,adminyn,sessionid"

        //    //                        trans(0, 3) = "'" & usrid & "','" & session("machineid") & "','" & _

        //    //                            session("branchcode") & "',sysdate,'" & admin & "','" & sessid & "'"

        //    //                        trans(0, 4) = ""

        //    //                        trans(0, 0) = "I"

        //    //                        trans(0, 1) = "Genuserlogindtls"

        //    //                        trans(0, 2) = "userid,machineid,branchcode,loginsysdate,adminyn,sessionid"

        //    //                        trans(0, 3) = "'" & usrid & "','" & session("machineid") & "','" & _

        //    //                            session("branchcode") & "',sysdate,'" & admin & "','" & sessid & "'"

        //    //                        trans(0, 4) = ""


        //    //                        Strmsg = objupdate.DataTransactions(trans,,,,, "N")

        //    //                        Response.Write(strmsg)

        //    //                        'strmsg=""

        //    //                        Response.Write(trans(0, 3))


        //    //                        if left(strmsg, 11) = "Transaction" then

        //    //                            ''recdaybegin2 = createobject("adodb.recordset")
        //    //''                          recdaybegin1 = createobject("adodb.recordset")


        //    //                            recdaybegin = Objchk.SingleRecordset("genmodulemst c, genmoduletypesmst d", _

        //    //                                "distinct(c.moduleid),initcap(c.narration),moduleorder", _

        //    //                                "c.moduleid in(select moduleid from gengroupformsmst where groupcode=" & _

        //    //                                "(select groupid from genusermst where upper(userid)='" & ucase(usrid) & _

        //    //                                "') union select distinct moduleid from genuseridformsmst where addoreliminate='A' " & _

        //    //                                "and upper(userid)='" & ucase(usrid) & "'" & _

        //    //                                ") and d.implementedyn='Y' and d.moduleid=c.moduleid and d.branchcode='" & _

        //    //                                session("branchcode") & "' and c.parentmoduleid is null order by moduleorder")


        //    //                            stn = ""


        //    //                            if Objchk.ConnError<>"Connected" then

        //    //                ' genmodulemst -9

        //    //                strquery = ""

        //    //                strquery = "select distinct(c.moduleid),initcap(c.narration),moduleorder from genmodulemst c," & _

        //    //                " genmoduletypesmst d where c.moduleid in(select moduleid from gengroupformsmst where groupcode=" & _

        //    //                                "(select groupid from genusermst where upper(userid)=''" & ucase(usrid) & _

        //    //                                "'') union select distinct moduleid from genuseridformsmst where addoreliminate=''A'' " & _

        //    //                                "and upper(userid)=''" & ucase(usrid) & "''" & _

        //    //                                ") and d.implementedyn=''Y'' and d.moduleid=c.moduleid and d.branchcode=''" & _

        //    //                                session("branchcode") & "'' and c.parentmoduleid is null order by moduleorder"


        //    //        objErrlog.LogError("LoginCheck", "genmodulemst", 9, objchk.ConnError & " : SQL Query : " & strquery)


        //    //        strerror = objErrlog.ErrorProcess(9, "genmodulemst: " & objchk.ConnError, objchk.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))


        //    //                            Response.Redirect("useridscreen.aspx?record=" & Objchk.ConnError)

        //    //                            end if


        //    //                            if recdaybegin.RecordCount = 0 then
        //    //                                strm = "Workallotment is not done to this user.."

        //    //                                Response.Redirect("useridscreen.aspx?record=" & strm)

        //    //                            end if


        //    //                            do while not recdaybegin.EOF
        //    //                                Stx = Stx & recdaybegin(0).value & ":F" & "|"

        //    //                                stn = stn & "," & recdaybegin(1).value

        //    //                                recdaybegin.MoveNext
        //    //                            loop



        //    //                                Stx = Stx & "$"

        //    //                                session("modnar") = stn

        //    //                                session("mod") = stx


        //    //                                Response.Write(stx)

        //    //                                objErrlog = nothing

        //    //                                Response.Redirect("Modulescr.aspx?record=" & Stx)

        //    //                        else
        //    //                Response.Redirect("useridscreen.aspx?record=" & StrMsg)


        //    //                        end if

        //    //                    else
        //    //                    StrMsg = replace(StrMsg, vbnewline, " ")

        //    //                        StrMsg = replace(StrMsg, "\n", " ")

        //    //                        StrMsg = replace(StrMsg, vbcrlf, " ")

        //    //                        StrMsg = replace(StrMsg, vbtab, " ")

        //    //                        StrMsg = replace(StrMsg, "\r", " ")

        //    //                        StrMsg = replace(StrMsg, "\t", " ")

        //    //                        StrMsg = replace(StrMsg, "/", " or ")

        //    //                        StrMsg = replace(StrMsg, "-", " ")

        //    //                        StrMsg = replace(StrMsg, ":", " ")

        //    //                        StrMsg = replace(StrMsg, ";", " ")

        //    //                        StrMsg = replace(StrMsg, " ", "")

        //    //                        'Response.write("<br>BEGIN:" & StrMsg & ":END")

        //    //                        'Response.end 

        //    //                        Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //                    end if


        //    //                elseif status = "ChngPwd"  then


        //    //                    if StrMsg = "Successfully Loged in" OR StrMsg = "Trans Completed" then


        //    //                        session("userid") = ucase(trim(Request.Form("txtUid")))

        //    //                        Response.Redirect("confirmuseridscreen1.aspx")

        //    //                    else
        //    //                Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //                    end if

        //    //                end if

        //    //        else

        //    //                        strmsg = "not a Valid Password for " & ucase(usrid) & "...."

        //    //            Response.Redirect("useridscreen.aspx?record=" & StrMsg)

        //    //        end if


        //    //    else
        //    //                    RecWorkAllotment = nothing

        //    //        recdaybegin1 = createobject("adodb.recordset")

        //    //        recdaybegin2 = createobject("adodb.recordset")


        //    //        'recdaybegin1=Objchk.SingleRecordset("genmoduleactivitylog b, genmodulemst c","distinct(c.moduleid),initcap(c.narration)","b.moduleid in (select moduleid from gengroupformsmst where groupcode=(select groupid from genusermst where upper(userid)='" & ucase(usrid) & "') ) and dayenddate is null and dayenddate is null and daybeginstatus is null and daybegindate is null and b.moduleid=c.moduleid and branchcode='" & session("branchcode") &"'  and c.parentmoduleid is null")

        //    //        'recdaybegin=Objchk.SingleRecordset("genmoduleactivitylog b, genmodulemst c ","distinct(c.moduleid),b.daybeginstatus,initcap(c.narration)","to_char(dayenddate(+),'dd - Mon - yyyy')<>'" & rsdate(0) &"' and to_char(daybegindate(+),'dd - Mon - yyyy')='" & rsdate(0) &"'and b.moduleid=c.moduleid and c.moduleid in(select moduleid from gengroupformsmst where groupcode=(select groupid from genusermst where upper(userid)='" & ucase(usrid) & "')) and c.parentmoduleid is null")

        //    //        'recdaybegin2=Objchk.SingleRecordset("genmoduleactivitylog b, genmodulemst c,genmoduletypesmst d","distinct(parentmoduleid),initcap(parentmoduleidnarration)","b.moduleid in (select moduleid from gengroupformsmst where groupcode=(select groupid from genusermst where upper(userid)='" & ucase(usrid) & "') ) and dayenddate is null and dayenddate is null and daybeginstatus is null and daybegindate is null and b.moduleid=c.moduleid and b.branchcode='" & session("branchcode") &"' and d.implementedyn='Y' and d.moduleid=b.moduleid and d.moduleid=c.moduleid and c.parentmoduleid is not null")

        //    //        rsdate.close
        //    //        rsdate = Nothing


        //    //        Stn = ""



        //    //        if Objchk.ConnError<>"Connected" then

        //    //                Response.Redirect("useridscreen.aspx?record=" & Objchk.ConnError)

        //    //        end if

        //    //        do while not recdaybegin.EOF

        //    //            if recdaybegin(1) = "O" then
        //    //                Stx = Stx & recdaybegin(0).value & ":F" & "|"

        //    //            else
        //    //                Stx = Stx & Recdaybegin(0).value & ":T" & "|"

        //    //            end if

        //    //            stn = stn & "," & recdaybegin(2).value

        //    //            recdaybegin.MoveNext
        //    //        loop

        //    //        recdaybegin.close
        //    //        recdaybegin = Nothing


        //    //        stx = stx & "$"

        //    //        if len(stn) = 0 then stn = stn & "$"

        //    //            stn = stn & "$"

        //    //            if Objchk.ConnError<>"Connected" then

        //    //                    Response.Redirect("useridscreen.aspx?record=" & Objchk.ConnError)

        //    //            end if

        //    //            do while not recdaybegin1.EOF
        //    //                    Stx = Stx & recdaybegin1(0).value & ":F" & "|"

        //    //                    stn = stn & "," & recdaybegin1(1).value

        //    //                    recdaybegin1.MoveNext
        //    //            loop

        //    //            recdaybegin1.close
        //    //            recdaybegin1 = nothing

        //    //            'if len(stn)>0 then 	stn=right(stn,len(stn)-1)


        //    //            if Objchk.ConnError<>"Connected" then

        //    //                    Response.Redirect("useridscreen.aspx?record=" & Objchk.ConnError)

        //    //            end if

        //    //            do while not recdaybegin2.EOF
        //    //                stx = stx & recdaybegin2(0) & ":F" & "|"

        //    //                stn = stn & "," & recdaybegin2(1).value

        //    //                Response.Write(recdaybegin2(1).value)

        //    //                recdaybegin2.MoveNext
        //    //            loop

        //    //            recdaybegin2.close
        //    //            recdaybegin2 = nothing


        //    //            session("modnar") = stn

        //    //            session("mod") = stx


        //    //            'stx="genworkallotmentmst a,genmoduleactivitylog b" & " a.moduleid,nvl(b.daybeginstatus,'N')" & "a.moduleid=b.moduleid(+) and upper(a.userid)='" & ucase(usrid) & "' and to_char(daybegindate(+),'dd - Mon - yyyy')='" & rsdate(0) &"'"

        //    //            Response.Redirect("Modulescr.aspx?record=" & Stx)

        //    //        end if


        //    //objchk = nothing
        //    //%>
        //    //< script language = "vbscript" runat = "server" >

        //    //''''''''''''''''''''''''''''''''''''''''''
        //    //Function EncodePWD(strPwd, stUserid )

        //    //    Dim intcnt, strNpwd, strNuser


        //    //    'stUserid = UCase(Left(stUserid, 3))

        //    //        For intcnt = 1 To Len(strPwd)

        //    //            strNpwd = strNpwd & ChartoNum(Mid(strPwd, intcnt, 1))

        //    //        Next intcnt

        //    //        For intcnt = 1 To Len(UCase(Left(stUserid, 3)))
        //    //			strNuser = strNuser & ChartoNum(Mid(UCase(Left(stUserid, 3)), intcnt, 1))

        //    //        Next intcnt

        //    //        EncodePWD = strNuser & StrReverse(Mid(strNpwd, 1, Len(strNpwd) / 2)) & Mid(strNpwd, (Len(strNpwd) / 2) + 1)


        //    //End Function

        //    //'Function to Decode Password
        //    //Function DecodePWD(strPwd, stUserid)

        //    //    Dim intcnt, strNpwd, strNuser, strSUser


        //    //    strNuser = Left(strPwd, 6)

        //    //    strPwd = Mid(strPwd, 7)

        //    //    strPwd = StrReverse(Mid(strPwd, 1, Len(strPwd) / 2)) & Mid(strPwd, (Len(strPwd) / 2) + 1)

        //    //    stUserid = Left(stUserid, 3)


        //    //        For intcnt = 1 To Len(strPwd)

        //    //            strNpwd = strNpwd & NumToChar(Mid(strPwd, intcnt, 2))

        //    //            intcnt = intcnt + 1

        //    //        Next intcnt


        //    //        For intcnt = 1 To Len(strNuser)

        //    //             strSUser = strSUser & NumToChar(Mid(strNuser, intcnt, 2))

        //    //            intcnt = intcnt + 1

        //    //        Next intcnt


        //    //        DecodePWD = strSUser & strNpwd
        //    //End Function




        //    throw new NotImplementedException();
        //}

        //private int CharToNumber(string str)
        //{
        //    return Extensions.CharacterMap.TryGetValue(Convert.ToChar(str.Substring(0, 1)), out var result) ? result : '\0';
        //}

        //private char NumberToChar(int intNumber)
        //{
        //    return Extensions.NumberMap.TryGetValue(intNumber, out var result) ? result : '\0';
        //}
    }
}
