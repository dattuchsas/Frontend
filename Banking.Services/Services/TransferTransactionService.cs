using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Data;
using System.Reflection;

namespace Banking.Services
{
    public class TransferTransactionService : ITransferTransactionService
    {
        private readonly IDatabaseService _databaseFactory;
        private readonly ICommonService _commonService;
        private readonly IListService _listService;
        private ITransactionalService _transactionalService;

        public TransferTransactionService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
            _commonService = new CommonService(databaseSettings);
            _listService = new ListService(databaseSettings);
            _transactionalService = new TransactionalService(databaseSettings);
        }

        public async Task<TransferTransactionModel> Get(ISession session)
        {
            TransferTransactionModel model = new()
            {
                Branch = session.GetString(SessionConstants.BranchCode),
                BranchList = await _transactionalService.GetBranchCodesByUserId(session.GetString(SessionConstants.UserId))
            };

            if (string.IsNullOrWhiteSpace(model.TransactionMode.ToString()))
                model.TransactionMode = TransactionModes.Debit;

            string serviceCode = string.Concat("Service|", model.TransactionMode.ToString());

            model.ServiceList = await _listService.GetServiceList(serviceCode);
            model.CategoryList = await _commonService.GetCategoryList("CustType|Cust");

            model.CheckABB = false;
            model.CheckCheque = false;
            model.CheckLinkModule = false;
            model.CheckTransDetails = false;
            model.CheckDenoms = false;
            model.CheckRateDetails = false;
            model.CheckDenomsTally = false;

            return model;
        }

        public async Task<TransferTransactionModel> GetDetails(ISession session, TransferTransactionModel model, string queryString = "")
        {
            string strcts, DayLmt, strDepCertificate, cmod, cgl, cacc, cgldes, caccnam, smod, sgl, sacc, sgldes, saccnm, csmod,
                csgl, csacc, csgldes, csaccnm, strcgstmoddesc, strsgstmoddesc, strcessmoddesc, pBr, pBrCode, srgst, CshType, Rfldnms,
                RwhrCond, RecYN, TPayYN, TRecYN, cntrStatus, vModDir;

            //vUserid, vAppDate, vCounterNo, vCashierid, vBranchCode, vBrnarration, vCurCode, vCurnarration, vMachineId

            string sqlQuery = "SELECT CREDITMODULEID,CREDITGLCODE,CREDITACCNO FROM TDSEFILEPARM WHERE EFFECTIVEDATE = " +
                "(SELECT MAX(EFFECTIVEDATE) FROM TDSEFILEPARM WHERE EFFECTIVEDATE <='" + session.GetString(SessionConstants.ApplicationDate) + "')";

            DataTable dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count != 0)
            {
                model.Hidden_194NModId = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                model.Hidden_194NGLCode = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
                model.Hidden_194NAccNo = Conversions.ToString(dataTable.Rows[0].ItemArray[2]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            sqlQuery = "SELECT NARRATION FROM GENMODULEMST WHERE moduleid ='" + model.Hidden_194NModId + "'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count != 0)
            {
                model.Hidden_194NModDesc = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            sqlQuery = "SELECT GLDESCRIPTION FROM GENGLMASTMST WHERE MODULEID = '" + model.Hidden_194NModId + "' AND GLCODE = '" + model.Hidden_194NGLCode + "'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count != 0)
            {
                model.Hidden_194NGLDesc = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            sqlQuery = "SELECT NAME FROM " + model.Hidden_194NModId + "MST WHERE GLCODE = '" + model.Hidden_194NGLCode + "' AND ACCNO = '" + 
                model.Hidden_194NAccNo + "' AND BRANCHCODE = '" + session.GetString(SessionConstants.BranchCode) + "'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count != 0)
            {
                model.Hidden_194NAccName = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            sqlQuery = "SELECT impyn FROM genconfigmst WHERE code='194N'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count != 0)
            {
                model.Hidden_194NYN = Convert.IsDBNull(Conversions.ToString(dataTable.Rows[0].ItemArray[0])) ? "N" : Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("genconfigmst", "impyn", "code='CTS'");

            if (dataTable.Rows.Count > 0)
            {
                strcts = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            sqlQuery = "SELECT impyn FROM genconfigmst WHERE code='THRLMT'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count > 0)
            {
                model.Hidden_ThrLmt = Convert.IsDBNull(Conversions.ToString(dataTable.Rows[0].ItemArray[0])) ? "N" : Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GENCONFIGMST", "IMPYN", "CODE='OLIMYN'");

            if (dataTable.Rows.Count > 0)
            {
                model.Hidden_OlimpYN = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GENCONFIGMST", "IMPYN,VALUE1", "CODE='DAYLMT'");

            if (dataTable.Rows.Count > 0)
            {
                model.ImpYnDay = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                DayLmt = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GENCONFIGMST", "NVL(IMPYN,'N') imp", "CODE='ABBCLGYN'");

            if (dataTable.Rows.Count > 0)
            {
                model.ImpClgYN = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GENCONFIGMST", "IMPYN,VALUE1", "CODE='WEKLMT'");

            if (dataTable.Rows.Count > 0)
            {
                model.ImpYnWek = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                model.WekLmt = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            // Clearing inward returns
            sqlQuery = "SELECT nvl(AUTOPOSTCHRGSYN,'N') AUTOPOSTCHRGSYN, nvl(COMMISSIONYN,'N') COMMISSIONYN FROM GENCHARGESPMT WHERE CHARGESID='IRC'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count > 0)
            {
                model.Hidden_AutoRetChrgsYN = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                model.Hidden_CommRetChrgsYN = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            sqlQuery = "select depcertificate from genbankparm";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count > 0)
            {
                strDepCertificate = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GSTTYPEPMT a, GENGLMASTMST b",
                "nvl(a.MODULEID,''), nvl(a.GLCODE,''), nvl(a.ACCNO,''),nvl(b.gldescription,'') ",
                "a.glcode=b.glcode AND a.gstcode='GSTR' AND a.gsttype='CGST'");

            if (dataTable.Rows.Count > 0)
            {
                cmod = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                cgl = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
                cacc = Conversions.ToString(dataTable.Rows[0].ItemArray[2]);
                cgldes = Conversions.ToString(dataTable.Rows[0].ItemArray[3]);

                DataTable rsac = await _databaseFactory.SingleRecordSet(Conversions.ToString(dataTable.Rows[0].ItemArray[0]) + "MST",
                    "NVL(name,'') ", " glcode='" + Conversions.ToString(dataTable.Rows[0].ItemArray[1]) + "' AND accno='" +
                    Conversions.ToString(dataTable.Rows[0].ItemArray[2]) + "' AND branchcode='" + session.GetString(SessionConstants.BranchCode) + "' ");

                if (rsac.Rows.Count > 0)
                {
                    caccnam = Conversions.ToString(rsac.Rows[0].ItemArray[0]);
                }

                BankingExtensions.ReleaseMemory(rsac);

                sqlQuery = "SELECT NARRATION FROM GENMODULEMST WHERE moduleid ='" + cmod + "'";

                dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

                if (dataTable.Rows.Count > 0)
                {
                    strcgstmoddesc = Conversions.ToString(rsac.Rows[0].ItemArray[0]);
                }
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GSTTYPEPMT a, GENGLMASTMST b",
                "nvl(a.MODULEID,''), nvl(a.GLCODE,''), nvl(a.ACCNO,''),nvl(b.gldescription,'') ",
                "a.glcode=b.glcode AND gstcode='GSTR' AND gsttype='SGST'");

            if (dataTable.Rows.Count > 0)
            {
                smod = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                sgl = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
                sacc = Conversions.ToString(dataTable.Rows[0].ItemArray[2]);
                sgldes = Conversions.ToString(dataTable.Rows[0].ItemArray[3]);

                DataTable rssac = await _databaseFactory.SingleRecordSet(Conversions.ToString(dataTable.Rows[0].ItemArray[0]) + "MST",
                    "NVL(name,'') ", " glcode='" + Conversions.ToString(dataTable.Rows[0].ItemArray[1]) + "' AND accno='" +
                    Conversions.ToString(dataTable.Rows[0].ItemArray[2]) + "' AND branchcode='" + session.GetString(SessionConstants.BranchCode) + "' ");

                if (rssac.Rows.Count > 0)
                {
                    saccnm = Conversions.ToString(rssac.Rows[0].ItemArray[0]);
                }

                BankingExtensions.ReleaseMemory(rssac);

                sqlQuery = "SELECT NARRATION FROM GENMODULEMST WHERE moduleid ='" + smod + "'";

                dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

                if (dataTable.Rows.Count > 0)
                {
                    strsgstmoddesc = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                }
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GSTTYPEPMT a, GENGLMASTMST b",
                "nvl(a.MODULEID,''), nvl(a.GLCODE,''), nvl(a.ACCNO,''),nvl(b.gldescription,'') ",
                "a.glcode=b.glcode AND gstcode='GSTR' AND gsttype='CESS'");

            if (dataTable.Rows.Count > 0)
            {
                csmod = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                csgl = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
                csacc = Conversions.ToString(dataTable.Rows[0].ItemArray[2]);
                csgldes = Conversions.ToString(dataTable.Rows[0].ItemArray[3]);

                DataTable rscsac = await _databaseFactory.SingleRecordSet(Conversions.ToString(dataTable.Rows[0].ItemArray[0]) + "MST",
                    "NVL(name,'') ", " glcode='" + Conversions.ToString(dataTable.Rows[0].ItemArray[1]) + "' AND accno='" +
                    Conversions.ToString(dataTable.Rows[0].ItemArray[2]) + "' AND branchcode='" + session.GetString(SessionConstants.BranchCode) + "' ");

                if (rscsac.Rows.Count > 0)
                {
                    csaccnm = Conversions.ToString(rscsac.Rows[0].ItemArray[0]);
                }

                BankingExtensions.ReleaseMemory(rscsac);
    
                sqlQuery = "SELECT NARRATION FROM GENMODULEMST WHERE moduleid ='" + csmod + "'";

                dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

                if (dataTable.Rows.Count > 0)
                {
                    strcessmoddesc = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                }
            }

            BankingExtensions.ReleaseMemory(dataTable);

            // POS Place OF Supply

            pBr = session.GetString(SessionConstants.BranchCode);

            dataTable = await _databaseFactory.SingleRecordSet("genbankbranchmst a,GENSTATEMST b",
                " NVL(a.statecode||'-'||b.statename,'') POS ", "a.statecode = b.statecode AND a.branchcode='" + pBr + "'");

            if (dataTable.Rows.Count > 0)
            {
                model.SRPOS = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            // GSTIN Number

            dataTable = await _databaseFactory.SingleRecordSet("genbankparm", " NVL(gstin,'') GSTIN ", "");

            if (dataTable.Rows.Count > 0)
            {
                srgst = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            // GSTR %

            dataTable = await _databaseFactory.SingleRecordSet("genconfigmst", " NVL(value1,'0') val ", "CODE='GSTR'");

            if (dataTable.Rows.Count > 0)
            {
                model.SRGTP = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            // Start Remittance AutoCharges 

            sqlQuery = "SELECT nvl(AUTOPOSTCHRGSYN,'N') AUTOPOSTCHRGSYN, nvl(COMMISSIONYN,'N') COMMISSIONYN,COMMAMT FROM genchargespmt WHERE chargesid = 'CANC'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count > 0)
            {
                model.Hidden_RemCanAutoChrgsYN = Convert.IsDBNull(Conversions.ToString(dataTable.Rows[0].ItemArray[0])) ? "N" : Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                model.Hidden_RemCanCommYN = Convert.IsDBNull(Conversions.ToString(dataTable.Rows[0].ItemArray[0])) ? "N" : Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                model.Hidden_RemCanCommAmt = Conversions.ToString(dataTable.Rows[0].ItemArray[2]);
            }

            // GSTR
            sqlQuery = "SELECT nvl(impyn,'N') impyn,nvl(value1,0) val FROM GENCONFIGMST WHERE CODE = 'GSTR'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count > 0)
            {
                model.Hidden_RemCanGSTYN = Convert.IsDBNull(Conversions.ToString(dataTable.Rows[0].ItemArray[0])) ? "N" : Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                model.Hidden_RemCanGSTTax = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            // CESS
            sqlQuery = "SELECT nvl(impyn,'N') impyn,nvl(value1,0) val FROM GENCONFIGMST WHERE CODE = 'CESS'";

            dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

            if (dataTable.Rows.Count > 0)
            {
                model.Hidden_RemCanCESSYN = Convert.IsDBNull(Conversions.ToString(dataTable.Rows[0].ItemArray[0])) ? "N" : Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                model.Hidden_RemCanCESSTax = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            // End Remittance AutoCharges
            pBrCode = session.GetString(SessionConstants.BranchCode);

            dataTable = await _databaseFactory.SingleRecordSet("GENBANKBRANCHMST", "overdraftyn", "BRANCHCODE='" + pBrCode + "'");

            if (dataTable.Rows.Count > 0)
            {
                model.Overdraft = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            // To Exit from form
            string stmodule = session.GetString("module");

            // if General module other than Forex
            // string exitdir = "/commonmodule.aspx";
            model.UserId = session.GetString(SessionConstants.UserId);
            model.CounterNo = session.GetString(SessionConstants.CounterNo);

            string[] strBDTMod = queryString.Split(".");

            if (strBDTMod[0] == "BDT")
                model.ApplicationDate = string.Format("dd-MMM-yyyy", Convert.ToDateTime(session.GetString(SessionConstants.ApplicationDate)).AddDays(-1));
            else
                model.ApplicationDate = session.GetString(SessionConstants.ApplicationDate);

            model.CashierId = session.GetString(SessionConstants.UserId);
            model.Hidden_Precision = Convert.ToString(session.GetInt32(SessionConstants.Precision));

            model.BranchCode = session.GetString(SessionConstants.BranchCode);
            model.CurrencyCode = session.GetString(SessionConstants.CurrencyCode);
            model.BranchNarration = session.GetString(SessionConstants.BranchNarration);
            model.CurrencyNarration = session.GetString(SessionConstants.CurrencyNarration);
            model.MachineId = session.GetString(SessionConstants.MachineId);
            model.ABBUser = session.GetString(SessionConstants.ABBUser);

            vModDir = session.GetString(SessionConstants.SelectedModule);

            if (!string.IsNullOrWhiteSpace(vModDir) && vModDir.ToUpper().Equals("CASH"))
            {
                Rfldnms = "TELLERVERIFYREQYN";

                dataTable = await _databaseFactory.SingleRecordSet("GENBANKPARM", Rfldnms);

                model.Hidden_TellerVerifyReqYN = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);

                Rfldnms = "cashiertypeid,upper(counterstatus) cntStatus";

                string CwhrCond = "upper(branchcode)='" + model.BranchCode.Trim().ToUpper() + "' and upper(currencycode)='" +
                    model.CurrencyCode.Trim().ToUpper() + "' and upper(cashierid)='" + model.UserId.Trim().ToUpper() + "'";

                dataTable = await _databaseFactory.SingleRecordSet("CASHCOUNTERMST", Rfldnms, CwhrCond);

                if (dataTable.Rows.Count > 0)
                {
                    CshType = Conversions.ToString(dataTable.Rows[0]["cashiertypeid"]);
                    cntrStatus = Conversions.ToString(dataTable.Rows[0]["cntStatus"]);

                    Rfldnms = "receiptsyn,tellerpaymentsyn,tellerreceiptsyn";

                    RwhrCond = "upper(branchcode)='" + model.BranchCode.Trim().ToUpper() + "' and upper(currencycode)='" + model.CurrencyCode.Trim().ToUpper() + 
                        "' and upper(cashiertypeid)='" + CshType.Trim().ToUpper() + "' and upper(status)='R'";

                    dataTable = await _databaseFactory.SingleRecordSet("CASHCASHIERTYPEMST", Rfldnms, RwhrCond);

                    if (dataTable.Rows.Count > 0)
                    {
                        RecYN = Conversions.ToString(dataTable.Rows[0]["receiptsyn"]);
                        TPayYN = Conversions.ToString(dataTable.Rows[0]["tellerpaymentsyn"]);
                        TRecYN = Conversions.ToString(dataTable.Rows[0]["tellerreceiptsyn"]);

                        Rfldnms = "nvl(totamount,0) TotAmt";
                        dataTable = await _databaseFactory.SingleRecordSet("CASHCASHIERPOSMST", Rfldnms, CwhrCond);

                        if (dataTable.Rows.Count > 0)
                        {
                            model.VTotalAmount = Conversions.ToString(dataTable.Rows[0]["TotAmt"]);
                            model.Hidden_TotalNarration = "Curr. Balance : ";
                        }
                    }
                }

                BankingExtensions.ReleaseMemory(dataTable);

                if (queryString.Length > 0)
                {
                    string[] strMod = queryString.Split('.');

                    if (strMod[0].Substring(strMod[0].Length - 4) == "TPAY")
                    {
                        model.Hidden_Mode = "PAY";
                        model.Hidden_SubMode = "TPAY";
                        model.Hidden_Title = "Teller Payments";
                    }
                    else if (strMod[0].Substring(strMod[0].Length - 4) == "TREC")
                    {
                        model.Hidden_Mode = "REC";
                        model.Hidden_SubMode = "TREC";
                        model.Hidden_Title = "Teller Receipts";
                    }
                    else if (strMod[0].Substring(strMod[0].Length - 3) == "REC")
                    {
                        model.Hidden_Mode = "REC";
                        model.Hidden_Title = "Cash Receipts";
                    }
                }
            }
            else
            {
                if (queryString.Length > 0)
                {
                    string[] strMod = queryString.Split('.');

                    if (strMod[0] == "BDT")
                    {
                        model.Hidden_BDT = true;
                        model.Hidden_Mode = "TRANS";
                        model.Hidden_Title = "Back Date Transfers";

                        dataTable = await _databaseFactory.SingleRecordSet("GENCONFIGMST", "VALUE1", "CODE='BDT' AND (BRANCHCODE='" + 
                            pBrCode + "' OR BRANCHCODE IS NULL)");

                        if (dataTable.Rows.Count > 0)
                        {
                            int noOfDays = Conversions.ToInt(dataTable.Rows[0].ItemArray[0]);
                            model.Hidden_BDTStartDate = Convert.ToDateTime(session.GetString(SessionConstants.ApplicationDate)).AddDays(-noOfDays).ToString("dd-MMM-yyyy");
                        }

                        BankingExtensions.ReleaseMemory(dataTable);
                    }
                    else
                    {
                        model.Hidden_Mode = "PAY";
                        model.Hidden_Title = "Payments";
                    }
                }
                else
                {
                    model.Hidden_Mode = "TRANS";
                    model.Hidden_Title = "Transfers";
                }
            }

            // Code for Transaction Position Screen
            //    menustr = Request.QueryString("menuyn")
            //    If Len(menustr) > 0 Then
            //        menustr = Split(menustr, "|")
            //        menuyn = menustr(0)
            //        modid = menustr(1)
            //    End If

            if (session.GetString(SessionConstants.SelectedModule) == "CLG")
                model.Hidden_Title = "Clearing Inward Entry";

            model.Hidden_ChequeValidPeriod = session.GetString(SessionConstants.ChequeValidPeriod);
            model.Hidden_ChequeLength = session.GetString(SessionConstants.ChequeLength);
            model.SelectedModule = session.GetString(SessionConstants.SelectedModule);

            return model;
        }

        public async Task<string> GetBatchNoGenRemCan(string searchString = "")
        {
            string strResult = "";

            if (searchString.Length > 0)
            {
                string[] mode = searchString.Split("~*~");
                string[] strVal = mode[1].Split("~");
                string brCode = strVal[0];
                string batchNo = strVal[1];
                string tranNo = strVal[2];
                string strbatchno, strtranno = "";

                // For general batch, tran no generation
                switch (mode[0].ToUpper())
                {
                    case "GEN":
                        string tranNos = strVal[3];
                        if (string.IsNullOrWhiteSpace(batchNo) && string.IsNullOrWhiteSpace(tranNo))
                        {
                            if (tranNos == "1")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                strtranno = await _databaseFactory.GetTranNo(brCode);
                            }
                            else if (tranNos == "2")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2;
                            }
                            else if (tranNos == "5")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtrancomm = await _databaseFactory.GetTranNo(brCode);
                                string strtrannocgst = await _databaseFactory.GetTranNo(brCode);
                                string strtrannosgst = await _databaseFactory.GetTranNo(brCode);
                                string strtrannocess = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strbatchno + "*" + strtranno1 + "*" + strtrancomm + "*" + strtrannocgst + "*" + strtrannosgst + "*" + strtrannocess;
                            }
                        }
                        break;
                }

                string sqlstr = "SELECT COMMGLCODE,COMMAMT, COMMACCNO,COMGLDESC,COMMMODULEID,nvl(COMMISSIONYN,'N') COMMISSIONYN FROM genchargespmt g WHERE chargesid = 'CANC'";

                DataTable resDtls = await _databaseFactory.ProcessQueryAsync(sqlstr);

                string strcommglcode = "", strCommAmt = "0", strcommaccno = "", strcommgldesc = "", strcommmodid = "", strCommYN = "";

                if (resDtls.Rows.Count > 0)
                {
                    strcommglcode = Convert.IsDBNull(resDtls.Rows[0].ItemArray[0]) ? "" : Conversions.ToString(resDtls.Rows[0].ItemArray[0]);
                    strCommAmt = Convert.IsDBNull(resDtls.Rows[0].ItemArray[1]) ? "" : Conversions.ToString(resDtls.Rows[0].ItemArray[1]);
                    strcommaccno = Convert.IsDBNull(resDtls.Rows[0].ItemArray[2]) ? "" : Conversions.ToString(resDtls.Rows[0].ItemArray[2]);
                    strcommgldesc = Convert.IsDBNull(resDtls.Rows[0].ItemArray[3]) ? "" : Conversions.ToString(resDtls.Rows[0].ItemArray[3]);
                    strcommmodid = Convert.IsDBNull(resDtls.Rows[0].ItemArray[4]) ? "" : Conversions.ToString(resDtls.Rows[0].ItemArray[4]);
                    strCommYN = Convert.IsDBNull(resDtls.Rows[0].ItemArray[5]) ? "" : Conversions.ToString(resDtls.Rows[0].ItemArray[5]);
                }

                string strcommaccname = "";
                sqlstr = "SELECT name FROM " + strcommmodid + "MST WHERE accno ='" + strcommaccno + "' AND glcode ='" + strcommglcode + "' AND branchcode = '" + brCode + "'";
                resDtls = await _databaseFactory.ProcessQueryAsync(sqlstr);

                if (resDtls.Rows.Count > 0)
                    strcommaccname = Convert.IsDBNull(resDtls.Rows[0].ItemArray[0]) ? "" : Conversions.ToString(resDtls.Rows[0].ItemArray[0]);

                string strcommmoddesc = "";
                sqlstr = "SELECT narration FROM GENMODULEMST WHERE moduleid = '" + strcommmodid + "'";
                resDtls = await _databaseFactory.ProcessQueryAsync(sqlstr);

                if (resDtls.Rows.Count > 0)
                    strcommmoddesc = Convert.IsDBNull(resDtls.Rows[0].ItemArray[0]) ? "" : Conversions.ToString(resDtls.Rows[0].ItemArray[0]);

                string counterno = strcommaccno + "*" + strcommaccname + "*" + strcommglcode + "*" + strcommgldesc + "*" + strcommmodid + "*" + strcommmoddesc;

                strResult = strtranno + "~" + counterno;
            }

            return strResult;
        }

        public async Task<string> GetBatchNoGen(string searchString = "")
        {
            string brCode = "", batchNo = "", tranNos, strbatchno = "", strtranno = "";

            if (searchString.Length > 0)
            {
                string[] mode = searchString.Split("~*~");
                string[] strVal = mode[1].Split("~");

                brCode = strVal[0];
                batchNo = strVal[1];
                string tranNo = strVal[2];

                // For general batch, tran no generation
                switch (mode[0])
                {
                    case "GEN":
                        tranNos = strVal[3];
                        if (string.IsNullOrWhiteSpace(batchNo) && string.IsNullOrWhiteSpace(tranNo))
                        {
                            if (tranNos == "1")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                strtranno = await _databaseFactory.GetTranNo(brCode);
                            }
                            else if (tranNos == "2")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2;
                            }
                            else if (tranNos == "3")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno3 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2 + "~" + strtranno3;
                            }
                            else if (tranNos == "4")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno3 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno4 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2 + "~" + strtranno3 + "~" + strtranno4;
                            }
                            else if (tranNos == "5")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno3 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno4 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno5 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2 + "~" + strtranno3 + "~" + strtranno4 + "~" + strtranno5;
                            }
                            else if (tranNos == "6")
                            {
                                strbatchno = await _databaseFactory.GetBatchNo(brCode);
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno3 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno4 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno5 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno6 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2 + "~" + strtranno3 + "~" + strtranno4 + "~" + strtranno5 + "~" + strtranno6;
                            }
                        }
                        else if (!string.IsNullOrWhiteSpace(batchNo) && string.IsNullOrWhiteSpace(tranNo))
                        {
                            if (tranNos == "1")
                            {
                                strbatchno = batchNo;
                                strtranno = await _databaseFactory.GetTranNo(brCode);
                            }
                            else if (tranNos == "2")
                            {
                                strbatchno = batchNo;
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2;
                            }
                            else if (tranNos == "2")
                            {
                                strbatchno = batchNo;
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno3 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2 + "~" + strtranno3;
                            }
                            else if (tranNos == "2")
                            {
                                strbatchno = batchNo;
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno3 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno4 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2 + "~" + strtranno3 + "~" + strtranno4;
                            }
                            else if (tranNos == "2")
                            {
                                strbatchno = batchNo;
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno3 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno4 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno5 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2 + "~" + strtranno3 + "~" + strtranno4 + "~" + strtranno5;
                            }
                            else if (tranNos == "2")
                            {
                                strbatchno = batchNo;
                                string strtranno1 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno2 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno3 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno4 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno5 = await _databaseFactory.GetTranNo(brCode);
                                string strtranno6 = await _databaseFactory.GetTranNo(brCode);
                                strtranno = strtranno1 + "~" + strtranno2 + "~" + strtranno3 + "~" + strtranno4 + "~" + strtranno5 + "~" + strtranno6;
                            }
                        }
                        return strbatchno + "~" + strtranno;

                    // For clearing batch,tran no generation
                    case "CLG":
                        strVal = mode[1].Split("~");
                        brCode = strVal[7];
                        if (string.IsNullOrWhiteSpace(batchNo) && string.IsNullOrWhiteSpace(tranNo))
                        {
                            tranNos = strVal[6];
                            DataTable RecBatchNO = await _databaseFactory.SingleRecordSet("CLGINWARDINSTRUMENTDTLS", "BATCHNO", "upper(trim(branchcode))='" +
                                strVal[0] + "' and upper(trim(currencycode))='" + strVal[3] + "' and APPLICATIONDATE =to_date('" + strVal[5] + "','dd-mm-yyyy') and " +
                                "upper(trim(CLEARINGTYPE))='" + strVal[4] + "'");

                            if (RecBatchNO.Rows.Count > 0)
                                strbatchno = Conversions.ToString(RecBatchNO.Rows[0].ItemArray[0]) + "";
                            else
                                strtranno = await _databaseFactory.GetTranNo(brCode);
                        }
                        else if (string.IsNullOrWhiteSpace(batchNo) && string.IsNullOrWhiteSpace(tranNo))
                        {
                            strbatchno = batchNo;
                            strtranno = await _databaseFactory.GetTranNo(brCode);
                        }

                        return strbatchno + "~" + strtranno;
                }

                return string.Empty;
            }

            return string.Empty;
        }

        public async Task<string> InsertTempTransaction(string insertString = "")
        {
            string[,] ArrTrans = new string[1, 5];

            //ObjIns = server.CreateObject("GeneralTransactions.DBTransactions")

            if (insertString.Length > 0)
            {
                string[] strValue = insertString.Split("~*~");

                string mode = strValue[0];
                string FlxRowNo = strValue[1];

                switch (mode)
                {
                    case "GEN":
                        string strFldNms = "BATCHNO,TRANNO,GLCODE,GLDESC,ACCNO,NAME,AMOUNT,ENTEREDTIMEBAL,APPLICATIONDATE,CUSTOMERID,MODEOFTRAN,MODEOFTRANDESC,ABBAPPLICATIONDATE," +
                            "TRANSTATUS,CURRENCYCODE,USERID,MACHINEID,MODULEID,BRANCHCODE,TOKENNO,REMARKS,CHQSERIESNO,CHQNO,CHQDATE,CHQFVG,SYSTEMGENERATEDYN,MODULEDESC,EFFECTIVEDATE," +
                            "CLGRATETYPE,RATE,FCURRENCYCODE,FAMOUNT,LINKMODULEID,LINKMODULEDESC,LINKGLCODE,LINKGLDESC,LINKACCTYPE,LINKACCNO,LINKACCNAME,SERVICEID,SERVICEDESC," +
                            "RESPONDINGBRANCHCODE,RESPONDINGBRANCHDESC,RESPONDINGSECTIONCODE,RESPONDINGSECTIONDESC,ABBBRANCHCODE,BRANCHNARRATION,DISPOSALBATCHNO,DISPOSALTRANNO," +
                            "ACCOUNTCHECKYN,EXCEPTIONYN,EXCEPTIONCODES,respondingbankcode,respondingbankdesc,STANDINSTRYN,COUNTERNO,CASHIERID,SCROLLNO,RATEREFCODE,RATEREFDESC,C61,C62," +
                            "C63,C64,C65,C66,C67,C68,C69,C70,C71,C72,C73,C74,C75,C76,C77,C78,C79,C80,C81,C82,C83,C84,C85,C86,C87,C88,C89,C90,C91,C92,C93,C94,C95,C96,C97,C98,C99,C100,abbyn";

                        string strValues = strValue[3];
                        string NoOfRows = strValue[4];
                        ArrTrans[0, 0] = "I";
                        ArrTrans[0, 1] = "GENTEMPTRANSLOG";  // Passing the table name
                        ArrTrans[0, 2] = strFldNms;          // Passing Columns
                        ArrTrans[0, 3] = strValues;          // Passing Values
                        ArrTrans[0, 4] = "";

                        // If the transaction belongs to disposal
                        string dispValues = strValue[2];
                        if (dispValues != "")
                        {
                            string[] strvalueD = dispValues.Split("~");
                            string batchNo = strvalueD[0];
                            string tranNo = strvalueD[1];
                            string brCode = strvalueD[2];
                            string crCode = strvalueD[3];
                            string dispBatchNo = strvalueD[4];
                            string dispTranNo = strvalueD[5];
                            string Moduleid = strvalueD[6];

                            string strfldnmsD = "batchno,tranno";
                            string strvaluesD = "'" + batchNo!.Trim() + "'~'" + tranNo!.Trim() + "'";
                            string strWhrCondD = "upper(branchcode)='" + brCode + "' and upper(currencycode)='" + crCode + "' and upper(disposalBatchno)='" + dispBatchNo + 
                                "' and upper(disposaltranNo)='" + dispTranNo + "'";

                            ArrTrans[1, 0] = "U";

                            if (Moduleid != "SI")
                                ArrTrans[1, 1] = "GENDISPOSALDTLSTEMP";  // Passing the table name
                            else
                                ArrTrans[1, 1] = "SIDISPOSALDTLS";  // Passing the table name

                            ArrTrans[1, 2] = strfldnmsD;             // Passing columns
                            ArrTrans[1, 3] = strvaluesD;             // Passing values
                            ArrTrans[1, 4] = strWhrCondD;            // Passing where condition
                        }
                        
                        return await _databaseFactory.ProcessDataTransactions(ArrTrans);
                }
            }

            return string.Empty;
        }
    }
}
