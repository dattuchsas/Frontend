using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using System.Data;

namespace Banking.Services
{
    public class ListService : IListService
    {
        private readonly IDatabaseService _databaseFactory;

        public ListService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        // SERVICEID
        public async Task<List<SelectListItem>> GetServiceList(string searchString = "")
        {
            string whereCond = string.Empty;
            string[] search = searchString.Split('|');

            if (search.Length > 1 && search[1] == TransactionModes.Debit.ToString())
                whereCond = "Code in ('1','3','4','7','8','9')";
            else if (search.Length > 1 && search[1] == TransactionModes.Credit.ToString())
                whereCond = "Code in('1','2','3','4','7')";
            //else if (search.Length > 1 && search[1] == TransactionModes.Clearing.ToString())
            //    whereCond = "Code in('1','8')";
            else
                whereCond = "";

            DataTable dataTable = await _databaseFactory.SingleRecordSet("GENSERVICETYPESPMT", "CODE,NARRATION", whereCond, "CODE");

            return BankingExtensions.ReturnKeyValuePair(dataTable, "Service");
        }

        // MODULE
        public async Task<List<SelectListItem>> GetModuleId(string searchString = "")
        {
            string whereCond = string.Empty;
            DataTable dataTable = null!;

            if (string.IsNullOrWhiteSpace(searchString))
                return null!;

            if (searchString.Substring(0, 14).Equals("TellerModuleId") &&
                searchString.Substring(0, 17).Equals("MatTellerModuleId") &&
                searchString.Substring(0, 18).Equals("AutoTellerModuleId"))
            {
                string[] str = searchString.Split("|", StringSplitOptions.RemoveEmptyEntries);
                if (str.Length > 1 && str[2] == "1")
                {
                    whereCond = " gmt.MODULEID in ('SB','CA','LOAN','MISC','CC','INV','PL','REM')";
                    dataTable = await _databaseFactory.GetModuleId(str[1], "Y", "", "", whereCond);
                }
                else if (str.Length > 1 && str[2] == "1")
                {
                    whereCond = " MODULEID in ('SB','CA','DEP') ";
                    dataTable = await _databaseFactory.GetModuleId(str[1], "N", "", "", whereCond);
                }
            }
            else if (searchString.Substring(0, 12).Equals("TellerModule"))
            {
                string[] str = searchString.Split("|", StringSplitOptions.RemoveEmptyEntries);
                dataTable = await _databaseFactory.GetModuleId(str[1], "");
            }

            return BankingExtensions.ReturnKeyValuePair(dataTable, "Module");
        }

        // MODULE LIST
        public async Task<List<SelectListItem>> GetModuleList(string whereCondition = "")
        {
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENSERVICETYPESPMT", "CODE,NARRATION", whereCondition, "CODE");

            return BankingExtensions.ReturnKeyValuePair(dataTable, "Module");
        }

        public async Task<List<SelectListItem>> GetGLQuery(string searchString = "", string hidsearch = "", string userId = "")
        {
            string strType = searchString;
            string uid = userId;
            DataTable dataTable = null!;

            if (strType == "Branch")
                dataTable = await _databaseFactory.SingleRecordSet("GENBANKBRANCHMST", "distinct(Branchcode),narration");
            else if (strType == "Tellerbranch")
                dataTable = await _databaseFactory.GetBranchCodes(userId);
            else if (strType.Substring(0, 11) == "TelLockAcno") // For locker operating accno
            {
                string[] k = strType.Split("|");

                if (k[6] == "INTIME")
                {
                    dataTable = await _databaseFactory.SingleRecordSet("LOCKERMST",
                        "ACCNO,NAME", "ACCNO NOT IN ( SELECT ACCNO FROM LOCKEROPERATINGDTLS WHERE BRANCHCODE='" + k[1] + "' AND APPLICATIONDATE='" + k[5] +
                        "' AND OUTTIME IS NULL) AND GLCODE='" + k[3] + "' AND BRANCHCODE='" + k[1] + "' ORDER BY TO_NUMBER(ACCNO)");

                    if (!string.IsNullOrWhiteSpace(hidsearch))
                    {
                        string[] searchby = hidsearch.Split("|");
                        if (searchby[0] == "name")
                            dataTable = await _databaseFactory.SingleRecordSet("LOCKERMST",
                                "ACCNO,NAME", "ACCNO NOT IN ( SELECT ACCNO FROM LOCKEROPERATINGDTLS WHERE BRANCHCODE='" + k[1] + "' AND APPLICATIONDATE='" + k[5] +
                                "' AND OUTTIME IS NULL) AND UPPER(NAME) LIKE '%" + searchby[1]?.ToUpper() + "%' AND GLCODE='" + k[3] + "' AND BRANCHCODE='" + k[1] +
                                "' ORDER BY TO_NUMBER(ACCNO)");
                        else if (searchby[0] == "num")
                            dataTable = await _databaseFactory.SingleRecordSet("LOCKERMST",
                                "ACCNO,NAME", "ACCNO NOT IN ( SELECT ACCNO FROM LOCKEROPERATINGDTLS WHERE BRANCHCODE='" + k[1] + "' AND APPLICATIONDATE='" + k[5] +
                                "' AND OUTTIME IS NULL) AND ACCNO LIKE '%" + searchby[1] + "%' AND GLCODE='" + k[3] + "' AND BRANCHCODE='" + k[1] +
                                "' ORDER BY TO_NUMBER(ACCNO)");
                    }
                }
                else if (k[6] == "OUTTIME")
                {
                    dataTable = await _databaseFactory.SingleRecordSet("LOCKEROPERATINGDTLS A,LOCKERMST B",
                        "A.ACCNO,B.NAME", "B.ACCNO=A.ACCNO AND B.CUSTOMERID=A.CUSTOMERID AND B.BRANCHCODE=A.BRANCHCODE AND A.BRANCHCODE='" + k[1] +
                        "' AND A.APPLICATIONDATE='" + k[5] + "' AND OUTTIME IS NULL ORDER BY TO_NUMBER(A.ACCNO)");

                    if (!string.IsNullOrWhiteSpace(hidsearch))
                    {
                        string[] searchby = hidsearch.Split("|");
                        if (searchby[0] == "name")
                            dataTable = await _databaseFactory.SingleRecordSet("LOCKEROPERATINGDTLS A,LOCKERMST B",
                                "A.ACCNO,B.NAME", "B.ACCNO=A.ACCNO AND B.CUSTOMERID=A.CUSTOMERID AND B.BRANCHCODE=A.BRANCHCODE AND UPPER(B.NAME) LIKE '%" +
                                searchby[1]?.ToUpper() + "%' AND A.BRANCHCODE='" + k[1] + "' AND A.APPLICATIONDATE='" + k[5] +
                                "' AND OUTTIME IS NULL ORDER BY TO_NUMBER(A.ACCNO)");
                        else if (searchby[0] == "num")
                            dataTable = await _databaseFactory.SingleRecordSet("LOCKEROPERATINGDTLS A,LOCKERMST B",
                                "A.ACCNO,B.NAME", "B.ACCNO=A.ACCNO AND B.CUSTOMERID=A.CUSTOMERID AND B.BRANCHCODE=A.BRANCHCODE AND A.ACCNO LIKE '%" + searchby[1] +
                                "%' AND A.BRANCHCODE='" + k[1] + "' AND A.APPLICATIONDATE='" + k[5] + "' AND OUTTIME IS NULL ORDER BY TO_NUMBER(A.ACCNO)");
                    }
                }
            }
            else if (strType.Substring(0, 11) == "TellGlaccno" || strType.Substring(0, 11) == "CreTellGlno" ||      // For GL Code
                strType.Substring(0, 17) == "AddRecTellGlaccno")
            {
                string[] k = strType.Split("|");
                dataTable = await _databaseFactory.SingleRecordSet("GenGlMastMst a ", "a.glcode,a.gldescription", "moduleid='" + k[1] +
                    "' AND status='R' AND GLCATEGORY='A' AND glcode IN (SELECT glcode FROM genglsheetmst WHERE status='R' AND glcode= a.glcode AND moduleid=a.moduleid " +
                    "AND branchcode='" + k[2] + "') order by a.glcode");

                if (!string.IsNullOrWhiteSpace(hidsearch))
                {
                    string[] searchby = hidsearch.Split("|");
                    if (searchby[0] == "name")
                        dataTable = await _databaseFactory.SingleRecordSet("GenGlMastMst a ", "a.glcode,a.gldescription", "moduleid='" + k[1] +
                            "' AND status='R' AND GLCATEGORY='A' and UPPER(gldescription) like '%" + searchby[1]?.ToUpper() +
                            "%' AND glcode IN (SELECT glcode FROM genglsheetmst WHERE status='R' AND glcode= a.glcode AND moduleid=a.moduleid AND branchcode='" + k[2] +
                            "') order by a.glcode");
                    else if (searchby[0] == "num")
                        dataTable = await _databaseFactory.SingleRecordSet("GenGlMastMst a ", "a.glcode,a.gldescription", "moduleid='" + k[1] +
                            "' AND status='R' AND GLCATEGORY='A' and glcode like '" + searchby[1] + "%' AND glcode IN (SELECT glcode FROM genglsheetmst WHERE status='R' " +
                            "AND glcode= a.glcode AND moduleid=a.moduleid AND branchcode='" + k[2] + "') order by a.glcode");
                }
            }
            else if (strType.Substring(0, 11) == "Telleraccno" || strType.Substring(0, 11) == "LnkCreAccno")
            {
                string[] k = strType.Split("|");
                dataTable = await _databaseFactory.SingleRecordSet(k[2] + "mst", "accno,name", " status = 'R' and branchcode='" + k[1] + "' AND currencycode='" + k[4] +
                    "' AND GLCODE='" + k[3] + "' AND STATUS='R' order by to_number(accno)");

                if (!string.IsNullOrWhiteSpace(hidsearch))
                {
                    string[] searchby = hidsearch.Split("|");
                    if (searchby[0] == "name")
                        dataTable = await _databaseFactory.SingleRecordSet(k[2] + "mst", "accno,name", "branchcode='" + k[1] + "' AND currencycode='" + k[4] +
                            "' AND GLCODE='" + k[3] + "' AND STATUS='R' and UPPER(name) like '%" + searchby[1]?.ToUpper() + "%' order by to_number(accno)");
                    else if (searchby[0] == "num")
                        dataTable = await _databaseFactory.SingleRecordSet(k[2] + "mst", "accno,name", "branchcode='" + k[1] + "' AND currencycode='" + k[4] +
                            "' AND GLCODE='" + k[3] + "' AND STATUS='R' and  accno like '" + searchby[1] + "%' order by to_number(accno)");
                }
            }

            return BankingExtensions.ReturnKeyValuePair(dataTable, "", false);
        }

        public async Task GetTransList(string searchString = "", string hidsearch = "", string userId = "")
        {
            DataTable dataTable = null!;

            if (searchString.Substring(0, 11).Equals("Telleraccno", StringComparison.OrdinalIgnoreCase))
            {
                string[] k = searchString.Split("|");

                if (k[2] == "FXREM")
                    dataTable = await _databaseFactory.GetAccountNumbers(k[1], k[2], k[3], k[4], "", "", k[6]);
                else
                    dataTable = await _databaseFactory.GetAccountNumbers(k[1], k[2], k[3], k[4], "", "", "", hidsearch);
            }
            else if (searchString.Substring(0, 16).Equals("DepRenCloseAccno", StringComparison.OrdinalIgnoreCase))
            {
                string[] strVal = searchString.Split("|");
                string brcode = strVal[1];
                string modId = strVal[2];
                string glCode = strVal[3];
                string crcode = strVal[4];
                string serId = strVal[5];
                
                string whrCond = "upper(branchcode)='" + brcode.Trim().ToUpper() + "' and upper(currencycode)='" + crcode.Trim().ToUpper() + "' and upper(linkmoduleid)='" + 
                    modId.Trim().ToUpper() + "' and upper(linkglcode)='" + glCode.Trim().ToUpper() + "' and upper(status)='P' and batchno IN(SELECT DISTINCT(batchno) from " +
                    "gentemptranslog WHERE moduleid='DEP' AND serviceid='" + serId.Trim() + "')";

                dataTable = await _databaseFactory.SingleRecordSet("GENTEMPTRANSLOG", "DISTINCT(linkaccno),linkaccname", whrCond, "linkaccname");
            }

            //<%
            //    dim strType,userid,brchCd,atype,Modid,status,strBatNo,strArrBatNo,strLstBatNo
            //    strType = Request.QueryString("st")
            //    userid = session("userid")
            //    brchCd = Request.QueryString("brchCd")
            //    atype = Request.QueryString("atype")
            //    Modid = Request.QueryString("Modid")
            //    status = "Y"
            //    strLstBatNo = ""
            //    strArrBatNo = ""
            //    strBatNo = ""
            //%>

            //dim connerr
            //dim obj, rs, rsNew
            //dim cnt
            //dim objrep
            //'dim disp,brCode,glcode,crCode
            // '   disp=split(strType,"|")
            //   ' brCode=disp(1)

            //    'modid=disp(2)
            //    'glcode=disp(3)
            //    'crCode=disp(4)
            //   rs = server.CreateObject("adodb.recordset")
            //   rs1 = server.CreateObject("adodb.recordset")
            //   obj = server.CreateObject("queryrecordsets.fetchrecordsets")
            //   objbr = server.CreateObject("GeneralTranQueries.TransactionQueries")

            //     obj1 = server.CreateObject("generaltranqueries.transactionqueries")

            //     objrep = server.CreateObject("ReportPurposeOnly.Reportonly")
            //if strType = "Branch" then

            //     rs = obj.singlerecordset("GENBANKBRANCHMST", "Branchcode,narration")


            //elseif strType = "BLevel" then
            //     rs = obj.singlerecordset("GENBANKLEVELMST", "code,narration")


            //elseif strType = "Bruser" then
            //     rs = objbr.BranchCodes(cstr(userid))


            //elseif left(strType,6)= "Userid" then
            //    atype = mid(strType, 7, len(strType))
            //     rs = obj.singlerecordset("genusermst", "userid,name", "branchcode='" & atype & "'")

            //elseif strType = "Currency" then
            //     rs = obj.singlerecordset("GENCURRENCYTYPEMST", "currencycode,narration")

            //elseif strType = "Curr" then

            //     rs = obj.singlerecordset("GENCURRENCYTYPEMST", "currencycode,narration,precision")
            //elseif strType = "FxCurr" then

            //     rs = obj.singlerecordset("GENCURRENCYTYPEMST", "currencycode,narration,precision")

            //elseif left(strType,12)= "Tellermodule" then
            //    obj = server.CreateObject("GeneralTranQueries.TransactionQueries")
            //    k = split(strType, "|")
            //     rs = obj.ModuleID(cstr(k(1)), "")

            //elseif left(strType, 12) = "Tellerglcode" then

            //     obj = server.CreateObject("GeneralTranQueries.TransactionQueries")

            //    k = split(strType, "|")

            //     rs = obj.GLCodes(cstr(k(1)), cstr(k(2)))


            //elseif strType = "Module" then
            //     rs = obj.singlerecordset("genmoduletypesmst", "moduleid,Narration", "implementedyn='Y'")


            //elseif left(strType,6)= "Glcode" then
            //   'stname=left(strType,2)
            //   'atype=mid(strType,7,len(strType))
            //    rs = obj.singlerecordset("genglsheetmst", "glcode,NARRATION", "moduleid='" & atype & "'")
            //elseif left(strType,14)= "PigTelleraggno" then
            //   k = split(strType, "|")
            //    rs = obj.singlerecordset("pigmyagentmst", "agentcode,agentname", "branchcode='" & k(1) & "' and moduleid='" & k(2) & "' and glcode='" & k(3) & "' and accno='" & k(4) & "' and status='R'")


            //  elseif left(strType,14)= "PigTelleraccno" then
            //   k = split(strType, "|")
            //    rs = obj.singlerecordset("pigmyaccountsmst", "accno,name,LIENSTATUS", "branchcode='" & k(1) & "' and currencycode='" & k(2) & "' and glcode='" & k(3) & "' and agentcode='" & k(4) & "' and status='R' order by to_number(accno)")
            //elseif left(strType,5)= "Accno" then
            //    'stname=left(strType,5)
            //    'atype=mid(strType,6,len(strType))
            //    dim objTrn
            //    objTrn = Server.CreateObject("GeneralTranQueries.TransactionQueries")
            //    rs = objTrn.AccountNumbers(cstr(brchCd), cstr(Modid), cstr(atype))

            //     objTrn = nothing


            //elseif left(strType,6)= "CustID" then
            //dim stname
            //    stname = left(strType, 4)
            //    atype = mid(strType, 7)
            //     rs = obj.singlerecordset("GENCUSTINFOMST", "customerid,custname", "")


            //elseif left(strType,7)= "TransNo" then
            //dim stname
            //    stname = left(strType, 5)
            //    atype = mid(strType, 8)
            //     rs = obj.singlerecordset("translog", "tranno,amount", "glcode='" & atype & "'", "tranno")


            //elseif left(strType,11)= "Cashiertype" then
            //dim stname
            //    stname = left(strType, 11)

            //    k = split(strType, "*")

            //     rs = obj.singlerecordset("CASHCASHIERTYPEMST", "cashiertypeid,narration", "BRANCHCODE='" & k(1) & "'", "cashiertypeid")
            //elseif strType = "Cashier" then
            //dim stname,strcond,strfld,strtab

            //    stname = strType

            //    strcond = " W.USERID = U.USERID AND W.USERID NOT IN (SELECT CASHIERID FROM CASHCOUNTERMST)"

            //    strfld = "DISTINCT W.USERID,U.NAME"

            //    strtab = "GENWORKALLOTMENTMST W,GENUSERMST U"

            //     rs = obj.singlerecordset(cstr(strtab), cstr(strfld), cstr(strcond))


            //elseif left(strType,9)= "Cashierid" then
            //dim stname
            //    stname = strType

            //    k = split(strType, "*")

            //     rs = obj.singlerecordset("cashcashierposmst cash,genusermst gen", "cash.cashierid,gen.name", "cash.cashierid=gen.userid and cash.cashierid <> '" & cstr(userid) & "' ")


            //elseif left(strType,6)= "CashID" then
            //    k = split(strType, "|")

            //     rs = obj.singlerecordset("cashcountermst cash,genusermst gen", "distinct(cash.cashierid),gen.name", "cash.cashierid=gen.userid and upper(trim(cash.cashierid)) <> '" & ucase(trim(cstr(userid))) & "' and gen.branchcode='" & k(1) & "'")


            //elseif left(strType,14)= "AllotedCashier" then
            //dim stname,cash
            //    stname = strType

            //    cash = split(stname, "*")
            //     rs = obj.singlerecordset("CASHALLOTMENTSTRN CASH,GENUSERMST GEN", "DISTINCT(CASH.CASHIERID),GEN.NAME", "CASH.CASHIERID=GEN.USERID AND CASH.BRANCHCODE='" & CASH(1) & "' AND CASH.CURRENCYCODE='" & CASH(2) & "'", "CASH.CASHIERID")


            //elseif left(strType,9)= "Allotment" then
            //    k = split(strType, "*")


            //     rs = obj.singlerecordset("cashallotmentstrn", "Allotmentno", "cashierid='" & k(1) & "' and counterno = '" & k(2) & "' and status='P'", "allotmentno")


            //elseif strtype = "Bankcode" then
            //     rs = obj.singlerecordset("Genbankmst", "Bankname,BANKCODE")


            //elseif left(strtype,10)= "Cashiermgt" then
            //    k = split(strtype, "*")

            //     rs = obj.singlerecordset("cashcountermst cash,genusermst gen", "distinct(cash.cashierid),gen.name", "cash.branchcode='" & k(1) & "' and cash.currencycode='" & k(2) & "' and cash.cashierid=gen.userid and cash.cashierid not in ('" & ucase(userid) & "')")


            //elseif left(strtype,16)= "Cashrefundaccept" then
            //    k = split(strtype, "*")

            //     rs = obj.singlerecordset("cashrefundstrn cash,genusermst gen", "distinct(cash.REFUNDEDUSERID),gen.name", "cash.branchcode='" & k(1) & "' and cash.currencycode='" & k(2) & "' and cash.REFUNDEDUSERID=gen.userid  and cash.status='P' and cash.USERID <> '" & userid & "'")


            //elseif left(strtype,7)= "Cashacc" then
            //    k = split(strtype, "*")

            //     rs = obj.singlerecordset("CASHTRANSBTCASHIERSTRN cash,genusermst gen", "distinct(cash.fromcashierid),gen.name", "cash.branchcode='" & k(1) & "' and cash.currencycode='" & k(2) & "' and cash.FROMcashierid=gen.userid and cash.status='P' and cash.tocashierid='" & cstr(userid) & "'", "cash.fromcashierid")


            //' Suspence Start
            //elseif left(strtype,12)= "Categorycode" then

            //    k = split(strtype, "|")


            //     rs = obj.singlerecordset("SCRCATEGORYMST", "DISTINCT CATEGORYCODE,CATEGORYNAME")
            //' Suspence End

            //elseif left(strtype,11)= "CutsoiledNo" then

            //    k = split(strtype, "|")


            //     rs = obj.singlerecordset("CASHCUTNSPOILNOTESMST", "CUTSOILTRANNO,custid,RECEIVEDFROM", "UPPER(TRIM(branchcode))='" & UCASE(TRIM(k(1))) & "' and UPPER(TRIM(currencycode))='" & UCASE(TRIM(k(2))) & "'")

            //'-------prsrem

            //elseif left(strType,8)= "issonbnk" then
            //   k = split(strType, "~")

            //      ''' for fetching the remtype from the remittypemst for selected glcode

            //    'rs=obj.singlerecordset("REMTYPEMST","REMTYPE","upper(REMGLCODE)='"&k(1)&"' and " & _

            //    '						" upper(NATIVAORAGENCY)='A' and upper(status)='R'")

            //    rs = obj.singlerecordset("REMTYPEMST", "REMTYPE,upper(NATIVAORAGENCY)", _

            //        "upper(REMGLCODE)='" & k(1) & "' and upper(status)='R'")


            //    if not rs.EOF and not rs.BOF then

            //          if rs(0).value = "ADD" or rs(0).value = "TC" then

            //            'rs=obj.singlerecordset("GENOTHERBANKMST","Bankcode,BANKNAME", _

            //            '"upper(status)='R'")


            //            dim strCond


            //            'Code commented by radhika on 13 may 2008

            //            'reason: Agency DD can issue on different branches of same bank 

            //            '        But this concept is under testing

            //            'strCond="upper(trim(OURBRANCHCODE))='" & trim(k(2)) & "' AND status='R' " & _

            //            '" AND bankcode IN (SELECT DISTINCT OTHERBANKCODE  FROM REMISSUEBANKMST " & _

            //            '" WHERE upper(trim(BRANCHCODE))='" & trim(k(2)) & "' AND  " & _

            //            '" upper(trim(CURRENCYCODE))='" & trim(k(3)) & "' " & _

            //            '" AND upper(trim(REMTYPE))='" & trim(rs(0).value) & "' AND status='R')"


            //            'response.write("<br><br> strCond=" & strCond)

            //            'response.end


            //            'rs=obj.singlerecordset("GENOTHERBANKMST","BANKCODE,BANKNAME", _

            //            'strCond)		 


            //            'New code is

            //            strCond = "status='R' AND bankcode IN (SELECT DISTINCT OTHERBANKCODE" & _

            //                " FROM REMISSUEBANKMST WHERE UPPER(trim(CURRENCYCODE))='" & _

            //                trim(k(3)) & "' AND UPPER(trim(REMTYPE))='" & _

            //                 trim(rs(0).value) & "' AND status='R')"


            //            rs = obj.singlerecordset("GENCORRESPBANKSMST", "BANKCODE,BANKNAME", _

            //            strCond)


            //        elseif rs(0).value = "DD" or rs(0).value = "TT" or rs(0).value = "MT"  _
            //            or rs(0).value = "BC" or rs(0).value = "GC" or rs(0).value = "PO" then
            //            rs = obj.singleRecordSet("GENBANKPARM", "BANKCODE,bankname", "")

            //        else
            //                rs = obj.singleRecordSet("GENBANKPARM", "BANKCODE,bankname", "")

            //        end if

            //    else
            //                    rs = obj.singleRecordSet("GENBANKPARM", "BANKCODE,bankname", "")

            //    end if

            //elseif left(strType, 9) = "nftsonbnk" or left(strType,12)= "Matnftsonbnk" or left(strType,13)= "Autonftsonbnk" then

            //rs = obj.singlerecordset("GENCORRESPBANKSMST", "BANKCODE,BANKNAME", "status = 'R'")

            //elseif left(strType,8)= "IMPSBank" then

            //sqlStr = "SELECT DISTINCT bank bank ,bank bank1 FROM BANKIFSCDTLS ORDER BY bank"
            //rs = objrep.SingleSelectStat(sqlStr)


            //elseif left(strType,9)= "IMPSState" then
            //k = split(strType, "~")
            //sqlStr = "select distinct state state , state state1 from BANKIFSCDTLS where bank = '" & k(1) & "' order by state"
            //rs = objrep.SingleSelectStat(sqlStr)

            //elseif left(strType,12)= "IMPSDistrict" then

            //k = split(strType, "~")
            //sqlStr = "select distinct DISTRICT DISTRICT,DISTRICT DISTRICT1 from BANKIFSCDTLS where bank = '" & k(1) & "' and state ='" & k(2) & "' order by DISTRICT"
            //rs = objrep.SingleSelectStat(sqlStr)

            //elseif left(strType,8)= "IMPSCity" then

            //k = split(strType, "~")
            //sqlStr = "select distinct CITY CITY,CITY CITY1 from BANKIFSCDTLS where bank = '" & k(1) & "' and state ='" & k(2) & "' and district = '" & k(3) & "' order by CITY"
            //rs = objrep.SingleSelectStat(sqlStr)


            //elseif left(strType,10)= "IMPSBranch" then

            //k = split(strType, "~")
            //sqlStr = "select distinct BRANCH BRANCH,BRANCH BRANCH1 from BANKIFSCDTLS where bank = '" & k(1) & "' and state ='" & k(2) & "' and district = '" & k(3) & "' and CITY = '" & k(4) & "' order by BRANCH"
            //rs = objrep.SingleSelectStat(sqlStr)


            //elseif left(strType,12)= "nftsonbranch" or left(strType,15)= "Matnftsonbranch" or left(strType,16)= "Autonftsonbranch" then

            //k = split(strType, "~")
            //rs = obj.singlerecordset("GENCORRESPBANKBRANCHESMST", "BRANCHCODE, BRANCHNAME", "BANKCODE = '" & k(1) & "' and status = 'R'")

            //elseif left(strType,11)= "nftsacctype" or left(strType,14)= "Matnftsacctype"  or left(strType,15)= "Autonftsacctype" then

            //rs = obj.singlerecordset("CLGMICRINSTRTYPEMST", "MICRINSTRCODE, MICRINSTRDESC", "ACTIVEYN= 'Y' AND status = 'R'")

            //elseif left(strType,12)= "stopissonbnk" then
            //   k = split(strType, "~")


            //      if k(1) = "ADD" then
            //        rs = obj.singlerecordset("GENCORRESPBANKSMST", "Bankcode,BANKNAME", "upper(status)='R'")

            //    else
            //                rs = obj.singleRecordSet("GENBANKPARM", "BANKCODE,bankname", "")


            //    end if
            //'elseif strType="issonbr" then
            //elseif left(strType,7)= "issonbr" then
            //    dim bankcode, strCond

            //        'original code commented by radhika on 14 may 2008

            //     'rs=obj.singlerecordset("GENBANKBRANCHMST","BRANCHCODE,BRANCHNAME")	


            //     'new code is

            //     bankcode = split(strType, "~")

            //     if bankcode(1) = "ADD" or bankcode(1)= "TC" then
            //        strCond = "status='R' AND upper(trim(BANKCODE))='" & trim(bankcode(2)) & "'"


            //        rs = obj.singlerecordset("GENCORRESPBANKBRANCHESMST", "BRANCHCODE, BRANCHNAME", _

            //        strCond)

            //     else
            //                rs = obj.singlerecordset("GENBANKBRANCHMST", "BRANCHCODE,BRANCHNAME")

            //     end if


            //elseif left(strType, 10) = "issonothbr" then
            //dim bankcode
            //    bankcode = split(strType, "~")
            //    dim strCond


            //    if bankcode(1) = "ADD" or bankcode(1)= "TC" then
            //'		 rs=obj.singlerecordset("GENOTHERBRANCHMST", _
            //'		"BRANCHCODE,BRANCHNAME","UPPER(BANKCODE)='" & ucase(trim(bankcode(2))) & _
            //'		"' ")	


            //        'strCond="upper(trim(OURBRANCHCODE))='" & trim(bankcode(3)) & "' AND status='R' "& _

            //        '" AND upper(trim(BANKCODE))='" & trim(bankcode(2)) & "'" & _

            //        '" AND BRANCHCODE IN (SELECT DISTINCT OTHERBRANCHCODE FROM REMISSUEBANKMST " & _

            //        '" WHERE upper(trim(BRANCHCODE))='" & trim(bankcode(3)) & "' AND  " & _

            //        '" upper(trim(CURRENCYCODE))='" & trim(bankcode(4)) & "' " & _

            //        '" AND upper(trim(REMTYPE))='" & trim(bankcode(1)) & "'" & _

            //        '" AND upper(trim(OTHERBANKCODE))='" & trim(bankcode(2)) & "'" & _

            //        '" AND status='R')"


            //         'rs=obj.singlerecordset("GENOTHERBRANCHMST", "BRANCHCODE, BRANCHNAME",strCond)


            //        'new code is 

            //        strCond = "status='R' AND upper(trim(BANKCODE))='" & trim(bankcode(2)) & "'"


            //        rs = obj.singlerecordset("GENCORRESPBANKBRANCHESMST", "BRANCHCODE, BRANCHNAME", _

            //        strCond)


            //    elseif bankcode(1)= "AOB" then
            //         rs = obj.singlerecordset("GENBANKBRANCHMST", _

            //        "BRANCHCODE,BRANCHNAME", "UPPER(BANKCODE)='" & trim(bankcode(2)) & "' and status='R'")

            //    elseif bankcode(1)= "OthBrs" then
            //    rs = obj.singlerecordset("GENCORRESPBANKBRANCHESMST", "BRANCHCODE,BRANCHNAME", "STATUS='R' AND UPPER(BANKCODE)='" & ucase(trim(bankcode(2))) & "'")

            //    else
            //                rs = obj.singlerecordset("GENBANKBRANCHMST", _

            //                   "BRANCHCODE,BRANCHNAME", "UPPER(BANKCODE)='" & ucase(trim(bankcode(2))) & "' " & _

            //                   "")

            //    end if

            //elseif left(strType,9)= "DispAccNo" then
            //disp = split(strType, "|")
            //    brCode = disp(1)
            //    modid = disp(2)
            //    glcode = disp(3)
            //    crCode = disp(4)
            // if left(ucase(modid), 2) <> "TM" then
            // dim strWhr
            //    strWhr = "upper(moduleid)='" & ucase(trim(modid)) & "'"
            //     '''or  upper(M.accno)=upper(D.disposalaccno)
            //     rs = obj.singlerecordset("GENMODULEMST", "mastertable", cstr(strWhr))
            //    if rs.RecordCount > 0 then
            //    dim table1,tables
            //        table1 = rs(0).value
            //        tables = rs(0).value & " M,GENDISPOSALDTLSTEMP D"


            //        strWhr = "upper(D.branchcode)='" & ucase(trim(brCode)) & "' and upper(D.currencycode)='" & _

            //                ucase(trim(crCode)) & "'and upper(D.moduleid)='" & ucase(trim(modid)) & "'" & _

            //               " and upper(D.glcode)='" & ucase(trim(glcode)) & "' and upper(D.transtatus)='P'" & _

            //               " and D.batchno is null and D.tranno is null and " & _

            //               "upper(M.branchcode)=upper(D.branchcode) and upper(M.currencycode)" & _

            //               "=upper(D.currencycode) " & _

            //              " and upper(M.glcode)=upper(D.glcode) and upper(M.accno)=upper(D.accno)"


            //        'and upper(M.moduleid)=upper(D.moduleid) 
            //         rs = obj.singlerecordset(cstr(tables), _
            //        "distinct(nvl(D.accno,D.disposalaccno)),M.name", cstr(strWhr))


            //   end if
            // else
            //                    dim strWhr


            //       strWhr = "upper(D.branchcode)='" & ucase(trim(brCode)) & "' and upper(D.currencycode)='" & _

            //                ucase(trim(crCode)) & "'and upper(D.moduleid)='" & ucase(trim(modid)) & "'" & _

            //               " and upper(D.glcode)='" & ucase(trim(glcode)) & "' and upper(D.transtatus)='P'" & _

            //               " and D.batchno is null and D.tranno is null "



            //  rs = obj.singlerecordset("GENDISPOSALDTLSTEMP D", "distinct(nvl(D.accno,D.disposalaccno))", cstr(strWhr))

            // end if


            //'-----Link Module
            //elseif left(strType,9)= "LnkModule" then

            //     obj = server.CreateObject("GeneralTranQueries.TransactionQueries")


            //    k = split(strType, "|")


            //     rs = obj.ModuleID(cstr(k(1)), "N", "N")


            //elseif left(strType,9)= "LnkGlcode" then
            // obj = server.CreateObject("GeneralTranQueries.TransactionQueries")

            //    k = split(strType, "|")

            //     rs = obj.GLCodes(cstr(k(1)), cstr(k(2)))


            //elseif left(strType,8)= "LnkAccno" then

            //    k = split(strType, "|")
            //    modId = ucase(k(2))
            //    glCode = ucase(k(3))
            //    if modId<>"TM" then
            //       obj = server.CreateObject("GeneralTranQueries.TransactionQueries")

            //       rs = obj.AccountNumbers(cstr(k(1)), cstr(modId), cstr(glCode), cstr(k(4)))

            //    else
            //                dim strWhr

            //       strWhr = "upper(glcode)='" & glCode & "' and upper(status)='R'"

            //        rs = obj.singlerecordset("TMGENTYPEMST", "upper(mastertable) mstTab", cstr(strWhr))

            //       if rs.RecordCount > 0 and rs("mstTab")<> "" then
            //       dim mstTab
            //          mstTab = rs("mstTab")

            //          strWhr = "upper(status)='R'"

            //         rs = obj.singlerecordset(cstr(mstTab), "accno", cstr(strWhr), "to_number(accno)")

            //       end if

            //    end if


            //    connerr = obj.ConnError

            //      if obj.connerror<>"" then
            //        kstr = "Norecords"

            //        Errstr = obj.ConnError

            //    end if


            //'-----Link Module Ends 
            //''''--------clearing--------------------------------------------------------------
            //''' for clearing moduleid
            //elseif left(strType,9)= "CLGModule" then

            //     obj = server.CreateObject("GeneralTranQueries.TransactionQueries")


            //    k = split(strType, "|")


            //     rs = obj.ModuleID(cstr(k(1)), "N", "N")
            //''' for clearing glcode

            //elseif left(strType,9)= "CLGGlcode" then
            //obj = server.CreateObject("GeneralTranQueries.TransactionQueries")

            //    k = split(strType, "|")

            //     rs = obj.GLCodes(cstr(k(1)), cstr(k(2)))

            //elseif left(strType,8)= "CLGAccno" then

            //    k = split(strType, "|")

            //     obj = server.CreateObject("GeneralTranQueries.TransactionQueries")

            //     rs = obj.AccountNumbers(cstr(k(1)), cstr(k(2)), cstr(k(3)), cstr(k(4)))


            //    connerr = obj.ConnError


            //    if obj.connerror<>"" then
            //        kstr = "Norecords"

            //        Errstr = obj.ConnError

            //    end if



            //elseif left(strType, 11) = "retCLGAccno" then

            //    k = split(strType, "|")

            //     'obj=server.CreateObject("GeneralTranQueries.TransactionQueries")

            //     'rs=obj.AccountNumbers(cstr(k(1)),cstr(k(2)),cstr(k(3)),cstr(k(4)))

            //    modid1 = k(2) & "MST"

            //    objaccno = server.CreateObject("ReportPurposeOnly.Reportonly")

            //'sqlstr= "SELECT ACCNO,Name,Customerid,status FROM " & modid1 & " WHERE UPPER(trim(branchcode))='"& k(1) &"' AND UPPER(trim(glcode))='"& k(3) &"' AND  transtatus IN ('A') AND UPPER(trim(currencycode))='"& k(4) &"'  ORDER BY to_number(accno)"
            //sqlstr = "SELECT ACCNO,Name,Customerid FROM " & modid1 & " WHERE UPPER(trim(branchcode))='" & k(1) & "' AND UPPER(trim(glcode))='" & k(3) & "' AND  transtatus IN ('A') AND UPPER(trim(currencycode))='" & k(4) & "'  ORDER BY to_number(accno)"

            //rs = objaccno.SingleSelectStat(sqlstr)
            //if not hidsearch = "" then
            //        searchby = split(hidsearch, "|")

            //            if searchby(0) = "name" then
            //        sqlstr = "SELECT ACCNO,Name,Customerid FROM " & modid1 & " WHERE UPPER(trim(branchcode))='" & k(1) & "' AND UPPER(trim(glcode))='" & k(3) & "' AND  transtatus IN ('A') AND UPPER(trim(currencycode))='" & k(4) & "' and name like '" & Ucase(searchby(1)) & "%' ORDER BY to_number(accno)"

            //        rs = objaccno.SingleSelectStat(sqlstr)


            //            else if searchby(0) = "num" then
            //        sqlstr = "SELECT ACCNO,Name,Customerid FROM " & modid1 & " WHERE UPPER(trim(branchcode))='" & k(1) & "' AND UPPER(trim(glcode))='" & k(3) & "' AND  transtatus IN ('A') AND UPPER(trim(currencycode))='" & k(4) & "' and accno like '" & Ucase(searchby(1)) & "%' ORDER BY to_number(accno)"

            //        rs = objaccno.SingleSelectStat(sqlstr)


            //            end if

            //    end if


            //    connerr = obj.ConnError


            //    if obj.connerror<>"" then
            //        kstr = "Norecords"

            //        Errstr = obj.ConnError

            //    end if


            //''for bankcode

            //elseif left(strType, 7) = "CLGBank" then

            //    k = split(strType, "|")

            //     rs = obj.singlerecordset("GENOTHERBANKMST", "BANKCODE,BANKNAME", _

            //    "ourbranchcode='" & k(1) & "'", "BANKCODE")

            //    if obj.connerror<>"" then
            //        kstr = "Norecords"

            //        Errstr = obj.ConnError

            //    end if

            //''for clgbranchcodes

            //elseif left(strType, 9) = "CLGBranch" then

            //    k = split(strType, "|")

            //     rs = obj.singlerecordset("GENOTHERBRANCHMST", "BRANCHCODE,BRANCHNAME", _

            //    "BANKCODE='" & k(1) & "' and ourbranchcode='" & k(2) & "'", "BANKCODE")

            //    if obj.connerror<>"" then
            //        kstr = "Norecords"

            //        Errstr = obj.ConnError

            //    end if

            //''for clgReasoncodes

            //elseif left(strType, 9) = "CLGReason" then

            //    k = split(strType, "|")

            //     rs = obj.singlerecordset("CLGRETURNREASONMST", "CODE,DESCRIPTION", "", "CODE")

            //    if obj.connerror<>"" then
            //        kstr = "Norecords"

            //        Errstr = obj.ConnError

            //    end if
            //''''-------------------------------------------------------------------------------- -
            //'''''This is Code is for vouching  Details.
            //'''-----------------------------------------------------------------------------------
            //elseif left(strType,13)= "VochServiceid" then
            //dim ser,whcond

            //      ser = split(strtype, "|")


            //    if ser(1) = "3" then
            //       whcond = "Code in('1')"
            //    elseif ser(1)= "4" then
            //       'whcond="Code in('1','2')"
            //       whcond = "Code in('1')"
            //    end if

            //     rs = obj.singlerecordset("GENSERVICETYPESPMT", "CODE,NARRATION", cstr(whcond), "CODE")


            //elseif left(strType,14)= "ChargeModuleid" then


            //   atype = Split(strType, "|")


            //    rs = obj1.ModuleID(cstr(atype(1)), "")


            //  if atype(2) = "4" and atype(3)= "1" then


            //    rs.Filter = "moduleid<>'CLG'"


            //  elseif atype(2)= "4" and atype(3)= "2" then


            //    rs.Filter = "moduleid='CA' or moduleid='DEP' or  moduleid='SB'"


            // elseif atype(2)= "3" and atype(3)= "1" then


            //    rs.Filter = "moduleid<>'CLG' AND moduleid<>'DEP' " & _

            //    "AND moduleid<>'FXDEP' AND moduleid<>'FXREM' AND moduleid<>'REM' " & _

            //    "AND moduleid<>'LOAN' AND moduleid<>'LOCKER'"



            //  end if
            //  ''' for contra moduleids,description
            // elseif left(strType,14)= "ContraModuleid" then
            //    atype = Split(strType, "|")

            //        rs = obj1.ModuleID(cstr(atype(1)), "")


            // ''' for contra glcodes,description

            //    elseif left(strType,12)= "ContraGlcode" then
            // dim strflds
            //   strflds = split(strtype, "|")
            //       rs = obj.singlerecordset(cstr(strflds(2)) & "typemst", _

            //             strflds(3) & ",(select narration from genglsheetmst where " & _

            //             "glcode=" & strflds(3) & " and branchcode='" & strflds(1) & "')", cstr(strflds(4)))


            //  elseif left(strtype,13)= "ContraAccCode" then

            //        k = split(strtype, "|")
            //       rs = obj1.AccountNumbers(cstr(k(1)), cstr(k(2)), cstr(k(3)), cstr(k(4)))
            //elseif left(strtype,12)= "ChargeGlcode" then

            //      k = split(strtype, "|")
            //        rs = obj1.GLCodes(cstr(k(1)), cstr(k(2)))


            //elseif left(strtype,13)= "ChargeAccCode" then

            //        k = split(strtype, "|")
            //       rs = obj1.AccountNumbers(cstr(k(1)), cstr(k(2)), cstr(k(3)), cstr(k(4)))


            //elseif strType = "catcode" then
            //      rs = obj.singlerecordset("GENCATEGORYMST", "CATEGORYCODE,NARRATION", "categorycode<>'99'")


            //elseif strType = "remcode" then
            //      rs = obj.singlerecordset("FXREMTYPEMST a,FXGENMODEOFREMITTANCEMST b", _

            //             "a.modeofremittance, narration", "a.modeofremittance=b.modeofremittance")



            //'Forex
            //elseif left(strtype,11)= "fxratecodes" then
            //dim strValue,strWhr
            //     strValue = split(strtype, "|")


            //     strWhr = "sourcecurrencycode='" & strValue(2) & "' AND ratecategory=category and upper(a.status)='R'"


            //     if strValue(1) = "C" then
            //         rs = obj.singlerecordset("FXGENCARDRATECATEGORIESMST b,FXGENCARDRATESPMT a", _

            //                        "category,NARRATION,rate", cstr(strWhr))
            //     elseif strValue(1)= "N" then
            //        strWhr = "currencycode='" & strValue(2) & "' AND a.category=b.category and upper(a.status)='R'"
            //         rs = obj.singlerecordset("FXGENNOTIONALCATEGORIESMST b,FXGENNOTIONALRATESPMT a", _
            //        " a.category,NARRATION,rate", cstr(strWhr))
            //     elseif strValue(1)= "D" then
            //        strWhr = "status='R'"
            //         rs = obj.singlerecordset("FXDEALINGROOMMST", "CODE,NARRATION,'0'", cstr(strWhr))
            //     elseif strValue(1)= "F" then
            //        strWhr = "upper(status)='R' and upper(transtatus)='A'"
            //         rs = obj.singlerecordset("FXFCMST", "accno,name,rate", cstr(strWhr))
            //     end if


            //elseif left(strType, 7) = "BatchNo" then
            //    strVal = split(strType, "|")

            //    brcode = strVal(1)

            //    crcode = strVal(2)

            //    whrAdd = strVal(3)

            //    abbYN = strVal(4)


            //    dim whrBr

            //    if ucase(abbYN) <> "Y" then
            //      whrBr = "upper(branchcode)='" & ucase(brcode) & "' and abbbranchcode is null "

            //    else
            //                whrBr = "upper(abbbranchcode)='" & ucase(brcode) & "'"

            //    end if


            //    whrCond = whrBr & " and upper(currencycode)='" & _

            //    ucase(trim(crcode)) & "' and upper(transtatus)='P' and approvedby is null " & _

            //    "and approvedmachine is null " & whrAdd


            //     rs = obj.singlerecordset("GENTRANSLOG", "distinct(BATCHNO)", cstr(whrCond), "batchno")
            //'------Code Added by Monica-25-NOV-09 to display Name along with the BatchNo----------ORG----------	 

            //     rsNew = Nothing

            //     rsNew = obj.singlerecordset("GENTRANSLOG", "distinct(BATCHNO),NAME", cstr(whrCond), "batchno")

            //     cnt = 0

            //     DO UNTIL rsNew.EOF


            //        IF(cnt = 0) THEN
            //            strArrBatNo = rsNew(1).value & "-----" & rsNew(0).value

            //        ELSEIf(strBatNo<>rsNew(0).value) THEN
            //            strArrBatNo = strArrBatNo & "|" & rsNew(1).value & "-----" & rsNew(0).value

            //        END IF


            //        strBatNo = rsNew(0).value


            //        rsNew.MoveNext
            //        cnt = cnt + 1

            //     LOOP
            //     cnt = 0

            //     strLstBatNo = split(strArrBatNo, "|")
            //'-----End of -Code Added by Monica-25-NOV-09 to display Name along with the BatchNo----------ORG----------

            //elseif left(strType,10)= "RefBatchNo" then
            //    strVal = split(strType, "|")

            //    brcode = strVal(1)

            //    crcode = strVal(2)

            //    whrAdd = strVal(3)

            //    abbYN = strVal(4)


            //    dim whrBr

            //    if ucase(abbYN) <> "Y" then
            //      whrBr = "upper(branchcode)='" & ucase(brcode) & "' and abbbranchcode is null "

            //    else
            //                whrBr = "upper(abbbranchcode)='" & ucase(brcode) & "'"

            //    end if


            //    whrCond = whrBr & " and upper(currencycode)='" & _

            //    ucase(trim(crcode)) & "' and upper(transtatus)='P' and approvedby is null " & _

            //    "and approvedmachine is null " & whrAdd


            //     rs = obj.singlerecordset("GENTRANSLOG", "distinct(BATCHNO)", cstr(whrCond), "batchno")
            //'------Code Added by Monica-25-NOV-09 to display Name along with the BatchNo----------ORG----------	 

            //     rsNew = Nothing

            //     rsNew = obj.singlerecordset("GENTRANSLOG", "distinct(BATCHNO),NAME,RATEREFCODE", cstr(whrCond), "batchno")

            //     cnt = 0

            //     DO UNTIL rsNew.EOF


            //        IF(cnt = 0) THEN
            //            strArrBatNo = rsNew(1).value & "-----" & rsNew(0).value & "-----" & rsNew(2).value

            //        ELSEIf(strBatNo<>rsNew(0).value) THEN
            //            strArrBatNo = strArrBatNo & "|" & rsNew(1).value & "-----" & rsNew(0).value & "-----" & rsNew(2).value

            //        END IF


            //        strBatNo = rsNew(0).value


            //        rsNew.MoveNext
            //        cnt = cnt + 1

            //     LOOP
            //     cnt = 0

            //     strLstBatNo = split(strArrBatNo, "|")
            //'-----End of -Code Added by Monica-25-NOV-09 to display Name along with the BatchNo----------ORG----------


            //elseif left(strType,10)= "DelBatchNo" then
            //    strVal = split(strType, "|")

            //    brcode = strVal(1)

            //    crcode = strVal(2)

            //    abbYN = strVal(3)


            //    dim whrBr

            //    if ucase(abbYN) <> "Y" then
            //      whrBr = "upper(branchcode)='" & ucase(brcode) & "' and abbbranchcode is null "

            //    else
            //                whrBr = "upper(abbbranchcode)='" & ucase(brcode) & "'"

            //    end if


            //    whrCond = whrBr & " and upper(currencycode)='" & _

            //    ucase(trim(crcode)) & "' and upper(DELETEDTRANSTATUS)='P' and DELETEDAPPROVEDBY is null " & _

            //    "and DELETEDAPPROVEDMACHINE  is null "


            //     rs = obj.singlerecordset("GENDELETEDTRANSLOG", "distinct(BATCHNO)", cstr(whrCond), "batchno")


            //     rsNew = Nothing

            //     rsNew = obj.singlerecordset("GENDELETEDTRANSLOG", "distinct(BATCHNO),NAME", cstr(whrCond), "batchno")

            //     cnt = 0

            //     DO UNTIL rsNew.EOF


            //        IF(cnt = 0) THEN
            //            strArrBatNo = rsNew(1).value & "-----" & rsNew(0).value

            //        ELSEIf(strBatNo<>rsNew(0).value) THEN
            //            strArrBatNo = strArrBatNo & "|" & rsNew(1).value & "-----" & rsNew(0).value

            //        END IF


            //        strBatNo = rsNew(0).value


            //        rsNew.MoveNext
            //        cnt = cnt + 1

            //     LOOP
            //     cnt = 0

            //     strLstBatNo = split(strArrBatNo, "|")

            //elseif left(strType,8)= "BatchVer" then
            //    strVal = split(strType, "|")

            //    brcode = strVal(1)

            //    crcode = strVal(2)

            //    whrAdd = strVal(3)

            //    payMode = strVal(4)

            //    abbYN = strVal(5)

            //    dim whrExt, strFld, strTab

            //    if payMode = "ALL" then

            //       if abbYN<>"Y" then

            //          whrExt = "' and ((e.verifiedby IS NULL AND t.approvedby IS NOT NULL and " & _

            //                "upper(t.exceptionyn)='Y' AND UPPER(e.branchcode)='" & _

            //                ucase(brcode) & "') or " & _

            //                " (p.verifiedby IS NULL AND UPPER(p.branchcode)='" & ucase(brcode) & _

            //                "' and t.verifiedby is null AND t.approvedby IS NOT NULL " & _

            //                " AND upper(t.cashpaidyn)='Y'))"
            //       else
            //                whrExt = "' and ((e.verifiedby IS NULL AND t.approvedby IS NOT NULL and " & _

            //                 "upper(t.exceptionyn)='Y') or " & _

            //                 " (p.verifiedby IS NULL and t.verifiedby is null AND t.approvedby " & _

            //                 "IS NOT NULL AND upper(t.cashpaidyn)='Y'))"
            //       end if


            //        'strTab="GENEXCEPTIONALTRANDAY e,CASHTELLERPAYMENTSTRANDAY p,GENTRANSLOG t" 

            //        strFld = "distinct(T.BATCHNO)"


            //    elseif payMode = "TRANS" or payMode = "CLG" then
            //        whrExt = "' and e.verifiedby IS NULL  AND t.approvedby IS NOT NULL " & _

            //               " and UPPER(e.branchcode)='" & ucase(brcode) & "'"


            //        'strTab="GENEXCEPTIONALTRANDAY e,CASHTELLERPAYMENTSTRANDAY p,GENTRANSLOG t"

            //        strFld = "distinct(e.BATCHNO)"
            //    elseif payMode = "TELLER" then
            //        whrExt = "' and p.verifiedby IS NULL  and t.verifiedby is null " & _

            //                " AND t.approvedby IS NOT NULL and upper(t.cashpaidyn)='Y'" & _

            //                " and upper(p.branchcode)='" & ucase(brcode) & "'"


            //        'strTab="CASHTELLERPAYMENTSTRANDAY p,GENTRANSLOG t"

            //        strFld = "distinct(p.BATCHNO)"
            //    elseif payMode = "CASH" then
            //        whrExt = "' and e.verifiedby IS NULL  AND t.approvedby IS NOT NULL " & _

            //               "and t.batchno not in(select batchno from CASHTELLERPAYMENTSTRANDAY)" & _

            //               " and upper(e.branchcode)='" & ucase(brcode) & "'"


            //        'strTab="GENEXCEPTIONALTRANDAY e,CASHTELLERPAYMENTSTRANDAY p,GENTRANSLOG t"

            //        strFld = "distinct(e.BATCHNO)"

            //    end if


            //    strTab = "GENEXCEPTIONALTRANDAY e,CASHTELLERPAYMENTSTRANDAY p,GENTRANSLOG t"


            //    if abbYN<>"Y" then
            //    whrCond = "t.branchcode=p.branchcode(+) AND t.currencycode=p.currencycode(+)" & _
            //            " AND t.batchno=p.batchno(+) AND t.branchcode=e.branchcode(+)" & _
            //            " AND t.currencycode=e.currencycode(+) AND t.batchno=e.batchno(+)" & _

            //            " and upper(t.branchcode)='" & ucase(brcode) & "' and upper(t.currencycode)='" & _

            //            ucase(trim(crcode)) & whrExt & " and t.abbbranchcode is null AND " & _

            //            "t.BATCHNO IN (SELECT t.batchno FROM " & _
            //            " gentranslog t WHERE t.approvedby IS NOT NULL) AND t.batchno " & _
            //            " NOT IN(SELECT t.batchno FROM gentranslog t WHERE t.approvedby IS NULL)" & _
            //            whrAdd
            //    else
            //                whrCond = "t.branchcode=p.branchcode(+) AND t.currencycode=p.currencycode(+)" & _
            //            " AND t.batchno=p.batchno(+) AND t.branchcode=e.branchcode(+)" & _
            //            " AND t.currencycode=e.currencycode(+) AND t.batchno=e.batchno(+)" & _

            //            " and upper(t.abbbranchcode)='" & ucase(brcode) & "' and upper(t.currencycode)='" & _

            //            ucase(trim(crcode)) & whrExt & " AND t.BATCHNO IN (SELECT t.batchno FROM " & _
            //            " gentranslog t WHERE t.approvedby IS NOT NULL) AND t.batchno " & _
            //            " NOT IN(SELECT t.batchno FROM gentranslog t WHERE t.approvedby IS NULL)" & _
            //            whrAdd
            //    end if


            //     rs = obj.singlerecordset(cstr(strTab), cstr(strFld), cstr(whrCond), "batchno")


            //     '------Code Added by Monica-27-NOV-09 to display Name along with the BatchNo--------------------	 

            //        strFld = "t.batchno, t.name FROM GENTRANSLOG t WHERE t.batchno IN (SELECT " & strFld

            //        whrCond = whrCond & ")"


            //        rsNew = Nothing

            //        rsNew = obj.singlerecordset(cstr(strTab), cstr(strFld), cstr(whrCond), "batchno")

            //        cnt = 0

            //        DO UNTIL rsNew.EOF


            //            IF(cnt = 0) THEN
            //                strArrBatNo = rsNew(1).value & "-----" & rsNew(0).value

            //            ELSEIf(strBatNo<>rsNew(0).value) THEN
            //                strArrBatNo = strArrBatNo & "|" & rsNew(1).value & "-----" & rsNew(0).value

            //            END IF


            //            strBatNo = rsNew(0).value


            //            rsNew.MoveNext
            //            cnt = cnt + 1

            //        LOOP
            //        cnt = 0

            //        strLstBatNo = split(strArrBatNo, "|")
            //'-----End of -Code Added by Monica-27-NOV-09 to display Name along with the BatchNo--------------------	 



            //elseif left(strType,8)= "BatchDel" then
            //    strVal = split(strType, "|")

            //    brcode = strVal(1)

            //    crcode = strVal(2)

            //    whrAdd = strVal(3)

            //    abbYN = strVal(4)

            //    moduleid = strVal(5)


            //    dim whrBr

            //    if abbYN<>"Y" then
            //       whrBr = "upper(branchcode)='" & ucase(brcode) & "' and abbbranchcode is null"

            //    else
            //                whrBr = "upper(abbbranchcode)='" & ucase(brcode) & "'"

            //    end if


            //    'Note: This code was changed by Radhika on 22-oct-2007

            //    if abbYN<>"Y" then

            //    if moduleid = "CASH" then
            //        whrCond = whrBr & " and upper(currencycode)='" & _

            //        ucase(trim(crcode)) & "' and upper(nvl(cashpaidyn,'N')) in ('Y','N') " & _

            //        whrAdd & " and Cashierid='" & userid & "'"

            //    else
            //                whrCond = whrBr & " and upper(currencycode)='" & _

            //        ucase(trim(crcode)) & "' and upper(nvl(cashpaidyn,'N'))<>'Y' " & _

            //        whrAdd & " And Cashierid is null"

            //    end if

            //    else '' ABB Entries Only
            //        whrCond = whrBr & " and upper(currencycode)='" & _

            //        ucase(trim(crcode)) & "' and upper(nvl(cashpaidyn,'N')) in ('Y','N') " & whrAdd

            //    end if


            //     rs = obj.singlerecordset("GENTRANSLOG", "distinct(BATCHNO)", cstr(whrCond), "batchno")

            //'------Code Added by Monica-26-NOV-09 to display Name along with the BatchNo--------------------	 

            //     rsNew = Nothing

            //     rsNew = obj.singlerecordset("GENTRANSLOG", "distinct(BATCHNO),NAME", cstr(whrCond), "batchno")

            //     cnt = 0

            //     DO UNTIL rsNew.EOF


            //        IF(cnt = 0) THEN
            //            strArrBatNo = rsNew(1).value & "-----" & rsNew(0).value

            //        ELSEIf(strBatNo<>rsNew(0).value) THEN
            //            strArrBatNo = strArrBatNo & "|" & rsNew(1).value & "-----" & rsNew(0).value

            //        END IF


            //        strBatNo = rsNew(0).value


            //        rsNew.MoveNext
            //        cnt = cnt + 1

            //     LOOP
            //     cnt = 0

            //     strLstBatNo = split(strArrBatNo, "|")
            //'-----End of -Code Added by Monica-26-NOV-09 to display Name along with the BatchNo--------------------	 

            //    'Response.Write whrcond

            //elseif left(strType,16)= "NEFTRTGSBatchDel" then
            //    strVal = split(strType, "|")

            //    brcode = strVal(1)

            //    crcode = strVal(2)

            //    whrAdd = strVal(3)

            //    abbYN = strVal(4)

            //    moduleid = strVal(5)


            //    dim whrBr

            //    if abbYN<>"Y" then
            //       whrBr = "upper(branchcode)='" & ucase(brcode) & "' and abbbranchcode is null"

            //    else
            //                whrBr = "upper(abbbranchcode)='" & ucase(brcode) & "'"

            //    end if


            //    'Note: This code was changed by Radhika on 22-oct-2007

            //    if abbYN<>"Y" then

            //    if moduleid = "CASH" then
            //        whrCond = whrBr & " and upper(currencycode)='" & _

            //        ucase(trim(crcode)) & "' and upper(nvl(cashpaidyn,'N')) in ('Y','N') " & _

            //        whrAdd & " and Cashierid='" & userid & "'"

            //    else
            //                whrCond = whrBr & " and upper(currencycode)='" & _

            //        ucase(trim(crcode)) & "' and upper(nvl(cashpaidyn,'N'))<>'Y' " & _

            //        whrAdd & ""

            //    end if

            //    else '' ABB Entries Only
            //        whrCond = whrBr & " and upper(currencycode)='" & _

            //        ucase(trim(crcode)) & "' and upper(nvl(cashpaidyn,'N')) in ('Y','N') " & whrAdd

            //    end if


            //     rs = obj.singlerecordset("GENTRANSLOG", "distinct(BATCHNO)", cstr(whrCond), "batchno")

            //'------Code Added by Monica-26-NOV-09 to display Name along with the BatchNo--------------------	 

            //     rsNew = Nothing

            //     rsNew = obj.singlerecordset("GENTRANSLOG", "distinct(BATCHNO),NAME", cstr(whrCond), "batchno")

            //     cnt = 0

            //     DO UNTIL rsNew.EOF


            //        IF(cnt = 0) THEN
            //            strArrBatNo = rsNew(1).value & "-----" & rsNew(0).value

            //        ELSEIf(strBatNo<>rsNew(0).value) THEN
            //            strArrBatNo = strArrBatNo & "|" & rsNew(1).value & "-----" & rsNew(0).value

            //        END IF


            //        strBatNo = rsNew(0).value


            //        rsNew.MoveNext
            //        cnt = cnt + 1

            //     LOOP
            //     cnt = 0

            //     strLstBatNo = split(strArrBatNo, "|")
            //'-----End of -Code Added by Monica-26-NOV-09 to display Name along with the BatchNo--------------------	 

            //    'Response.Write whrcond



            //    ''code added by jyothsna for transaction deletion report
            //elseif left(strType, 8) = "BatchRep" then
            //    strVal = split(strType, "|")

            //    brcode = strVal(1)

            //    crcode = strVal(2)

            //    whrAdd = strVal(3)

            //    abbYN = strVal(4)

            //    moduleid = strVal(5)


            //    dim whrBr

            //    if abbYN<>"Y" then
            //       whrBr = "upper(branchcode)='" & ucase(brcode) & "' and abbbranchcode is null"

            //    else
            //                whrBr = "upper(abbbranchcode)='" & ucase(brcode) & "'"

            //    end if


            //        whrCond = whrBr & " and upper(currencycode)='" & _

            //        ucase(trim(crcode)) & "' " & whrAdd


            //         rs = obj.singlerecordset("GENTRANSLOGDEM", "distinct(BATCHNO)", cstr(whrCond), "batchno")


            //        rsNew = Nothing

            //        rsNew = obj.singlerecordset("GENTRANSLOGDEM", "distinct(BATCHNO),NAME", cstr(whrCond), "batchno")


            //        cnt = 0

            //     DO UNTIL rsNew.EOF


            //        IF(cnt = 0) THEN
            //            strArrBatNo = rsNew(1).value & "-----" & rsNew(0).value

            //        ELSEIf(strBatNo<>rsNew(0).value) THEN
            //            strArrBatNo = strArrBatNo & "|" & rsNew(1).value & "-----" & rsNew(0).value

            //        END IF


            //        strBatNo = rsNew(0).value


            //        rsNew.MoveNext
            //        cnt = cnt + 1

            //     LOOP
            //     cnt = 0

            //     strLstBatNo = split(strArrBatNo, "|")



            //    ''end of code , jyo


            //elseif left(strType,10)= "GETSCHOOLS" then
            //    strVal = split(strType, "|")
            //    if strVal(1) = "CASH" then
            //        rs = obj.singlerecordset("SCHOOLBATCHDTLS A, SCHOOLMST V", "A.ACCNO, V.NAME, A.CASHBATCHNO", "NVL(A.CASHBATCHSTATUS, 'O')='O' AND A.APPLICATIONDATE='" & session("applicationdate") & "' AND A.ACCNO=V.ACCNO AND V.GLCODE=A.GLCODE AND V.BRANCHCODE=A.BRANCHCODE AND V.CURRENCYCODE=A.CURRENCYCODE", "TO_NUMBER(A.ACCNO)")
            //    else
            //                rs = obj.singlerecordset("SCHOOLBATCHDTLS A, SCHOOLMST V", "A.ACCNO, V.NAME, A.TRANSFERBATCHNO", "NVL(A.TRANSFERBATCHSTATUS, 'O')='O' AND A.APPLICATIONDATE='" & session("applicationdate") & "' AND A.ACCNO=V.ACCNO AND V.GLCODE=A.GLCODE AND V.BRANCHCODE=A.BRANCHCODE AND V.CURRENCYCODE=A.CURRENCYCODE", "TO_NUMBER(A.ACCNO)")
            //    end if
            //elseif left(strType, 11) = "GETBRANCHES" then
            //    strVal = split(strType, "|")
            //    if strVal(4) = "CASH" then
            //        rs = obj.singlerecordset("SCHOOLBRANCHMST", "SCHOOLBRANCHID, SCHBRANCHNAME", "SCHOOLACCNO='" & strVal(1) & "' AND (SCHOOLACCNO, GLCODE)=(SELECT ACCNO, GLCODE FROM SCHOOLBATCHDTLS WHERE CASHBATCHNO='" & strVal(2) & "' AND APPLICATIONDATE='" & strVal(3) & "')")
            //    else
            //                rs = obj.singlerecordset("SCHOOLBRANCHMST", "SCHOOLBRANCHID, SCHBRANCHNAME", "SCHOOLACCNO='" & strVal(1) & "' AND (SCHOOLACCNO, GLCODE)=(SELECT ACCNO, GLCODE FROM SCHOOLBATCHDTLS WHERE TRANSFERBATCHNO='" & strVal(2) & "' AND APPLICATIONDATE='" & strVal(3) & "')")
            //    end if
            //elseif left(strType, 11) = "GETSTUDENTS" then
            //    strVal = split(strType, "|")
            //    if strVal(3) = "CASH" then
            //        rs = obj.singlerecordset("SCHOOLSTUDENTINFOMST", "STUDENTID, NAME", "(SCHOOLACCNO, GLCODE)=(SELECT ACCNO, GLCODE FROM SCHOOLBATCHDTLS WHERE CASHBATCHNO='" & strVal(1) & "' AND APPLICATIONDATE='" & strVal(2) & "') AND SCHOOLBRANCHID='" & strVal(4) & "'")
            //    else
            //                rs = obj.singlerecordset("SCHOOLSTUDENTINFOMST", "STUDENTID, NAME", "(SCHOOLACCNO, GLCODE)=(SELECT ACCNO, GLCODE FROM SCHOOLBATCHDTLS WHERE TRANSFERBATCHNO='" & strVal(1) & "' AND APPLICATIONDATE='" & strVal(2) & "') AND SCHOOLBRANCHID='" & strVal(4) & "'")
            //    end if
            //end if


        }

        // TELLERBRANCH, TELLERVOBRANCH, MATTELLERVOBRANCH, AUTOTELLERVOBRANCH
        public void GetTellerBranchList()
        {
            //    obj = server.CreateObject("GeneralTranQueries.TransactionQueries")
            //    dataTable = obj.BranchCodes(cstr(session("userid")))
        }

        public async Task<string> GetOnBlur(string searchString = "")
        {
            string details = "";
            string insdtl = searchString;
            string[] insstr = insdtl.Split("~!~", StringSplitOptions.RemoveEmptyEntries);

            string stmode = insstr[1];
            string sttxtcode = insstr[0];
            string sttxtname = insstr[2];

            if (insdtl.Length > 0)
            {
                DataTable rsins;

                switch (stmode)
                {
                    case "GEN":
                        if (sttxtcode.Length > 0 && stmode.Length > 0)
                        {
                            string sttable = insstr[3];
                            string stfields = insstr[4];
                            string stwhere = insstr[5];
                            stwhere = stwhere.Replace("@", "+").Replace("$", "<");

                            rsins = await _databaseFactory.SingleRecordSet(sttable, stfields, stwhere);

                            if (rsins.Rows.Count > 0)
                            {
                                foreach (DataRow row in rsins.Rows)
                                    details = string.Concat(details, "|", Conversions.ToString(row.ItemArray[0]));
                                details = sttxtname + "~" + details;
                            }
                            else
                                details = sttxtname + "~|" + "NoRecords";
                            details = sttxtcode + "~|" + details;
                        }
                        return details;
                    case "COMP":
                        DataRow[] filteredRows = Array.Empty<DataRow>();
                        string modId = "", glCode = "", accNo = "";
                        string brCode = insstr[3];

                        if (sttxtcode.Equals("txtbranchcode"))
                        {
                            string userid = insstr[4];
                            rsins = await _databaseFactory.GetBranchCodes(userid);
                            filteredRows = rsins.Select("(branchcode)='" + brCode.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtModId"))
                        {
                            modId = insstr[4];
                            rsins = await _databaseFactory.GetModuleId(brCode, "");
                            filteredRows = rsins.Select("(moduleid)='" + modId.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtGLcode"))
                        {
                            modId = insstr[4];
                            glCode = insstr[5];
                            rsins = await _databaseFactory.GetGLCodes(brCode, modId);
                            filteredRows = rsins.Select("(glcode)='" + glCode.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtAccNo"))
                        {
                            modId = insstr[4];
                            glCode = insstr[5];
                            accNo = insstr[6];
                            string CurCode = "";

                            if (modId.Trim().ToUpper() == "SCR")
                            {
                                CurCode = insstr[7];
                                rsins = await _databaseFactory.GetAccountNumbers(brCode, modId, glCode, CurCode);
                            }
                            else
                                rsins = await _databaseFactory.GetAccountNumbers(brCode, modId, glCode);
                            filteredRows = rsins.Select("(accno)='" + accNo.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtLnkModId"))
                        {
                            modId = insstr[4];
                            rsins = await _databaseFactory.GetModuleId(brCode, "N", "N");
                            filteredRows = rsins.Select("(moduleid)='" + modId.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtLnkGLCode"))
                        {
                            modId = insstr[4];
                            glCode = insstr[5];
                            rsins = await _databaseFactory.GetGLCodes(brCode, modId);
                            filteredRows = rsins.Select("(glcode)='" + glCode.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtLnkAccNo"))
                        {
                            modId = insstr[4];
                            glCode = insstr[5];
                            accNo = insstr[6];
                            rsins = await _databaseFactory.GetAccountNumbers(brCode, modId, glCode);
                            filteredRows = rsins.Select("(accno)='" + accNo.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtCLGModId"))
                        {
                            modId = insstr[4];
                            rsins = await _databaseFactory.GetModuleId(brCode, "N", "N");
                            filteredRows = rsins.Select("(moduleid)='" + modId.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtCLGGLcode"))
                        {
                            modId = insstr[4];
                            glCode = insstr[5];
                            rsins = await _databaseFactory.GetGLCodes(brCode, modId);
                            filteredRows = rsins.Select("(glcode)='" + glCode.Trim().ToUpper() + "'");
                        }
                        else if (sttxtcode.Equals("txtCLGAccNo"))
                        {
                            modId = insstr[4];
                            glCode = insstr[5];
                            accNo = insstr[6];
                            rsins = await _databaseFactory.GetAccountNumbers(brCode, modId, glCode);
                            filteredRows = rsins.Select("(accno)='" + accNo.Trim().ToUpper() + "'");
                        }

                        if (filteredRows != null && filteredRows.Length > 0)
                        {
                            foreach (DataRow row in filteredRows)
                                details = Conversions.ToString(row.ItemArray[1]);   // 'details &"|"& rsins(jint)  txtCLGGLcode

                            details = sttxtname + "~|" + details;
                        }

                        else
                            details = sttxtname + "~|" + "NoRecords";

                        details = sttxtcode + "~|" + details;

                        if (modId == "SB" || modId == "CC" || modId == "CA" || modId == "LOAN" || modId == "DEP")
                        {
                            string[] strstatus = details.Split("~|");

                            if (strstatus[2] == "NoRecords")
                            {
                                string modid1 = modId + "MST";
                                string sqlstr = "SELECT status,transtatus FROM " + modid1 + " WHERE branchcode = '" + brCode + "' AND glcode = '" + glCode +
                                    "' AND accno = '" + accNo + "'";

                                DataTable Recstatus = await _databaseFactory.ProcessQueryAsync(sqlstr);

                                if (Recstatus.Rows.Count > 0)
                                {
                                    string transtatus = Conversions.ToString(Recstatus.Rows[0].ItemArray[1]);
                                    if (transtatus == "A")
                                    {
                                        string status = Conversions.ToString(Recstatus.Rows[0].ItemArray[0]);
                                        details = strstatus[0] + "~|" + strstatus[1] + "~|" + status;
                                    }
                                    else
                                        details = strstatus[0] + "~|" + strstatus[1] + "~|" + transtatus;
                                }
                                else
                                    details = strstatus[0] + "~|" + strstatus[1] + "~|" + "NoRecords";

                                BankingExtensions.ReleaseMemory(Recstatus);
                            }
                        }
                        return details;
                }

                return details;
            }

            return details;
        }
    }
}
