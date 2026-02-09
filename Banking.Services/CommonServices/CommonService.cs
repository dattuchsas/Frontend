using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using System.Data;
using System.Diagnostics;
using System.Reflection.PortableExecutable;
using System.Text;

namespace Banking.Services
{
    public class CommonService : ICommonService
    {
        private readonly IDatabaseService _databaseFactory;

        public CommonService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        public async Task<List<SelectListItem>> GetSalutationList()
        {
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENSALUTATIONMST", "CODE,DESCRIPTION", "");

            return ReturnKeyValuePair(dataTable, "Salutation");
        }

        public async Task<List<SelectListItem>> GetRelationList(string whereCondition = "")
        {
            // "status='R' order by code"
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENRELATIONSMST", 
                "CODE,NARRATION", !string.IsNullOrWhiteSpace(whereCondition) ? whereCondition : string.Empty);

            return ReturnKeyValuePair(dataTable, "Relation");
        }

        public async Task<List<SelectListItem>> GetReligionList()
        {
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENRELIGIONMST", "CODE,DESCRIPTION", "");

            return ReturnKeyValuePair(dataTable, "Religion");
        }

        public async Task<List<SelectListItem>> GetOccupationList()
        {
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("genoccupationmst", "code,narration", "status='R' order by code");

            return ReturnKeyValuePair(dataTable, "Occupation");
        }

        public async Task<List<SelectListItem>> GetEducationList()
        {
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("genoccupationmst", "code,narration", "status='R' order by code");

            return ReturnKeyValuePair(dataTable, "Education");
        }

        public async Task<List<SelectListItem>> GetKYCList()
        {
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENKYCMST", "CODE,DESCRIPTION", "code not in (2,12) ");

            return ReturnKeyValuePair(dataTable, "KYC Type");
        }

        public List<SelectListItem> GetGenderList()
        {
            return
            [
                new() { Text = "Select", Value = "" },
                new() { Text = "Male", Value = "M" },
                new() { Text = "Female", Value = "F" }
            ];
        }

        public List<SelectListItem> GetMaritalStatusList()
        {
            return
            [
                new() { Text = "Select", Value = "" },
                new() { Text = "Single", Value = "N" },
                new() { Text = "Married", Value = "Y" }
            ];
        }

        public async Task<List<SelectListItem>> GetBranchList()
        {
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENBANKBRANCHMST", "Branchcode,narration");

            return ReturnKeyValuePair(dataTable, "Branch");
        }

        public async Task<List<SelectListItem>> GetCategoryList(string type = "")
        {
            string[] arr = type.Split('|');

            DataTable dataTable = new DataTable();

            if (arr[1].Equals("View"))
                dataTable = await _databaseFactory.SingleRecordSet("gencategorymst", "CATEGORYCODE,NARRATION",
                    "'R'", "NARRATION");
            else if (arr[1].Equals("Cust"))
                dataTable = await _databaseFactory.SingleRecordSet("gencategorymst", "CATEGORYCODE,NARRATION", 
                    "CATEGORYCODE<>'99'", "NARRATION");
            else
                dataTable = await _databaseFactory.SingleRecordSet("gencategorymst", "CATEGORYCODE,NARRATION", "", "NARRATION");

            return ReturnKeyValuePair(dataTable, "Category");
        }

        public List<SelectListItem> GetRiskCategoryList()
        {
            return
            [
                new() { Text = "Select", Value = "" },
                new() { Text = "High", Value = "H" },
                new() { Text = "Medium", Value = "M" },
                new() { Text = "Low", Value = "L" },
                new() { Text = "None", Value = "N" }
            ];
        }

        public void GetList(string strType, string hidsearch)
        {
            string strsql;
            DataTable rs = new DataTable();

            // For Stoppayment
            if (strType.Substring(0, 8) == "getdates")
            {
                //    k = split(strType, "|")
                //objfetch = server.CreateObject("ReportPurposeOnly.Reportonly")
                //sqlQuery = "SELECT to_char(EXECUTEDATE,'dd-Mon-yyyy') FROM CUSTBALANCEEXECUTEDATE where branchcode = '" & k(1) & "' AND MONTHS_BETWEEN('" & k(2) & "',EXECUTEDATE) <=42 "

                //    rs = objfetch.SingleSelectStat(sqlQuery)
            }
            else if (strType.Substring(0, 12) == "DividForYear")
            {
                //k = split(strType, "|")

                //     'rs=obj.singlerecordset("SHAREDIVIDENDDTLS","DISTINCT TO_CHAR(DIVIDENDTODATE,'dd - Mon - yyyy'),TO_CHAR(DIVIDENDFROMDATE,'dd - Mon - yyyy')","upper(trim(branchcode))='" & k(1) & "' and sharetype='" & k(2) & "'")


                //     rs = obj.singlerecordset("SHAREDIVIDENDDTLS", "DISTINCT TO_CHAR(DIVIDENDTODATE,'dd-Mon-yyyy'),TO_CHAR(DIVIDENDFROMDATE,'dd-Mon-yyyy')", "DIVIDENDFROMDATE=(SELECT DIVIDENDFROMDATE FROM SHAREDIVIDENDMST F WHERE (F.BRANCHCODE, F.GLCODE, F.ACCNO) IN ( SELECT A.BRANCHCODE, A.GLCODE, A.ACCNO FROM SHAREDIVIDENDMST a,GENMODULEMST b,GENGLSHEETMST c,CAMST d WHERE c.branchcode='" & k(1) & "' AND a.sharetype='" & k(2) & "' AND a.moduleid=b.moduleid AND a.glcode=c.glcode AND a.branchcode=d.branchcode AND a.branchcode=c.branchcode  AND a.accno=d.accno AND a.glcode=d.glcode AND A.ACCNO='" & k(3) & "'))")

            }
            else if (strType.Substring(0, 8) == "Trmodule")
            {
                //rs = obj.singlerecordset("GENMODULEMST", _

                //            "distinct MODULEID,NARRATION", "moduleid in ('MISC','PL')")

            }
            else if (strType == "ScopeType")
            {
                //     rs = obj.singlerecordset("GENCARDSCOPEMST", _

                //            "CARDSCOPETYPE,DESCRIPTION", "UPPER(TRIM(status))='R'")
            }
            else if (strType.Substring(0, 9) == "ShareType")
            {
                //k = split(strType, "|")

                //            rs = obj.singlerecordset("SHARETYPEMST", _

                //            "distinct SHARETYPE,DESCRIPTION", "glcode='" & k(1) & "' and UPPER(TRIM(status))='R'")

            }
            else if (strType == "TrBranch")
            {
                //    rs = obj.singlerecordset("GENBANKBRANCHMST", "Branchcode,narration")

            }
            else if (strType.Substring(0, 9) == "Intmodule")
            {
                //    obj = server.CreateObject("GeneralTranQueries.TransactionQueries")


                //    k = split(strType, "|")


                //    rs = obj.ModuleID(cstr(k(1)), "N", "N")

            }
            else if (strType.Substring(0, 9) == "Directors")
            {
                //    'k=split(strType,"|")

                //    rs = server.CreateObject("adodb.recordset")

                //    obj = server.CreateObject("queryrecordsets.fetchrecordsets")

                //    rs = obj.singlerecordset("GENDIRECTORDTLS", "DIRCODE,DIRNAME", "status = 'R'", "NAME")


                //    'obj=nothing			

            }
            else if (strType.Substring(0, 11) == "ReportSType")
            {
                //    k = split(strType, "|")


                //    'Code commented and new code added by Radhika on 27 June 2008

                //    'Reason: 

                //    'rs=obj.singlerecordset("SHAREALLOTMENTDTLS s,SHARETYPEMST m ", _

                //    '	"distinct s.SHARETYPE,m.DESCRIPTION","upper(trim(s.branchcode))='" & _

                //    '	k(1) & "' and s.SHARETYPE = m.SHARETYPE","SHARETYPE")


                //    rs = obj.singlerecordset("SHARETYPEMST a , GENGLSHEETMST b", _

                //        "distinct a.sharetype, A.DESCRIPTION", "upper(trim(B.branchcode))='" & _

                //        k(1) & "' and A.GLCODE = B.GLCODE", "A.SHARETYPE")

                //    'end of Code commented and new code added by Radhika on 27 June 2008
            }
            //'Reportholderid
            else if (strType.Substring(0, 14) == "Reportholderid")
            {
                //    k = split(strType, "|")


                //        rs = obj.singlerecordset("SHAREDIVIDENDDTLS", "distinct SHAREACCNO, NAME", "upper(trim(branchcode))='" & k(1) & "' and sharetype='" & k(2) & "' and paiddate is null and paidbatchno is null and paidtranno is null order by shareaccno")

            }
            else if (strType.Substring(0, 8) == "GetAccno")
            {
                //k = split(strType, "|")

                // rs = obj.singlerecordset("CAMST", "distinct ACCNO, NAME", "upper(trim(branchcode))='" & k(1) & "' and glcode='" & k(2) & "' and status='R' and transtatus='A'", "name")


            }
            else if (strType.Substring(0, 14) == "newShareidname")
            {
                //k = split(strType, "|")
                // objfetch = server.CreateObject("ReportPurposeOnly.Reportonly")
                //sqlQuery = "select DISTINCT A.ACCNO, B.NAME from SHAREALLOTMENTDTLS A, SHARESMST  B where A.SHARETYPE='" & k(3) & "' AND A.BRANCHCODE='" & k(2) & "' AND A.ACCNO=B.ACCNO AND A.SHARETYPE = B.GLCODE AND A.BRANCHCODE=B.BRANCHCODE and " & k(4) & " order by TO_NUMBER(A.ACCNO)"

                //rs = objfetch.SingleSelectStat(sqlQuery)


            }
            else if (strType.Substring(0, 11) == "Shareidname")
            {
                //k = split(strType, "|")


                //    if (k(1) = "old") then

                //     'rs=obj.singlerecordset("SHAREHOLDERINFOMST","distinct customerid,NAME","upper(trim(branchcode))='" & k(2) & "' and glcode='" & k(3) & "' and " & k(4),"name")
                //  rs = obj.singlerecordset("sharesmst", "distinct accno,name", "upper(trim(branchcode))='" & k(2) & "' and glcode='" & k(3) & "' and " & k(4), "name")

                //        else
                //            if k(4) <> "" then

                //            'rs=obj.singlerecordset("SHAREALLOTMENTDTLS a,SHAREHOLDERINFOMST s,sharetypemst c", _

                //            '"distinct a.accno,s.name","upper(trim(a.branchcode))='" & k(2) & "'and a.CUSTOMERID=s.CUSTOMERID and a.sharetype=c.sharetype and c.glcode='" & k(3) & "' and " & k(4),"s.name")


                //rs = obj.singlerecordset("SHARESMST A, SHAREALLOTMENTDTLS B", _

                //            "DISTINCT A.ACCNO, A.NAME", "A.GLCODE='" & k(3) & "' AND A.BRANCHCODE='" & k(2) & "' AND A.ACCNO=B.ACCNO AND A.GLCODE=B.SHARETYPE AND A.BRANCHCODE=B.BRANCHCODE and " & k(4), "TO_NUMBER(A.ACCNO)")


                //        else
                //                'rs=obj.singlerecordset("SHAREALLOTMENTDTLS a,SHAREHOLDERINFOMST s", _

                //        '	"distinct a.SHAREACCNO,s.name","upper(trim(a.branchcode))='" & k(2) & "'and a.SHAREACCNO=s.accno ","s.name")
                //rs = obj.singlerecordset("SHAREALLOTMENTDTLS a,SHAREHOLDERINFOMST s,sharetypemst c", _

                //            "distinct a.accno,s.name", "upper(trim(a.branchcode))='" & k(2) & "'and a.CUSTOMERID=s.CUSTOMERID and a.sharetype=c.sharetype and c.glcode='" & k(3) & "'", "s.name")

                //        end if
                //  end if
            }
            else if (strType.Substring(0, 12) == "Sharesnameid")
            {
                // k = split(strType, "|")
                // objfetch = server.CreateObject("ReportPurposeOnly.Reportonly")
                // sqlstr = "SELECT DISTINCT a.accno,NVL((SELECT s.name FROM gencustinfomst s WHERE s.customerid=A.customerid " & _
                // "AND S.BRANCHCODE=A.BRANCHCODE),'') NAME,(select custmobile from gencustinfomst g where  g.customerid = A.customerid ) custmobile FROM SHAREALLOTMENTDTLS a,sharetypemst c, sharesmst s WHERE  a.ACCNO = s.ACCNO AND a.SHARETYPE = s.GLCODE AND a.BRANCHCODE = s.BRANCHCODE AND s.status = 'R' AND c.glcode='" & k(3) & "' AND UPPER(trim(a.branchcode))='" & k(2) & "' AND a.sharetype=c.sharetype AND " & k(4) & " ORDER BY NAME"
                // rs = objfetch.SingleSelectStat(sqlstr)
                // 'rs=obj.singlerecordset("SHAREALLOTMENTDTLS a,sharetypemst c","DISTINCT a.customerid,NVL((SELECT s.name FROM SHAREHOLDERINFOMST s WHERE s.customerid=A.customerid AND S.BRANCHCODE=A.BRANCHCODE AND S.GLCODE=A.SHARETYPE AND UPPER(trim(a.branchcode))='" & k(2) & "' AND A.SHARETYPE='" & k(3) & "' AND S.GLCODE='" & k(3) & "' AND UPPER(trim(S.branchcode))='" & k(2) & "'),'') NAME","WHERE c.glcode='" & k(3) & "' AND UPPER(trim(a.branchcode))='" & k(2) & "' AND a.status='R' AND a.transtatus='A' AND a.sharetype=c.sharetype","NAME")
                //  'rs=obj.singlerecordset("SHAREALLOTMENTDTLS a,SHAREHOLDERINFOMST s,sharetypemst c", _

                //            '"distinct a.customerid,s.name","upper(trim(a.branchcode))='" & k(2) & "'and a.customerid=s.customerid and a.sharetype=c.sharetype and c.glcode='" & k(3) & "' and " & k(4),"s.name")

            }
            else if (strType.Substring(0, 13) == "Sharesnamesid")
            {
                // k = split(strType, "|")
                //  'rs=obj.singlerecordset("SHAREALLOTMENTDTLS a,gencustinfomst s,sharetypemst c,sharedividenddtls d", _
                //'			"distinct a.accno,s.name","d.SHAREACCNO = a.ACCNO and d.SHARETYPE = a.SHARETYPE " & _
                //'			"and d.BRANCHCODE = a.BRANCHCODE and d.STATUS = 'R' and a.customerid=s.customerid " & _
                //'			"and a.sharetype=c.sharetype and c.sharetype='" & k(3) & "' and upper(trim(a.branchcode))=" & _
                //'			"'" & k(2) & "' and " & k(4),"s.name")

                //    objfetch = server.CreateObject("ReportPurposeOnly.Reportonly")

                //    'sqlstr="SELECT DISTINCT a.accno,NVL((SELECT s.name FROM gencustinfomst s WHERE s.customerid=A.customerid " & _

                //    '"AND S.BRANCHCODE=A.BRANCHCODE),'') NAME FROM SHAREALLOTMENTDTLS a,sharetypemst c WHERE c.glcode='" & k(3) & "' AND UPPER(trim(a.branchcode))='" & k(2) & "' AND a.sharetype=c.sharetype ORDER BY NAME"



                //    sqlstr = "SELECT DISTINCT a.accno,NVL((SELECT s.name FROM gencustinfomst s WHERE s.customerid=A.customerid " & _

                //    "AND S.BRANCHCODE=A.BRANCHCODE),'') NAME FROM SHAREALLOTMENTDTLS a,sharetypemst c WHERE c.glcode='" & k(3) & "' AND a.sharetype=c.sharetype ORDER BY NAME"


                //    rs = objfetch.SingleSelectStat(sqlstr)


            }
            else if (strType == "SponsorType")
            {
                // rs = obj.singlerecordset("GENCARDSPONSORMST", _

                //            "CARDSPONSORTYPE,DESCRIPTION", "UPPER(TRIM(status))='R'")

            }
            else if (strType == "CardType")
            {
                //     rs = obj.singlerecordset("GENCARDTYPEMST", _

                //            "CARDTYPE,DESCRIPTION", "UPPER(TRIM(status))='R'")

            }
            else if (strType == "CategoryType")
            {
                //     rs = obj.singlerecordset("GENCARDCATEGORYSMST", _

                //            "CARDCATEGORYTYPE,DESCRIPTION,ADDENYN", "UPPER(TRIM(status))='R'")

            }
            else if (strType == "custid")
            {
                //     rs = obj.singlerecordset("GENCUSTINFOMST", _

                //            "customerid,name", "", "name")

            }
            else if (strType.Substring(0, 12) == "GetPPSAcknos")
            {
                //k = split(strType, "|")

                //     rs = obj.singlerecordset("clgppsdtls", "ACKNO,ACKNO ACKNO1", "status not in ('C','D','L')", "ACKNO")


                //    if not hidsearch = "" then

                //    searchby = split(hidsearch, "|")

                //            if searchby(0) = "name" then
                // rs = obj.singlerecordset("clgppsdtls", _

                //            "ACKNO,ACKNO ACKNO1", "status not in ('C','D','L') and ACKNO like '%" & Ucase(searchby(1)) & "%' order by ACKNO")


                //            else if searchby(0) = "num" then
                //            rs = obj.singlerecordset("clgppsdtls", _

                //            "ACKNO,ACKNO ACKNO1", "status not in ('C','D','L') and ACKNO like '%" & Ucase(searchby(1)) & "%' order by ACKNO")


                //            end if

                //    end if

            }
            else if (strType.Substring(0, 10) == "GetUMRNNOS")
            {
                //k = split(strType, "|")

                //     rs = obj.singlerecordset("NACHMANDATEDTLS", _

                //            "UMRN,UMRN UMRN1", k(1) & " order by UMRN")


                //    if not hidsearch = "" then

                //    searchby = split(hidsearch, "|")

                //            if searchby(0) = "name" then
                // rs = obj.singlerecordset("NACHMANDATEDTLS", _

                //            "UMRN,UMRN UMRN1", k(1) & " and UMRN like '%" & Ucase(searchby(1)) & "%' order by UMRN")


                //            else if searchby(0) = "num" then
                //            rs = obj.singlerecordset("NACHMANDATEDTLS", _

                //            "UMRN,UMRN UMRN1", k(1) & " and UMRN like '%" & Ucase(searchby(1)) & "%' order by UMRN")


                //            end if

                //    end if
            }
            else if (strType.Substring(0, 9) == "modcustid")
            {
                //k = split(strType, "|")

                //    if k(2) <> "" then
                //         rs = obj.singlerecordset("CARDCUSTOMERDTLS", _

                //            "distinct customerid,name", "upper(trim(branchcode))='" & k(1) & "'and " & k(2), "name")

                //    else
                //                rs = obj.singlerecordset("CARDCUSTOMERDTLS", _

                //                   "distinct customerid,name", "upper(trim(branchcode))='" & k(1) & "'", "name")

                //    end if
            }
            else if (strType.Substring(0, 13) == "certificateno")
            {
                //k = split(strType, "|")



                //       rs = obj.singlerecordset("SHAREALLOTMENTDTLS", _

                //            "distinct CERTIFICATENO", "upper(trim(branchcode))='" & k(1) & "'and upper(trim(SHARETYPE))='" & k(2) & "'and upper(trim(CURRENCYCODE))='" & k(3) & "' and status='C' and REALLOTTEDDATE IS NULL and CERTIFICATENO not in(select certificateno from SHAREALLOTMENTDTLS where status='R')", "certificateno")

            }
            else if (strType.Substring(0, 11) == "sharetranno")
            {
                //k = split(strType, "|")

                //    if k(2) = session("applicationdate") then
                //         rs = obj.singlerecordset("GENTRANSLOG", _

                //            "distinct currencycode,tranno,amount", "upper(trim(branchcode))='" & k(1) & "'and to_char(applicationdate,'dd-Mon-yyyy')='" & k(2) & "'and upper(trim(GLCODE))='" & k(3) & "' and accno='" & k(4) & "' and tranno not in (select transactionno from sharetransactiondtls where branchcode='" & k(1) & "' and to_char(transactiondate,'dd-Mon-yyyy')='" & k(2) & "') and " & k(5), "tranno")

                //    else
                //                rs = obj.singlerecordset("GENTRANSLOGBKP", _

                //                   "distinct currencycode,tranno,amount", "upper(trim(branchcode))='" & k(1) & "'and to_char(applicationdate,'dd-Mon-yyyy')='" & k(2) & "'and upper(trim(GLCODE))='" & k(3) & "' accno='" & k(4) & "' and tranno not in (select transactionno from sharetransactiondtls where branchcode='" & k(1) & "' and to_char(transactiondate,'dd-Mon-yyyy')='" & k(2) & "') and " & k(5), "tranno")

                //    end if

            }
            else if (strType.Substring(0, 10) == "Shareaccno")
            {
                //k = split(strType, "|")

                //    if k(3) <> "" then
                //         rs = obj.singlerecordset("SHAREHOLDERINFOMST", _

                //            "distinct CUSTOMERID,NAME", "upper(trim(branchcode))='" & k(1) & "' and glcode='" & k(2) & "' and " & k(3), "name,CUSTOMERID")

                //    else
                //                rs = obj.singlerecordset("SHAREHOLDERINFOMST", _

                //                   "distinct CUSTOMERID,NAME", "upper(trim(branchcode))='" & k(1) & "' and glcode='" & k(2) & "'", "name,CUSTOMERID")

                //    end if

            }
            else if (strType.Substring(0, 11) == "allotmentno")
            {
                //k = split(strType, "|")

                //    if k(4) <> "" then
                //         rs = obj.singlerecordset("SHARESSUSPENSEDTLS", _

                //            "distinct applicationno,name", "upper(trim(branchcode))='" & k(1) & "' and upper(trim(currencycode))='" & k(2) & "' and upper(trim(SHARETYPE))='" & k(3) & "' and alloteddate is null and allotmentamount is null and REFUNDAMOUNT is null and  " & k(4), "applicationno")

                //    else
                //                rs = obj.singlerecordset("SHARESSUSPENSEDTLS", _

                //                   "distinct applicationno", "upper(trim(branchcode))='" & k(1) & "'and upper(trim(currencycode))='" & k(2) & "' and upper(trim(SHARETYPE))='" & k(3) & "' and upper(trim(SHARETYPE))='" & k(3) & "' and alloteddate is null and allotmentamount is null and REFUNDAMOUNT is null", "applicationno")

                //    end if

            }
            else if (strType.Substring(0, 11) == "ModCardType")
            {
                //k = split(strType, "|")

                //     rs = obj.singlerecordset("CARDCUSTOMERDTLS c,GENCARDTYPEMST m ", _

                //            "distinct c.CARDTYPE,m.DESCRIPTION", "upper(trim(c.branchcode))='" & k(1) & "'and " & k(2) & "and c.cardtype=m.cardtype", "")

            }



            else if (strType == "StopBranch")
            {
                //     rs = obj.singlerecordset("GENBANKBRANCHMST a,genusermst b", "DISTINCT a.Branchcode,a.narration", "b.ABBUSERYN='Y' and upper(trim(a.branchcode))=upper(trim(b.branchcode))")
            }
            else if (strType == "QueryBranch")
            {
                //     rs = obj.singlerecordset("genstoppa`	ymst a,GENBANKBRANCHMST b", "distinct(a.Branchcode),b.narration", "upper(trim(a.branchcode))=upper(trim(b.branchcode))")
            }
            else if (strType == "StopBranch")
            {
                //     rs = obj.singlerecordset("GENBANKBRANCHMST a,genusermst b", "a.Branchcode,a.narration", "b.ABBUSERYN='Y' and upper(trim(a.branchcode))=upper(trim(b.branchcode))")
            }
            else if (strType == "Currency")
            {
                //     rs = obj.singlerecordset("GENCURRENCYTYPEMST", "currencycode,narration,PRECISION")
            }

            else if (strType.Substring(0, 13) == "QueryCurrency")
            {
                //strflds = split(strType, "~")

                //     rs = obj.singlerecordset("genstoppaymst a,GENCURRENCYTYPEMST b", "distinct(a.currencycode),b.narration", _

                //                "a.currencycode=b.currencycode and a.branchcode='" & strFlds(1) & "'")
            }

            else if (strType == "Curr")
            {
                //     rs = obj.singlerecordset("GENCURRENCYTYPEMST", "currencycode,narration,precision")
            }
            else if (strType == "Module")
            {
                //      rs = obj.singlerecordset("genmoduletypesmst", "moduleid,Narration", "implementedyn='Y'")
            }
            // For BankBranchMaster form 
            // Branchcode
            else if (strType == "BankBranch")
            {
                //     rs = obj.singlerecordset("GENBANKBRANCHMST", "Branchcode,narration")
            }
            //''branchcode
            else if (strType == "BankCurrency")
            {
                //     rs = obj.singlerecordset("GENCURRENCYTYPEMST", "currencycode,narration,precision")
            }
            else if (strType.Substring(0, 6) == "BankId")
            {
                //strArr = split(strtype, "*")
                // rs = obj.singlerecordset("GENOTHERBANKMST", "BANKCODE,BANKNAME", _

                //        "upper(trim(branchcode))='" & strArr(1) & "'")
            }
            //'''------------------------------------------------------------------------------------------
            //'''  For MinMaxBal.asp from in SbModule 

            else if (strType.Substring(0, 6) == "Glcode")
            {
                //    k = split(strType, "|")


                // rs = obj.singlerecordset("GenGlsheetmst", _

                //                        "distinct(glcode),narration", "moduleid='" & k(1) & "'")
            }


            else if (strType.Substring(0, 7) == "QueryGL")
            {

                //    k = split(strType, "|")
                //     rs = obj.singlerecordset("genminmaxbalancepmt m,GenGlsheetmst g", "distinct(m.glcode),g.narration", "m.glcode=g.glcode and m.moduleid='" & k(1) & "' and m.currencycode='" & k(2) & "'and g.branchcode='" & k(3) & "'")
            }
            //''''' for Genral parameters ------------------------------------------------------------------ 
            //''' for moduleid Querying while inserting new record      
            else if (strType.Substring(0, 8) == "SBModule")
            {            //     rs = obj.singlerecordset("GenModuletypesmst", _

                //                    "moduleid,narration", "upper(IMPLEMENTEDYN)='Y'")
            }
            //  ''''----------------------------------------------------------------------------------------------
            else if (strType.Substring(0, 8) == "GLCharge")
            {
                //    k = split(strType, "|")
                //     rs = obj.singlerecordset("genchargespmt m,GenGlsheetmst g", _
                //    "distinct(m.glcode),g.narration", _
                //    "m.glcode=g.glcode and " & _
                //    "m.moduleid='" & k(1) & "' and " & _
                //    "m.currencycode='" & k(2) & "' and m.branchcode='" & k(3) & "'")
            }

            //'''''For GLParam.asp in SbModule
            else if (strType.Substring(0, 7) == "GLParam")
            {
                //    k = split(strType, "|")
                //     rs = obj.singlerecordset("GENGLCODESPMT m,GenGlsheetmst g", _
                //    "distinct(m.glcode),g.narration", _
                //    "m.glcode=g.glcode and m.moduleid='" & k(1) & "' and " & _
                //    "m.branchcode='" & k(2) & "'")
            }


            //''' for CustCat.asp(CustomerCategory) in Sbmodule
            else if (strType.Substring(0, 12) == "CustCategory")
            {
                //     rs = obj.singlerecordset("GENMODULECATPMTMST", "code,categoryname", "")
            }

            //'''for Sbtypeparameters.asp form in Sbbodule
            else if (strType.Substring(0, 7) == "SBParam")
            {
                //    k = split(strType, "|")
                //    rs = obj.singlerecordset("SBTYPEPMT m,GenGlsheetmst g", "distinct(m.glcode),g.narration", "m.glcode=g.glcode and m.moduleid='" & k(1) & "' and m.currencycode='" & k(2) & "' and m.branchcode='" & k(3) & "'")
            }
            else if (strType.Substring(0, 9) == "BookAccNo")
            {
                //    k = split(strType, "|")

                //    if k(5) = "ADD" then
                //     rs = obj.singlerecordset("sbmst", "distinct(accno),name", "branchcode='" & k(1) & "'" & _

                //                                " and currencycode='" & k(2) & "' and glcode='" & k(4) & "' and CHEQUEBOOK='Y'")

                //    elseif k(5)= "MODIFY" then

                //     rs = obj.singlerecordset("genstoppaymst a,sbmst b", "distinct(a.accno),b.name", "a.branchcode='" & k(1) & "'" & _

                //                                " and a.currencycode='" & k(2) & "' and a.glcode='" & k(4) & "' and a.accno=b.accno")

                //    end if
            }
            //''' for Stop payments Querying and to listout the stoppayno,accno,name	



            else if (strType.Substring(0, 9) == "QueryStop")
            {
                //    k = split(strType, "|")


                //    'set rs=obj.singlerecordset("GENSTOPPAYMST g,sbmst s","distinct(g.accno),g.stopno,s.name","g.branchcode='" & k(1) &"'" & _

                //    '							" and g.currencycode='" & k(2) &"' and g.glcode='" & k(4) &"'" & _

                //    '							" and g.moduleid='" & k(3) &"' and g.accno='" & k(5) &"'" & _

                //    '							" and s.accno='" & k(5) &"'")								
                //  rs = obj.singlerecordset("GENSTOPPAYMST g,sbmst s", "distinct(g.accno),g.stopno,s.name", "g.branchcode='" & k(1) & "'" & _

                //                                " and g.currencycode='" & k(2) & "' and g.glcode='" & k(4) & "'" & _

                //                                " and g.moduleid='" & k(3) & "' " & _

                //                                " and g.accno=s.accno")


                // elseif strType.Substring(0,8)= "StModule)
                // objMod = server.CreateObject("GeneralTranQueries.TransactionQueries")

                //    k = split(strType, "|")

                //     rs = objMod.ModuleID(cstr(k(1)), "N")
            }

            else if (strType.Substring(0, 9) == "QryModule")
            {
                //strFlds = split(strType, "|")
                //     rs = obj.singlerecordset("genstoppaymst a,GenModuletypesmst b", _

                //                    "distinct(a.moduleid),b.narration", "a.moduleid=b.moduleid and " & _

                //                    "a.branchcode='" & strFlds(1) & "' and " & _

                //                    "a.currencycode='" & strFlds(2) & "'")
            }
            //'''for querying moduleid in minmaxbalpmt form
            else if (strType.Substring(0, 11) == "QueryModule")
            {
                //strFlds = split(strType, "*")
                //     rs = obj.singlerecordset("GENMINMAXBALANCEPMT a,GenModuletypesmst b ", _

                //                    "distinct(a.moduleid),b.narration", "a.moduleid=b.moduleid and " & _

                //                    "a.branchcode='" & strFlds(1) & "' and " & _

                //                    "a.currencycode='" & strFlds(2) & "'")

            }

            else if (strType.Substring(0, 12) == "sharesGlcode")
            {
                //strFlds = split(strType, "|")
                //strCond = "upper(a.moduleid)= 'SHARES' and a.branchcode='" & strFlds(1) & "' and a.status='R' and b.GLCATEGORY='A' and a.glcode=b.glcode"
                //rs = obj.singlerecordset("GENGLSHEETMST a,GENGLMASTMST b ", "distinct(a.glcode),a.narration", cstr(strCond))
            }
            else if (strType.Substring(0, 11) == "QueryChrgGl")
            {            //strFlds = split(strType, "|")
                         //     rs = obj.singlerecordset("GENchargesPMT a,GenModuletypesmst b ", _

                //                    "distinct(a.moduleid),b.narration", "a.moduleid=b.moduleid and " & _

                //                    "a.branchcode='" & strFlds(1) & "' and " & _

                //                    "a.currencycode='" & strFlds(2) & "'")
            }
            //'''fetching moduleid,description in glparam.asp form while querying
            else if (strType.Substring(0, 13) == "QuerySBModule")
            {            //strFlds = split(strType, "|")
                         //     rs = obj.singlerecordset("GENGLCODESPMT a,GenModuletypesmst b ", _

                //                    "distinct(a.moduleid),b.narration", "a.moduleid=b.moduleid and " & _

                //                    "a.branchcode='" & strFlds(1) & "'")
            }

            else if (strType.Substring(0, 5) == "QryGl")
            {
                //    strFlds = split(strType, "|")
                //  rs = obj.singlerecordset("genstoppaymst a,GenGlsheetmst b", _

                //            "distinct(a.glcode),b.narration", _

                //            "a.glcode=b.glcode and a.branchcode='" & strFlds(1) & "' and " & _

                //            "a.currencycode='" & strFlds(2) & "' and " & _

                //            "a.moduleid='" & strFlds(3) & "'")
            }
            //'''---------------------------------------------------------------------------------------    
            else if (strType.Substring(0, 5) == "Accno")
            {
                //    'stname=strType.Substring(0,5)


                //    'atype=mid(strType,6,len(strType))
                //    k = split(strType, "|")
                //  rs = obj.singlerecordset("sbmst", "accno,name,custid", "glcode = '" & k(1) & "'", "name")
            }

            else if (strType.Substring(0, 6) == "CustID")
            {
                //    stname = strType.Substring(0, 4)
                //    atype = mid(strType, 7)
                //  rs = obj.singlerecordset("GENCUSTINFOMST", "customerid,custname", "")
            }

            else if (strType.Substring(0, 7) == "TransNo")
            {
                //    stname = strType.Substring(0, 5)
                //    atype = mid(strType, 8)
                //     rs = obj.singlerecordset("translog", "tranno,amount", "glcode='" & atype & "'", "tranno")
            }
            //'--------------------------------------------    
            else if (strType.Substring(0, 12) == "TREMINALCODE")
            {
                //k = split(strType, "|")
                //     rs = obj.singlerecordset("POSMASTERDTLS", "TERMINALID, MERCHANTID", "ISSUEDYN = 'N' AND STATUS='R' and sno = '" & k(2) & "'", "")
            }
            else if (strType.Substring(0, 14) == "MASTERTREMINAL")
            {


                //k = split(strType, "|")
                //     rs = obj.singlerecordset("POSMASTERDTLS", "TERMINALID, SERIALNUM", " UPPER(BRANCHCODE) = '" & k(1) & "' and sno = '" & k(2) & "'", "")
            }
            else if (strType.Substring(0, 15) == "MODTREMINALCODE")
            {            //k = split(strType, "|")
                         //     rs = obj.singlerecordset("posissuedtls", "TID, MID", " UPPER(BRANCHCODE) = '" & k(1) & "' and sno = '" & k(2) & "' AND STATUS='R'", "")
            }

            else if (strType == "Tellerbranch")
            {
                //     obj = server.CreateObject("GeneralTranQueries.TransactionQueries")


                //     rs = obj.BranchCodes(cstr(session("userid")))

            }
            else if (strType.Substring(0, 12) == "Tellermodule")
            {
                //     obj = server.CreateObject("GeneralTranQueries.TransactionQueries")


                //    k = split(strType, "|")


                //     rs = obj.ModuleID(cstr(k(1)), "N", "N")

            }
            else if (strType.Substring(0, 11) == "Telleraccno" || strType.Substring(0, 13) == "TrTelleraccno")
            {
                //    k = split(strType, "|")

                //     obj = server.CreateObject("GeneralTranQueries.TransactionQueries")

                //     rs = obj.AccountNumbers(cstr(k(1)), cstr(k(2)), cstr(k(3)))

                //    if obj.connerror<>"" then
                //        kstr = "Norecords"

                //        Errstr = obj.ConnError

                //    end if
            }
            else if (strType.Substring(0, 12) == "Tellerglcode" || strType.Substring(0, 14) == "TrTellerglcode")
            {

                //    obj = server.CreateObject("GeneralTranQueries.TransactionQueries")

                //    k = split(strType, "|")

                //     rs = obj.GLCodes(cstr(k(1)), cstr(k(2)))
                //end if
            }





            //dim obj,rs
            //  rs = server.CreateObject("adodb.recordset")
            //  rssyn = server.CreateObject("adodb.recordset")
            //  rs1 = server.CreateObject("adodb.recordset")
            //  obj = server.CreateObject("queryrecordsets.fetchrecordsets")
            //  objbr = server.CreateObject("GeneralTranQueries.TransactionQueries")


            //elseif strType = "BLevel" then
            //    rs = obj.singlerecordset("GENBANKLEVELMST", "code,narration")


            //elseif strType = "Bruser" then
            //    rs = objbr.BranchCodes(cstr(userid))


            //elseif left(strType,6)= "Userid" then
            //   atype = mid(strType, 7, len(strType))
            //   rs = obj.singlerecordset("genusermst", "userid,name", "branchcode='" & atype & "'")

            //elseif left(strType,6)= "Userid" then
            //   atype = mid(strType, 7, len(strType))
            //   rs = obj.singlerecordset("genusermst", "userid,name", "branchcode='" & atype & "' and status='A'")

            //elseif strType = "Currency" then
            //    rs = obj.singlerecordset("GENCURRENCYTYPEMST", "currencycode,narration", "STATUS!='D'")

            //elseif strType = "Curr" then
            //    rs = obj.singlerecordset("GENCURRENCYTYPEMST", "currencycode,narration,precision", "STATUS!='D'")

            //elseif strType = "Module" then
            //    rs = obj.singlerecordset("genmoduletypesmst", "distinct moduleid,Narration", "implementedyn='Y'")

            //elseif mid(strType,1,10)= "Occupation" then
            //    strtype1 = split(strtype, "|")
            //if strtype1(1) = "View" then
            //     rs = obj.singlerecordset("genoccupationmst", "code,Narration,status")
            //else
            //                rs = obj.singlerecordset("genoccupationmst", "code,Narration,status", "status='R'")
            //end if

            
            //elseif strType = "DocModule" then
            //    rs = obj.singlerecordset("GenDocumentMst a, Genmoduletypesmst b", "distinct a.moduleid,b.Narration", "a.moduleid=b.moduleid")

            //elseif mid(strType,1,5)= "DocNo" then
            //    rs = obj.singlerecordset("GenDocumentMst", "documentcode,Narration,status", "moduleid='" & mid(strtype, 6) & "'")

            //elseif left(strType,6)= "Glcode" then
            //   'stname=left(strType,2)
            //   'atype=mid(strType,7,len(strType))
            //   rs = obj.singlerecordset("genglsheetmst", "glcode,NARRATION", "moduleid='" & atype & "'")

            //elseif left(strType,5)= "Accno" then
            //    'stname=left(strType,5)
            //    'atype=mid(strType,6,len(strType))
            //    dim objTrn
            //    objTrn = Server.CreateObject("GeneralTranQueries.TransactionQueries")
            //    rs = objTrn.AccountNumbers(cstr(brchCd), cstr(Modid), cstr(atype))
            //    objTrn = nothing

            //elseif left(strType,6)= "CustID" then
            //    stname = left(strType, 4)
            //    atype = mid(strType, 7)
            //    rs = obj.singlerecordset("GENCUSTINFOMST", "customerid,custname", "")

            //elseif left(strType,7)= "TransNo" then
            //    stname = left(strType, 5)
            //    atype = mid(strType, 8)
            //    rs = obj.singlerecordset("translog", "tranno,amount", "glcode='" & atype & "'", "tranno")

            //elseif left(strtype,8)= "cashtype" then
            //    sctype = split(strtype, "|")
            //    rs = obj.singlerecordset("CASHCASHIERTYPEMST", "cashiertypeid,narration", "STATUS is null and (currencycode='" & sctype(2) & "' and branchcode='" & sctype(1) & "')")

            //elseif left(strtype,12)= "cashiertypes" then
            //    sctype = split(strtype, "|")
            //    rs = obj.singlerecordset("CASHCASHIERTYPEMST", "cashiertypeid,narration", " STATUS IS NULL and (currencycode='" & sctype(2) & "' and branchcode='" & sctype(1) & "')")

            //elseif strtype = "regions" then
            //    rs = obj.singlerecordset("GENREGIONMST", "CODE,NARRATION", "STATUS='R'")

            //elseif strtype = "usergroups" then
            //    rs = obj.singlerecordset("GENBANKUSERGROUPMST", "GROUPCODE,NARRATION", "STATUS IS NULL")

            //elseif left(strType,11)= "Cashiertype" then
            //    stname = left(strType, 11)
            //    k = split(strType, "*")
            //    rs = obj.singlerecordset("CASHCASHIERTYPEMST", "cashiertypeid,narration", "BRANCHCODE='" & k(1) & "'", "cashiertypeid")

            //elseif strType = "Cashier" then
            //    stname = strType
            //    strcond = "W.USERID = U.USERID AND W.USERID<>'" & userid & "' AND W.USERID NOT IN (SELECT CASHIERID FROM CASHCOUNTERMST)"
            //    strfld = "DISTINCT W.USERID,U.NAME"
            //    strtab = "GENWORKALLOTMENTMST W,GENUSERMST U"
            //    rs = obj.singlerecordset(cstr(strtab), cstr(strfld), cstr(strcond))

            //elseif left(strType,9)= "Cashierid" then
            //    stname = strType
            //    k = split(strType, "*")
            //    rs = obj.singlerecordset("cashcashierposmst cash,genusermst gen", "cash.cashierid,gen.name", "cash.cashierid=gen.userid and cash.cashierid <> '" & cstr(userid) & "' ")

            //elseif left(strType,6)= "CashID" then
            //    k = split(strType, "|")
            //    rs = obj.singlerecordset("cashcountermst cash,genusermst gen", "distinct(cash.cashierid),gen.name", "cash.cashierid=gen.userid and upper(trim(cash.cashierid)) <> '" & ucase(trim(cstr(userid))) & "' and gen.branchcode='" & k(1) & "'")

            //elseif left(strType,14)= "AllotedCashier" then
            //    stname = strType
            //    cash = split(stname, "*")
            //    rs = obj.singlerecordset("CASHALLOTMENTSTRN CASH,GENUSERMST GEN", "DISTINCT(CASH.CASHIERID),GEN.NAME", "CASH.CASHIERID=GEN.USERID AND CASH.BRANCHCODE='" & CASH(1) & "' AND CASH.CURRENCYCODE='" & CASH(2) & "'", "CASH.CASHIERID")

            //elseif left(strType,9)= "Allotment" then
            //    k = split(strType, "*")
            //    rs = obj.singlerecordset("cashallotmentstrn", "Allotmentno", "cashierid='" & k(1) & "' and counterno = '" & k(2) & "' and status='P'", "allotmentno")

            //elseif strtype = "Bankcode" then
            //    rs = obj.singlerecordset("Genbankmst", "Bankname,BANKCODE")

            //elseif left(strtype,10)= "Cashiermgt" then
            //    k = split(strtype, "*")
            //    rs = obj.singlerecordset("cashcountermst cash,genusermst gen", "distinct(cash.cashierid),gen.name", "cash.branchcode='" & k(1) & "' and cash.currencycode='" & k(2) & "' and cash.cashierid=gen.userid and cash.cashierid not in ('" & ucase(userid) & "')")

            //elseif left(strtype,16)= "Cashrefundaccept" then
            //    k = split(strtype, "*")
            //    rs = obj.singlerecordset("cashrefundstrn cash,genusermst gen", "distinct(cash.REFUNDEDUSERID),gen.name", "cash.branchcode='" & k(1) & "' and cash.currencycode='" & k(2) & "' and cash.REFUNDEDUSERID=gen.userid  and cash.status='P' and cash.USERID <> '" & userid & "'")

            //elseif left(strtype,7)= "Cashacc" then
            //    k = split(strtype, "*")
            //    rs = obj.singlerecordset("CASHTRANSBTCASHIERSTRN cash,genusermst gen", "distinct(cash.fromcashierid),gen.name", "cash.branchcode='" & k(1) & "' and cash.currencycode='" & k(2) & "' and cash.FROMcashierid=gen.userid and cash.status='P' and cash.tocashierid='" & cstr(userid) & "'", "cash.fromcashierid")

            //elseif left(strtype,11)= "CutsoiledNo" then
            //    k = split(strtype, "|")
            //    rs = obj.singlerecordset("CASHCUTNSPOILNOTESMST", "CUTSOILTRANNO,custid,RECEIVEDFROM", "UPPER(TRIM(branchcode))='" & UCASE(TRIM(k(1))) & "' and UPPER(TRIM(currencycode))='" & UCASE(TRIM(k(2))) & "'")

            //elseif left(strtype,5)= "Group" then
            //    k = split(strtype, "|")
            //    rs = obj.singlerecordset("GENBANKUSERGROUPMST", "GROUPCODE,NARRATION", "STATUS='A'")

            //elseif left(strtype,6)= "Groups" then
            //    k = split(strtype, "|")
            //    rs = obj.singlerecordset("GENBANKUSERGROUPMST", "GROUPCODE,NARRATION", "STATUS='A'")

            //elseif left(strtype,4)= "User" then
            //    k = split(strtype, "|")
            //    rs = obj.singlerecordset("GENusermst", "userid,name", "STATUS='A'")

            //elseif left(strtype,5)= "Query" then
            //    if right(strtype, 1) = "N" then
            //        rs = obj.singlerecordset("GENUSERMST", "Userid,Name")
            //    else
            //                rs = obj.singlerecordset("GENUSERMST", "Userid,Name", "status='P'")
            //    end if

            //elseif strType = "Groupid" then
            //    rs = obj.singlerecordset("GENBANKUSERGROUPMST", "Groupcode,narration", "status='A'")


            //elseif strType = "AppGroupid" then
            //    rs = obj.singlerecordset("GENBANKUSERGROUPMST", "Groupcode,narration", "groupcode in(select distinct(Groupcode) from gengroupformsmst where status<>'A')")

            //elseif left(strType,9)= "AppUserid" then
            //   atype = mid(strType, 7, len(strType))
            //   rs = obj.singlerecordset("genworkallotmentmst", "userid,username", "status<>'A'")

            //elseif left(strtype,11)= "ALLCASHIERS" then
            //    k = split(strType, "|")
            //    rs = obj.singlerecordset("cashcountermst cash,genusermst gen", "distinct(cash.cashierid), gen.name, cash.counterno ", " cash.branchcode='" & k(1) & "' and cash.currencycode='" & k(2) & "' and cash.cashierid=gen.userid", " gen.name")

            //elseif strType = "RealCust" then
            //    rs = obj.singlerecordset("Gencustinfomst", "customerid,name", "customerid=customerid order by name")

            //end if



        }

        public async Task<List<SelectListItem>> GetQualificationList(string type = "")
        {
            string[] arr = string.IsNullOrWhiteSpace(type) ? [] : type.Split('|');

            using DataTable dataTable = await _databaseFactory.SingleRecordSet("genqualificationmst", "code,narration,status",
                arr.Length != 0 && arr[1].Equals("View") ? "" : "status='R' order by code");

            return ReturnKeyValuePair(dataTable, "Qualification");
        }

        public async Task<List<SelectListItem>> GetIncomeList(string type = "")
        {
            string[] arr = string.IsNullOrWhiteSpace(type) ? [] : type.Split('|');

            using DataTable dataTable = await _databaseFactory.SingleRecordSet("genincomemst", "code,narration,status",
                arr.Length != 0 && string.IsNullOrWhiteSpace(arr[1]) ? "" : "status='R' order by code");

            return ReturnKeyValuePair(dataTable, "Income");
        }

        public async Task<List<SelectListItem>> GetCardLength()
        {
            // dim lengthmo
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENCARDLENGTHMST", "CARDLENGTH");
            // "status='R'"
            //              if rs4.RecordCount > 0 then
            //               length = rs4(0).value
            //              end if
            return ReturnKeyValuePair(dataTable, "Card Length");
        }

        private List<SelectListItem> ReturnKeyValuePair(DataTable dataTable, string type = "")
        {
            List<string> list = new List<string> 
            { 
                "Branch", "Category"
            };
            var result = new List<SelectListItem>();
            result.Add(new SelectListItem { Value = "", Text = "Select" });
            foreach (DataRow row in dataTable.Rows)
            {
                var keyValuePair = new SelectListItem();
                if (list.Contains(type))
                    keyValuePair.Text = string.Concat(Conversions.ToString(row.ItemArray[0]), " - ", Conversions.ToString(row.ItemArray[1]).ToLower().Humanize(LetterCasing.Title));
                else
                    keyValuePair.Text = Conversions.ToString(row.ItemArray[1]).ToLower().Humanize(LetterCasing.Title);
                keyValuePair.Value = Conversions.ToString(row.ItemArray[0]);
                result.Add(keyValuePair);
            }
            return result;
        }

        //public async Task<string> SearchByName(string strName)
        //{
        //    var names = new List<string>();
        //    var parts = strName.Split(' ', 3, StringSplitOptions.RemoveEmptyEntries);

        //    async Task<DataTable> Query(string value)
        //    {
        //        string v = value.ToUpper();
        //        string sql =
        //            $"select * from GENTERRORISTLIST where " +
        //            $"FIRSTNAME like '%{v}%' or SECONDNAME like '%{v}%' or " +
        //            $"THIRDNAME like '%{v}%' or FOURTHNAME like '%{v}%'";
        //        return await _databaseFactory.ProcessQueryAsync(sql);
        //    }

        //    // try full name first, then each part
        //    foreach (var key in new[] { strName }.Concat(parts))
        //    {
        //        var table = await Query(key);

        //        if (table.Rows.Count > 0)
        //        {
        //            foreach (DataRow r in table.Rows)
        //            {
        //                names.Add(
        //                    $"{r["DATEOFBIRTH"]}~{r["FIRSTNAME"]} {r["SECONDNAME"]} {r["THIRDNAME"]} {r["FOURTHNAME"]};"
        //                );
        //            }
        //            return string.Join("", names);
        //        }

        //        if (string.IsNullOrWhiteSpace(await Search(key, parts[0])))
        //            return " ~ No Records Found;".ToUpper();
        //    }

        //    return "NO RECORDS FOUND";
        //}

        //private async Task<string> Search(string strCheck, string strName)
        //{
        //    DataTable dataTable = null!;
        //    StringBuilder strAllNames = new StringBuilder();

        //    string[] aliasColumns = {
        //        "ALIASNAME1", "ALIASNAME2", "ALIASNAME3", "ALIASNAME4", "ALIASNAME5",
        //        "ALIASNAME6", "ALIASNAME7", "ALIASNAME8", "ALIASNAME9", "ALIASNAME10"
        //    };

        //    foreach (var alias in aliasColumns)
        //    {
        //        string searchString = alias == "ALIASNAME10" ? strName : strCheck;
        //        string sqlQuery = $"SELECT DATEOFBIRTH, FIRSTNAME, SECONDNAME, THIRDNAME, FOURTHNAME, {alias} FROM GENTERRORISTLIST " +
        //            $"WHERE {alias} LIKE '%{searchString}%'";

        //        dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

        //        if (dataTable.Rows.Count > 0)
        //        {
        //            foreach (DataRow row in dataTable.Rows)
        //            {
        //                strAllNames.Append($"{row["DATEOFBIRTH"]}~{row["FIRSTNAME"]} {row["SECONDNAME"]} " +
        //                    $"{row["THIRDNAME"]} {row["FOURTHNAME"]}~{Conversions.ToString(row[alias])};");
        //            }

        //            // Stop after finding the first matching alias column
        //            break;
        //        }
        //    }

        //    return Conversions.ToString(strAllNames);
        //}
    }
}
