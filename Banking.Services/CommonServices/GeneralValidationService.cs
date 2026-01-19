using Banking.Interfaces;
using Banking.Models;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
using System.Data;
using System.Threading.Tasks;

namespace Banking.Services
{
    public class GeneralValidationService : IGeneralValidationService
    {
        private readonly IDatabaseService _databaseFactory;

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

        private string GetFinancialYear(string AppDate)
        {
            var sDateTime = Convert.ToDateTime(AppDate); // DateTime.Now
            return (sDateTime.Month > 3) ? sDateTime.Year.ToString() + "-" + Convert.ToString(sDateTime.Year + 1) 
                : Convert.ToString(sDateTime.Year - 1) + "-" + sDateTime.Year.ToString();
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

                strSql = "SELECT NVL(TODLIMITAMT,0) TODLIMITAMT FROM genlimitlnk WHERE LINKEDACCNO = '" + accountNo + "' AND LINKEDGLCODE='" + GlCode + "' AND  LINKEDMODULEID='" + ModId + "' AND BRANCHCODE= '" + BrCode + "' AND CURRENCYCODE='INR' AND TODEXPDATE >= '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "' AND TODEXPDATE IS NOT NULL ";

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
                    " '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "') from dual";

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
                    Strings.Format(TranDate, "dd-MMM-yyyy") + "' AND TODEXPDATE IS NOT NULL ";

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

        //public string GetCustMobileNo(string BrCode, string CrCode, string ModId, string GlCode, string accountNo)
        //{
        //    string GetCustMobileNoRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    string strMobileNo = "";
        //    OracleClient.OracleDataReader dr;
        //    try
        //    {

        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetCustMobileNoRet;
        //            }
        //        }
        //        strQuery = "select custmobile from gencustinfomst where customerid = " + " (select DISTINCT customerid from " + ModId + "mst where " + " accno = '" + accountNo + "'  and glcode='" + GlCode + "'" + " and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "')";

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dr = objCmd.ExecuteReader;
        //        if (dr.HasRows == true)
        //        {
        //            dr.Read();
        //            strMobileNo = Conversions.ToString(Interaction.IIf(dr["custmobile"] is DBNull, "", dr["custmobile"]));
        //        }
        //        else
        //        {
        //            strMobileNo = "";
        //        }

        //        dr.Close();
        //        dr = default;
        //        objCmd.Dispose();
        //        objCmd = default;
        //        GetCustMobileNoRet = strMobileNo;
        //        return GetCustMobileNoRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetCustMobileNoRet = "";
        //    }

        //    return GetCustMobileNoRet;
        //}

        //public void GetCustomerIDName(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, ref string strCustomerID, ref string strName)
        //{
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;

        //    OracleClient.OracleDataReader dr;
        //    try
        //    {

        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return;
        //            }
        //        }
        //        strQuery = "select DISTINCT customerid customerid,name from " + ModId + "mst where " + " accno = '" + accountNo + "'  and glcode='" + GlCode + "'" + " and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "'";

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dr = objCmd.ExecuteReader;
        //        if (dr.HasRows == true)
        //        {
        //            dr.Read();
        //            strCustomerID = Conversions.ToString(Interaction.IIf(dr["customerid"] is DBNull, "", dr["customerid"]));
        //            strName = Conversions.ToString(Interaction.IIf(dr["name"] is DBNull, "", dr["name"]));
        //        }
        //        else
        //        {
        //            strCustomerID = "";
        //            strName = "";
        //        }

        //        dr.Close();
        //        dr = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        return;
        //    }
        //    catch (Exception ex)
        //    {
        //        strCustomerID = "1111111111";
        //        strName = "";
        //    }
        //}

        //public string GetCloseBal(string BrCode, string CrCode, string ModId, string GlCode, string accountNo)
        //{
        //    string GetCloseBalRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    string strCloseBal = "";
        //    OracleClient.OracleDataReader dr;
        //    try
        //    {

        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetCloseBalRet;
        //            }
        //        }
        //        strQuery = "select sum(nvl(closebal,0)) closebal from (select curbal closebal from " + ModId + "balance where  accno = '" + accountNo + "'  and glcode='" + GlCode + "' and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "'" + " union all " + " select sum(nvl(amount,0)) closebal from " + ModId + "tranday where accno = '" + accountNo + "'  and glcode='" + GlCode + "' and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "')";

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dr = objCmd.ExecuteReader;
        //        if (dr.HasRows == true)
        //        {
        //            dr.Read();
        //            strCloseBal = Conversions.ToString(Interaction.IIf(dr["closebal"] is DBNull, "0", dr["closebal"]));
        //        }
        //        else
        //        {
        //            strCloseBal = "";
        //        }
        //        dr.Close();
        //        dr = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        GetCloseBalRet = strCloseBal;
        //        return GetCloseBalRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetCloseBalRet = "";
        //    }

        //    return GetCloseBalRet;
        //}

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
                straccno1 = Strings.Mid(straccno, 10, 7);
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
                strfullaccno1 = Strings.StrReverse(Strings.Mid(Strings.StrReverse(strfullAccno), 1, 16));

                pstrBrId = Strings.Mid(strfullaccno1, 1, 3);
                pstrGlcd = Strings.Mid(strfullaccno1, 4, 6);

                // ' for accno 16 digits only
                NFTSCONVYN = await GetNFTSCONVYN();

                if (NFTSCONVYN == "Y")
                {
                    pstrAccNo = pstrBrId + pstrGlcd + Strings.Mid(strfullaccno1, 10, 7);
                }
                else
                {
                    pstrAccNo = Strings.Mid(strfullaccno1, 10, 7).TrimStart('0');
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
                else if (Strings.Mid(pstrGlcd, 1, 3) == "104")
                {
                    pstrACTP = "DEP";
                }
                else if (Strings.Mid(pstrGlcd, 1, 3) == "206")
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

        //public string GetTDSyn(string BrCode, string CurCode, string DepGlcode, string DepAccNo)
        //{
        //    string GetTDSynRet = default;
        //    string strSql;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();

        //    OracleClient.OracleDataReader recnfts1;
        //    string errmsg;
        //    string strtdsyn1 = "";
        //    string str15Hyn1 = "";
        //    string str15Gyn1 = "";
        //    string stryn1 = "";
        //    try
        //    {
        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetTDSynRet;
        //            }
        //        }

        //        strSql = "";
        //        strSql = "SELECT nvl(tdsyn,'N') tdsyn,nvl(EXMPFORMSRECYN,'N') EXMPFORMSRECYN, nvl(FORMS15G,'N') FORMS15G FROM depmst WHERE BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CurCode + "' AND GLCODE='" + DepGlcode + "' AND ACCNO='" + DepAccNo + "'";
        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //        recnfts1 = objCmd.ExecuteReader();
        //        if (recnfts1.HasRows == true)
        //        {
        //            recnfts1.Read();
        //            strtdsyn1 = recnfts1["tdsyn"];
        //            str15Hyn1 = recnfts1["EXMPFORMSRECYN"];
        //            str15Gyn1 = recnfts1["FORMS15G"];

        //            if (strtdsyn1 == "Y")
        //            {
        //                stryn1 = "Y";
        //            }
        //            else if (str15Hyn1 == "Y")
        //            {
        //                stryn1 = "Y";
        //            }
        //            else if (str15Gyn1 == "Y")
        //            {
        //                stryn1 = "Y";
        //            }
        //            else
        //            {
        //                stryn1 = "N";
        //            }
        //        }

        //        GetTDSynRet = stryn1;
        //        recnfts1.Close();
        //        recnfts1 = default;
        //        objCmd.Dispose();
        //        objCmd = default;
        //        return GetTDSynRet;
        //    }
        //    catch (Exception ex)
        //    {

        //    }

        //    return GetTDSynRet;
        //}

        //public string GetLoginOTPYN()
        //{
        //    string GetLoginOTPYNRet = default;
        //    string strSql, errmsg;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();

        //    if (objCon.State != ConnectionState.Open)
        //    {
        //        errmsg = "";
        //        objCon = dbCon.GetDbConnection(errmsg);
        //        if (!string.IsNullOrEmpty(errmsg))
        //        {
        //            throw new Exception(errmsg);
        //            return GetLoginOTPYNRet;
        //        }
        //    }

        //    string strloginotpyn = "N";
        //    OracleClient.OracleDataReader recnfts1;
        //    strSql = "";
        //    strSql = "select loginotpyn from genbankparm";

        //    objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //    recnfts1 = objCmd.ExecuteReader();
        //    if (recnfts1.HasRows == true)
        //    {
        //        recnfts1.Read();
        //        strloginotpyn = Conversions.ToString(Interaction.IIf(recnfts1["loginotpyn"] is DBNull, "N", recnfts1["loginotpyn"]));
        //    }

        //    recnfts1.Close();
        //    recnfts1 = default;
        //    objCmd.Dispose();
        //    objCmd = default;

        //    GetLoginOTPYNRet = strloginotpyn;
        //    return GetLoginOTPYNRet;
        //}

        //public void GetCKYCEnrollDetails(string strkycenrolldate, ref string pstrckycsno, ref string pstrduedate)
        //{
        //    string strSql, errmsg;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    try
        //    {


        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return;
        //            }
        //        }


        //        string strckycsno = default, strCKYCIDPERIOD = default;
        //        OracleClient.OracleDataReader recnfts1;
        //        strSql = "";
        //        strSql = "SELECT NVL(MAX(sno),0) +1 sno  FROM CKYCENROLLDTLS";

        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //        recnfts1 = objCmd.ExecuteReader();
        //        if (recnfts1.HasRows == true)
        //        {
        //            recnfts1.Read();
        //            strckycsno = Conversions.ToString(Interaction.IIf(recnfts1["sno"] is DBNull, "0", recnfts1["sno"]));
        //        }

        //        recnfts1.Close();
        //        recnfts1 = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        strSql = "";
        //        strSql = "select CKYCIDPERIOD from genbankparm";

        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //        recnfts1 = objCmd.ExecuteReader();
        //        if (recnfts1.HasRows == true)
        //        {
        //            recnfts1.Read();
        //            strCKYCIDPERIOD = Conversions.ToString(Interaction.IIf(recnfts1["CKYCIDPERIOD"] is DBNull, "0", recnfts1["CKYCIDPERIOD"]));
        //        }

        //        recnfts1.Close();
        //        recnfts1 = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        pstrduedate = Conversions.ToString(DateAndTime.DateAdd("m", Conversions.ToInteger(strCKYCIDPERIOD), Conversions.ToDate(strkycenrolldate)));
        //        pstrduedate = Strings.Format(Conversions.ToDate(pstrduedate), "dd-MMM-yyyy");
        //        pstrckycsno = strckycsno;
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //}

        //public string getCheckIMPSCycle(string strPrcsCode, string strTransAmt, ref string sumamount, ref string limitamount)
        //{
        //    string getCheckIMPSCycleRet = default;
        //    string strSql, errmsg;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    OracleClient.OracleDataReader recnfts;
        //    string intfromtime = default, inttotime = default;
        //    double dbllimitamt, dblamount, dblgentransamt;
        //    string sQuery;
        //    try
        //    {


        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return getCheckIMPSCycleRet;
        //            }
        //        }


        //        dbllimitamt = 0d;
        //        dblamount = 0d;
        //        dblgentransamt = 0d;
        //        if (strPrcsCode == "OUTWRD")
        //        {
        //            sQuery = "  SELECT fromtime,totime,limitamt FROM IMPSCYCLEDTLS  WHERE TO_CHAR(SYSDATE,'HH24Mi') BETWEEN fromtime AND totime AND effdate = (SELECT MAX(effdate) FROM IMPSCYCLEDTLS  WHERE TO_CHAR(SYSDATE,'HH24Mi') BETWEEN fromtime AND totime )";

        //            objCmd = new OracleClient.OracleCommand(sQuery, objCon);
        //            recnfts = objCmd.ExecuteReader;
        //            if (recnfts.HasRows == true)
        //            {
        //                recnfts.Read();
        //                intfromtime = recnfts["fromtime"];
        //                inttotime = recnfts["totime"];
        //                dbllimitamt = recnfts["limitamt"];
        //            }
        //            objCmd.Dispose();
        //            objCmd = default;
        //            recnfts.Close();
        //            recnfts = default;

        //            sQuery = "select sum(amount) amount from gentranslog where (remarks NOT LIKE 'IMPS Charges Inclusive GST Charges%' AND  trim(remarks) NOT LIKE 'Charges Inclusive GST Charges%') AND  SUBSTR(respondingbankcode,1,6) = 'OUTWRD' AND chqfvg = 'IMPS' AND moduleid != 'ATM'  AND modeoftran IN (1,3,5) AND TO_CHAR(systemdate,'HH24Mi') between '" + intfromtime + "' and '" + inttotime + "'";

        //            objCmd = new OracleClient.OracleCommand(sQuery, objCon);
        //            recnfts = objCmd.ExecuteReader;
        //            if (recnfts.HasRows == true)
        //            {
        //                recnfts.Read();
        //                dblgentransamt = Conversions.ToDouble(Interaction.IIf(recnfts["amount"] is DBNull, 0, recnfts["amount"]));

        //            }
        //            objCmd.Dispose();
        //            objCmd = default;
        //            recnfts.Close();
        //            recnfts = default;

        //            dblamount = Math.Abs(dblgentransamt) + Conversions.ToDouble(strTransAmt) / 100d;

        //            if (dblamount > dbllimitamt)
        //            {
        //                getCheckIMPSCycleRet = "121";
        //            }
        //            else
        //            {
        //                getCheckIMPSCycleRet = "";
        //            }

        //        }

        //        sumamount = dblamount.ToString();
        //        limitamount = dbllimitamt.ToString();
        //        return getCheckIMPSCycleRet;
        //    }
        //    catch (Exception ex)
        //    {

        //    }

        //    return getCheckIMPSCycleRet;
        //}

        //public string getNEFTMobileFrm_bnkbrhmst(string strbrid)
        //{
        //    string getNEFTMobileFrm_bnkbrhmstRet = default;
        //    string strSql, errmsg;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    OracleClient.OracleDataReader recnfts;
        //    string strNEFTMobNo;
        //    strNEFTMobNo = "";
        //    string sQuery;
        //    try
        //    {


        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return getNEFTMobileFrm_bnkbrhmstRet;
        //            }
        //        }

        //        sQuery = " select NEFTMOBILE from genbankbranchmst where branchcode = '" + strbrid + "'";

        //        objCmd = new OracleClient.OracleCommand(sQuery, objCon);
        //        recnfts = objCmd.ExecuteReader;
        //        if (recnfts.HasRows == true)
        //        {
        //            recnfts.Read();
        //            strNEFTMobNo = recnfts["NEFTMOBILE"];

        //        }
        //        objCmd.Dispose();
        //        objCmd = default;
        //        recnfts.Close();
        //        recnfts = default;
        //        getNEFTMobileFrm_bnkbrhmstRet = strNEFTMobNo;
        //    }
        //    catch (Exception ex)
        //    {
        //        getNEFTMobileFrm_bnkbrhmstRet = "";
        //    }

        //    return getNEFTMobileFrm_bnkbrhmstRet;
        //}

        //public string GetCCDrCrLienYN(string strBrCode, string strCurcode, string strModId, string strGlcode, string strAccno, DateTime TranDate, ref string o_Errmsg)
        //{
        //    string GetCCDrCrLienYNRet = default;

        //    string strDrLnYN;
        //    string strCrLnYN;
        //    string strAllowYN;
        //    double dblDrLnAmt;
        //    double dblCrLnAmt;
        //    double dblAccBal;
        //    double dblfinLeinLimAmt;
        //    string strDrCrLnYN;
        //    string strSql;
        //    var objCmd = new OracleClient.OracleCommand();
        //    OracleClient.OracleDataReader rsneftAck;
        //    try
        //    {
        //        if (strModId == "CC")
        //        {
        //        }
        //        else
        //        {
        //            goto End1;
        //        }

        //        // '   ObjOracleConnection = objDBConnection.GetDbConnection(o_Errmsg)

        //        if (ObjOracleConnection.State != ConnectionState.Open)
        //        {
        //            o_Errmsg = "";
        //            ObjOracleConnection = objDBConnection.GetDbConnection(o_Errmsg);
        //            if (!string.IsNullOrEmpty(o_Errmsg))
        //            {
        //                throw new Exception(o_Errmsg);
        //                return GetCCDrCrLienYNRet;
        //            }
        //        }
        //        if (Strings.Len(o_Errmsg) == 0)
        //        {

        //            strSql = "SELECT DRLIENYN, CRLIENYN FROM " + strModId + "mst  WHERE branchcode ='" + strBrCode + "' AND " + " currencycode ='" + strCurcode + "' AND glcode ='" + strGlcode + "'  AND accno ='" + strAccno + "'";
        //            objCmd = new OracleClient.OracleCommand(strSql, ObjOracleConnection);
        //            rsneftAck = objCmd.ExecuteReader;

        //            if (rsneftAck.HasRows == true)
        //            {
        //                rsneftAck.Read();
        //                strDrLnYN = Conversions.ToString(Interaction.IIf(rsneftAck["DRLIENYN"] is DBNull, "N", rsneftAck["DRLIENYN"]));
        //                strCrLnYN = Conversions.ToString(Interaction.IIf(rsneftAck["CRLIENYN"] is DBNull, "N", rsneftAck["CRLIENYN"]));
        //            }
        //            else
        //            {
        //                strDrLnYN = "N";
        //                strCrLnYN = "N";
        //            }

        //            objCmd.Dispose();
        //            objCmd = default;
        //            rsneftAck.Close();
        //            rsneftAck = default;

        //            strSql = "SELECT DRLIENAMT, CRLIENAMT FROM SBCALIENDTLS WHERE branchcode ='" + strBrCode + "' AND " + " currencycode ='" + strCurcode + "' AND glcode ='" + strGlcode + "'  AND accno ='" + strAccno + "'";

        //            objCmd = new OracleClient.OracleCommand(strSql, ObjOracleConnection);
        //            rsneftAck = objCmd.ExecuteReader;

        //            if (rsneftAck.HasRows == true)
        //            {
        //                rsneftAck.Read();

        //                dblDrLnAmt = Conversions.ToDouble(Interaction.IIf(rsneftAck["DRLIENAMT"] is DBNull, 0, rsneftAck["DRLIENAMT"]));
        //                dblCrLnAmt = Conversions.ToDouble(Interaction.IIf(rsneftAck["CRLIENAMT"] is DBNull, 0, rsneftAck["CRLIENAMT"]));
        //            }
        //            else
        //            {
        //                dblDrLnAmt = 0d;
        //                dblCrLnAmt = 0d;
        //            }

        //            objCmd.Dispose();
        //            objCmd = default;
        //            rsneftAck.Close();
        //            rsneftAck = default;

        //            GetCCDrCrLienYNRet = strDrLnYN + "|" + dblDrLnAmt + "|" + strCrLnYN + "|" + dblCrLnAmt;

        //        }
        //        return GetCCDrCrLienYNRet;
        //        End1:
        //        ;

        //        GetCCDrCrLienYNRet = "|||";
        //        return GetCCDrCrLienYNRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        o_Errmsg = ex.Message;
        //    }

        //    return GetCCDrCrLienYNRet;
        //}

        //public string GetSBCADrCrLienYN(string strMode, string strBrCode, string strCurcode, string strModId, string strGlcode, string strAccno, double TransAmt, DateTime TranDate, ref string o_Errmsg)
        //{
        //    string GetSBCADrCrLienYNRet = default;

        //    string strDrLnYN;
        //    string strCrLnYN;
        //    var strAllowYN = default(string);
        //    double dblDrLnAmt;
        //    double dblCrLnAmt;
        //    double dblAccBal;
        //    double dblfinLeinLimAmt;
        //    string strDrCrLnYN;
        //    string strSql;
        //    var objCmd = new OracleClient.OracleCommand();
        //    OracleClient.OracleDataReader rsneftAck;
        //    try
        //    {
        //        if (strModId == "SB" | strModId == "CA")
        //        {
        //        }
        //        else
        //        {
        //            goto End1;
        //        }

        //        // '   ObjOracleConnection = objDBConnection.GetDbConnection(o_Errmsg)

        //        if (ObjOracleConnection.State != ConnectionState.Open)
        //        {
        //            o_Errmsg = "";
        //            ObjOracleConnection = objDBConnection.GetDbConnection(o_Errmsg);
        //            if (!string.IsNullOrEmpty(o_Errmsg))
        //            {
        //                throw new Exception(o_Errmsg);
        //                return GetSBCADrCrLienYNRet;
        //            }
        //        }
        //        if (Strings.Len(o_Errmsg) == 0)
        //        {



        //            strSql = "select GETANYDAYBAL('" + strBrCode + "'," + " '" + strCurcode + "' ,'" + strModId + "'," + " '" + strGlcode + "','" + strAccno + "'," + " '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "') bal from dual";

        //            objCmd = new OracleClient.OracleCommand(strSql, ObjOracleConnection);
        //            rsneftAck = objCmd.ExecuteReader;
        //            if (rsneftAck.HasRows == true)
        //            {
        //                rsneftAck.Read();
        //                dblAccBal = Conversions.ToDouble(Interaction.IIf(rsneftAck["bal"] is DBNull, 0, rsneftAck["bal"]));
        //            }
        //            else
        //            {
        //                dblAccBal = 0d;
        //            }
        //            objCmd.Dispose();
        //            objCmd = default;
        //            rsneftAck.Close();
        //            rsneftAck = default;

        //            strSql = "SELECT DRLIENYN, CRLIENYN FROM " + strModId + "mst  WHERE branchcode ='" + strBrCode + "' AND " + " currencycode ='" + strCurcode + "' AND glcode ='" + strGlcode + "'  AND accno ='" + strAccno + "'";
        //            objCmd = new OracleClient.OracleCommand(strSql, ObjOracleConnection);
        //            rsneftAck = objCmd.ExecuteReader;

        //            if (rsneftAck.HasRows == true)
        //            {
        //                rsneftAck.Read();
        //                strDrLnYN = Conversions.ToString(Interaction.IIf(rsneftAck["DRLIENYN"] is DBNull, "N", rsneftAck["DRLIENYN"]));
        //                strCrLnYN = Conversions.ToString(Interaction.IIf(rsneftAck["CRLIENYN"] is DBNull, "N", rsneftAck["CRLIENYN"]));
        //            }
        //            else
        //            {
        //                strDrLnYN = "N";
        //                strCrLnYN = "N";
        //            }

        //            objCmd.Dispose();
        //            objCmd = default;
        //            rsneftAck.Close();
        //            rsneftAck = default;

        //            strSql = "SELECT DRLIENAMT, CRLIENAMT FROM SBCALIENDTLS WHERE branchcode ='" + strBrCode + "' AND " + " currencycode ='" + strCurcode + "' AND glcode ='" + strGlcode + "'  AND accno ='" + strAccno + "'";

        //            objCmd = new OracleClient.OracleCommand(strSql, ObjOracleConnection);
        //            rsneftAck = objCmd.ExecuteReader;

        //            if (rsneftAck.HasRows == true)
        //            {
        //                rsneftAck.Read();

        //                dblDrLnAmt = Conversions.ToDouble(Interaction.IIf(rsneftAck["DRLIENAMT"] is DBNull, 0, rsneftAck["DRLIENAMT"]));
        //                dblCrLnAmt = Conversions.ToDouble(Interaction.IIf(rsneftAck["CRLIENAMT"] is DBNull, 0, rsneftAck["CRLIENAMT"]));
        //            }
        //            else
        //            {
        //                dblDrLnAmt = 0d;
        //                dblCrLnAmt = 0d;
        //            }

        //            objCmd.Dispose();
        //            objCmd = default;
        //            rsneftAck.Close();
        //            rsneftAck = default;

        //            if (strModId == "SB" | strModId == "CA")
        //            {
        //                // ' for Debit lien yn
        //                if (strMode == "Dr")
        //                {
        //                    if (strDrLnYN == "Y")
        //                    {
        //                        if (dblAccBal - dblDrLnAmt >= TransAmt)
        //                        {
        //                            strAllowYN = "Y";
        //                        }
        //                        else
        //                        {
        //                            strAllowYN = "N";
        //                        }
        //                    }
        //                    else
        //                    {
        //                        strAllowYN = "Y";
        //                    }
        //                }


        //                // ' for Credit Lien YN
        //                if (strMode == "Cr")
        //                {
        //                    if (strCrLnYN == "Y")
        //                    {
        //                        strAllowYN = "N";
        //                    }
        //                    else
        //                    {
        //                        strAllowYN = "Y";
        //                    }
        //                }

        //                if (strMode == "Dr")
        //                {
        //                    dblfinLeinLimAmt = dblDrLnAmt;
        //                    strDrCrLnYN = strDrLnYN;
        //                }
        //                else if (strMode == "Cr")
        //                {
        //                    dblfinLeinLimAmt = dblCrLnAmt;
        //                    strDrCrLnYN = strCrLnYN;
        //                }
        //                else
        //                {
        //                    dblfinLeinLimAmt = 0d;
        //                    strDrCrLnYN = "";
        //                }
        //            } // 'strModId = "SB" Or strModId = "CA"


        //            GetSBCADrCrLienYNRet = strAllowYN;
        //        }
        //        return GetSBCADrCrLienYNRet;
        //        End1:
        //        ;

        //        GetSBCADrCrLienYNRet = "Y";
        //        return GetSBCADrCrLienYNRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetSBCADrCrLienYNRet = "N";
        //    }

        //    return GetSBCADrCrLienYNRet;
        //}
    }
}
