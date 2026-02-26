using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Data;

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

        public async Task<TransferTransactionModel> Get(ISession session, TransferTransactionModel model)
        {
            model.Branch = session.GetString(SessionConstants.BranchCode);
            model.BranchList = await _transactionalService.GetBranchCodesByUserId(session.GetString(SessionConstants.UserId));

            if (string.IsNullOrWhiteSpace(model.TransactionMode.ToString()))
                model.TransactionMode = TransactionModes.Debit;

            model.ServiceList = await _listService.GetServiceList(model.TransactionMode.ToString());
            model.ModuleList = await _listService.GetModuleList();

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
            string strcts, impYnDay, impYnWek, DayLmt, WekLmt, strDepCertificate, cmod, cgl, cacc, cgldes, caccnam, smod, sgl, sacc, sgldes, saccnm, csmod,
                csgl, csacc, csgldes, csaccnm, strcgstmoddesc, strsgstmoddesc, strcessmoddesc, srpos, pBr, pBrCode, srgtp, srgst, ovrdrft, CshType, Rfldnms,
                RwhrCond, RecYN, TPayYN, TRecYN, vPrec, cntrStatus, vTotAmt, vModDir;

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
                impYnDay = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                DayLmt = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GENCONFIGMST", "NVL(IMPYN,'N') imp", "CODE='ABBCLGYN'");

            if (dataTable.Rows.Count > 0)
            {
                model.Hidden_impClgYN = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
            }

            BankingExtensions.ReleaseMemory(dataTable);

            dataTable = await _databaseFactory.SingleRecordSet("GENCONFIGMST", "IMPYN,VALUE1", "CODE='WEKLMT'");

            if (dataTable.Rows.Count > 0)
            {
                impYnWek = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
                WekLmt = Conversions.ToString(dataTable.Rows[0].ItemArray[1]);
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
                srpos = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
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
                srgtp = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
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
                ovrdrft = Conversions.ToString(dataTable.Rows[0].ItemArray[0]);
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

            model.CashierId = session.GetString("userid");
            vPrec = session.GetString("precision");

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
                            vTotAmt = Conversions.ToString(dataTable.Rows[0]["TotAmt"]);
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

            return model;
        }
    }
}
