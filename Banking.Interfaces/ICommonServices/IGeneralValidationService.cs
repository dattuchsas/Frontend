using System;

namespace Banking.Interfaces
{
    public interface IGeneralValidationService
    {
        Task<string> GetHOTRALWBrCode();

        Task<string> GetDebitCreditByYealrly(string branchCode, string moduleId, string glCode, string accountNo, string appDate);

        Task<string> GetExcIntRevFrmDepIntAccDtls(string br, string cr, string gl, string acc, string frmdate, string todate);

        Task<string> GetSystemDate();

        Task<string> GetDepCertificateNameWOconn();

        Task<string> GetAnyDayBalance(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, DateTime TranDate);

        Task<string> GetAnyDayBalanceAppr(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, DateTime TranDate);

        Task<string> GetMinAmountBalMst(string CrCode, string ModId, string GlCode);

        Task GetAnyDayBalanceCC(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, DateTime TranDate, double pdblAnyDayBal,
            double pdbllimitamt, string strError);

        Task GetAnyDayBalanceCCAppr(string BrCode, string CrCode, string ModId, string GlCode, string accountNo, DateTime TranDate, double pdblAnyDayBal,
            double pdbllimitamt, string strError);

        Task<string> GetRefno();

        Task<string> GetRefnoWithOutTrans();

        Task<string> GetCustMobileNo(string BrCode, string CrCode, string ModId, string GlCode, string accountNo);

        Task GetCustomerIDName(string BrCode, string CrCode, string ModId, string GlCode, string accountNo);

        Task<string> GetCloseBal(string BrCode, string CrCode, string ModId, string GlCode, string accountNo);

        Task<string> GetNFTSCONVYN();

        // Get parameter details for feature
        Task<bool> GetParameterDetails(int intfeatcd1, string strmsgtags, string strcustmessage, string strtrantypeg, string strsmstypeg,
            string strmode1, int intdays, string strschtype, DateTime dtschdate, double dblminamt);

        string GetSMSAccno(string NFTSCONVYN, string straccno);

        Task<string> GetSMSBankName();

        Task<string> GetAccName(string strfullAccno);

        Task<string> GetModuleID(string pstrGlcd);

        Task<string> GetModuleIDCCLOAN(string pglcode);

        Task<string> GetPanYN(string strcustid, string strtds, string pstrPAN206AAYN, string pstrPAN206ABYN);

        Task<string> GetPanYN_Con(string strcustid, string strtds, string pstrPAN206AAYN, string pstrPAN206ABYN);

        Task<string> GetTDSFlag(string BrCode, string CurCode, string DepGlcode, string DepAccNo);

        Task<string> GetTDSFlag_Con(string BrCode, string CurCode, string DepGlcode, string DepAccNo);

        Task<string> GetTDSFlagDtls(string BrCode, string CurCode, string DepGlcode, string DepAccNo);

        Task<string> GetTDSyn(string BrCode, string CurCode, string DepGlcode, string DepAccNo);

        Task<string> GetLoginOTPYN();

        Task GetCKYCEnrollDetails(string strkycenrolldate);

        Task<string> getCheckIMPSCycle(string strPrcsCode, string strTransAmt);

        Task<string> getNEFTMobileFrm_bnkbrhmst(string strbrid);

        Task<string> GetCCDrCrLienYN(string strBrCode, string strCurcode, string strModId, string strGlcode, string strAccno, DateTime TranDate);

        Task<string> GetSBCADrCrLienYN(string strMode, string strBrCode, string strCurcode, string strModId, string strGlcode, string strAccno,
            double TransAmt, DateTime TranDate);

        Task<object> GetMaturityvalue(string Period, string EffDate, string MatDate, double Amount, string CompoundTerm, 
            string InstalmentsYN, double ROI, string strpremat = "0");
    }
}
