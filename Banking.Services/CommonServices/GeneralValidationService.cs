using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Microsoft.Extensions.Options;
using System.Data;

namespace Banking.Services
{
    public class GeneralValidationService : IGeneralValidationService
    {
        private int intDivPer;
        private double dblNoOfDaysPerYear;
        private double Intamt;
        private double PrincipalAmount;
        private double RemainingDays;
        private double NewROI;
        private double InMonths;
        private string DateTill = string.Empty;
        private string Tilldate = string.Empty;
        private string BreakDate = string.Empty;
        private string strCompoundType = string.Empty;

        private readonly IDatabaseService _databaseFactory;

        #region Validations

        public GeneralValidationService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        public async Task<string> GetHOTRALWBrCode()
        {
            string GetHOTRALWBrCodeRet = string.Empty;
            try
            {
                string strBrcode = "101";

                DataTable objDrcust;

                // objDrcust = await _databaseFactory.SingleRecordSet("GENCONFIGMST", "branchcode", "impyn = 'Y' and code = 'HOTRAW'");
                objDrcust = await _databaseFactory.ProcessQueryAsync("SELECT branchcode FROM GENCONFIGMST WHERE impyn = 'Y' and code = 'HOTRAW'");

                strBrcode = (objDrcust.Rows.Count > 0) ? Convert.ToString(objDrcust.Rows[0]["branchcode"]) ?? string.Empty : "101";

                GetHOTRALWBrCodeRet = strBrcode;
            }
            catch (Exception ex)
            {
                // Log Error
                GetHOTRALWBrCodeRet = "101";
            }

            return GetHOTRALWBrCodeRet;
        }

        public async Task<string> GetDebitCreditByYealrly(string branchCode, string moduleId, string glCode, string accountNo, string appDate)
        {
            string fromdate;
            string Todate;
            string debitBalance = "0";
            string creditBalance = "0";
            string maxAmount = "0";

            try
            {
                string[] vb = GetFinancialYear(appDate).Split("-");

                fromdate = "1-APR-" + vb[0];
                Todate = "31-MAR-" + vb[1];

                string strSqlQuery = "SELECT (SELECT NVL(SUM(AMOUNT),0) FROM " + moduleId + "TRAN WHERE modeoftran=1 AND BRANCHCODE='" + branchCode + 
                    "'" + " AND MODULEID='" + moduleId + "' AND GLCODE='" + glCode + "' AND ACCNO='" + accountNo + "'" + " AND APPLICATIONDATE BETWEEN '" + fromdate + 
                    "' AND '" + Todate + "') AS DR " + "," + "(" + "SELECT NVL(SUM(AMOUNT),0) " + " FROM " + moduleId + "TRAN WHERE modeoftran=2 AND BRANCHCODE='" + 
                    branchCode + "' AND MODULEID='" + moduleId + "' AND GLCODE='" + glCode + "'" + " AND ACCNO='" + accountNo + "'" + " AND APPLICATIONDATE BETWEEN '" + 
                    fromdate + "' AND '" + Todate + "') AS CR," + "(" + " SELECT NVL(SUM(AMOUNT),0) FROM " + moduleId + "TRANDAY WHERE modeoftran=1 AND BRANCHCODE='" + 
                    branchCode + "'" + " AND MODULEID='" + moduleId + "' AND GLCODE='" + glCode + "' AND ACCNO='" + accountNo + "' " + " AND APPLICATIONDATE BETWEEN '" + 
                    fromdate + "' AND '" + Todate + "') AS DRDAY " + "," + "(" + "SELECT NVL(SUM(AMOUNT),0) " + " FROM " + moduleId + 
                    "TRANDAY WHERE modeoftran=2 AND BRANCHCODE='" + branchCode + "' AND MODULEID='" + moduleId + "' AND GLCODE='" + glCode + "'" + " AND ACCNO='" + accountNo + 
                    "'" + " AND APPLICATIONDATE BETWEEN '" + fromdate + "' AND '" + Todate + "') AS CRDAY," + " TO_NUMBER(VALUE1) AS MAXAMOUNT" + 
                    " FROM GENCONFIGMST WHERE CODE='CTR'";

                DataTable result = await _databaseFactory.ProcessQueryAsync(strSqlQuery);

                if (!Convert.IsDBNull(result.Rows[0]["DR"]))
                {
                    debitBalance = (Convert.ToDecimal(result.Rows[0]["DR"]) + Convert.ToDecimal(result.Rows[0]["DRDAY"])).ToString();
                }

                if (!Convert.IsDBNull(result.Rows[0]["CR"]))
                {
                    creditBalance = (Convert.ToDecimal(result.Rows[0]["CR"]) + Convert.ToDecimal(result.Rows[0]["CRDAY"])).ToString();
                }

                if (!Convert.IsDBNull(result.Rows[0]["MAXAMOUNT"]))
                {
                    maxAmount = Convert.ToString(result.Rows[0]["MAXAMOUNT"]) ?? "0";
                }

                return debitBalance + "|" + creditBalance + "|" + maxAmount;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        public async Task<string> GetExcIntRevFrmDepIntAccDtls(string br, string cr, string gl, string acc, string frmdate, string todate)
        {
            string strSql, GetExcIntRevFrmDepIntAccDtlsRet = string.Empty;
            double dbldepaccrintexcessamount = 0d;

            try
            {
                strSql = "SELECT SUM(ABS(INTAMOUNT)) INTAMOUNT FROM DEPINTACCRUEDDTLS WHERE  ACCNO = '" + acc + 
                    "' AND GLCODE = '" + gl + "' AND INTAMOUNT < 0 AND MODULEID = 'DEP' AND (REMARKS LIKE 'Excess Interest Adjusted%' " +
                    "OR REMARKS LIKE 'Excess Int Reverse%'  OR REMARKS LIKE 'Excess Int Rev To GL%') AND APPLICATIONDATE  BETWEEN '" + 
                    string.Format("dd-MMM-yyyy", Convert.ToDateTime(frmdate)) + "' AND '" + string.Format("dd-MMM-yyyy", Convert.ToDateTime(todate)) + 
                    "' AND BRANCHCODE = '" + br + "' AND currencycode = '" + cr + "'";

                DataTable rsdepintaccr = await _databaseFactory.ProcessQueryAsync(strSql);

                if (rsdepintaccr.Rows.Count > 0)
                {
                    if (rsdepintaccr.Rows[0]["INTAMOUNT"] is DBNull)
                    {
                        dbldepaccrintexcessamount = 0d;
                    }
                    else
                    {
                        dbldepaccrintexcessamount = Convert.ToDouble(rsdepintaccr.Rows[0]["INTAMOUNT"]);
                    }

                }

                GetExcIntRevFrmDepIntAccDtlsRet = dbldepaccrintexcessamount.ToString();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return GetExcIntRevFrmDepIntAccDtlsRet;
        }

        public async Task<string> GetSystemDate()
        {
            string getSystemDateRet = string.Empty, strsystemdate = string.Empty;
            string sQuery;

            try
            {
                sQuery = "select to_char(sysdate,'dd-Mon-yyyy') sysdate1 from dual";

                DataTable objDrcust = await _databaseFactory.ProcessQueryAsync(sQuery);

                if (objDrcust.Rows.Count > 0)
                {
                    strsystemdate = Convert.IsDBNull(objDrcust.Rows[0]["sysdate1"]) ? "" : Convert.ToString(objDrcust.Rows[0]["sysdate1"]) ?? string.Empty;
                }

                getSystemDateRet = strsystemdate;
            }
            catch (Exception ex)
            {
                getSystemDateRet = string.Format("dd-MMM-yyyy", DateTime.Now);
            }

            return getSystemDateRet;
        }

        public async Task<string> GetDepCertificateNameWOconn()
        {
            string GetDepCertificateNameWOconnRet = string.Empty;

            string sQuery;

            try
            {
                string strDepCertName1 = "";

                sQuery = "select depcertificate from genbankparm";

                DataTable objDrcust = await _databaseFactory.ProcessQueryAsync(sQuery);

                if (objDrcust.Rows.Count > 0)
                {
                    strDepCertName1 = Convert.IsDBNull(objDrcust.Rows[0]["depcertificate"]) ? string.Empty : Convert.ToString(objDrcust.Rows[0]["depcertificate"]) ?? string.Empty;
                }

                GetDepCertificateNameWOconnRet = strDepCertName1;
            }
            catch (Exception ex)
            {
                GetDepCertificateNameWOconnRet = "MAHARAJA";
            }
            return GetDepCertificateNameWOconnRet;
        }

        public async Task<string> GetAnyDayBalance(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, DateTime TranDate)
        {
            string strQuery;
            double dblAnyDayBal = 0d, dblCCLmt = 0d;

            strQuery = "select GETANYDAYBAL('" + BrCode + "'," + " '" + CrCode + "' ,'" + ModId + "'," + " '" + GlCode + "','" + accountNo + "'," + " '" + 
                string.Format("dd-MMM-yyyy", TranDate) + "') from dual";

            DataTable result = await _databaseFactory.ProcessQueryAsync(strQuery);

            dblAnyDayBal = Convert.ToDouble(result.Rows[0].ItemArray[0]);

            if (ModId == "CC")
            {
                strQuery = "SELECT LINKEDAMOUNT FROM GENLIMITLNK WHERE LINKEDACCNO='" + accountNo + "' AND LINKEDGLCODE='" + GlCode + "' AND LINKEDMODULEID='" + ModId + "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CrCode + "' AND STATUS='R'";

                result = await _databaseFactory.ProcessQueryAsync(strQuery);

                dblCCLmt = Convert.ToDouble(result.Rows[0].ItemArray[0]);

                dblAnyDayBal = dblAnyDayBal + dblCCLmt;
            }

            return Convert.ToString(dblAnyDayBal);
        }

        public async Task<string> GetAnyDayBalanceAppr(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, DateTime TranDate)
        {
            string strQuery;
            double dblAnyDayBal = 0d;

            strQuery = "select GetanydaybalAppr('" + BrCode + "'," + " '" + CrCode + "' ,'" + ModId + "'," + " '" + GlCode + "','" + accountNo + "'," + 
                " '" + string.Format("dd-MMM-yyyy", TranDate) + "') from dual";

            DataTable result = await _databaseFactory.ProcessQueryAsync(strQuery);

            dblAnyDayBal = Convert.ToDouble(result.Rows[0].ItemArray[0]);

            return Convert.ToString(dblAnyDayBal);
        }

        public async Task<string> GetMinAmountBalMst(string CrCode, string ModId, string GlCode)
        {
            string strQuery;
            double dblMinAmt = 0d;
            string GetMinAmountBalMstRet = string.Empty;

            try
            {
                strQuery = "SELECT MINAMOUNT FROM genminmaxbalancemst WHERE glcode = '" + GlCode + "' AND  moduleid = '" + ModId + 
                    "' AND currencycode = '" + CrCode + "' AND categorycode = '99'";

                DataTable result = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (result.Rows.Count > 0)
                {
                    dblMinAmt = Convert.IsDBNull(result.Rows[0]["MINAMOUNT"]) ? 0 : Convert.ToDouble(result.Rows[0]["MINAMOUNT"]);
                }

                GetMinAmountBalMstRet = Convert.ToString(dblMinAmt);
            }
            catch (Exception ex)
            {
                GetMinAmountBalMstRet = Convert.ToString(dblMinAmt);
            }

            return GetMinAmountBalMstRet;
        }

        public async Task GetAnyDayBalanceCC(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, DateTime TranDate, double pdblAnyDayBal, 
            double pdbllimitamt, string strError)
        {
            double dblAnyDayBal = 0d;
            string strQuery;

            try
            {
                strQuery = "select GETANYDAYBAL('" + BrCode + "'," + " '" + CrCode + "' ,'" + ModId + "'," + " '" + GlCode + "','" + accountNo + "'," + 
                    " '" + string.Format("dd-MMM-yyyy", TranDate) + "') from dual";

                DataTable result = await _databaseFactory.ProcessQueryAsync(strQuery);

                dblAnyDayBal = Convert.ToDouble(result.Rows[0].ItemArray[0]);

                double dbllimitamt = 0d;
                DataTable rstod;

                double dbltodlimitamt = 0d;
                string strSql;
                DataTable objDr;

                strSql = " select Sum(nvl(LINKEDAMOUNT,0)) AMOUNT from GENLIMITLNK where LINKEDACCNO='" + accountNo + "' and LINKEDGLCODE='" + GlCode + 
                    "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='INR' AND LINKEDMODULEID='" + ModId + "'   and closedate is null and status='R' ";

                objDr = await _databaseFactory.ProcessQueryAsync(strSql);

                if (objDr.Rows.Count > 0)
                    dbllimitamt = Convert.IsDBNull(objDr.Rows[0]["AMOUNT"]) ? 0 : Convert.ToDouble(objDr.Rows[0]["AMOUNT"]);

                strSql = "SELECT NVL(TODLIMITAMT,0) TODLIMITAMT FROM genlimitlnk WHERE LINKEDACCNO = '" + accountNo + "' AND LINKEDGLCODE='" + GlCode + 
                    "' AND  LINKEDMODULEID='" + ModId + "' AND BRANCHCODE= '" + BrCode + "' AND CURRENCYCODE='INR' AND TODEXPDATE >= '" + 
                    string.Format("dd-MMM-yyyy", TranDate) + "' AND TODEXPDATE IS NOT NULL ";

                rstod = await _databaseFactory.ProcessQueryAsync(strSql);

                if (rstod.Rows.Count > 0)
                    dbltodlimitamt = Convert.IsDBNull(rstod.Rows[0]["TODLIMITAMT"]) ? 0 : Convert.ToDouble(rstod.Rows[0]["TODLIMITAMT"]);
                else
                    dbltodlimitamt = 0d;

                pdblAnyDayBal = dblAnyDayBal;
                pdbllimitamt = dbllimitamt + dbltodlimitamt;
                return;
            }
            catch (Exception ex)
            {
                strError = ex.Message;
                pdblAnyDayBal = 0d;
                pdbllimitamt = 0d;
            }
        }

        public async Task GetAnyDayBalanceCCAppr(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, DateTime TranDate, double pdblAnyDayBal, 
            double pdbllimitamt, string strError)
        {
            string errmsg, strQuery;
            double dblAnyDayBal = 0d;

            try
            {
                strQuery = "select GetanydaybalAppr('" + BrCode + "'," + " '" + CrCode + "' ,'" + ModId + "'," + " '" + GlCode + "','" + accountNo + "'," + 
                    " '" + string.Format("dd-MMM-yyyy", TranDate) + "') from dual";

                DataTable objCmd = await _databaseFactory.ProcessQueryAsync(strQuery);

                dblAnyDayBal = Convert.ToDouble(objCmd.Rows[0].ItemArray[0]);

                double dbllimitamt = 0d;
                DataTable rstod;

                double dbltodlimitamt = 0d;
                string strSql;

                strSql = " select Sum(nvl(LINKEDAMOUNT,0)) AMOUNT from GENLIMITLNK where LINKEDACCNO='" + accountNo + "' and LINKEDGLCODE='" + GlCode + 
                    "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='INR' AND LINKEDMODULEID='" + ModId + "'   and closedate is null and status='R' ";

                objCmd = await _databaseFactory.ProcessQueryAsync(strSql);

                if (objCmd.Rows.Count > 0)
                {
                    dbllimitamt = Convert.IsDBNull(objCmd.Rows[0]["AMOUNT"]) ? 0 : Convert.ToDouble(objCmd.Rows[0]["AMOUNT"]);
                }

                strSql = "SELECT NVL(TODLIMITAMT,0) TODLIMITAMT FROM genlimitlnk WHERE LINKEDACCNO = '" + accountNo + "' AND LINKEDGLCODE='" + GlCode + 
                    "' AND  LINKEDMODULEID='" + ModId + "' AND BRANCHCODE= '" + BrCode + "' AND CURRENCYCODE='INR' AND TODEXPDATE >= '" + 
                    string.Format("dd-MMM-yyyy", TranDate) + "' AND TODEXPDATE IS NOT NULL ";

                rstod = await _databaseFactory.ProcessQueryAsync(strSql);

                if (rstod.Rows.Count > 0)
                    dbltodlimitamt = Convert.IsDBNull(objCmd.Rows[0]["TODLIMITAMT"]) ? 0 : Convert.ToDouble(objCmd.Rows[0]["TODLIMITAMT"]);
                else
                    dbltodlimitamt = 0d;

                pdblAnyDayBal = dblAnyDayBal;
                pdbllimitamt = dbllimitamt + dbltodlimitamt;
                return;
            }
            catch (Exception ex)
            {
                strError = ex.Message;
                pdblAnyDayBal = 0d;
                pdbllimitamt = 0d;
            }
        }

        public async Task<string> GetRefno()
        {
            string GetRefnoRet = string.Empty;

            try
            {
                string strSql1, strRefno = string.Empty;

                strSql1 = "SELECT (SELECT H2Hbankname FROM GENBANKPARM)||TO_CHAR(SYSDATE,'yymmdd')||x.refno  refno FROM (SELECT " +
                    "LPAD(NVL(MAX(SUBSTR(refno,11,6)),0)+1,6,'0') refno FROM neftrtgsdtls WHERE TO_NUMBER(SUBSTR(refno,5,6)) = TO_NUMBER(TO_CHAR(SYSDATE,'yymmdd'))) x";

                DataTable result = await _databaseFactory.ProcessQueryAsync(strSql1);

                if (result.Rows.Count > 0)
                {
                    strRefno = Convert.IsDBNull(result.Rows[0]["refno"]) ? string.Empty : Convert.ToString(result.Rows[0]["refno"]) ?? string.Empty;
                }

                GetRefnoRet = strRefno;
            }
            catch (Exception ex)
            {
                string returnMsg = ex.Message;
                if (returnMsg.Trim().Length > 0)
                {
                    returnMsg = returnMsg.Replace("\n", " ").Replace("\r", " ");
                }
            }

            return GetRefnoRet;
        }

        public async Task<string> GetRefnoWithOutTrans()
        {
            string GetRefnoWithOutTransRet = string.Empty;

            try
            {
                DataTable dr;
                DataTable objDrcust;
                string strQuery, strRefno = "";

                strQuery = "SELECT (SELECT H2Hbankname FROM GENBANKPARM)||TO_CHAR(SYSDATE,'yymmdd')||x.refno  refno FROM " +
                    "(SELECT LPAD(NVL(MAX(SUBSTR(refno,11,6)),0)+1,6,'0') refno FROM neftrtgsdtls WHERE TO_NUMBER(SUBSTR(refno,5,6)) = " +
                    "TO_NUMBER(TO_CHAR(SYSDATE,'yymmdd'))) x";

                objDrcust = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (objDrcust.Rows.Count > 0)
                {
                    strRefno = Convert.IsDBNull(objDrcust.Rows[0]["refno"]) ? "" : Convert.ToString(objDrcust.Rows[0]["refno"]) ?? string.Empty;
                }

                GetRefnoWithOutTransRet = strRefno;
                return GetRefnoWithOutTransRet;
            }
            catch (Exception ex)
            {
                GetRefnoWithOutTransRet = ex.Message;
            }

            return GetRefnoWithOutTransRet;
        }

        public async Task<string> GetCustMobileNo(string BrCode, string CrCode, string ModId, string GlCode, string accountNo)
        {
            DataTable dr;
            string GetCustMobileNoRet = string.Empty, strQuery;

            try
            {
                strQuery = "select custmobile from gencustinfomst where customerid = " + " (select DISTINCT customerid from " + ModId + "mst where " + 
                    " accno = '" + accountNo + "'  and glcode='" + GlCode + "'" + " and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "')";

                dr = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (dr.Rows.Count > 0)
                {
                    GetCustMobileNoRet = Convert.IsDBNull(dr.Rows[0]["custmobile"]) ? "" : Convert.ToString(dr.Rows[0]["custmobile"]) ?? string.Empty;
                }
                else
                {
                    GetCustMobileNoRet = "";
                }

                dr = null!;
            }
            catch (Exception ex)
            {
                GetCustMobileNoRet = "";
            }

            return GetCustMobileNoRet;
        }

        public async Task GetCustomerIDName(string BrCode, string CrCode, string ModId, string GlCode, string accountNo)
        {
            DataTable dr;
            string strQuery;
            string strCustomerID, strName;

            try
            {
                strQuery = "select DISTINCT customerid customerid,name from " + ModId + "mst where " + " accno = '" + accountNo + "'  and glcode='" + GlCode + 
                    "'" + " and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "'";

                dr = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (dr.Rows.Count > 0)
                {
                    strCustomerID = Convert.IsDBNull(dr.Rows[0][""]) ? "" : Convert.ToString(dr.Rows[0]["customerid"]) ?? string.Empty;
                    strName = Convert.IsDBNull(dr.Rows[0]["name"]) ? "" : Convert.ToString(dr.Rows[0]["name"]) ?? string.Empty;
                }
                else
                {
                    strCustomerID = "";
                    strName = "";
                }

                dr = null!;
            }
            catch (Exception ex)
            {
                strCustomerID = "1111111111";
                strName = "";
            }
        }

        public async Task<string> GetCloseBal(string BrCode, string CrCode, string ModId, string GlCode, string accountNo)
        {
            DataTable dr;
            string GetCloseBalRet = string.Empty, strQuery;
            
            try
            {
                strQuery = "select sum(nvl(closebal,0)) closebal from (select curbal closebal from " + ModId + "balance where  accno = '" + accountNo + 
                    "' and glcode='" + GlCode + "' and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "'" + " union all " + 
                    " select sum(nvl(amount,0)) closebal from " + ModId + "tranday where accno = '" + accountNo + "'  and glcode='" + GlCode + 
                    "' and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "')";

                dr = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (dr.Rows.Count > 0)
                {
                    GetCloseBalRet = Convert.IsDBNull(dr.Rows[0]["closebal"]) ? "0" : Convert.ToString(dr.Rows[0]["closebal"]) ?? string.Empty;
                }
                else
                {
                    GetCloseBalRet = "";
                }

                dr = null!;

                return GetCloseBalRet;
            }
            catch (Exception ex)
            {
                GetCloseBalRet = "";
            }

            return GetCloseBalRet;
        }

        public async Task<string> GetNFTSCONVYN()
        {
            DataTable dr;
            string strQuery, GetNFTSCONVYNRet = string.Empty, strNFTSCONVYN = "";

            try
            {
                strQuery = "select NFTSCONVYN from genbankparm";

                dr = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (dr.Rows.Count > 0)
                {
                    strNFTSCONVYN = Convert.IsDBNull(dr.Rows[0]["NFTSCONVYN"]) ? "N" : Convert.ToString(dr.Rows[0]["NFTSCONVYN"]) ?? string.Empty;
                }
                else
                    strNFTSCONVYN = "N";

                GetNFTSCONVYNRet = strNFTSCONVYN;
            }
            catch (Exception ex)
            {
                GetNFTSCONVYNRet = "N";
            }

            return GetNFTSCONVYNRet;
        }

        // Get parameter details for feature
        public async Task<bool> GetParameterDetails(int intfeatcd1, string strmsgtags, string strcustmessage, string strtrantypeg, string strsmstypeg, 
            string strmode1, int intdays, string strschtype, DateTime dtschdate, double dblminamt)
        {
            DataTable dr;
            string strQuery;
            bool GetParameterDetailsRet = default;

            try
            {
                strmsgtags = "";
                strcustmessage = "";
                strtrantypeg = "";
                strsmstypeg = "";
                strmode1 = "";
                strschtype = "";
                intdays = 0;
                dblminamt = 0d;

                strQuery = "select nvl(m.messagetags,'') MESSAGETAGS, nvl(s.CUSTOMERMESSAGE,'') CUSTOMERMESSAGE, s.TRANTYPE, s.SMSTYPE,s.mode1,s.days,s.schtype,nvl(s.nextpushdate,s.schday) schday,s.minamt from smstypemst s , smsfeaturemst m   where s.featurecode = m.featurecode and m.activeyn = 'Y' and s.featurecode =" + intfeatcd1;

                dr = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (dr.Rows.Count > 0)
                {
                    strmsgtags = Convert.ToString(dr.Rows[0]["MESSAGETAGS"]) ?? string.Empty;
                    strcustmessage = Convert.ToString(dr.Rows[0]["CUSTOMERMESSAGE"]) ?? string.Empty;
                    strtrantypeg = Convert.ToString(dr.Rows[0]["TRANTYPE"]) ?? string.Empty;

                    strsmstypeg = Convert.IsDBNull(dr.Rows[0]["SMSTYPE"]) ? "" : Convert.ToString(dr.Rows[0]["SMSTYPE"]) ?? string.Empty;
                    strmode1 = Convert.IsDBNull(dr.Rows[0]["mode1"]) ? "" : Convert.ToString(dr.Rows[0]["mode1"]) ?? string.Empty;
                    intdays = Convert.IsDBNull(dr.Rows[0]["days"]) ? 0 : Convert.ToInt32(dr.Rows[0]["days"]);
                    strschtype = Convert.IsDBNull(dr.Rows[0]["schtype"]) ? "" : Convert.ToString(dr.Rows[0]["schtype"]) ?? string.Empty;

                    if (!Convert.IsDBNull(dr.Rows[0]["schday"]))
                    {
                        dtschdate = Convert.ToDateTime(dr.Rows[0]["schday"]);
                    }

                    dblminamt = Convert.IsDBNull(dr.Rows[0]["minamt"]) ? 0 : Convert.ToDouble(dr.Rows[0]["minamt"]);

                    GetParameterDetailsRet = true;
                }
                else
                    GetParameterDetailsRet = false;
            }
            catch (Exception ex)
            {
                dr = null!;
            }
            return GetParameterDetailsRet;
        }

        public string GetSMSAccno(string NFTSCONVYN, string straccno)
        {
            string getSMSAccnoRet = string.Empty, strmodaccno = string.Empty;

            if (NFTSCONVYN == "N")
            {
                if (straccno.Length == 1)
                    strmodaccno = "XXXXX" + straccno;
                else if (straccno.Length == 2)
                    strmodaccno = "XXXX" + straccno;
                else if (straccno.Length == 3)
                    strmodaccno = "XXX" + straccno;
                else if (straccno.Length == 4)
                    strmodaccno = "XXX" + straccno.Substring(1, 3);
                else if (straccno.Length == 5)
                    strmodaccno = "XXX" + straccno.Substring(2, 3);
                else if (straccno.Length == 6)
                    strmodaccno = "XXX" + straccno.Substring(3, 3);
            }
            else if (NFTSCONVYN == "Y")
            {
                string straccno1;
                string straccnotrimst;
                straccno1 = straccno.Substring(9, 7);
                straccnotrimst = straccno1.TrimStart('0');

                if (straccnotrimst.Length == 1)
                    strmodaccno = "XXXXXX" + straccnotrimst;
                else if (straccnotrimst.Length == 2)
                    strmodaccno = "XXXXX" + straccnotrimst;
                else if (straccnotrimst.Length == 3)
                    strmodaccno = "XXXX" + straccnotrimst;
                else if (straccnotrimst.Length == 4)
                    strmodaccno = "XXXX" + straccnotrimst.Substring(1, 3);
                else if (straccnotrimst.Length == 5)
                    strmodaccno = "XXXX" + straccnotrimst.Substring(2, 3);
                else if (straccnotrimst.Length == 6)
                    strmodaccno = "XXXX" + straccnotrimst.Substring(3, 3);
                else if (straccnotrimst.Length == 7)
                    strmodaccno = "XXXX" + straccnotrimst.Substring(4, 3);
            }
            getSMSAccnoRet = strmodaccno;
            return getSMSAccnoRet;
        }

        public async Task<string> GetSMSBankName()
        {
            string GetSMSBankNameRet = string.Empty;
            string strQuery, strSMSBankName = "";
            DataTable dr;

            try
            {
                strQuery = "SELECT smsbankname FROM smsparameters";

                dr = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (dr.Rows.Count > 0)
                {
                    strSMSBankName = Convert.IsDBNull(dr.Rows[0]["smsbankname"]) ? "" : Convert.ToString(dr.Rows[0]["smsbankname"]) ?? string.Empty;
                }

                return GetSMSBankNameRet;
            }
            catch (Exception ex)
            {
                GetSMSBankNameRet = "";
            }

            return GetSMSBankNameRet;
        }

        public async Task<string> GetAccName(string strfullAccno)
        {
            string GetAccNameRet = string.Empty;

            try
            {
                string strfullaccno1, pstrBrId, pstrGlcd, NFTSCONVYN, pstrAccNo, pstrACTP;
                strfullaccno1 = strfullAccno.Length <= 16 ? strfullAccno : strfullAccno.Substring(strfullAccno.Length - 16);

                pstrBrId = strfullaccno1.Substring(0, 3);
                pstrGlcd = strfullaccno1.Substring(3, 6);

                // ' for accno 16 digits only
                NFTSCONVYN = await GetNFTSCONVYN();

                if (NFTSCONVYN == "Y")
                {
                    pstrAccNo = pstrBrId + pstrGlcd + strfullaccno1.Substring(9, 7);
                }
                else
                {
                    pstrAccNo = strfullaccno1.Substring(9, 7).TrimStart('0');
                }

                pstrACTP = await GetModuleID(pstrGlcd);

                DataTable recnfts;
                string strQuery, strAccName = string.Empty;

                strQuery = "select name from " + pstrACTP + "mst where " + " accno = '" + pstrAccNo + "'  and glcode='" + pstrGlcd + 
                    "'" + " and branchcode='" + pstrBrId + "'and currencycode = 'INR'";

                recnfts = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (recnfts.Rows.Count > 0)
                {
                    strAccName = Convert.IsDBNull(recnfts.Rows[0]["name"]) ? "" : Convert.ToString(recnfts.Rows[0]["name"]) ?? string.Empty;
                }

                GetAccNameRet = strAccName;
            }
            catch (Exception ex)
            {
                GetAccNameRet = "";
            }

            return GetAccNameRet;
        }

        public async Task<string> GetModuleID(string pstrGlcd)
        {
            string GetModuleIDRet = string.Empty;
            string pstrACTP = string.Empty;
            try
            {
                if (pstrGlcd == "102020")
                {
                    pstrACTP = "SB";
                }
                else if (pstrGlcd == "102030")
                {
                    pstrACTP = "CA";
                }
                else if (pstrGlcd.Substring(0, 3) == "104")
                {
                    pstrACTP = "DEP";
                }
                else if (pstrGlcd.Substring(0, 3) == "206")
                {
                    pstrACTP = await GetModuleIDCCLOAN(pstrGlcd);
                }
                GetModuleIDRet = pstrACTP;
            }
            catch (Exception ex)
            {

            }

            return GetModuleIDRet;
        }

        public async Task<string> GetModuleIDCCLOAN(string pglcode)
        {
            DataTable recnfts;
            string strSql, strError10, GetModuleIDCCLOANRet = string.Empty, strmodid = string.Empty;

            try
            {
                strSql = "select moduleid  from cctypemst where glcode = '" + pglcode + "' union select moduleid  from loantypemst where glcode = '" + pglcode + "'";

                recnfts = await _databaseFactory.ProcessQueryAsync(strSql);

                if (recnfts.Rows.Count > 0)
                {
                    strmodid = Convert.IsDBNull(recnfts.Rows[0]["moduleid"]) ? "" : Convert.ToString(recnfts.Rows[0]["moduleid"]) ?? string.Empty;
                }

                GetModuleIDCCLOANRet = strmodid;
                return GetModuleIDCCLOANRet;
            }
            catch (Exception ex)
            {
                GetModuleIDCCLOANRet = "";
                strError10 = ex.Message;
            }

            return GetModuleIDCCLOANRet;
        }

        public async Task<string> GetPanYN(string strcustid, string strtds, string pstrPAN206AAYN, string pstrPAN206ABYN)
        {
            try
            {
                return await GetPanYNDtls(strcustid, strtds, pstrPAN206AAYN, pstrPAN206ABYN);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetPanYN_Con(string strcustid, string strtds, string pstrPAN206AAYN, string pstrPAN206ABYN)
        {
            try
            {
                return await GetPanYNDtls(strcustid, strtds, pstrPAN206AAYN, pstrPAN206ABYN);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetTDSFlag(string BrCode, string CurCode, string DepGlcode, string DepAccNo)
        {
            try
            {
                return await GetTDSFlagDtls(BrCode, CurCode, DepGlcode, DepAccNo);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetTDSFlag_Con(string BrCode, string CurCode, string DepGlcode, string DepAccNo)
        {
            try
            {
                return await GetTDSFlagDtls(BrCode, CurCode, DepGlcode, DepAccNo);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetTDSFlagDtls(string BrCode, string CurCode, string DepGlcode, string DepAccNo)
        {
            DataTable recnfts1;
            string strSql, strtdsyn1 = string.Empty;

            strSql = "SELECT nvl(TDSYN,'N') TDSYN, nvl(EXMPFORMSRECYN,'N') EXMPFORMSRECYN , nvl(FORMS15G,'N') FORMS15G, nvl(NONTDS,'N') NONTDS FROM depmst " +
                "WHERE BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CurCode + "' AND GLCODE='" + DepGlcode + "' AND ACCNO='" + DepAccNo + "'";

            recnfts1 = await _databaseFactory.ProcessQueryAsync(strSql);

            if (recnfts1.Rows.Count > 0)
            {
                if (Convert.ToString(recnfts1.Rows[0]["NONTDS"]) == "Y")
                {
                    strtdsyn1 = "Non TDS";
                }
                else if (Convert.ToString(recnfts1.Rows[0]["TDSYN"]) == "Y")
                {
                    strtdsyn1 = "TDS";
                }
                else if (Convert.ToString(recnfts1.Rows[0]["EXMPFORMSRECYN"]) == "Y")
                {
                    strtdsyn1 = "Form 15H";
                }
                else if (Convert.ToString(recnfts1.Rows[0]["FORMS15G"]) == "Y")
                {
                    strtdsyn1 = "Form 15G";
                }
                else
                {
                    strtdsyn1 = "Non TDS";
                }
            }
            return strtdsyn1;
        }

        public async Task<string> GetTDSyn(string BrCode, string CurCode, string DepGlcode, string DepAccNo)
        {
            DataTable recnfts1;
            string GetTDSynRet = string.Empty, strSql;
            string strtdsyn1 = "", str15Hyn1 = "", str15Gyn1 = "";

            try
            {
                strSql = "SELECT nvl(tdsyn,'N') tdsyn,nvl(EXMPFORMSRECYN,'N') EXMPFORMSRECYN, nvl(FORMS15G,'N') FORMS15G FROM depmst WHERE BRANCHCODE='" + BrCode + 
                    "' AND CURRENCYCODE='" + CurCode + "' AND GLCODE='" + DepGlcode + "' AND ACCNO='" + DepAccNo + "'";

                recnfts1 = await _databaseFactory.ProcessQueryAsync(strSql);

                if (recnfts1.Rows.Count > 0)
                {
                    strtdsyn1 = Convert.ToString(recnfts1.Rows[0]["tdsyn"]) ?? string.Empty;
                    str15Hyn1 = Convert.ToString(recnfts1.Rows[0]["EXMPFORMSRECYN"]) ?? string.Empty;
                    str15Gyn1 = Convert.ToString(recnfts1.Rows[0]["FORMS15G"]) ?? string.Empty;

                    if (strtdsyn1 == "Y")
                        GetTDSynRet = "Y";
                    else if (str15Hyn1 == "Y")
                        GetTDSynRet = "Y";
                    else if (str15Gyn1 == "Y")
                        GetTDSynRet = "Y";
                    else
                        GetTDSynRet = "N";
                }

                recnfts1 = null!;
            }
            catch (Exception ex)
            {

            }

            return GetTDSynRet;
        }

        public async Task<string> GetLoginOTPYN()
        {
            DataTable recnfts1;
            string strSql, GetLoginOTPYNRet = string.Empty;

            strSql = "select loginotpyn from genbankparm";

            recnfts1 = await _databaseFactory.ProcessQueryAsync(strSql);

            if (recnfts1.Rows.Count > 0)
            {
                GetLoginOTPYNRet = Convert.IsDBNull(recnfts1.Rows[0]["loginotpyn"]) ? "N" : Convert.ToString(recnfts1.Rows[0]["loginotpyn"]) ?? string.Empty;
            }

            recnfts1 = null!;

            return GetLoginOTPYNRet;
        }

        public async Task<CKYCEnrollmentDateModel> GetCKYCEnrollDetails(string strkycenrolldate)
        {
            DataTable recnfts1;
            string strSql, strckycsno = string.Empty, strCKYCIDPERIOD = string.Empty;

            try
            {
                strSql = "SELECT NVL(MAX(sno),0) +1 sno  FROM CKYCENROLLDTLS";

                recnfts1 = await _databaseFactory.ProcessQueryAsync(strSql);

                if (recnfts1.Rows.Count > 0)
                {
                    strckycsno = Convert.IsDBNull(recnfts1.Rows[0]["sno"]) ? "0" : Convert.ToString(recnfts1.Rows[0]["sno"]) ?? string.Empty;
                }

                recnfts1 = null!;

                strSql = "select CKYCIDPERIOD from genbankparm";

                recnfts1 = await _databaseFactory.ProcessQueryAsync(strSql);

                if (recnfts1.Rows.Count > 0)
                {
                    strCKYCIDPERIOD = Convert.IsDBNull(recnfts1.Rows[0]["CKYCIDPERIOD"]) ? "0" : Convert.ToString(recnfts1.Rows[0]["CKYCIDPERIOD"]) ?? string.Empty;
                }

                recnfts1 = null!;

                var ckycModel = new CKYCEnrollmentDateModel();
                string pstrduedate = Convert.ToString(Convert.ToDateTime(strkycenrolldate).AddMonths(Convert.ToInt32(strCKYCIDPERIOD)));
                ckycModel.DueDate = string.Format("dd-MMM-yyyy", Convert.ToDateTime(pstrduedate));
                ckycModel.CKYCSno = strckycsno;

                return ckycModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<string> getCheckIMPSCycle(string strPrcsCode, string strTransAmt)
        {
            DataTable recnfts;
            string sumamount = string.Empty, limitamount = string.Empty;
            double dbllimitamt = 0d, dblamount = 0d, dblgentransamt = 0d;
            string strQuery, getCheckIMPSCycleRet = string.Empty, intfromtime = string.Empty, inttotime = string.Empty;

            try
            {
                if (strPrcsCode == "OUTWRD")
                {
                    strQuery = "SELECT fromtime,totime,limitamt FROM IMPSCYCLEDTLS  WHERE TO_CHAR(SYSDATE,'HH24Mi') BETWEEN fromtime AND totime AND " +
                        "effdate = (SELECT MAX(effdate) FROM IMPSCYCLEDTLS  WHERE TO_CHAR(SYSDATE,'HH24Mi') BETWEEN fromtime AND totime )";

                    recnfts = await _databaseFactory.ProcessQueryAsync(strQuery);

                    if (recnfts.Rows.Count > 0)
                    {
                        intfromtime = Convert.ToString(recnfts.Rows[0]["fromtime"]) ?? string.Empty;
                        inttotime = Convert.ToString(recnfts.Rows[0]["totime"]) ?? string.Empty;
                        dbllimitamt = Convert.ToDouble(recnfts.Rows[0]["limitamt"]);
                    }

                    recnfts = null!;

                    strQuery = "select sum(amount) amount from gentranslog where (remarks NOT LIKE 'IMPS Charges Inclusive GST Charges%' AND  trim(remarks) NOT LIKE 'Charges Inclusive GST Charges%') AND  SUBSTR(respondingbankcode,1,6) = 'OUTWRD' AND chqfvg = 'IMPS' AND moduleid != 'ATM'  AND modeoftran IN (1,3,5) AND TO_CHAR(systemdate,'HH24Mi') between '" + intfromtime + "' and '" + inttotime + "'";

                    recnfts = await _databaseFactory.ProcessQueryAsync(strQuery);

                    if (recnfts.Rows.Count > 0)
                    {
                        dblgentransamt = Convert.IsDBNull(recnfts.Rows[0]["amount"]) ? 0 : Convert.ToDouble(recnfts.Rows[0]["amount"]);
                    }

                    recnfts = null!;

                    dblamount = Math.Abs(dblgentransamt) + Convert.ToDouble(strTransAmt) / 100d;

                    if (dblamount > dbllimitamt)
                        getCheckIMPSCycleRet = "121";
                    else
                        getCheckIMPSCycleRet = "";
                }

                sumamount = dblamount.ToString();
                limitamount = dbllimitamt.ToString();
                return getCheckIMPSCycleRet;
            }
            catch (Exception ex)
            {
            }

            return getCheckIMPSCycleRet;
        }

        public async Task<string> getNEFTMobileFrm_bnkbrhmst(string strbrid)
        {
            DataTable recnfts;
            string getNEFTMobileFrm_bnkbrhmstRet = string.Empty, strQuery, strNEFTMobNo = "";

            try
            {
                strQuery = " select NEFTMOBILE from genbankbranchmst where branchcode = '" + strbrid + "'";

                recnfts = await _databaseFactory.ProcessQueryAsync(strQuery);

                if (recnfts.Rows.Count > 0)
                {
                    strNEFTMobNo = Convert.ToString(recnfts.Rows[0]["NEFTMOBILE"]) ?? string.Empty;
                }

                recnfts = null!;

                getNEFTMobileFrm_bnkbrhmstRet = strNEFTMobNo;
            }
            catch (Exception ex)
            {
                getNEFTMobileFrm_bnkbrhmstRet = "";
            }

            return getNEFTMobileFrm_bnkbrhmstRet;
        }

        public async Task<string> GetCCDrCrLienYN(string strBrCode, string strCurcode, string strModId, string strGlcode, string strAccno, DateTime TranDate)
        {
            DataTable rsneftAck;
            double dblDrLnAmt, dblCrLnAmt;
            string GetCCDrCrLienYNRet = string.Empty, strSql, strDrLnYN, strCrLnYN;

            try
            {
                if (strModId == "CC")
                {
                }
                else
                {
                }

                strSql = "SELECT DRLIENYN, CRLIENYN FROM " + strModId + "mst  WHERE branchcode ='" + strBrCode + "' AND " + " currencycode ='" + strCurcode + "' AND glcode ='" + strGlcode + "'  AND accno ='" + strAccno + "'";

                rsneftAck = await _databaseFactory.ProcessQueryAsync(strSql);

                if (rsneftAck.Rows.Count > 0)
                {
                    strDrLnYN = Convert.IsDBNull(rsneftAck.Rows[0]["DRLIENYN"]) ? "N" : Convert.ToString(rsneftAck.Rows[0]["DRLIENYN"]) ?? string.Empty;
                    strCrLnYN = Convert.IsDBNull(rsneftAck.Rows[0]["CRLIENYN"]) ? "N" : Convert.ToString(rsneftAck.Rows[0]["CRLIENYN"]) ?? string.Empty;
                }
                else
                {
                    strDrLnYN = "N";
                    strCrLnYN = "N";
                }

                rsneftAck = null!;

                strSql = "SELECT DRLIENAMT, CRLIENAMT FROM SBCALIENDTLS WHERE branchcode ='" + strBrCode + "' AND " + " currencycode ='" + strCurcode + "' AND glcode ='" + strGlcode + "'  AND accno ='" + strAccno + "'";

                rsneftAck = await _databaseFactory.ProcessQueryAsync(strSql);

                if (rsneftAck.Rows.Count > 0)
                {
                    dblDrLnAmt = Convert.IsDBNull(rsneftAck.Rows[0]["DRLIENAMT"]) ? 0 : Convert.ToDouble(rsneftAck.Rows[0]["DRLIENAMT"]);
                    dblCrLnAmt = Convert.IsDBNull(rsneftAck.Rows[0]["CRLIENAMT"]) ? 0 : Convert.ToDouble(rsneftAck.Rows[0]["CRLIENAMT"]);
                }
                else
                {
                    dblDrLnAmt = 0d;
                    dblCrLnAmt = 0d;
                }

                rsneftAck = null!;

                GetCCDrCrLienYNRet = strDrLnYN + "|" + dblDrLnAmt + "|" + strCrLnYN + "|" + dblCrLnAmt;

                return GetCCDrCrLienYNRet;

                //GetCCDrCrLienYNRet = "|||";
                //return GetCCDrCrLienYNRet;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetSBCADrCrLienYN(string strMode, string strBrCode, string strCurcode, string strModId, string strGlcode, string strAccno, 
            double TransAmt, DateTime TranDate)
        {
            DataTable rsneftAck;
            double dblDrLnAmt, dblCrLnAmt, dblAccBal, dblfinLeinLimAmt;
            string strDrCrLnYN, strSql, strDrLnYN, strCrLnYN, GetSBCADrCrLienYNRet = string.Empty, strAllowYN = string.Empty;

            try
            {
                if (strModId == "SB" | strModId == "CA")
                {
                }
                else
                {
                    // goto End1;
                }

                strSql = "select GETANYDAYBAL('" + strBrCode + "'," + " '" + strCurcode + "' ,'" + strModId + "'," + " '" + strGlcode + "','" +
                        strAccno + "'," + " '" + string.Format("dd-MMM-yyyy", TranDate) + "') bal from dual";

                rsneftAck = await _databaseFactory.ProcessQueryAsync(strSql);

                if (rsneftAck.Rows.Count > 0)
                {
                    dblAccBal = Convert.IsDBNull(rsneftAck.Rows[0]["bal"]) ? 0 : Convert.ToDouble(rsneftAck.Rows[0]["bal"]);
                }
                else
                {
                    dblAccBal = 0d;
                }

                rsneftAck = null!;

                strSql = "SELECT DRLIENYN, CRLIENYN FROM " + strModId + "mst  WHERE branchcode ='" + strBrCode + "' AND " + " currencycode ='" + strCurcode + 
                    "' AND glcode ='" + strGlcode + "'  AND accno ='" + strAccno + "'";

                rsneftAck = await _databaseFactory.ProcessQueryAsync(strSql);

                if (rsneftAck.Rows.Count > 0)
                {
                    strDrLnYN = Convert.IsDBNull(rsneftAck.Rows[0]["DRLIENYN"]) ? "N" : Convert.ToString(rsneftAck.Rows[0]["DRLIENYN"]) ?? string.Empty;
                    strCrLnYN = Convert.IsDBNull(rsneftAck.Rows[0]["CRLIENYN"]) ? "N" : Convert.ToString(rsneftAck.Rows[0]["CRLIENYN"]) ?? string.Empty;
                }
                else
                {
                    strDrLnYN = "N";
                    strCrLnYN = "N";
                }

                rsneftAck = null!;

                strSql = "SELECT DRLIENAMT, CRLIENAMT FROM SBCALIENDTLS WHERE branchcode ='" + strBrCode + "' AND " + " currencycode ='" + strCurcode + 
                    "' AND glcode ='" + strGlcode + "'  AND accno ='" + strAccno + "'";

                rsneftAck = await _databaseFactory.ProcessQueryAsync(strSql);

                if (rsneftAck.Rows.Count > 0)
                {
                    dblDrLnAmt = Convert.IsDBNull(rsneftAck.Rows[0]["DRLIENAMT"]) ? 0 : Convert.ToDouble(rsneftAck.Rows[0]["DRLIENAMT"]);
                    dblCrLnAmt = Convert.IsDBNull(rsneftAck.Rows[0]["CRLIENAMT"]) ? 0 : Convert.ToDouble(rsneftAck.Rows[0]["CRLIENAMT"]);
                }
                else
                {
                    dblDrLnAmt = 0d;
                    dblCrLnAmt = 0d;
                }

                rsneftAck = null!;

                if (strModId == "SB" | strModId == "CA")
                {
                    // for Debit lien yn
                    if (strMode == "Dr")
                    {
                        if (strDrLnYN == "Y")
                        {
                            if (dblAccBal - dblDrLnAmt >= TransAmt)
                                strAllowYN = "Y";
                            else
                                strAllowYN = "N";
                        }
                        else
                            strAllowYN = "Y";
                    }

                    // ' for Credit Lien YN
                    if (strMode == "Cr")
                    {
                        if (strCrLnYN == "Y")
                            strAllowYN = "N";
                        else
                            strAllowYN = "Y";
                    }

                    if (strMode == "Dr")
                    {
                        dblfinLeinLimAmt = dblDrLnAmt;
                        strDrCrLnYN = strDrLnYN;
                    }
                    else if (strMode == "Cr")
                    {
                        dblfinLeinLimAmt = dblCrLnAmt;
                        strDrCrLnYN = strCrLnYN;
                    }
                    else
                    {
                        dblfinLeinLimAmt = 0d;
                        strDrCrLnYN = "";
                    }
                } // strModId = "SB" Or strModId = "CA"

                GetSBCADrCrLienYNRet = strAllowYN;

                return GetSBCADrCrLienYNRet;

                //if (Strings.Len(o_Errmsg) == 0)
                //{
                //}
                //GetSBCADrCrLienYNRet = "Y";
                //return GetSBCADrCrLienYNRet;
            }
            catch (Exception ex)
            {
                GetSBCADrCrLienYNRet = "N";
            }

            return GetSBCADrCrLienYNRet;
        }

        #endregion

        #region Maturity Value Calculation

        public async Task<object> GetMaturityvalue(string Period, string EffDate, string MatDate, double Amount, string CompoundTerm, string InstalmentsYN, 
            double ROI, string strpremat = "0")
        {
            double GetMaturityvalueRet = 0d;
            int Monstr, Prd;
            string TERM;
            double DiffMonths, Year, Mon, Day, DblDays, Strperiod, NoOfQuarters, Factor;
            long lngdiffdays, lngdiffdays1;

            //int Chkstr;
            //string Strmsg;
            //public string ConnError; // error object
            //string ErrNum, errDesc, strComponent;
            //double Maturityvalue, , , i, SimIntDays;
            //object TotQuarters, intcount, RemainingDays, InMonths, Monstr, objdblink, ArrLink, objError, ArrError;
            //const bool blnDebug = true;

            try
            {
                dblNoOfDaysPerYear = 36500;
                if (string.IsNullOrEmpty(Period))
                {
                    if (string.IsNullOrEmpty(EffDate) | string.IsNullOrEmpty(MatDate))
                    {
                        throw new Exception("Error! Please send required parameters");
                    }
                }
                // Either two dates or period can be given as input for Mat value Calculation

                if (!string.IsNullOrEmpty(EffDate) & !string.IsNullOrEmpty(MatDate))
                {
                    Tilldate = Convert.ToString(Convert.ToDateTime(MatDate));
                    BreakDate = Convert.ToString(Convert.ToDateTime(EffDate));
                }

                if (!string.IsNullOrEmpty(Period))
                {
                    string[] prdDtls = Period.Split("|");
                    Year = Convert.ToDouble(Convert.ToString(prdDtls[0]).Trim());
                    Mon = Convert.ToDouble(Convert.ToString(prdDtls[1]).Trim());
                    Day = Convert.ToDouble(Convert.ToString(prdDtls[2]).Trim());
                    if (Year == default)
                        Year = 0d;
                    if (Mon == (double)default)
                        Mon = 0d;
                    if (Day == default)
                        Day = 0d;

                    if (InstalmentsYN == "N" & (string.IsNullOrEmpty(CompoundTerm) | CompoundTerm == "N"))
                    {
                        // Do Simple int calculation based on given periodicity
                        double dblTempInt;

                        dblTempInt = 0d;

                        if (Year > 0)
                            dblTempInt = Amount * Year * ROI / 100;

                        if (Mon > 0d)
                            dblTempInt = dblTempInt + Amount * Mon * ROI / 1200d;

                        if (Day > 0)
                            dblTempInt = dblTempInt + Amount * Day * ROI / 36500;

                        // Maturity value = Principal + calculated Interest
                        GetMaturityvalueRet = Amount + dblTempInt;

                        return GetMaturityvalueRet;
                    }

                    // If period is send as input then, breakDate is assumed as this date for reference only
                    BreakDate = Convert.ToString(Convert.ToDateTime("1-jan-2000"));
                    Tilldate = Convert.ToString(Convert.ToDateTime(BreakDate).AddYears(Convert.ToInt32(Year)));
                    Tilldate = Convert.ToString(Convert.ToDateTime(Tilldate).AddMonths(Convert.ToInt32(Mon)));
                    Tilldate = Convert.ToString(Convert.ToDateTime(Tilldate).AddDays(Day));
                    Tilldate = Convert.ToString(Convert.ToDateTime(Tilldate));
                }

                NewROI = ROI;
                PrincipalAmount = Amount;
                DblDays = BankingExtensions.DateDifference("D", Convert.ToDateTime(BreakDate), Convert.ToDateTime(Tilldate));
                DateTill = Convert.ToString(Convert.ToDateTime(BreakDate));
                DateTill = Convert.ToString(Convert.ToDateTime(DateTill));

                // Finding exact number of full months between two periods
                // For i = 1 To 1000
                // DateTill = DateAdd("M", 1, CDate(DateTill))
                // If CDate(DateTill) > CDate(Tilldate) Then
                // Exit For
                // End If
                // Count = Count + 1
                // Next
                // DiffMonths = Count

                // Original Code commented by Radhika on 31 Mar 2008
                // DiffMonths = Fix(DateDiff("M", BreakDate, Tilldate))
                
                DiffMonths = GetMonthsDiff(Convert.ToDateTime(BreakDate), Convert.ToDateTime(Tilldate));

                if (strpremat == "Y")
                {
                    lngdiffdays = BankingExtensions.DateDifference("D", Convert.ToDateTime(BreakDate), Convert.ToDateTime(Tilldate));
                    if (lngdiffdays < 365L)
                    {
                        lngdiffdays1 = BankingExtensions.DateDifference("D", Convert.ToDateTime(BreakDate), Convert.ToDateTime(Tilldate));

                        Strperiod = lngdiffdays1 / 365d;

                        PrincipalAmount = PrincipalAmount + PrincipalAmount * Strperiod * NewROI / 100d;
                        GetMaturityvalueRet = PrincipalAmount;
                        return GetMaturityvalueRet;
                    }
                }
                // Simple Int calc
                // If Compound term is null component calculates Simple Interest

                if (string.IsNullOrEmpty(CompoundTerm) & InstalmentsYN == "N" | CompoundTerm == "N" & InstalmentsYN == "N")
                {
                    Strperiod = DiffMonths / 12d;
                    BreakDate = Convert.ToString(Convert.ToDateTime(BreakDate).AddMonths(Convert.ToInt32(DiffMonths)));
                    RemainingDays = BankingExtensions.DateDifference("D", Convert.ToDateTime(BreakDate), Convert.ToDateTime(Tilldate));
                    if (Convert.ToBoolean(RemainingDays > 0)) //Operators.ConditionalCompareObjectGreater(RemainingDays, 0, false)))
                    {
                        Strperiod = Convert.ToDouble(Strperiod + Convert.ToString((double)RemainingDays / 365)); // Operators.AddObject(Strperiod, Operators.DivideObject(RemainingDays, 365)));
                    }
                    PrincipalAmount = PrincipalAmount + PrincipalAmount * Strperiod * NewROI / 100d;
                    GetMaturityvalueRet = PrincipalAmount;
                    return GetMaturityvalueRet;
                }

                // Simple Int Calc Ends

                if (InstalmentsYN == "Y")  // For Recurring Deposits
                {
                    GetMaturityvalueRet = await getRDMaturityValue(Convert.ToDateTime(MatDate), Convert.ToDateTime(EffDate), Amount, (float)ROI);
                }
                else
                {
                    // Compound Int Calc Starts
                    switch (CompoundTerm ?? "")
                    {
                        case "Q":    // Quarterly
                        {
                            if (DiffMonths >= 3d)
                            {
                                NoOfQuarters = DiffMonths / 3d;
                                Factor = 0.0025d;
                                TERM = "Q";
                                Prd = 1;
                                CompCalculation(Factor, NoOfQuarters, TERM, Prd);
                                GetMaturityvalueRet = PrincipalAmount;
                            }
                            else
                            {
                                // GetMaturityvalue = "Error  ! Period does not satisfy one Quarter"
                                PrincipalAmount = PrincipalAmount + PrincipalAmount * DblDays * NewROI / 36500d;
                                GetMaturityvalueRet = Math.Round(PrincipalAmount);
                            }

                            break;
                        }
                        case "M":    // Monthly
                        {
                            if (DiffMonths >= 1d)
                            {
                                NoOfQuarters = DiffMonths;
                                Factor = 1d / 1200d;
                                TERM = "M";
                                Prd = 1;
                                CompCalculation(Factor, NoOfQuarters, TERM, Prd);
                                GetMaturityvalueRet = PrincipalAmount;
                            }
                            else
                            {
                                // GetMaturityvalue = "Error  ! Period does not satisfy one Month"
                                PrincipalAmount = PrincipalAmount + PrincipalAmount * DblDays * NewROI / 36500d;
                                GetMaturityvalueRet = Math.Round(PrincipalAmount);
                            }

                            break;
                        }
                        case "H":    // Half Yearly
                        {
                            if (DiffMonths >= 6d)
                            {
                                NoOfQuarters = DiffMonths / 6d;
                                Factor = 0.005d;
                                TERM = "Q";
                                Prd = 2;
                                CompCalculation(Factor, NoOfQuarters, TERM, Prd);
                                GetMaturityvalueRet = PrincipalAmount;
                            }
                            else
                            {
                                // GetMaturityvalue = "Error  ! Period does not satisfy one Halfyear"
                                PrincipalAmount = PrincipalAmount + PrincipalAmount * DblDays * NewROI / 36500d;
                                GetMaturityvalueRet = Math.Round(PrincipalAmount);
                            }

                            break;
                        }
                        case "Y":    // Yearly
                        {
                            if (DiffMonths >= 12d)
                            {
                                NoOfQuarters = DiffMonths / 12d;
                                Factor = 0.01d;
                                TERM = "YYYY";
                                Prd = 1;
                                CompCalculation(Factor, NoOfQuarters, TERM, Prd);
                                GetMaturityvalueRet = PrincipalAmount;
                            }
                            else
                            {
                                // GetMaturityvalue = "Error  ! Period does not satisfy one Year"
                                PrincipalAmount = PrincipalAmount + PrincipalAmount * DblDays * NewROI / 36500d;
                                GetMaturityvalueRet = Math.Round(PrincipalAmount);
                            }

                            break;
                        }
                    }
                }

                return GetMaturityvalueRet;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #endregion

        #region Private Methods

        private string GetFinancialYear(string AppDate)
        {
            var sDateTime = Convert.ToDateTime(AppDate); // DateTime.Now
            return (sDateTime.Month > 3) ? sDateTime.Year.ToString() + "-" + Convert.ToString(sDateTime.Year + 1)
                : Convert.ToString(sDateTime.Year - 1) + "-" + sDateTime.Year.ToString();
        }

        private async Task<double> GetLimitAmount(string pstrBrCode, string pstrmodid, string pstrGlcode, string pstrAccno, DateTime TranDate)
        {
            double GetLimitAmountRet = default;
            DataTable objDr;
            double dbllimitamt = 0d;
            double dbltodlimitamt = 0d;
            string strSql;

            try
            {
                strSql = " select Sum(nvl(LINKEDAMOUNT,0)) AMOUNT from GENLIMITLNK where LINKEDACCNO='" + pstrAccno + "' and LINKEDGLCODE='" + pstrGlcode +
                    "' AND BRANCHCODE='" + pstrBrCode + "' AND CURRENCYCODE='INR' AND LINKEDMODULEID='" + pstrmodid + "'   and closedate is null and status='R' ";

                objDr = await _databaseFactory.ProcessQueryAsync(strSql);

                if (objDr.Rows.Count > 0)
                {
                    dbllimitamt = Convert.IsDBNull(objDr.Rows[0]["AMOUNT"]) ? 0 : Convert.ToDouble(objDr.Rows[0]["AMOUNT"]);
                }

                strSql = "SELECT NVL(TODLIMITAMT,0) TODLIMITAMT FROM genlimitlnk WHERE LINKEDACCNO = '" + pstrAccno + "' AND LINKEDGLCODE='" + pstrGlcode +
                    "' AND  LINKEDMODULEID='" + pstrmodid + "' AND BRANCHCODE= '" + pstrBrCode + "' AND CURRENCYCODE='INR' AND TODEXPDATE >= '" +
                    string.Format("dd-MMM-yyyy", TranDate) + "' AND TODEXPDATE IS NOT NULL ";

                objDr = await _databaseFactory.ProcessQueryAsync(strSql);

                if (objDr.Rows.Count > 0)
                {
                    dbltodlimitamt = Convert.IsDBNull(objDr.Rows[0]["TODLIMITAMT"]) ? 0 : Convert.ToDouble(objDr.Rows[0]["TODLIMITAMT"]);
                }

                GetLimitAmountRet = dbllimitamt + dbltodlimitamt;
            }
            catch (Exception ex)
            {

            }
            return GetLimitAmountRet;
        }

        private async Task<string> GetPanYNDtls(string strcustid, string strtds, string pstrPAN206AAYN = "", string pstrPAN206ABYN = "")
        {
            string strSql;
            string GetPanYNDtlsRet = string.Empty;
            DataTable recnfts;

            string strPANYN = "";
            string strPAN206AAYN = "", strPAN206ABYN = "";

            strSql = "SELECT PAN206AAYN,PAN206ABYN FROM gencustinfomst WHERE  CUSTOMERID = '" + strcustid + "'";

            recnfts = await _databaseFactory.ProcessQueryAsync(strSql);

            if (recnfts.Rows.Count > 0)
            {
                strPAN206AAYN = Convert.ToString(recnfts.Rows[0]["PAN206AAYN"]) ?? string.Empty;
                strPAN206ABYN = Convert.ToString(recnfts.Rows[0]["PAN206ABYN"]) ?? string.Empty;
            }

            recnfts = null!;

            pstrPAN206AAYN = strPAN206AAYN;
            pstrPAN206ABYN = strPAN206ABYN;

            if (strtds == "TDS")
            {
                strSql = "SELECT panno FROM gencustinfomst WHERE KYCID=2 and  CUSTOMERID = '" + strcustid + "'";

                recnfts = await _databaseFactory.ProcessQueryAsync(strSql);

                if (recnfts.Rows.Count > 0)
                {
                    string panno = Convert.ToString(recnfts.Rows[0]["panno"]) ?? string.Empty;

                    if (Convert.IsDBNull(recnfts.Rows[0]["panno"]))
                    {
                        strPANYN = "N"; // ' 20%
                    }
                    else if (panno.Length != 10)
                    {
                        strPANYN = "N";   // ' 20%
                    }
                    // ' pan no is there
                    else if (strPAN206AAYN == "Y" & strPAN206ABYN == "Y")
                    {
                        strPANYN = "N";   // ' 20%
                    }
                    else if (strPAN206AAYN == "Y" & strPAN206ABYN == "N")
                    {
                        strPANYN = "Y";   // ' 10%
                    }
                    else if (strPAN206AAYN == "N" & strPAN206ABYN == "Y")
                    {
                        strPANYN = "N";   // ' 20%
                    }
                    else if (strPAN206AAYN == "N" & strPAN206ABYN == "N")
                    {
                        strPANYN = "N";   // ' 20%
                    }
                }
                else
                {
                    strPANYN = "N";
                }
            }
            else if (strtds == "Form 15H" | strtds == "Form 15G")
            {
                strSql = "SELECT panno FROM gencustinfomst WHERE KYCID=2 and  CUSTOMERID = '" + strcustid + "'";

                recnfts = await _databaseFactory.ProcessQueryAsync(strSql);

                if (recnfts.Rows.Count > 0)
                {
                    string panno = Convert.ToString(recnfts.Rows[0]["panno"]) ?? string.Empty;
                    if (Convert.IsDBNull(recnfts.Rows[0]["panno"]))
                    {
                        strPANYN = "N"; // ' 20%
                    }
                    else if (panno.Length != 10)
                    {
                        strPANYN = "N";   // ' 20%
                    }
                    // ' pan no is there
                    else if (strPAN206AAYN == "Y" & strPAN206ABYN == "Y")
                    {
                        strPANYN = "N";   // ' 20%
                    }
                    else if (strPAN206AAYN == "Y" & strPAN206ABYN == "N")
                    {
                        strPANYN = "";   // ' 
                    }
                    else if (strPAN206AAYN == "N" & strPAN206ABYN == "Y")
                    {
                        strPANYN = "N";   // ' 20%
                    }
                    else if (strPAN206AAYN == "N" & strPAN206ABYN == "N")
                    {
                        strPANYN = "N";   // ' 20%
                    }
                }
                else
                {
                    strPANYN = "N";
                }
            }
            GetPanYNDtlsRet = strPANYN;
            return GetPanYNDtlsRet;
        }

        private void CompCalculation(double Fact, double Quarters, string TERM, int Prd)
        {
            // Full period calculation
            dblNoOfDaysPerYear = 36500;
            var loopTo = (int)Math.Round(Quarters);
            for (int intcount = 1; intcount <= loopTo; intcount++)
            {
                if (TERM.Equals("M"))
                    BreakDate = Convert.ToString(Convert.ToDateTime(BreakDate).AddMonths(Prd));
                if (TERM.Equals("D"))
                    BreakDate = Convert.ToString(Convert.ToDateTime(BreakDate).AddDays(Prd));
                if (TERM.Contains("Y"))
                    BreakDate = Convert.ToString(Convert.ToDateTime(BreakDate).AddYears(Prd));
                Intamt = PrincipalAmount * NewROI * Fact;
                PrincipalAmount = PrincipalAmount + Convert.ToDouble(Intamt);
            }

            // Remaining Months calculation
            double Count = 0d;
            DateTill = BreakDate;
            for (int i = 1; i <= 1000d; i++)
            {
                DateTill = Convert.ToString(Convert.ToDateTime(DateTill).AddMonths(1));
                if (Convert.ToDateTime(DateTill) > Convert.ToDateTime(Tilldate))
                {
                    break;
                }
                Count = Count + 1;
            }
            InMonths = Count;
            BreakDate = Convert.ToString(Convert.ToDateTime(BreakDate).AddMonths(Convert.ToInt32(InMonths)));

            // Convert.ToDouble(Operators.AddObject(PrincipalAmount, Operators.DivideObject(Operators.MultiplyObject(Operators.MultiplyObject(PrincipalAmount, Operators.DivideObject(InMonths, 12)), NewROI), 100)));
            PrincipalAmount = PrincipalAmount + (PrincipalAmount * (InMonths / 12.0) * NewROI / 100.0);

            // Remaining Days calculation
            RemainingDays = BankingExtensions.DateDifference("D", BreakDate, Tilldate);
            if (RemainingDays > 0) // (Convert.ToBoolean(Operators.ConditionalCompareObjectGreater(RemainingDays, 0, false)))
            {
                Intamt = PrincipalAmount * NewROI * Convert.ToDouble(RemainingDays) / Convert.ToDouble(dblNoOfDaysPerYear);
                PrincipalAmount = PrincipalAmount + Convert.ToDouble(Intamt);
            }
        }

        private int GetMonthsDiff(DateTime i_FromDt, DateTime i_ToDt)
        {
            int GetMonthsDiffRet = default;
            // Dim objCon As New OracleClient.OracleConnection
            // Dim objCmd As New OracleClient.OracleCommand
            // Dim dbCon As New DatabaseConnection.cDBConnection
            // Dim errmsg, strSql As String
            // Dim dr_Gen As OracleClient.OracleDataReader


            // If objCon.State <> ConnectionState.Open Then
            // errmsg = ""
            // objCon = dbCon.GetDbConnection(errmsg)
            // If errmsg <> "" Then
            // Throw New Exception(errmsg)
            // Exit Function
            // End If
            // End If

            // If i_FromDt > i_ToDt Then
            // Throw New Exception("To Date Should be greater than From Date to get Months Difference")
            // End If

            // strSql = "Select floor(months_between('" & _
            // Format(i_ToDt, "dd-MMM-yyyy") & "', '" & Format(i_FromDt, "dd-MMM-yyyy") _
            // & "')) mon from dual"


            // objCmd = New OracleClient.OracleCommand(strSql, objCon)

            // dr_Gen = objCmd.ExecuteReader
            // objCmd.Dispose()
            // objCmd = Nothing

            // If dr_Gen.HasRows = True Then
            // dr_Gen.Read()
            // GetMonthsDiff = IIf(IsDBNull(dr_Gen!mon), "", dr_Gen!mon)
            // Else
            // Throw New Exception("Unable to Get Months Difference between given Dates")
            // End If
            // dr_Gen.Close()
            // dr_Gen = Nothing
            GetMonthsDiffRet = 0;
            GetMonthsDiffRet = (int)Math.Round(Math.Floor((decimal)BankingExtensions.DateDifference("", i_FromDt, i_ToDt)));
            return GetMonthsDiffRet;

        }

        private async Task<double> getRDMaturityValue(DateTime MaturityDate, DateTime IntEffectiveDate, double InstalmentAmt, float ROI)
        {
            double getRDMaturityValueRet = default;
            int NoOfQuarters;
            double FirstQuarterAmt;
            int RemainingDays;
            // If Not IsDate(MaturityDate) Or Not IsDate(IntEffectiveDate) Then
            // MsgBox "Either Maturity date or Interest Effective Date is null." & Chr(13) & _
            // "System cannot calculate Maturity Amount", vbInformation
            // Exit Function
            // End If
            // New formula is Introduced on 18-01-2003 don't change this formula without informing to the project manager
            // Code altered by Radhika on 29 Mar 2008
            // Reason: Date difference in Months not giving correct value
            // NoOfQuarters = Fix(DateDiff("M", IntEffectiveDate, MaturityDate) / 3)

            /// THIS CODE ADDED BY VINOD FOR RECURRING DEPOSIT CALCULATION

            // Dim strCompoundType As String
            var intPer = default(int);
            // Dim intDivPer As Integer
            string strSql;
            DataTable dr_Gen;

            strSql = "SELECT NVL(INTCOMPOUNDYN,'N') COMYN FROM DEPTYPEMST WHERE INSTSYN='Y'";

            dr_Gen = await _databaseFactory.ProcessQueryAsync(strSql);

            if (dr_Gen.Rows.Count > 0)
            {
                strCompoundType = Convert.IsDBNull(dr_Gen.Rows[0]["COMYN"]) ? "" : Convert.ToString(dr_Gen.Rows[0]["COMYN"]) ?? string.Empty;
            }
            else
            {
                throw new Exception("Unable to Get Compound Yes or No.");
            }

            dr_Gen = null!;

            // If rsTmp.RecordCount = 0 Then
            // Err.Raise(999, , "Unable to Get Compound Yes or No.")
            // End If

            if (strCompoundType == "M")
            {
                intPer = 1;
                intDivPer = 1200;
            }
            else if (strCompoundType == "Q")
            {
                intPer = 3;
                intDivPer = 400;
            }
            else if (strCompoundType == "H")
            {
                intPer = 6;
                intDivPer = 200;
            }
            else if (strCompoundType == "Y")
            {
                intPer = 12;
                intDivPer = 100;
            }

            /// THIS CODE ADDED BY VINOD FOR RECURRING DEPOSIT CALCULATION CODE ENDED HERE

            int intMonths;
            intMonths = GetMonthsDiff(Convert.ToDateTime(IntEffectiveDate), Convert.ToDateTime(MaturityDate));
            NoOfQuarters = Convert.ToInt32(Math.Truncate(intMonths / (double)intPer));

            // RemainingDays = (int)DateAndTime.DateDiff("D", DateAndTime.DateAdd("M", NoOfQuarters * intPer, IntEffectiveDate), MaturityDate);
            RemainingDays = (MaturityDate - IntEffectiveDate.AddMonths(NoOfQuarters * intPer)).Days;
            FirstQuarterAmt = InstalmentAmt * (double)(intPer + ROI / intDivPer);

            if (strCompoundType == "M")
            {
                getRDMaturityValueRet = getRDCompundedValue(NoOfQuarters, FirstQuarterAmt, ROI);
            }
            else
            {
                getRDMaturityValueRet = RDCompoundCalculation(intMonths, strCompoundType, InstalmentAmt, ROI);
            }

            return getRDMaturityValueRet;

            // If RemainingDays > 0 Then
            // getRDMaturityValue = (getRDMaturityValue + InstalmentAmt) + ((getRDMaturityValue + InstalmentAmt) * 31 * ROI / 36500)
            // End If

            // If RemainingDays > 31 Then
            // getRDMaturityValue = (getRDMaturityValue + InstalmentAmt) + ((getRDMaturityValue + InstalmentAmt) * (RemainingDays - 31) * ROI / 36500)
            // End If

            // After Quarter, Calculate Simple Interest and add it.



            // New formula Ends here
        }

        private double getRDCompundedValue(int Quarter, double InstalmentAmt, float ROI)
        {
            double getRDCompundedValueRet = default, SubTotal;
            if (Quarter <= 0)
            {
                getRDCompundedValueRet = 0d;
                return getRDCompundedValueRet;
            }
            SubTotal = InstalmentAmt * Math.Pow((double)(1f + ROI / intDivPer), Quarter - 1) + getRDCompundedValue(Quarter - 1, InstalmentAmt, ROI);
            getRDCompundedValueRet = SubTotal;
            return getRDCompundedValueRet;
        }

        private double RDCompoundCalculation(int Months, string perType, double Amount, float ROI)
        {
            double RDCompoundCalculationRet = default;
            double dblInstlAmt = 0d, dblInt = 0d;
            int intInstallments = default(int), intAddInstal = 0;

            if (perType == "Q")
            {
                intInstallments = 3;
                intAddInstal = 3;
            }
            else if (perType == "H")
            {
                intInstallments = 6;
                intAddInstal = 6;
            }
            else if (perType == "Y")
            {
                intInstallments = 12;
                intAddInstal = 12;
            }

            var loopTo = (double)Months;
            for (int i = 1; i <= loopTo; i++)
            {
                dblInstlAmt = dblInstlAmt + Amount;

                if (i == Months & Months % intAddInstal != 0)
                    dblInt = dblInstlAmt * (1d / 12d) * (double)ROI / 100d;
                else
                    dblInt = dblInt + dblInstlAmt * (1d / 12d) * (double)ROI / 100d;

                if (i == intInstallments & i < Months)
                {
                    dblInstlAmt = dblInstlAmt + dblInt + Amount;
                    dblInt = dblInstlAmt * (1d / 12d) * (double)ROI / 100d;
                    intInstallments = intInstallments + intAddInstal;
                    i = i + 1;
                }
            }

            RDCompoundCalculationRet = dblInstlAmt + dblInt;
            return RDCompoundCalculationRet;
        }

        #endregion
    }
}
