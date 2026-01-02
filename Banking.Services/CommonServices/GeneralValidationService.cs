using Banking.Interfaces;
using Banking.Models;
using Microsoft.Extensions.Options;
using System.Data;

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


        //public string getDebitCreditByYealrly(string BranchCode, string ModuleId, string Glcode, string AccNo, string AppDate)
        //{

        //    string fromdate;
        //    string Todate;
        //    try
        //    {

        //        OracleClient.OracleDataReader drCreditDebit;
        //        // Dim daOracleDataAdapter As OracleClient.OracleDataAdapter
        //        OracleClient.OracleCommand objcommand;
        //        string[] vb = GetFinancialYear(AppDate).Split("-");
        //        fromdate = "1-APR-" + vb[0];
        //        Todate = "31-MAR-" + vb[1];

        //        string strSqlQuery = "SELECT (" + " SELECT NVL(SUM(AMOUNT),0) FROM " + ModuleId + "TRAN WHERE modeoftran=1 AND BRANCHCODE='" + BranchCode + "'" + " AND MODULEID='" + ModuleId + "' AND GLCODE='" + Glcode + "' AND ACCNO='" + AccNo + "'" + " AND APPLICATIONDATE BETWEEN '" + fromdate + "' AND '" + Todate + "') AS DR " + "," + "(" + "SELECT NVL(SUM(AMOUNT),0) " + " FROM " + ModuleId + "TRAN WHERE modeoftran=2 AND BRANCHCODE='" + BranchCode + "' AND MODULEID='" + ModuleId + "' AND GLCODE='" + Glcode + "'" + " AND ACCNO='" + AccNo + "'" + " AND APPLICATIONDATE BETWEEN '" + fromdate + "' AND '" + Todate + "') AS CR," + "(" + " SELECT NVL(SUM(AMOUNT),0) FROM " + ModuleId + "TRANDAY WHERE modeoftran=1 AND BRANCHCODE='" + BranchCode + "'" + " AND MODULEID='" + ModuleId + "' AND GLCODE='" + Glcode + "' AND ACCNO='" + AccNo + "' " + " AND APPLICATIONDATE BETWEEN '" + fromdate + "' AND '" + Todate + "') AS DRDAY " + "," + "(" + "SELECT NVL(SUM(AMOUNT),0) " + " FROM " + ModuleId + "TRANDAY WHERE modeoftran=2 AND BRANCHCODE='" + BranchCode + "' AND MODULEID='" + ModuleId + "' AND GLCODE='" + Glcode + "'" + " AND ACCNO='" + AccNo + "'" + " AND APPLICATIONDATE BETWEEN '" + fromdate + "' AND '" + Todate + "') AS CRDAY," + " TO_NUMBER(VALUE1) AS MAXAMOUNT" + " FROM GENCONFIGMST WHERE CODE='CTR'";

        //        ObjOracleConnection = objDBConnection.GetDbConnection(o_Errmsg);

        //        if (Len(o_Errmsg) == 0)
        //        {

        //            objcommand = new OracleClient.OracleCommand(strSqlQuery, ObjOracleConnection);
        //            // daOracleDataAdapter = New OracleClient.OracleDataAdapter(objcommand)
        //            // daOracleDataAdapter.Fill(ds)
        //            drCreditDebit = objcommand.ExecuteReader;

        //            string debitBalance = "0";
        //            string creditBalance = "0";
        //            string maxAmount = "0";
        //            DataTable dtbTable;
        //            short i;
        //            object rcount;

        //            if (drCreditDebit.Read)
        //            {
        //                if (!Convert.IsDBNull(drCreditDebit("DR")))
        //                {
        //                    debitBalance = (Convert.ToDecimal(drCreditDebit("DR")) + Convert.ToDecimal(drCreditDebit("DRDAY"))).ToString();
        //                }

        //                if (!Convert.IsDBNull(drCreditDebit("CR")))
        //                {
        //                    creditBalance = (Convert.ToDecimal(drCreditDebit("CR")) + Convert.ToDecimal(drCreditDebit("CRDAY"))).ToString();
        //                }

        //                if (!Convert.IsDBNull(drCreditDebit("MAXAMOUNT")))
        //                {
        //                    maxAmount = drCreditDebit("MAXAMOUNT");
        //                }

        //            }
        //            drCreditDebit = default;
        //            objcommand = default;
        //            ObjOracleConnection = (object)null;
        //            objDBConnection = (object)null;
        //            return debitBalance + "|" + creditBalance + "|" + maxAmount;
        //        }

        //        else
        //        {
        //            return o_Errmsg;
        //        }
        //    }

        //    catch (Exception ex)
        //    {
        //        return ex.Message.ToString();
        //    }

        //}

        //public string GetExcIntRevFrmDepIntAccDtls(string br, string cr, string gl, string acc, string frmdate, string todate, ref string strError)
        //{
        //    string GetExcIntRevFrmDepIntAccDtlsRet = default;

        //    string strSql;
        //    OracleClient.OracleDataReader rsdepintaccr;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg;
        //    double dbldepaccrintexcessamount;
        //    dbldepaccrintexcessamount = 0d;
        //    try
        //    {


        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetExcIntRevFrmDepIntAccDtlsRet;
        //            }
        //        }

        //        strSql = "SELECT SUM(ABS(INTAMOUNT)) INTAMOUNT FROM DEPINTACCRUEDDTLS WHERE  ACCNO = '" + acc + "' AND GLCODE = '" + gl + "' AND INTAMOUNT < 0 AND MODULEID = 'DEP' AND (REMARKS LIKE 'Excess Interest Adjusted%'  OR REMARKS LIKE 'Excess Int Reverse%'  OR REMARKS LIKE 'Excess Int Rev To GL%') AND APPLICATIONDATE  BETWEEN '" + Strings.Format(Conversions.ToDate(frmdate), "dd-MMM-yyyy") + "' AND  '" + Strings.Format(Conversions.ToDate(todate), "dd-MMM-yyyy") + "' AND BRANCHCODE = '" + br + "' AND currencycode = '" + cr + "'";
        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //        rsdepintaccr = objCmd.ExecuteReader();
        //        if (rsdepintaccr.HasRows == true)
        //        {
        //            rsdepintaccr.Read();
        //            if (rsdepintaccr["INTAMOUNT"] is DBNull)
        //            {
        //                dbldepaccrintexcessamount = 0d;
        //            }
        //            else
        //            {
        //                dbldepaccrintexcessamount = rsdepintaccr["INTAMOUNT"];
        //            }

        //        }

        //        rsdepintaccr.Close();
        //        rsdepintaccr = default;
        //        objCmd.Dispose();
        //        objCmd = default;



        //        GetExcIntRevFrmDepIntAccDtlsRet = dbldepaccrintexcessamount.ToString();
        //    }
        //    catch (Exception ex)
        //    {
        //        strError = ex.Message;
        //    }

        //    return GetExcIntRevFrmDepIntAccDtlsRet;
        //}

        //public string GetFinancialYear(string AppDate)
        //{

        //    string finyear = string.Empty;
        //    var sDateTime = Convert.ToDateTime(AppDate); // DateTime.Now
        //    int month = sDateTime.Month;
        //    int year = sDateTime.Year;

        //    if (month > 3)
        //    {
        //        finyear = year.ToString() + "-" + Convert.ToString(year + 1);
        //    }
        //    else
        //    {
        //        finyear = Convert.ToString(year - 1) + "-" + year.ToString();
        //    }

        //    return finyear;

        //}

        //public string getSystemDate(OracleClient.OracleConnection objCon)
        //{
        //    string getSystemDateRet = default;
        //    OracleClient.OracleDataReader objDrcust;
        //    var objCmd = new OracleClient.OracleCommand();
        //    var strsystemdate = default(string);
        //    string errmsg, sQuery;
        //    try
        //    {
        //        sQuery = "select to_char(sysdate,'dd-Mon-yyyy') sysdate1 from dual";
        //        objCmd = new OracleClient.OracleCommand(sQuery, objCon);

        //        objDrcust = objCmd.ExecuteReader();
        //        if (objDrcust.HasRows)
        //        {
        //            objDrcust.Read();
        //            strsystemdate = Conversions.ToString(Interaction.IIf(objDrcust["sysdate1"] is DBNull, "", objDrcust["sysdate1"]));
        //        }
        //        getSystemDateRet = strsystemdate;
        //        objDrcust.Close();
        //        objDrcust.Dispose();
        //        objDrcust = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        return getSystemDateRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        getSystemDateRet = Strings.Format(DateTime.Now, "dd-MMM-yyyy");
        //    }

        //    return getSystemDateRet;
        //}

        //public string GetDepCertificateNameWOconn(OracleClient.OracleConnection objCon)
        //{
        //    string GetDepCertificateNameWOconnRet = default;

        //    var objCmd = new OracleClient.OracleCommand();

        //    string errmsg, sQuery;
        //    try
        //    {

        //        OracleClient.OracleDataReader objDrcust;
        //        string strDepCertName1;
        //        strDepCertName1 = "";
        //        sQuery = "select depcertificate from genbankparm";

        //        objCmd = new OracleClient.OracleCommand(sQuery, objCon);

        //        objDrcust = objCmd.ExecuteReader();
        //        if (objDrcust.HasRows)
        //        {
        //            objDrcust.Read();
        //            strDepCertName1 = Conversions.ToString(Interaction.IIf(objDrcust["depcertificate"] is DBNull, "", objDrcust["depcertificate"]));
        //        }
        //        objDrcust.Close();
        //        objDrcust.Dispose();
        //        objDrcust = default;
        //        objCmd.Dispose();
        //        objCmd = default;
        //        GetDepCertificateNameWOconnRet = strDepCertName1;
        //        return GetDepCertificateNameWOconnRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetDepCertificateNameWOconnRet = "MAHARAJA";
        //    }

        //    return GetDepCertificateNameWOconnRet;
        //}

        //public string GetAnyDayBalance(string BrCode, string CrCode, string ModId, string GlCode, string AccNo, DateTime TranDate)
        //{
        //    string GetAnyDayBalanceRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    double dblAnyDayBal, dblCCLmt;
        //    dblAnyDayBal = 0d;
        //    dblCCLmt = 0d;
        //    if (objCon.State != ConnectionState.Open)
        //    {
        //        errmsg = "";
        //        objCon = dbCon.GetDbConnection(errmsg);
        //        if (!string.IsNullOrEmpty(errmsg))
        //        {
        //            throw new Exception(errmsg);
        //            return GetAnyDayBalanceRet;
        //        }
        //    }
        //    strQuery = "select GETANYDAYBAL('" + BrCode + "'," + " '" + CrCode + "' ,'" + ModId + "'," + " '" + GlCode + "','" + AccNo + "'," + " '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "') from dual";

        //    objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //    dblAnyDayBal = objCmd.ExecuteScalar;

        //    objCmd.Dispose();
        //    objCmd = default;

        //    if (ModId == "CC")
        //    {
        //        strQuery = "SELECT LINKEDAMOUNT FROM GENLIMITLNK WHERE LINKEDACCNO='" + AccNo + "' AND LINKEDGLCODE='" + GlCode + "' AND LINKEDMODULEID='" + ModId + "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CrCode + "' AND STATUS='R'";

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dblCCLmt = objCmd.ExecuteScalar;
        //        dblAnyDayBal = dblAnyDayBal + dblCCLmt;
        //        objCmd.Dispose();
        //        objCmd = default;
        //    }

        //    GetAnyDayBalanceRet = dblAnyDayBal.ToString();
        //    return GetAnyDayBalanceRet;

        //}

        //public string GetAnyDayBalanceAppr(string BrCode, string CrCode, string ModId, string GlCode, string AccNo, DateTime TranDate)
        //{
        //    string GetAnyDayBalanceApprRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    double dblAnyDayBal, dblCCLmt;
        //    dblAnyDayBal = 0d;
        //    dblCCLmt = 0d;
        //    if (objCon.State != ConnectionState.Open)
        //    {
        //        errmsg = "";
        //        objCon = dbCon.GetDbConnection(errmsg);
        //        if (!string.IsNullOrEmpty(errmsg))
        //        {
        //            throw new Exception(errmsg);
        //            return GetAnyDayBalanceApprRet;
        //        }
        //    }
        //    strQuery = "select GetanydaybalAppr('" + BrCode + "'," + " '" + CrCode + "' ,'" + ModId + "'," + " '" + GlCode + "','" + AccNo + "'," + " '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "') from dual";

        //    objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //    dblAnyDayBal = objCmd.ExecuteScalar;

        //    objCmd.Dispose();
        //    objCmd = default;



        //    GetAnyDayBalanceApprRet = dblAnyDayBal.ToString();
        //    return GetAnyDayBalanceApprRet;

        //}

        //public string GetMinAmountBalMst(string CrCode, string ModId, string GlCode)
        //{
        //    string GetMinAmountBalMstRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    OracleClient.OracleDataReader objmdr;
        //    double dblMinAmt;
        //    dblMinAmt = 0d;
        //    try
        //    {


        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetMinAmountBalMstRet;
        //            }
        //        }
        //        strQuery = "SELECT MINAMOUNT FROM genminmaxbalancemst WHERE  glcode = '" + GlCode + "' AND  moduleid = '" + ModId + "' AND currencycode = '" + CrCode + "' AND categorycode = '99'";

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        objcommand = new OracleClient.OracleCommand(strQuery, objCon);

        //        objmdr = objcommand.ExecuteReader;
        //        if (objmdr.HasRows)
        //        {
        //            objmdr.Read();
        //            dblMinAmt = Conversions.ToDouble(Interaction.IIf(objmdr["MINAMOUNT"] is DBNull, 0, objmdr["MINAMOUNT"]));
        //        }
        //        else
        //        {
        //            dblMinAmt = 0d;
        //        }
        //        objmdr.Close();
        //        objmdr = default;
        //        objCmd.Dispose();
        //        objCmd = default;
        //        GetMinAmountBalMstRet = dblMinAmt.ToString();
        //        return GetMinAmountBalMstRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        dblMinAmt = 0d;
        //        GetMinAmountBalMstRet = dblMinAmt.ToString();
        //    }

        //    return GetMinAmountBalMstRet;

        //}

        //public void GetAnyDayBalanceCC(string BrCode, string CrCode, string ModId, string GlCode, string AccNo, DateTime TranDate, ref double pdblAnyDayBal, ref double pdbllimitamt, ref string strError)
        //{
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    double dblAnyDayBal;
        //    try
        //    {
        //        dblAnyDayBal = 0d;
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
        //        strQuery = "select GETANYDAYBAL('" + BrCode + "'," + " '" + CrCode + "' ,'" + ModId + "'," + " '" + GlCode + "','" + AccNo + "'," + " '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "') from dual";

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dblAnyDayBal = objCmd.ExecuteScalar;

        //        objCmd.Dispose();
        //        objCmd = default;


        //        double dbllimitamt = 0d;
        //        OracleClient.OracleDataReader rstod;
        //        double dbltodlimitamt = 0d;
        //        string strSql;
        //        OracleClient.OracleDataReader objDr;


        //        strSql = " select Sum(nvl(LINKEDAMOUNT,0)) AMOUNT from GENLIMITLNK where LINKEDACCNO='" + AccNo + "' and LINKEDGLCODE='" + GlCode + "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='INR' AND LINKEDMODULEID='" + ModId + "'   and closedate is null and status='R' ";

        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);

        //        objDr = objCmd.ExecuteReader();
        //        if (objDr.HasRows == true)
        //        {
        //            objDr.Read();
        //            dbllimitamt = Conversions.ToDouble(Interaction.IIf(objDr["AMOUNT"] is DBNull, 0, objDr["AMOUNT"]));
        //        }

        //        objDr.Close();
        //        objDr.Dispose();
        //        objDr = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        strSql = "SELECT NVL(TODLIMITAMT,0) TODLIMITAMT FROM genlimitlnk WHERE LINKEDACCNO = '" + AccNo + "' AND LINKEDGLCODE='" + GlCode + "' AND  LINKEDMODULEID='" + ModId + "' AND BRANCHCODE= '" + BrCode + "' AND CURRENCYCODE='INR' AND TODEXPDATE >= '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "' AND TODEXPDATE IS NOT NULL ";

        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);

        //        rstod = objCmd.ExecuteReader();

        //        if (rstod.HasRows == true)
        //        {
        //            rstod.Read();
        //            dbltodlimitamt = Conversions.ToDouble(Interaction.IIf(rstod["TODLIMITAMT"] is DBNull, 0, rstod["TODLIMITAMT"]));
        //        }
        //        else
        //        {
        //            dbltodlimitamt = 0d;
        //        }
        //        rstod.Close();
        //        rstod = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        pdblAnyDayBal = dblAnyDayBal;
        //        pdbllimitamt = dbllimitamt + dbltodlimitamt;


        //        return;
        //    }
        //    catch (Exception ex)
        //    {
        //        strError = ex.Message;
        //        pdblAnyDayBal = 0d;
        //        pdbllimitamt = 0d;

        //    }


        //}

        //public void GetAnyDayBalanceCCAppr(string BrCode, string CrCode, string ModId, string GlCode, string AccNo, DateTime TranDate, ref double pdblAnyDayBal, ref double pdbllimitamt, ref string strError)
        //{
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    double dblAnyDayBal;
        //    try
        //    {
        //        dblAnyDayBal = 0d;
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
        //        strQuery = "select GetanydaybalAppr('" + BrCode + "'," + " '" + CrCode + "' ,'" + ModId + "'," + " '" + GlCode + "','" + AccNo + "'," + " '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "') from dual";

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dblAnyDayBal = objCmd.ExecuteScalar;

        //        objCmd.Dispose();
        //        objCmd = default;


        //        double dbllimitamt = 0d;
        //        OracleClient.OracleDataReader rstod;
        //        double dbltodlimitamt = 0d;
        //        string strSql;
        //        OracleClient.OracleDataReader objDr;


        //        strSql = " select Sum(nvl(LINKEDAMOUNT,0)) AMOUNT from GENLIMITLNK where LINKEDACCNO='" + AccNo + "' and LINKEDGLCODE='" + GlCode + "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='INR' AND LINKEDMODULEID='" + ModId + "'   and closedate is null and status='R' ";

        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);

        //        objDr = objCmd.ExecuteReader();
        //        if (objDr.HasRows == true)
        //        {
        //            objDr.Read();
        //            dbllimitamt = Conversions.ToDouble(Interaction.IIf(objDr["AMOUNT"] is DBNull, 0, objDr["AMOUNT"]));
        //        }

        //        objDr.Close();
        //        objDr.Dispose();
        //        objDr = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        strSql = "SELECT NVL(TODLIMITAMT,0) TODLIMITAMT FROM genlimitlnk WHERE LINKEDACCNO = '" + AccNo + "' AND LINKEDGLCODE='" + GlCode + "' AND  LINKEDMODULEID='" + ModId + "' AND BRANCHCODE= '" + BrCode + "' AND CURRENCYCODE='INR' AND TODEXPDATE >= '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "' AND TODEXPDATE IS NOT NULL ";

        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);

        //        rstod = objCmd.ExecuteReader();

        //        if (rstod.HasRows == true)
        //        {
        //            rstod.Read();
        //            dbltodlimitamt = Conversions.ToDouble(Interaction.IIf(rstod["TODLIMITAMT"] is DBNull, 0, rstod["TODLIMITAMT"]));
        //        }
        //        else
        //        {
        //            dbltodlimitamt = 0d;
        //        }
        //        rstod.Close();
        //        rstod = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        pdblAnyDayBal = dblAnyDayBal;
        //        pdbllimitamt = dbllimitamt + dbltodlimitamt;


        //        return;
        //    }
        //    catch (Exception ex)
        //    {
        //        strError = ex.Message;
        //        pdblAnyDayBal = 0d;
        //        pdbllimitamt = 0d;
        //    }
        //}

        //public string GetRefno(ref OracleClient.OracleConnection gObjOracleConnection, ref OracleClient.OracleTransaction objTransaction, ref string returnMsg)
        //{
        //    string GetRefnoRet = default;
        //    try
        //    {
        //        string strSql1;
        //        OracleClient.OracleDataReader objDrcust;
        //        string strRefno;
        //        var objCmd = new OracleClient.OracleCommand();
        //        string errmsg;

        //        strSql1 = "SELECT (SELECT H2Hbankname FROM GENBANKPARM)||TO_CHAR(SYSDATE,'yymmdd')||x.refno  refno FROM (SELECT LPAD(NVL(MAX(SUBSTR(refno,11,6)),0)+1,6,'0') refno FROM neftrtgsdtls WHERE TO_NUMBER(SUBSTR(refno,5,6)) = TO_NUMBER(TO_CHAR(SYSDATE,'yymmdd'))) x";

        //        objCmd = new OracleClient.OracleCommand(strSql1, gObjOracleConnection);
        //        objCmd.Transaction = objTransaction;
        //        objDrcust = objCmd.ExecuteReader();
        //        if (objDrcust.HasRows)
        //        {
        //            objDrcust.Read();
        //            strRefno = Conversions.ToString(Interaction.IIf(objDrcust["refno"] is DBNull, "", objDrcust["refno"]));
        //        }
        //        else
        //        {
        //            strRefno = "";
        //        }
        //        GetRefnoRet = strRefno;
        //        objDrcust.Close();
        //        objDrcust = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        return GetRefnoRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        returnMsg = ex.Message;
        //        if (Strings.Trim(returnMsg).Length > 0)
        //        {
        //            returnMsg = Strings.Replace(returnMsg, "\n", " ");
        //            returnMsg = Strings.Replace(returnMsg, "\r", " ");
        //        }

        //    }

        //    return GetRefnoRet;
        //}

        //public string GetRefnoWithOutTrans()
        //{
        //    string GetRefnoWithOutTransRet = default;
        //    try
        //    {
        //        var objCon = new OracleClient.OracleConnection();
        //        var objCmd = new OracleClient.OracleCommand();
        //        var dbCon = new DatabaseConnection.cDBConnection();
        //        string errmsg, strQuery;
        //        string strMobileNo = "";
        //        OracleClient.OracleDataReader dr;
        //        OracleClient.OracleDataReader objDrcust;
        //        string strSql1, strRefno;
        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetRefnoWithOutTransRet;
        //            }
        //        }
        //        strSql1 = "SELECT (SELECT H2Hbankname FROM GENBANKPARM)||TO_CHAR(SYSDATE,'yymmdd')||x.refno  refno FROM (SELECT LPAD(NVL(MAX(SUBSTR(refno,11,6)),0)+1,6,'0') refno FROM neftrtgsdtls WHERE TO_NUMBER(SUBSTR(refno,5,6)) = TO_NUMBER(TO_CHAR(SYSDATE,'yymmdd'))) x";

        //        objCmd = new OracleClient.OracleCommand(strSql1, objCon);

        //        objDrcust = objCmd.ExecuteReader();
        //        if (objDrcust.HasRows)
        //        {
        //            objDrcust.Read();
        //            strRefno = Conversions.ToString(Interaction.IIf(objDrcust["refno"] is DBNull, "", objDrcust["refno"]));
        //        }
        //        else
        //        {
        //            strRefno = "";
        //        }
        //        GetRefnoWithOutTransRet = strRefno;
        //        objDrcust.Close();
        //        objDrcust = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        return GetRefnoWithOutTransRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetRefnoWithOutTransRet = ex.Message;


        //    }

        //    return GetRefnoWithOutTransRet;
        //}

        //private double GetLimitAmount(string pstrBrCode, string pstrmodid, string pstrGlcode, string pstrAccno, DateTime TranDate, OracleClient.OracleConnection objconn)
        //{
        //    double GetLimitAmountRet = default;

        //    var objCmd = new OracleClient.OracleCommand();

        //    OracleClient.OracleDataReader rstod;
        //    OracleClient.OracleDataReader objDr;
        //    double dbllimitamt = 0d;
        //    double dbltodlimitamt = 0d;
        //    string strSql;

        //    try
        //    {
        //        strSql = " select Sum(nvl(LINKEDAMOUNT,0)) AMOUNT from GENLIMITLNK where LINKEDACCNO='" + pstrAccno + "' and LINKEDGLCODE='" + pstrGlcode + "' AND BRANCHCODE='" + pstrBrCode + "' AND CURRENCYCODE='INR' AND LINKEDMODULEID='" + pstrmodid + "'   and closedate is null and status='R' ";

        //        objCmd = new OracleClient.OracleCommand(strSql, objconn);
        //        objDr = objCmd.ExecuteReader();
        //        if (objDr.HasRows == true)
        //        {
        //            objDr.Read();
        //            dbllimitamt = Conversions.ToDouble(Interaction.IIf(objDr["AMOUNT"] is DBNull, 0, objDr["AMOUNT"]));
        //        }

        //        objDr.Close();
        //        objDr.Dispose();
        //        objDr = default;
        //        objCmd.Dispose();
        //        objCmd = default;


        //        strSql = "SELECT NVL(TODLIMITAMT,0) TODLIMITAMT FROM genlimitlnk WHERE LINKEDACCNO = '" + pstrAccno + "' AND LINKEDGLCODE='" + pstrGlcode + "' AND  LINKEDMODULEID='" + pstrmodid + "' AND BRANCHCODE= '" + pstrBrCode + "' AND CURRENCYCODE='INR' AND TODEXPDATE >= '" + Strings.Format(TranDate, "dd-MMM-yyyy") + "' AND TODEXPDATE IS NOT NULL ";

        //        objCmd = new OracleClient.OracleCommand(strSql, objconn);
        //        rstod = objCmd.ExecuteReader();

        //        if (rstod.HasRows == true)
        //        {
        //            rstod.Read();
        //            dbltodlimitamt = Conversions.ToDouble(Interaction.IIf(rstod["TODLIMITAMT"] is DBNull, 0, rstod["TODLIMITAMT"]));
        //        }
        //        else
        //        {
        //            dbltodlimitamt = 0d;
        //        }
        //        rstod.Close();
        //        rstod = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //        GetLimitAmountRet = dbllimitamt + dbltodlimitamt;
        //        return GetLimitAmountRet;
        //    }
        //    catch (Exception ex)
        //    {

        //    }

        //    return GetLimitAmountRet;

        //}

        //public string GetCustMobileNo(string BrCode, string CrCode, string ModId, string GlCode, string AccNo)
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
        //        strQuery = "select custmobile from gencustinfomst where customerid = " + " (select DISTINCT customerid from " + ModId + "mst where " + " accno = '" + AccNo + "'  and glcode='" + GlCode + "'" + " and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "')";

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

        //public void GetCustomerIDName(string BrCode, string CrCode, string ModId, string GlCode, string AccNo, ref string strCustomerID, ref string strName)
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
        //        strQuery = "select DISTINCT customerid customerid,name from " + ModId + "mst where " + " accno = '" + AccNo + "'  and glcode='" + GlCode + "'" + " and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "'";

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

        //public string GetCloseBal(string BrCode, string CrCode, string ModId, string GlCode, string AccNo)
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
        //        strQuery = "select sum(nvl(closebal,0)) closebal from (select curbal closebal from " + ModId + "balance where  accno = '" + AccNo + "'  and glcode='" + GlCode + "' and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "'" + " union all " + " select sum(nvl(amount,0)) closebal from " + ModId + "tranday where accno = '" + AccNo + "'  and glcode='" + GlCode + "' and branchcode='" + BrCode + "'and currencycode = '" + CrCode + "')";

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

        //public string GetNFTSCONVYN()
        //{
        //    string GetNFTSCONVYNRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    string strNFTSCONVYN = "";
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
        //                return GetNFTSCONVYNRet;
        //            }
        //        }
        //        strQuery = "select NFTSCONVYN from genbankparm";
        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dr = objCmd.ExecuteReader;

        //        if (dr.HasRows == true)
        //        {
        //            dr.Read();
        //            strNFTSCONVYN = Conversions.ToString(Interaction.IIf(dr["NFTSCONVYN"] is DBNull, "N", dr["NFTSCONVYN"]));
        //        }
        //        else
        //        {
        //            strNFTSCONVYN = "N";
        //        }
        //        dr.Close();
        //        dr = default;
        //        objCmd.Dispose();
        //        objCmd = default;
        //        GetNFTSCONVYNRet = strNFTSCONVYN;
        //        return GetNFTSCONVYNRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetNFTSCONVYNRet = "N";
        //    }

        //    return GetNFTSCONVYNRet;
        //}

        //// get parameter details for feature
        //public bool GetParameterDetails(int intfeatcd1, ref string strmsgtags, ref string strcustmessage, ref string strtrantypeg, ref string strsmstypeg, ref string strmode1, ref int intdays, ref string strschtype, ref DateTime dtschdate, [Optional, DefaultParameterValue(0d)] ref double dblminamt)
        //{
        //    bool GetParameterDetailsRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    var dr = default(OracleClient.OracleDataReader);
        //    try
        //    {
        //        strmsgtags = "";
        //        strcustmessage = "";
        //        strtrantypeg = "";
        //        strsmstypeg = "";
        //        strmode1 = "";
        //        intdays = 0;
        //        strschtype = "";
        //        dblminamt = 0d;
        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetParameterDetailsRet;
        //            }
        //        }
        //        strQuery = "select nvl(m.messagetags,'') MESSAGETAGS, nvl(s.CUSTOMERMESSAGE,'') CUSTOMERMESSAGE, s.TRANTYPE, s.SMSTYPE,s.mode1,s.days,s.schtype,nvl(s.nextpushdate,s.schday) schday,s.minamt from smstypemst s , smsfeaturemst m   where s.featurecode = m.featurecode and m.activeyn = 'Y' and s.featurecode =" + intfeatcd1;

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dr = objCmd.ExecuteReader();
        //        if (dr.Read())
        //        {
        //            strmsgtags = dr["MESSAGETAGS"].ToString;
        //            strcustmessage = dr["CUSTOMERMESSAGE"].ToString;
        //            strtrantypeg = dr["TRANTYPE"].ToString;
        //            strsmstypeg = Conversions.ToString(Interaction.IIf(dr["SMSTYPE"] is DBNull, "", dr["SMSTYPE"].ToString));
        //            strmode1 = Conversions.ToString(Interaction.IIf(dr["mode1"] is DBNull, "", dr["mode1"].ToString));
        //            intdays = Conversions.ToInteger(Interaction.IIf(dr["days"] is DBNull, 0, dr["days"].ToString));
        //            strschtype = Conversions.ToString(Interaction.IIf(dr["schtype"] is DBNull, "", dr["schtype"].ToString));
        //            if (dr["schday"] is DBNull)
        //            {
        //            }
        //            else
        //            {
        //                dtschdate = dr["schday"].ToString;
        //            }
        //            dblminamt = Conversions.ToDouble(Interaction.IIf(dr["minamt"] is DBNull, 0, dr["minamt"].ToString));

        //            GetParameterDetailsRet = true;
        //            objCmd.Dispose();
        //            objCmd = default;
        //            dr.Close();
        //            dr = default;
        //            return GetParameterDetailsRet;
        //        }
        //        else
        //        {
        //            GetParameterDetailsRet = false;
        //            return GetParameterDetailsRet;
        //        }

        //        return GetParameterDetailsRet;
        //    }
        //    catch (Exception ex)
        //    {

        //        objCmd.Dispose();
        //        objCmd = default;
        //        dr.Close();
        //        dr = default;
        //    }

        //    return GetParameterDetailsRet;
        //}

        //public string getSMSAccno(string NFTSCONVYN, string straccno)
        //{
        //    string getSMSAccnoRet = default;
        //    var strmodaccno = default(string);
        //    if (NFTSCONVYN == "N")
        //    {
        //        if (Strings.Len(straccno) == 1)
        //        {
        //            strmodaccno = "XXXXX" + straccno;
        //        }
        //        else if (Strings.Len(straccno) == 2)
        //        {
        //            strmodaccno = "XXXX" + straccno;
        //        }
        //        else if (Strings.Len(straccno) == 3)
        //        {
        //            strmodaccno = "XXX" + straccno;
        //        }
        //        else if (Strings.Len(straccno) == 4)
        //        {
        //            strmodaccno = "XXX" + Strings.Mid(straccno, 2, 3);
        //        }
        //        else if (Strings.Len(straccno) == 5)
        //        {
        //            strmodaccno = "XXX" + Strings.Mid(straccno, 3, 3);
        //        }
        //        else if (Strings.Len(straccno) == 6)
        //        {
        //            strmodaccno = "XXX" + Strings.Mid(straccno, 4, 3);
        //        }
        //    }
        //    else if (NFTSCONVYN == "Y")
        //    {

        //        string straccno1;
        //        string straccnotrimst;
        //        straccno1 = Strings.Mid(straccno, 10, 7);
        //        straccnotrimst = straccno1.TrimStart('0');
        //        if (Strings.Len(straccnotrimst) == 1)
        //        {
        //            strmodaccno = "XXXXXX" + straccnotrimst;
        //        }
        //        else if (Strings.Len(straccnotrimst) == 2)
        //        {
        //            strmodaccno = "XXXXX" + straccnotrimst;
        //        }
        //        else if (Strings.Len(straccnotrimst) == 3)
        //        {
        //            strmodaccno = "XXXX" + straccnotrimst;
        //        }
        //        else if (Strings.Len(straccnotrimst) == 4)
        //        {
        //            strmodaccno = "XXXX" + Strings.Mid(straccnotrimst, 2, 3);
        //        }
        //        else if (Strings.Len(straccnotrimst) == 5)
        //        {
        //            strmodaccno = "XXXX" + Strings.Mid(straccnotrimst, 3, 3);
        //        }
        //        else if (Strings.Len(straccnotrimst) == 6)
        //        {
        //            strmodaccno = "XXXX" + Strings.Mid(straccnotrimst, 4, 3);
        //        }
        //        else if (Strings.Len(straccnotrimst) == 7)
        //        {
        //            strmodaccno = "XXXX" + Strings.Mid(straccnotrimst, 5, 3);
        //        }
        //    }
        //    getSMSAccnoRet = strmodaccno;
        //    return getSMSAccnoRet;
        //}

        //public string GetSMSBankName()
        //{
        //    string GetSMSBankNameRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, strQuery;
        //    string strSMSBankName = "";
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
        //                return GetSMSBankNameRet;
        //            }
        //        }
        //        strQuery = "SELECT smsbankname FROM smsparameters";
        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dr = objCmd.ExecuteReader;

        //        if (dr.HasRows == true)
        //        {
        //            dr.Read();
        //            strSMSBankName = Conversions.ToString(Interaction.IIf(dr["smsbankname"] is DBNull, "", dr["smsbankname"]));
        //        }
        //        else
        //        {
        //            strSMSBankName = "";
        //        }
        //        dr.Close();
        //        dr = default;
        //        objCmd.Dispose();
        //        objCmd = default;
        //        GetSMSBankNameRet = strSMSBankName;
        //        return GetSMSBankNameRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetSMSBankNameRet = "";
        //    }

        //    return GetSMSBankNameRet;
        //}

        //public string GetAccName(string strfullAccno)
        //{
        //    string GetAccNameRet = default;
        //    try
        //    {
        //        string strfullaccno1, pstrBrId, pstrGlcd, NFTSCONVYN, pstrAccNo, pstrACTP;
        //        strfullaccno1 = Strings.StrReverse(Strings.Mid(Strings.StrReverse(strfullAccno), 1, 16));

        //        pstrBrId = Strings.Mid(strfullaccno1, 1, 3);
        //        pstrGlcd = Strings.Mid(strfullaccno1, 4, 6);

        //        // ' for accno 16 digits only
        //        NFTSCONVYN = GetNFTSCONVYN();
        //        if (NFTSCONVYN == "Y")
        //        {
        //            pstrAccNo = pstrBrId + pstrGlcd + Strings.Mid(strfullaccno1, 10, 7);
        //        }
        //        else
        //        {
        //            pstrAccNo = Strings.Mid(strfullaccno1, 10, 7).TrimStart('0');
        //        }

        //        pstrACTP = GetModuleID(pstrGlcd);

        //        var objCon = new OracleClient.OracleConnection();
        //        var objCmd = new OracleClient.OracleCommand();
        //        var dbCon = new DatabaseConnection.cDBConnection();
        //        string errmsg, sQuery;
        //        OracleClient.OracleDataReader recnfts;

        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetAccNameRet;
        //            }
        //        }
        //        string strQuery;
        //        string strAccName;
        //        OracleClient.OracleDataReader dr;
        //        strQuery = "select name from " + pstrACTP + "mst where " + " accno = '" + pstrAccNo + "'  and glcode='" + pstrGlcd + "'" + " and branchcode='" + pstrBrId + "'and currencycode = 'INR'";

        //        objCmd = new OracleClient.OracleCommand(strQuery, objCon);
        //        dr = objCmd.ExecuteReader;
        //        if (dr.HasRows == true)
        //        {
        //            dr.Read();
        //            strAccName = Conversions.ToString(Interaction.IIf(dr["name"] is DBNull, "", dr["name"]));
        //        }
        //        else
        //        {
        //            strAccName = "";
        //        }

        //        dr.Close();
        //        dr = default;
        //        objCmd.Dispose();
        //        objCmd = default;
        //        GetAccNameRet = strAccName;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetAccNameRet = "";
        //    }

        //    return GetAccNameRet;
        //}

        //public string GetModuleID(string pstrGlcd)
        //{
        //    string GetModuleIDRet = default;
        //    var pstrACTP = default(string);
        //    try
        //    {


        //        if (pstrGlcd == "102020")
        //        {
        //            pstrACTP = "SB";
        //        }
        //        else if (pstrGlcd == "102030")
        //        {
        //            pstrACTP = "CA";
        //        }
        //        else if (Strings.Mid(pstrGlcd, 1, 3) == "104")
        //        {
        //            pstrACTP = "DEP";
        //        }
        //        else if (Strings.Mid(pstrGlcd, 1, 3) == "206")
        //        {

        //            pstrACTP = GetModuleIDCCLOAN(pstrGlcd);
        //        }
        //        GetModuleIDRet = pstrACTP;
        //        return GetModuleIDRet;
        //    }
        //    catch (Exception ex)
        //    {

        //    }

        //    return GetModuleIDRet;
        //}

        //public string GetModuleIDCCLOAN(string pglcode)
        //{
        //    string GetModuleIDCCLOANRet = default;
        //    string strmodid = "";
        //    string strError10;
        //    string strSql;
        //    var objCon = new OracleClient.OracleConnection();
        //    var objCmd = new OracleClient.OracleCommand();
        //    var dbCon = new DatabaseConnection.cDBConnection();
        //    string errmsg, sQuery;
        //    OracleClient.OracleDataReader recnfts;
        //    try
        //    {
        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetModuleIDCCLOANRet;
        //            }
        //        }

        //        strSql = "select moduleid  from cctypemst where glcode = '" + pglcode + "' union select moduleid  from loantypemst where glcode = '" + pglcode + "'";
        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //        recnfts = objCmd.ExecuteReader();
        //        if (recnfts.HasRows == true)
        //        {
        //            recnfts.Read();
        //            strmodid = Conversions.ToString(Interaction.IIf(recnfts["moduleid"] is DBNull, "", recnfts["moduleid"]));
        //        }
        //        GetModuleIDCCLOANRet = strmodid;
        //        recnfts.Close();
        //        recnfts.Dispose();
        //        recnfts = default;
        //        objCmd.Dispose();
        //        objCmd = default;
        //        return GetModuleIDCCLOANRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        GetModuleIDCCLOANRet = "";
        //        strError10 = ex.Message;
        //    }

        //    return GetModuleIDCCLOANRet;
        //}

        //public string GetPanYN(string strcustid, string strtds, ref string strErrorMessage, [Optional, DefaultParameterValue("")] ref string pstrPAN206AAYN, [Optional, DefaultParameterValue("")] ref string pstrPAN206ABYN)
        //{
        //    string GetPanYNRet = default;
        //    string errmsg;
        //    var objCon = new OracleClient.OracleConnection();

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
        //                return GetPanYNRet;
        //            }
        //        }
        //        GetPanYNRet = Conversions.ToString(GetPanYNDtls(strcustid, strtds, ref strErrorMessage, ref objCon, ref pstrPAN206AAYN, ref pstrPAN206ABYN));
        //        return GetPanYNRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        strErrorMessage = ex.Message;
        //    }

        //    return GetPanYNRet;
        //}

        //public string GetPanYN_Con(string strcustid, string strtds, ref string strErrorMessage, ref OracleClient.OracleConnection objCon, [Optional, DefaultParameterValue("")] ref string pstrPAN206AAYN, [Optional, DefaultParameterValue("")] ref string pstrPAN206ABYN)
        //{
        //    string GetPanYN_ConRet = default;
        //    try
        //    {


        //        GetPanYN_ConRet = Conversions.ToString(GetPanYNDtls(strcustid, strtds, ref strErrorMessage, ref objCon, ref pstrPAN206AAYN, ref pstrPAN206ABYN));
        //        return GetPanYN_ConRet;
        //    }
        //    catch (Exception ex)
        //    {
        //        strErrorMessage = ex.Message;
        //    }

        //    return GetPanYN_ConRet;
        //}

        //private object GetPanYNDtls(string strcustid, string strtds, ref string strErrorMessage, ref OracleClient.OracleConnection objCon, [Optional, DefaultParameterValue("")] ref string pstrPAN206AAYN, [Optional, DefaultParameterValue("")] ref string pstrPAN206ABYN)
        //{
        //    object GetPanYNDtlsRet = default;
        //    string strSql;
        //    var objCmd = new OracleClient.OracleCommand();
        //    OracleClient.OracleDataReader recnfts;
        //    OracleClient.OracleDataReader recnfts1;

        //    string strPANYN = "";
        //    string strPAN206AAYN, strPAN206ABYN;
        //    strPAN206AAYN = "";
        //    strPAN206ABYN = "";
        //    strSql = "SELECT PAN206AAYN,PAN206ABYN FROM gencustinfomst WHERE  CUSTOMERID = '" + strcustid + "'";
        //    objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //    recnfts = objCmd.ExecuteReader();
        //    if (recnfts.HasRows == true)
        //    {
        //        recnfts.Read();
        //        strPAN206AAYN = recnfts["PAN206AAYN"];
        //        strPAN206ABYN = recnfts["PAN206ABYN"];
        //    }
        //    recnfts.Close();
        //    recnfts = default;
        //    objCmd.Dispose();
        //    objCmd = default;
        //    pstrPAN206AAYN = strPAN206AAYN;
        //    pstrPAN206ABYN = strPAN206ABYN;
        //    if (strtds == "TDS")
        //    {

        //        strSql = "SELECT panno FROM gencustinfomst WHERE KYCID=2 and  CUSTOMERID = '" + strcustid + "'";

        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //        recnfts = objCmd.ExecuteReader();
        //        if (recnfts.HasRows == true)
        //        {
        //            recnfts.Read();
        //            if (recnfts["panno"] is DBNull == true)
        //            {
        //                strPANYN = "N"; // ' 20%
        //            }

        //            else if (recnfts["panno"].ToString().Length != 10)
        //            {
        //                strPANYN = "N";   // ' 20%
        //            }
        //            // ' pan no is there
        //            else if (strPAN206AAYN == "Y" & strPAN206ABYN == "Y")
        //            {
        //                strPANYN = "N";   // ' 20%
        //            }
        //            else if (strPAN206AAYN == "Y" & strPAN206ABYN == "N")
        //            {
        //                strPANYN = "Y";   // ' 10%
        //            }
        //            else if (strPAN206AAYN == "N" & strPAN206ABYN == "Y")
        //            {
        //                strPANYN = "N";   // ' 20%
        //            }
        //            else if (strPAN206AAYN == "N" & strPAN206ABYN == "N")
        //            {
        //                strPANYN = "N";   // ' 20%
        //                                  // ' 20%
        //            }
        //        }
        //        else
        //        {
        //            strPANYN = "N";
        //        }
        //    }
        //    else if (strtds == "Form 15H" | strtds == "Form 15G")
        //    {
        //        strSql = "SELECT panno FROM gencustinfomst WHERE KYCID=2 and  CUSTOMERID = '" + strcustid + "'";

        //        objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //        recnfts = objCmd.ExecuteReader();
        //        if (recnfts.HasRows == true)
        //        {
        //            recnfts.Read();
        //            if (recnfts["panno"] is DBNull == true)
        //            {
        //                strPANYN = "N"; // ' 20%
        //            }

        //            else if (recnfts["panno"].ToString().Length != 10)
        //            {
        //                strPANYN = "N";   // ' 20%
        //            }
        //            // ' pan no is there
        //            else if (strPAN206AAYN == "Y" & strPAN206ABYN == "Y")
        //            {
        //                strPANYN = "N";   // ' 20%
        //            }
        //            else if (strPAN206AAYN == "Y" & strPAN206ABYN == "N")
        //            {
        //                strPANYN = "";   // ' 
        //            }
        //            else if (strPAN206AAYN == "N" & strPAN206ABYN == "Y")
        //            {
        //                strPANYN = "N";   // ' 20%
        //            }
        //            else if (strPAN206AAYN == "N" & strPAN206ABYN == "N")
        //            {
        //                strPANYN = "N";   // ' 20%

        //            }
        //        }
        //        else
        //        {
        //            strPANYN = "N";
        //        }
        //        recnfts.Close();
        //        recnfts = default;
        //        objCmd.Dispose();
        //        objCmd = default;

        //    }
        //    GetPanYNDtlsRet = strPANYN;
        //    return GetPanYNDtlsRet;
        //}

        //public string GetTDSFlag(string BrCode, string CurCode, string DepGlcode, string DepAccNo)
        //{
        //    string GetTDSFlagRet = default;
        //    var objCon = new OracleClient.OracleConnection();
        //    var dbCon = new DatabaseConnection.cDBConnection();

        //    string errmsg;
        //    try
        //    {

        //        if (objCon.State != ConnectionState.Open)
        //        {
        //            errmsg = "";
        //            objCon = dbCon.GetDbConnection(errmsg);
        //            if (!string.IsNullOrEmpty(errmsg))
        //            {
        //                throw new Exception(errmsg);
        //                return GetTDSFlagRet;
        //            }
        //        }

        //        GetTDSFlagRet = GetTDSFlagDtls(BrCode, CurCode, DepGlcode, DepAccNo, ref objCon);

        //        return GetTDSFlagRet;
        //    }
        //    catch (Exception ex)
        //    {

        //    }

        //    return GetTDSFlagRet;
        //}

        //public string GetTDSFlag_Con(string BrCode, string CurCode, string DepGlcode, string DepAccNo, ref OracleClient.OracleConnection objCon)
        //{
        //    string GetTDSFlag_ConRet = default;

        //    try
        //    {



        //        GetTDSFlag_ConRet = GetTDSFlagDtls(BrCode, CurCode, DepGlcode, DepAccNo, ref objCon);

        //        return GetTDSFlag_ConRet;
        //    }
        //    catch (Exception ex)
        //    {

        //    }

        //    return GetTDSFlag_ConRet;
        //}

        //public string GetTDSFlagDtls(string BrCode, string CurCode, string DepGlcode, string DepAccNo, ref OracleClient.OracleConnection objCon)
        //{
        //    string GetTDSFlagDtlsRet = default;
        //    string strSql;

        //    var objCmd = new OracleClient.OracleCommand();

        //    string strtdsyn1;
        //    OracleClient.OracleDataReader recnfts1;
        //    strSql = "";
        //    strSql = "SELECT nvl(TDSYN,'N') TDSYN, nvl(EXMPFORMSRECYN,'N') EXMPFORMSRECYN , nvl(FORMS15G,'N') FORMS15G, nvl(NONTDS,'N') NONTDS FROM depmst WHERE BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CurCode + "' AND GLCODE='" + DepGlcode + "' AND ACCNO='" + DepAccNo + "'";

        //    objCmd = new OracleClient.OracleCommand(strSql, objCon);
        //    recnfts1 = objCmd.ExecuteReader();
        //    if (recnfts1.HasRows == true)
        //    {
        //        recnfts1.Read();

        //        if (recnfts1["NONTDS"] == "Y")
        //        {
        //            strtdsyn1 = "Non TDS";
        //        }
        //        else if (recnfts1["TDSYN"] == "Y")
        //        {
        //            strtdsyn1 = "TDS";
        //        }
        //        else if (recnfts1["EXMPFORMSRECYN"] == "Y")
        //        {
        //            strtdsyn1 = "Form 15H";
        //        }
        //        else if (recnfts1["FORMS15G"] == "Y")
        //        {
        //            strtdsyn1 = "Form 15G";
        //        }
        //        else
        //        {
        //            strtdsyn1 = "Non TDS";
        //        }
        //    }
        //    else
        //    {
        //        strtdsyn1 = "";
        //    }
        //    recnfts1.Close();
        //    recnfts1 = default;
        //    objCmd.Dispose();
        //    objCmd = default;

        //    GetTDSFlagDtlsRet = strtdsyn1;
        //    return GetTDSFlagDtlsRet;
        //}

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
