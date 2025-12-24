using Banking.Backend;
using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Concurrent;
using System.Net.Http;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Banking.Services
{
    public class LoginService : ILoginService
    {
        private readonly IDatabaseService _databaseFactory;

        private DateTime DtLicFrmDt = DateTime.MinValue;
        private DateTime DtLicToDt = DateTime.MinValue;
        private DateTime DtAMCFrmDt = DateTime.MinValue;
        private DateTime DtAMCToDt = DateTime.MinValue;

        private string strliamc = string.Empty; // L - License, A - AMC

        private string GetBankDataRet = string.Empty;

        string query = string.Empty;
        string loginValidateRet = string.Empty;

        string branchCode = string.Empty;
        string userMode = string.Empty;
        string bankName = string.Empty;

        DateTime dtAppDt = DateTime.MinValue;
        DateTime dtFrmDt = DateTime.MinValue;
        DateTime dtToDt = DateTime.MinValue;

        DateTime strDtLicFeePend = DateTime.MinValue;
        DateTime strDtAMCFeePend = DateTime.MinValue;

        DateTime currDate = DateTime.MinValue;

        public LoginService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        public async Task<string> LoginValidate(string userId)
        {
            OracleDataReader reader;

            try
            {
                // Query to convert
                query = $"select distinct a.branchcode,a.GROUPID from genusermst a, genbankbranchmst b where a.branchcode=b.branchcode and upper(a.userid) = \'{userId}\'";

                reader = await _databaseFactory.ProcessQuery(query);

                if (reader != null && !reader.IsClosed && reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        branchCode = reader.GetString(0);
                        userMode = reader.GetString(1);
                    }
                }

                // Query to convert
                query = "SELECT DEPCERTIFICATE FROM genbankparm";

                reader = await _databaseFactory.ProcessQuery(query);

                if (reader != null && !reader.IsClosed && reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        int depCertIndex = reader.GetOrdinal("DEPCERTIFICATE");
                        bankName = reader.IsDBNull(depCertIndex) ? string.Empty : reader.GetString(depCertIndex);
                    }
                }

                if (string.IsNullOrEmpty(bankName))
                {
                    loginValidateRet = "Noo~Bank Name Is Not Set";
                    return string.Empty;
                }

                // Licence and AMC EXPIRY Dates
                // Kuppam       -- 30-06-2017   -   AMC          ( Single Branch )  - software changed
                // Dharmavaram  -- 19-10-2019   -   AMC          ( Single Branches)
                // Palamoor     -- 31-10-2019   -   AMC          ( Two Branches )
                // Nellore      -- 21-11-2019   -   AMC          ( Two Branches)
                // Salur        -- 31-12-2019   -   AMC          ( Single Branch+ATM)
                // Eluru        -- 14-02-2019   -   AMC          ( Four Branches )
                // Swarna       -- 31-03-2019   -   AMC          ( SINGLE BRANCH )
                // Maharaja     -- 30-04-2019   -   AMC          ( Five BRANCHES + Mobile+IMPS )
                // Amalapuram   -- 15-06-2019   -   AMC          ( Single Branch) -- AMC increase @10% every two years
                // GUNTUR       -- 31-08-2019   -   AMC          ( SINGLE BRANCH)

                // Query to convert
                query = $"SELECT to_char(applicationdate,'dd-Mon-yyyy') appdate FROM genapplicationdatemst where branchcode = \'{branchCode}\'";

                reader = await _databaseFactory.ProcessQuery(query);

                if (reader != null && !reader.IsClosed && reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        int depCertIndex = reader.GetOrdinal("appdate");
                        dtAppDt = Convert.ToDateTime(reader.GetValue(depCertIndex));
                    }
                }

                loginValidateRet = GetBankData(bankName, branchCode);

                if (loginValidateRet != BankingConstants.DataPresent)
                {
                    return string.Empty;
                }

                if (strliamc == "L")  // ' license
                {
                    dtFrmDt = DtLicFrmDt;
                    dtToDt = DtLicToDt;
                }
                else if (strliamc == "A") // ' AMC
                {
                    dtFrmDt = DtAMCFrmDt;
                    dtToDt = DtAMCToDt;
                }
                else
                {
                    loginValidateRet = "Noo~License Or AMC Not Set";
                    return string.Empty;
                }

                double dblDiffDays = 0;

                // Before License or AMC is expired - start before expiry of license or AMC
                if (dtAppDt >= dtFrmDt && dtAppDt <= dtToDt)
                {
                    dblDiffDays = BankingExtensions.DateDifference("d", dtAppDt, dtToDt);
                    if (dblDiffDays <= 7d)        // '' below 7 days
                    {
                        if (strliamc == "A")
                        {
                            loginValidateRet = "Mes~Your AMC Is Going To Expire On " + string.Format("dd-MMM-yyyy", dtToDt) + ", " + " Please Renew It";
                        }
                        else
                        {
                            loginValidateRet = "Mes~Your License Is Going To Expire On " + string.Format("dd-MMM-yyyy", dtToDt, "dd-MMM-yyyy") + "," + " Please Enter Into AMC";
                        }
                    }
                }

                // 'after license or AMC is expired - start appdate is greater than expiry date
                if (dtAppDt >= dtToDt)
                {
                    dblDiffDays = BankingExtensions.DateDifference("d", dtToDt, dtAppDt);
                    if (dblDiffDays <= 4d)        // '' below 4 days
                    {
                        if (strliamc == "A")
                        {
                            loginValidateRet = "Mes~Your AMC Is Expired On " + string.Format("dd-MMM-yyyy", dtToDt, "dd-MMM-yyyy") + ", Please " + " Renew Your AMC Before " + string.Format("dd-MMM-yyyy", dtToDt.AddDays(7)) + " To " + " Extend Our Services ";
                        }
                        else
                        {
                            loginValidateRet = "Mes~Your License Is Expired On " + string.Format("dd-MMM-yyyy", dtToDt, "dd-MMM-yyyy") + ", Please" + " Enter Into AMC Before " + string.Format("dd-MMM-yyyy", dtToDt.AddDays(7));
                        }
                    }
                    else if (dblDiffDays >= 5d & dblDiffDays <= 7d)  // '' above 5 days below 7 days
                    {
                        if (strliamc == "A")
                        {
                            loginValidateRet = "Mes~Your AMC Is Expired On " + string.Format("dd-MMM-yyyy", dtToDt, "dd-MMM-yyyy") + ", Please" + " Renew Your AMC Before " + string.Format("dd-MMM-yyyy", dtToDt.AddDays(7)) + " To " + " Extend Our Services ";
                        }
                        else
                        {
                            loginValidateRet = "Mes~Your License Is Expired On " + string.Format("dd-MMM-yyyy", dtToDt, "dd-MMM-yyyy") + ", Please" + " Enter Into AMC Before " + string.Format("dd-MMM-yyyy", dtToDt.AddDays(7)) + " For " + " Extending Support ";
                        }
                    }
                    else if (strliamc == "A")
                    {
                        loginValidateRet = "NoA~Your AMC Period Is Expired, Please Contact Raminfo Ltd.";
                    }
                    else
                    {
                        loginValidateRet = "NoL~Your License Period Is Expired, Please Contact Raminfo Ltd.";
                    } // 'strliamc = "A"
                }

                // License pending fee - application date less than license fee pending cut off date
                if (strDtLicFeePend.GetType() == typeof(DateTime))
                {
                    if (dtAppDt <= strDtLicFeePend)
                    {
                        dblDiffDays = BankingExtensions.DateDifference("d", dtAppDt, strDtLicFeePend);

                        if (dblDiffDays <= 7d)   // ' before 7 days of cut off date
                        {
                            loginValidateRet = "Mes~Your License Fee Is Pending, Please Pay On" + " Before  " + string.Format("dd-MMM-yyyy", strDtLicFeePend, "dd-MMM-yyyy") + ". To Extending Services ";
                        } // 'dblDiffDays <= 7
                    }

                    else if (dtAppDt > strDtLicFeePend) // '  when app date greater than cut off date
                    {

                        loginValidateRet = "NoP~License Fee Is Not Paid, Please Contact Raminfo Ltd. To Extend " + "Our Services";

                    } // ' dtAppDt <= CDate(strDtlicfeepend)
                }

                // Start AMC pending fee - application date less than AMC fee pending cut off date
                if (strDtAMCFeePend.GetType() == typeof(DateTime))
                {
                    if (dtAppDt <= strDtAMCFeePend)
                    {

                        dblDiffDays = BankingExtensions.DateDifference("d", dtAppDt, strDtAMCFeePend);

                        if (dblDiffDays <= 7d)   // ' before 7 days of cut off date
                        {
                            loginValidateRet = "Mes~Your AMC Fee Is Pending, Please Pay On" + " Before  " + strDtAMCFeePend + ". To Extending Services ";
                        } // 'dblDiffDays <= 7
                    }

                    else if (dtAppDt > strDtAMCFeePend) // '  when app date greater than cut off date
                    {

                        loginValidateRet = "NoP~AMC Fee Is Not Paid, Please Contact Raminfo Ltd. To Extend Our Services";

                    } // ' dtAppDt <= CDate(strDtamcfeepend)
                } // ' IsDate(strDtamcfeepend)

                // System date > expiry date
                currDate = DateTime.Now;
                if (currDate > dtToDt)
                {
                    dblDiffDays = BankingExtensions.DateDifference("d", dtToDt, currDate); //  .DateDiff("d", );
                    if (dblDiffDays > 7d)
                    {
                        if (dblDiffDays <= 10d)    // ' before 10 days of cut off date
                        {
                            loginValidateRet = "Mes~";
                        }
                        else
                        {
                            loginValidateRet = "DLL~Your AMC Period Is Expired, Please Contact SAS Ltd.";
                        } // 'dblDiffDays <= 10
                    }
                }

                string subString = loginValidateRet.Substring(1, 3);
                if (subString != "NoA" | subString != "NoL" | subString != "NoP")
                {
                    if (userMode == "ADMIN" | userMode == "MGR" | userMode == "CASH" | userMode == "OFF")
                    {
                    }
                    else // ' for user modes clerks, cashiers, data entry operators
                    {
                        loginValidateRet = "Yes";
                    }
                }
                else
                {
                }

                return loginValidateRet;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetEODProgress(string userId)
        {
            OracleDataReader reader;

            string GetEODProgressRet = string.Empty;
            string query;
            //string strSMSBankName = "";
            string strDayBeginStatus = "";
            string strDayEndStatus = "";
            string strHOdayBeginStatus = "";
            string strHODayEndStatus = "";
            try
            {
                query = "SELECT DAYBEGINSTATUS, DAYENDSTATUS, HODAYBEGINSTATUS, HODAYENDSTATUS FROM genapplicationdatemst  where branchcode != '999'";

                reader = await _databaseFactory.ProcessQuery(query);

                if (reader != null && !reader.IsClosed && reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        int one = reader.GetOrdinal("DAYBEGINSTATUS");
                        strDayBeginStatus = reader.IsDBNull(one) ? string.Empty : reader.GetString(one);

                        int two = reader.GetOrdinal("DAYENDSTATUS");
                        strDayEndStatus = reader.IsDBNull(two) ? string.Empty : reader.GetString(two);

                        int three = reader.GetOrdinal("HODAYBEGINSTATUS");
                        strHOdayBeginStatus = reader.IsDBNull(three) ? string.Empty : reader.GetString(three);

                        int four = reader.GetOrdinal("HODAYENDSTATUS");
                        strHODayEndStatus = reader.IsDBNull(four) ? string.Empty : reader.GetString(four);

                        if (strDayBeginStatus == "O" & strDayEndStatus == "N" & strHOdayBeginStatus == "O" & strHODayEndStatus == "N" | strDayBeginStatus == "O" & strDayEndStatus == "O" & strHOdayBeginStatus == "O" & strHODayEndStatus == "N")
                        {
                            GetEODProgressRet = "YES";
                        }
                        else
                        {
                            GetEODProgressRet = "906";
                            break;
                        }
                    }
                }
                else
                {
                    GetEODProgressRet = "906";
                }

                return GetEODProgressRet;
            }
            catch (Exception ex)
            {
                GetEODProgressRet = "906";
            }

            return GetEODProgressRet;
        }

        public async Task<IDictionary<string, string>> LoginCheckProcess(ISession session, string userId, string firstPass, string secPass, string hdndaybegin,string status)
        {
            Dictionary<string, string> commDict = [];
            string[,] trans = new string[1, 5];
            string queryString = string.Empty, strMessage = string.Empty, message = string.Empty, strQuery = string.Empty;

            //dim ObjLogin, ObjWorkAllotment
            //Dim objchk
            //Dim objcnt
            //dim objfetch, Decodepswd
            //dim objErrlog
            //dim strerror

            // objErrlog.LogError("LoginCheck", "genmodulemst", 9, objchk.ConnError & " : SQL Query : " & strquery)
            // strerror = objErrlog.ErrorProcess(9, "genmodulemst: " & objchk.ConnError, objchk.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))

            OracleDataReader rs;
            OracleDataReader rs1;
            OracleDataReader rs2;
            OracleDataReader rscust;
            OracleDataReader rscnt;
            OracleDataReader rsdate;
            OracleDataReader rsLogChk;
            OracleDataReader rsBioChk;
            OracleDataReader recdaybegin = null!;
            OracleDataReader rsValid = null!;

            try
            {
                string appdate = session.GetString("applicationdate") ?? string.Empty;

                session.SetString("daybegin1", hdndaybegin);

                if (!string.IsNullOrWhiteSpace(userId.Trim().ToUpper()))
                {
                    session.SetString("userid", userId); 
                    session.SetString("daybegin", "");
                }
                else
                {
                    userId = session.GetString("userid") ?? string.Empty;
                }

                string sessionId = session.Id;

                try
                {
                    rs = await _databaseFactory.SingleRecordSet("genusermst a, genbankbranchmst b",
                        "distinct(a.branchcode),a.accountstatus,b.branchname,a.groupid,a.abbuseryn,a.NAME",
                        $"a.branchcode=b.branchcode and UPPER(a.userid)='{userId.ToUpper()}'");
                }
                catch (Exception ex)
                {
                    // 1. GENUSERMST
                    // Input - "select distinct(a.branchcode),a.accountstatus,b.branchname,a.groupid,a.abbuseryn from genusermst a, genbankbranchmst b where a.branchcode=b.branchcode and upper(a.userid)=''" & cstr(ucase(usrid)) & "''"
                    // LogError - LoginCheck, "genusermst", "ErrMessage", AboveInput
                    return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                }

                if (rs.HasRows)
                {
                    session.SetString("branchcode", rs.GetString(0));
                    session.SetString("branchnarration", rs.GetString(2));
                    session.SetString("groupcode", rs.GetString(3));
                    session.SetString("Abbuser", rs.GetString(4) == null ? "" : rs.GetString(4));
                    session.SetString("userName", rs.GetString(5));

                    try
                    {
                        rsdate = await _databaseFactory.SingleRecordSet("GENAPPLICATIONDATEMST", "to_char(applicationdate,'dd-Mon-yyyy')", " branchcode='" + rs.GetString(0) + "'");
                    }
                    catch (Exception ex)
                    {
                        // if DB not connected
                        // 2. GENAPPLICATIONDATEMST
                        // strquery = "select to_char(applicationdate,''dd-Mon-yyyy'') from GENAPPLICATIONDATEMST where branchcode=''" & rs(0).value & "''"
                        // LogError - LoginCheck, "GENAPPLICATIONDATEMST", "ErrorMessage", strquery
                        // Redirect to LoginIndex with Error Message
                        return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                    }

                    if (rsdate.HasRows)
                    {
                        session.SetString("applicationdate", rs.GetString(0));

                        try
                        {
                            rs1 = await _databaseFactory.SingleRecordSet("genbranchpmt a, gencurrencytypemst b",
                                "distinct(a.currencycode),b.narration,b.PRECISION,a.CHEQUEVALIDPERIOD,a.CHEQUELENGTH",
                                "a.branchcode='" + rs.GetString(0) + "' and a.currencycode=b.currencycode");
                        }
                        catch (Exception ex)
                        {
                            // if DB not connected
                            // 3. GENBRANCHPMT
                            // strquery = "select distinct(a.currencycode),b.narration,b.PRECISION,a.CHEQUEVALIDPERIOD,a.CHEQUELENGTH from genbranchpmt a, gencurrencytypemst b where a.branchcode=''" & rs(0).value & "'' and a.currencycode=b.currencycode"
                            // LogError - LoginCheck, "GENBRANCHPMT", ErrorMessage, strquery
                            // Redirect to LoginIndex with Error Message
                            return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                        }

                        rs.Close();
                        rs = null!;

                        if (rs1.HasRows)
                        {
                            session.SetString("currencycode", rs1.GetString(0));
                            session.SetString("currencynarration", rs1.GetString(1));
                            session.SetInt32("PRECISION", rs1.GetString(2).Length - 1);

                            // Cheque Validity Period
                            session.SetString("ChequeValidPeriod", rs1.IsDBNull(3).Equals(false) ? rs1.GetString(2) : string.Empty);

                            // Cheque Length
                            session.SetString("ChequeLength", rs1.GetString(4).Equals(false) ? rs1.GetString(3) : string.Empty);
                        }

                        rs1.Close();
                        rs1 = null!;

                        try
                        {
                            rscnt = await _databaseFactory.SingleRecordSet("cashcountermst", "counterno", "cashierid='" + session.GetString("userid") + "'");
                        }
                        catch (Exception ex)
                        {
                            // if DB not connected
                            // 4. CASHCOUNTERMST
                            // strquery = "select counterno from cashcountermst where cashierid=''" & session("userid") & "''"
                            // LogError - LoginCheck, "cashcountermst", "ErrMessage", AboveInput
                            // Redirect to LoginIndex with Error Message
                            return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                        }

                        if (rscnt.HasRows)
                            session.SetString("counterno", rscnt.GetString(0));

                        rscnt.Close();
                        rscnt = null!;
                    }

                    rscust = await _databaseFactory.SingleRecordSet("genbankparm", "NONCUSTOMERID");

                    if (rscust.HasRows)
                    {
                        session.SetString("noncustomer", rscust.GetString(0));
                    }

                    rscust.Close();
                    rscust = null!;

                    rs2 = await _databaseFactory.SingleRecordSet("genbankparm", "bankcode,bankname", "");

                    if (rs2.HasRows)
                    {
                        session.SetString("bankcode", rs2.GetString(0));
                        session.SetString("bankname", rs2.GetString(1));
                    }

                    rs2.Close();
                    rs2 = null!;

                    if (session.GetString("daybegin") == "")
                    {
                        var moduleId = session.GetString("moduleid") ?? string.Empty;
                        if (userId.Length != 0 && firstPass.Length != 0 && secPass.Length != 0 || moduleId == "xxxx")
                        {
                            // New code

                            try
                            {
                                // 1. Check whether The Entered User is valid or Not
                                rsValid = await _databaseFactory.SingleRecordSet("genuserMst", "userid", "upper(userid)='" + userId.ToUpper() + "' and accountstatus='R'");
                            }
                            catch (Exception ex)
                            {
                                // if DB not connected
                                // 5. GENUSERMST
                                // strquery = "select userid from genuserMst where upper(userid)=''" & ucase(usrid) & "'' and " & "accountstatus=''R''"
                                // LogError - LoginCheck, "genuserMst", 5, AboveInput
                                // Redirect to LoginIndex with Error Message
                                return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                            }

                            if (!rsValid.HasRows)
                            {
                                return commDict.AddAndReturn(BankingConstants.Screen_Login, $"{userId.ToUpper()} Your account is temporarly disabled. Please contact your Administrator...");
                            }

                            rsValid.Close();

                            // 1.1 Password checking for default password
                            // (i) check the password without encrypting for default passwords
                            // added new code
                            if (status == "ChngPwd1")
                            {
                                var Paswd1 = BankingExtensions.EncodePassword(firstPass.ToUpper(), userId);
                                var chkBio1 = BankingExtensions.EncodePassword(secPass.ToUpper(), userId);

                                session.SetString("userid", userId);

                                rsLogChk = await _databaseFactory.SingleRecordSet("GENPROMOTIONSMST", "EMPPWD", "upper(EMPID)='" + userId.ToUpper() + "'");
                                rsBioChk = await _databaseFactory.SingleRecordSet("GENUSERMST", "BIOMETRICS,status", "upper(USERID)='" + userId.ToUpper() + "'");

                                if (rsLogChk.HasRows)
                                {
                                    if (firstPass == rsLogChk.GetString(0) || Paswd1 == rsLogChk.GetString(0))
                                    {
                                        if (rsBioChk.HasRows)
                                        {
                                            if (secPass == rsBioChk.GetString(0) || chkBio1 == rsBioChk.GetString(0))
                                            {
                                                if (rsBioChk.GetString(1) == "A")
                                                    strMessage = "Successfully Loged in";
                                                else
                                                {
                                                    strMessage = "Not An Approved User...";
                                                    return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                                }
                                            }
                                            else
                                            {
                                                strMessage = "Invalid password OR Username LogonDenied";
                                                return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                            }
                                        }
                                        else
                                        {
                                            strMessage = "Not An Application User";
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                        }
                                    }
                                    else
                                    {
                                        strMessage = "Invalid Username OR password LogonDenied";
                                        return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                    }
                                }
                                else
                                {
                                    strMessage = "Invalid Username OR Password LogonDenied";
                                    return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                }
                                return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                            }
                            // end of new code

                            // 2.Password checking for the existing userid
                            // (i)  check with First Password
                            // (ii) check with Second Password
                            var chkPwd = BankingExtensions.EncodePassword(firstPass.ToUpper(), userId);
                            var chkBio = BankingExtensions.EncodePassword(secPass.ToUpper(), userId);
                            rsLogChk = await _databaseFactory.SingleRecordSet("GENPROMOTIONSMST", "EMPPWD", "upper(EMPID)='" + userId.ToUpper() + "'");
                            rsBioChk = await _databaseFactory.SingleRecordSet("GENUSERMST", "BIOMETRICS,status", "upper(USERID)='" + userId.ToUpper() + "'");
                            if (rsLogChk.HasRows)
                            {
                                if (chkPwd == rsLogChk.GetString(0))
                                {
                                    if (rsBioChk.HasRows)
                                    {
                                        if (chkBio == rsBioChk.GetString(0))
                                        {
                                            if (rsBioChk.GetString(1) == "A")
                                                strMessage = "Successfully Loged in";
                                            else
                                            {
                                                strMessage = "Not An Approved User...";
                                                return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                            }
                                        }
                                        else
                                        {
                                            strMessage = "Invalid password OR Username LogonDenied";
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                        }
                                    }
                                    else
                                    {
                                        strMessage = "Not An Application User";
                                        return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                    }
                                }
                                else
                                {
                                    strMessage = "Invalid Username OR password LogonDenied";
                                    return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                }
                            }
                            else
                            {
                                strMessage = "Invalid Username OR password LogonDenied";
                                return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                            }
                            rsLogChk.Close();
                            rsLogChk = null!;
                            rsBioChk.Close();
                            rsBioChk = null!;

                            // 3.Checking whether UserId Locked OR Not
                            OracleDataReader rsLock = await _databaseFactory.SingleRecordSet("GENUSERMST", "LOCKEDDATE", "upper(userid)='" + userId.ToUpper() + "'");
                            if (rsLock.HasRows)
                            {
                                if (rsLock.IsDBNull(0).Equals(false))
                                {
                                    strMessage = "UserId Locked";
                                    return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                }
                                rsLock.Close();
                                rsLock = null!;
                            }

                            // 4.Checking whether User Expirydate is crossed the Applicationdate
                            OracleDataReader rsExpDt = await _databaseFactory.SingleRecordSet("GENUSERMST", "EXPIRYDATE,sysdate", "upper(userid)='" + userId.ToUpper() + "'");
                            session.SetString("ExpiryUserid", "");
                            if (rsExpDt.HasRows)
                            {
                                if (rsExpDt.IsDBNull(0).Equals(false))
                                {
                                    double days = BankingExtensions.DateDifference("d", Convert.ToDateTime(session.GetString("applicationdate")), Convert.ToDateTime(rsExpDt.GetValue(0)));
                                    if (Convert.ToInt32(days) <= 10)
                                    {
                                        message = "UserId Will Be Expired WithIn " + days + " day(s)";
                                        if (Convert.ToInt32(days) == 0)
                                        {
                                            message = "UserId Will Expire Today";
                                        }
                                        if (Convert.ToInt32(days) < 0)
                                        {
                                            message = "UserId Expired, Please Contact Administrator";
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, message);
                                        }
                                        session.SetString("ExpiryUserid", message);
                                        return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                    }
                                }
                            }
                            rsExpDt.Close();
                            rsExpDt = null!;

                            // 5.Checking Password ExpiryDate
                            OracleDataReader rsPwdDt = await _databaseFactory.SingleRecordSet("GENPROMOTIONSMST", "PWDEXPIRYDT,sysdate,GRACETIME", "upper(EMPID)='" + userId.ToUpper() + "'");
                            session.SetString("Expirypwd", "");
                            if (!rsPwdDt.HasRows)
                            {
                                if (rsPwdDt.IsDBNull(0).Equals(false))
                                {
                                    double days = BankingExtensions.DateDifference("D", Convert.ToDateTime(session.GetString("applicationdate")), Convert.ToDateTime(rsExpDt.GetValue(0)));
                                    if (Convert.ToInt32(days) <= Convert.ToInt32(rsPwdDt.GetString(2)))
                                    {
                                        message = "Your Password Will Be Expired WithIn " + days + " day(s)";
                                        if (Convert.ToInt32(days) == 0)
                                            message = "Your Password Will Expire Today";
                                        if (Convert.ToInt32(days) < 0)
                                        {
                                            message = "Password Expired, Please Contact Administrator";
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, message);
                                        }
                                        session.SetString("Expirypwd", message);
                                    }
                                }
                            }
                            rsPwdDt.Close();
                            rsPwdDt = null!;

                            // End of New code
                            if (session.GetString("").Equals("xxxx"))
                            {
                                strMessage = "Successfully Loged in";
                                status = "Login";
                            }

                            if (status == "Login")
                            {
                                if (strMessage.Equals("Successfully Loged in") || strMessage.Equals("Trans Completed"))
                                {
                                    string group1 = string.Empty, macid = string.Empty;
                                    int sessions = 0;
                                    OracleDataReader reccheck;

                                    try
                                    {
                                        reccheck = await _databaseFactory.SingleRecordSet("genuserMst",
                                            "nvl(noofsessions,0), nvl(usermachineid,'X'),groupid",
                                            "upper(userid)='" + userId.ToUpper() + "' and accountstatus='R'");
                                    }
                                    catch (Exception ex)
                                    {
                                        // if DB not connected
                                        // 6. GENUSERMST
                                        // strquery = "select nvl(noofsessions,0), nvl(usermachineid,''X''),groupid from genuserMst where upper(userid)=''" & ucase(usrid) & "'' and accountstatus=''R''"
                                        // LogError - LoginCheck, "genuserMst", 6, AboveInput
                                        // Redirect to LoginIndex with Error Message
                                        return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                                    }

                                    if (reccheck.HasRows)
                                    {
                                        sessions = Convert.ToInt32(reccheck.GetValue(0));
                                        macid = reccheck.GetString(1);
                                        group1 = reccheck.GetString(2);
                                    }
                                    else
                                    {
                                        return commDict.AddAndReturn(BankingConstants.Screen_Login, $"{userId.ToUpper()} Your account is temporarly disabled. Please contact your Administrator...");
                                    }

                                    if (!group1.Equals("ADMIN"))
                                    {
                                        try
                                        {
                                            reccheck = await _databaseFactory.SingleRecordSet("genmachinedtls",
                                                "machineid",
                                                "upper(branchcode)='" + session.GetString("branchcode").ToUpper() + "' and machineipaddress='" + macid + "'");
                                        }
                                        catch (Exception ex)
                                        {
                                            // if DB not connected
                                            // 7. GENMACHINEDTLS
                                            // strquery = "select machineid from genmachinedtls where upper(branchcode)=''" & ucase(session("branchcode")) & "'' and machineipaddress=''" & macid & "''"
                                            // LogError - LoginCheck, "genmachinedtls", 7, AboveInput
                                            // Redirect to Login (useridscreen.aspx) with Error Message
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                                        }

                                        if (reccheck.HasRows)
                                        {
                                            if (!macid.Equals("")) // Request.ServerVariables("REMOTE_HOST")))
                                            {
                                                if (!macid.Equals("X"))
                                                {
                                                    return commDict.AddAndReturn(BankingConstants.Screen_Login, $"{userId} Please login from the machine alloted to u..");
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (!macid.Equals("X"))
                                            {
                                                return commDict.AddAndReturn(BankingConstants.Screen_Login, $"This Machine {macid} is not identified in {session.GetString("branchcode").ToUpper()} branch. Please check the Machine and try again..");
                                                // Redirect to Login (useridscreen.aspx) with Message - "
                                            }
                                            else
                                            {
                                                macid = ""; // Request.ServerVariables("REMOTE_HOST")
                                                reccheck = await _databaseFactory.SingleRecordSet("genmachinedtls", "machineid", "upper(branchcode)='" + session.GetString("branchcode").ToUpper() + "' and machineipaddress='" + macid + "'");
                                                if (reccheck.HasRows)
                                                {
                                                    //x = 0;   todo
                                                }
                                                else
                                                {
                                                    return commDict.AddAndReturn(BankingConstants.Screen_Login, $"This Machine {macid} is not identified in {session.GetString("branchcode").ToUpper()} branch. Please check the Machine and try again..");
                                                }
                                            }
                                        }
                                    }

                                    try
                                    {
                                        reccheck = await _databaseFactory.SingleRecordSet("genuserlogindtls", "machineid", "upper(userid)='" + userId.ToUpper() + "' and upper(machineid)<>'" + session.GetString("machineid").ToUpper() + "'");
                                    }
                                    catch (Exception ex)
                                    {
                                        // if DB not connected
                                        // 8 - GENUSERLOGINDTLS
                                        // strquery = "select machineid from genuserlogindtls where upperupper(userid)=''" & ucase(usrid) & "'' and upper(machineid)<>''" & ucase(session("machineid")) & "''"
                                        // LogError - LoginCheck, "genmachinedtls", 8, AboveInput
                                        // Redirect to Login (useridscreen.aspx) with Error Message
                                        return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                                    }

                                    if (reccheck.HasRows)
                                    {
                                        if (reccheck.FieldCount >= Convert.ToInt32(sessions) && group1.Equals("ADMIN"))
                                        {
                                            if (sessions == 0)
                                                sessions = 1;
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, $"{userId.ToUpper()} You have already opened {sessions} browsers. Please logout from some browsers and try again...");
                                        }
                                        else
                                        {
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, $"{userId.ToUpper()} You have already opened one browser. Please logout that and try again...");
                                        }
                                    }

                                    reccheck.Close();
                                    reccheck = null!;

                                    trans[0, 0] = "U";
                                    trans[0, 1] = "Genuserlogindtls";
                                    trans[0, 2] = "userid,machineid,branchcode,loginsysdate,adminyn,sessionid";
                                    trans[0, 3] = "'" + userId + "','" + session.GetString("machineid") + "','" + session.GetString("branchcode") + "',sysdate,'admin','" + sessionId + "'";
                                    trans[0, 4] = "";
                                    trans[0, 0] = "I";
                                    trans[0, 1] = "Genuserlogindtls";
                                    trans[0, 2] = "userid,machineid,branchcode,loginsysdate,adminyn,sessionid";
                                    trans[0, 3] = "'" + userId + "','" + session.GetString("machineid") + "','" + session.GetString("branchcode") + "',sysdate,'admin','" + sessionId + "'";
                                    trans[0, 4] = "";

                                    strMessage = _databaseFactory.ProcessDataTransactions(trans, "", "", "", "", "N");
                                    // Response.Write(strmsg)
                                    // Response.Write(trans(0, 3))

                                    if (strMessage.Length >= 11 && strMessage.Substring(0, 11).Equals(""))
                                    {
                                        string stx = "";
                                        string stn = "";

                                        try
                                        {
                                            recdaybegin = await _databaseFactory.SingleRecordSet("genmodulemst c, genmoduletypesmst d",
                                                "distinct(c.moduleid),initcap(c.narration),moduleorder",
                                                "c.moduleid in(select moduleid from gengroupformsmst where groupcode= (select groupid from genusermst where upper(userid)='" + userId.ToUpper() + "') union select distinct moduleid from genuseridformsmst where addoreliminate='A' and upper(userid)='" + userId.ToUpper() + "'" + ") and d.implementedyn='Y' and d.moduleid=c.moduleid and d.branchcode='" + session.GetString("branchcode") + "' and c.parentmoduleid is null order by moduleorder");
                                        }
                                        catch (Exception ex)
                                        {
                                            // if DB not connected
                                            // 9 - GENMODULEMST
                                            // strquery = "select distinct(c.moduleid),initcap(c.narration),moduleorder from genmodulemst c, genmoduletypesmst d where c.moduleid in (select moduleid from gengroupformsmst where groupcode= (select groupid from genusermst where upper(userid)=''" & ucase(usrid) "'') union select distinct moduleid from genuseridformsmst where addoreliminate=''A'' and upper(userid)=''" & ucase(usrid) & "'') and d.implementedyn=''Y'' and d.moduleid=c.moduleid and d.branchcode=''" & session("branchcode") & "'' and c.parentmoduleid is null order by moduleorder"
                                            // objErrlog.LogError("LoginCheck", "genmodulemst", 9, objchk.ConnError & " : SQL Query : " & strquery)
                                            // strerror = objErrlog.ErrorProcess(9, "genmodulemst: " & objchk.ConnError, objchk.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))
                                            // Redirect to Login (useridscreen.aspx) with Error Message
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed: " + ex.Message);
                                        }

                                        if (recdaybegin.FieldCount == 0)
                                        {
                                            string strm = "Workallotment is not done to this user..";
                                            return commDict.AddAndReturn(BankingConstants.Screen_Login, strm);
                                        }

                                        do
                                        {
                                            stx = stx + recdaybegin.GetString(0) + ":F" + "|";
                                            stn = stn + "," + recdaybegin.GetString(1);
                                        } while (recdaybegin.HasRows);

                                        stx = stx + "$";

                                        session.SetString("modnar", stn);
                                        session.SetString("mod", stx);
                                        return commDict.AddAndReturn(BankingConstants.Screen_ModuleSCR, stx);
                                    }
                                    else
                                    {
                                        return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                    }
                                }
                                else
                                {
                                    strMessage.Replace(Environment.NewLine, " ");
                                    strMessage.Replace("\n", " ");
                                    strMessage.Replace("\r\n", " ");
                                    strMessage.Replace("\t", " ");
                                    strMessage.Replace("\r", " ");
                                    strMessage.Replace("/", " or ");
                                    strMessage.Replace("-", " ");
                                    strMessage.Replace(":", " ");
                                    strMessage.Replace(";", " ");
                                    strMessage.Replace(" ", "");
                                    return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                                }
                            }
                            else if (status == "ChngPwd")
                            {
                                if (strMessage.Equals("Successfully Loged in") || strMessage.Equals("Trans Completed"))
                                {
                                    session.SetString("userid", userId);
                                    return commDict.AddAndReturn(BankingConstants.Screen_ConfirmUserId, strMessage);
                                }
                                return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                            }
                        }
                    }
                    else
                    {
                        strMessage = "not a Valid Password for " + userId.ToUpper() + "....";
                        return commDict.AddAndReturn(BankingConstants.Screen_Login, strMessage);
                    }
                }
                else
                {
                    // RecWorkAllotment = nothing

                    OracleDataReader recdaybegin1 = null!;
                    OracleDataReader recdaybegin2 = null!;

                    // rsdate.Close();
                    // rsdate = null!;

                    string stn = "";
                    string stx = "";

                    //if db not connected 
                    //Redirect to useridscreen.aspx. with error message.
                    // return DictionaryExtensions.AddAndReturn(commDict, BankingConstants.Screen_Login, "Connection Failed.");

                    do
                    {
                        if (recdaybegin.GetString(1) == "0")
                            stx = stx + recdaybegin.GetString(0) + ":F" + "|";
                        else
                            stx = stx + recdaybegin.GetString(0) + ":T" + "|";

                        stn = stn + "," + recdaybegin.GetString(2);

                    } while (recdaybegin.HasRows);

                    recdaybegin.Close();
                    recdaybegin = null!;

                    stx = stx + "$";

                    if (stn.Length == 0)
                    {
                        stn = stn + "$";

                        // if db not connected.
                        // Redirect to useridscreen.aspx with message - ConnError
                        // return DictionaryExtensions.AddAndReturn(commDict, BankingConstants.Screen_Login, "Connection Failed.");

                        do
                        {
                            stx = stx + recdaybegin1.GetString(0) + ":F" + "|";
                            stn = stn + "," + recdaybegin1.GetString(1);
                        } while (recdaybegin1.HasRows);

                        recdaybegin1.Close();
                        recdaybegin1 = null!;

                        // if DB not connected.
                        // Redirect to useridscreen.aspx with message - ConnError
                        // return DictionaryExtensions.AddAndReturn(commDict, BankingConstants.Screen_Login, "Connection Failed.");

                        do
                        {
                            stx = stx + recdaybegin2.GetString(0) + ":F" + "|";
                            stn = stn + "," + recdaybegin2.GetString(1);
                            // Response.Write(recdaybegin2(1).value)
                        } while (recdaybegin2.HasRows);

                        recdaybegin2.Close();
                        recdaybegin2 = null!;

                        session.SetString("modnar", stn);
                        session.SetString("mod", stx);

                        // 'stx="genworkallotmentmst a,genmoduleactivitylog b" & " a.moduleid,nvl(b.daybeginstatus,'N')" & "a.moduleid=b.moduleid(+) and upper(a.userid)='" & ucase(usrid) & "' and to_char(daybegindate(+),'dd - Mon - yyyy')='" & rsdate(0) &"'"
                        // Response.Redirect("Modulescr.aspx?record=" & stx)
                        return commDict.AddAndReturn(BankingConstants.Screen_ModuleSCR, stx);
                    }
                }

                return commDict.AddAndReturn(BankingConstants.Screen_Login, "");
            }
            catch (Exception ex)
            {
                return commDict.AddAndReturn(BankingConstants.Screen_Login, "Connection Failed.");
            }
        }

        #region Private Methods

        private string GetBankData(string bankName, string branchCode)
        {
            // ' START MAHARAJA COOPERATIVE URBAN BANK
            if (bankName.ToUpper().Equals("MAHARAJA"))
            {
                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A  (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2014");
                    DtLicToDt = Convert.ToDateTime("09-Apr-2016");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");  // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected set by raminfo
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }
                else if (branchCode == "100")
                {
                    strliamc = "A";            // ' License -- L or AMC - A  (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2014");
                    DtLicToDt = Convert.ToDateTime("09-Apr-2016");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");  // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected set by raminfo
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }
                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A  (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2014");
                    DtLicToDt = Convert.ToDateTime("09-Apr-2016");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");  // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected set by raminfo
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }
                else if (branchCode == "102")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2014");
                    DtLicToDt = Convert.ToDateTime("09-Apr-2016");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");  // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }
                else if (branchCode == "103")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2014");
                    DtLicToDt = Convert.ToDateTime("09-Apr-2016");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");  // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // 'if cust need to chage then set this dates
                    // 'DtLicFrmDt = "07-Dec-2014"
                    // 'DtLicToDt = "06-Dec-2016"

                    // 'DtAMCFrmDt = "07-Dec-2016"     ''For One Year
                    // 'DtAMCToDt = "06-Dec-2017"

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }

                else if (branchCode == "104")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");  // 'set later it as '10-apr-2016
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }

                else if (branchCode == "105")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }

                else if (branchCode == "106")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "107")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "108")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "109")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "110")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "111")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "112")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "113")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "114")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "115")
                {

                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("10-Apr-2016");
                    DtLicToDt = Convert.ToDateTime("09-May-2017");

                    DtAMCFrmDt = Convert.ToDateTime("05-Apr-2016");   // 'set later it as '30-apr-2017
                    DtAMCToDt = Convert.ToDateTime("30-Apr-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END MAHARAJA COOPERATIVE URBAN BANK

            // ' START NELLORE COOPERATIVE URBAN BANK IS UNDER LICENSE
            else if (bankName.ToUpper().Equals("NELLORE"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                                               // 'License fee paid upto 21-nov-2016 --warranty perriod is 22-11-2013 to 21-11-2015

                    DtLicFrmDt = Convert.ToDateTime("22-Nov-2014");
                    DtLicToDt = Convert.ToDateTime("21-Nov-2016");

                    DtAMCFrmDt = Convert.ToDateTime("22-Nov-2016");  // 'AMC will start on 22-11-2016
                    DtAMCToDt = Convert.ToDateTime("21-Nov-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "30-Nov-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                                               // 'License fee paid upto 21-nov-2016 --warranty perriod is 22-11-2013 to 21-11-2015

                    DtLicFrmDt = Convert.ToDateTime("22-Nov-2014");
                    DtLicToDt = Convert.ToDateTime("21-Nov-2016");

                    DtAMCFrmDt = Convert.ToDateTime("22-Nov-2016");  // 'AMC will start on 22-11-2016
                    DtAMCToDt = Convert.ToDateTime("21-Nov-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "30-Nov-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "102")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("22-Nov-2014");
                    DtLicToDt = Convert.ToDateTime("21-Nov-2016");

                    DtAMCFrmDt = Convert.ToDateTime("22-Nov-2016");   // 'AMC will start on 22-11-2016
                    DtAMCToDt = Convert.ToDateTime("21-Nov-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "30-Nov-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END NELLORE COOPERATIVE URBAN BANK

            // ' START PALAMOOR COOPERATIVE URBAN BANK  (This bank under AMC)
            else if (bankName.ToUpper().Equals("PCUB"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("21-Aug-2013");
                    DtLicToDt = Convert.ToDateTime("31-Oct-2014");

                    DtAMCFrmDt = Convert.ToDateTime("01-Nov-2016");      // ' AMC Received for yearly
                    DtAMCToDt = Convert.ToDateTime("31-Oct-2023");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "15-Nov-2016"

                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("21-Aug-2013");
                    DtLicToDt = Convert.ToDateTime("31-Oct-2014");

                    DtAMCFrmDt = Convert.ToDateTime("01-Nov-2016");      // ' AMC Received for yearly
                    DtAMCToDt = Convert.ToDateTime("31-Oct-2023");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "15-Nov-2016"

                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "102")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("21-Aug-2013");
                    DtLicToDt = Convert.ToDateTime("31-Oct-2014");

                    DtAMCFrmDt = Convert.ToDateTime("01-Nov-2016");      // ' AMC Received for yearly
                    DtAMCToDt = Convert.ToDateTime("31-Oct-2023");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "15-Nov-2016"

                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END PALAMOOR COOPERATIVE URBAN BANK

            // ' START UNIVERSAL COOPERATIVE URBAN BANK (This Bank Under AMC)
            else if (bankName.ToUpper().Equals("UCUB"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-Apr-2012");
                    DtLicToDt = Convert.ToDateTime("31-Mar-2013");

                    // ' AMC paid by Quterly - Last AMC Exp Date 31-03-2015 (AMC Is Pending)

                    DtAMCFrmDt = Convert.ToDateTime("01-Apr-2015");
                    DtAMCToDt = Convert.ToDateTime("31-Dec-2015");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"    ''Lincense pending
                    // ' strDtamcfeepend = "10-Jun-2015"  ''AMC pending
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-Apr-2012");
                    DtLicToDt = Convert.ToDateTime("31-Mar-2013");

                    // ' AMC paid by Quterly - Last AMC Exp Date 31-03-2015 (AMC Is Pending)

                    DtAMCFrmDt = Convert.ToDateTime("01-Apr-2015");
                    DtAMCToDt = Convert.ToDateTime("31-Dec-2015");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    // ' strDtamcfeepend = "10-Jun-2015"  ''AMC pending
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else if (branchCode == "102")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-Apr-2012");
                    DtLicToDt = Convert.ToDateTime("31-Mar-2013");

                    // ' AMC paid by Quterly - Last AMC Exp Date 31-03-2015 (AMC Is Pending)

                    DtAMCFrmDt = Convert.ToDateTime("0l-Apr-2015");
                    DtAMCToDt = Convert.ToDateTime("31-Dec-2015");

                    // ' pending license fee collection, comment this code after amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    // ' strDtamcfeepend = "10-Jun-2015"  ''AMC pending
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END UNIVERSAL COOPERATIVE URBAN BANK

            // ' START MAHAJAN COOPERATIVE URBAN BANK (This bank under Warranty - 1 year)
            else if (bankName.ToUpper().Equals("MAHAJAN"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("01-Aug-2014");
                    DtLicToDt = Convert.ToDateTime("31-Jul-2016");

                    DtAMCFrmDt = Convert.ToDateTime("01-Aug-2016");
                    DtAMCToDt = Convert.ToDateTime("31-Oct-2016");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "15-May-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("01-Aug-2014");
                    DtLicToDt = Convert.ToDateTime("31-Jul-2016");

                    DtAMCFrmDt = Convert.ToDateTime("01-Aug-2016");
                    DtAMCToDt = Convert.ToDateTime("31-Oct-2016");  // 'AMC Paid for first QTR
                                                                    // ' pending license fee collection, comment this code for amount collected
                                                                    // ' strDtlicfeepend = "15-May-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END MAHAJAN COOPERATIVE URBAN BANK

            // ' START DHARMAVARAM COOPERATIVE URBAN BANK (This Bank under Warranty - 1 year)
            else if (bankName.ToUpper().Equals("DMM"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("20-Oct-2014");   // ' license fees received
                    DtLicToDt = Convert.ToDateTime("19-Oct-2015");

                    DtAMCFrmDt = Convert.ToDateTime("20-Oct-2016");
                    DtAMCToDt = Convert.ToDateTime("19-Oct-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "25-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("20-Oct-2014");   // ' license feel received
                    DtLicToDt = Convert.ToDateTime("19-Oct-2015");

                    DtAMCFrmDt = Convert.ToDateTime("20-Oct-2016");
                    DtAMCToDt = Convert.ToDateTime("19-Oct-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "25-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END DHARMAVARAM COOPERATIVE URBAN BANK

            // ' START SWARNA COOPERATIVE URBAN BANK    (This bank under AMC)
            else if (bankName.ToUpper().Equals("SWARNA"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("01-Apr-2012");
                    DtLicToDt = Convert.ToDateTime("31-Mar-2013");

                    DtAMCFrmDt = Convert.ToDateTime("01-Apr-2016");  // ' Under AMC
                    DtAMCToDt = Convert.ToDateTime("31-Mar-2026");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    // 'strDtamcfeepend = "11-APR-2017"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("01-Apr-2015");
                    DtLicToDt = Convert.ToDateTime("07-Apr-2015");

                    DtAMCFrmDt = Convert.ToDateTime("01-Apr-2016");  // ' Under AMC
                    DtAMCToDt = Convert.ToDateTime("31-Mar-2026");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    // ' strDtamcfeepend = "11-APR-2017"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END SWARNA COOPERATIVE URBAN BANK


            // ' START AMALAPURAM COOPERATIVE URBAN BANK (This bank under AMC)
            // ' AMC Increase every two years @ 10% on Exisiting AMC

            else if (bankName.ToUpper().Equals("ACTB"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("16-JUN-2017");
                    DtLicToDt = Convert.ToDateTime("15-JUN-2018");

                    DtAMCFrmDt = Convert.ToDateTime("16-JUN-2018");
                    DtAMCToDt = Convert.ToDateTime("15-JUN-2026");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "20-AUG-2017"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("16-JUN-2017");
                    DtLicToDt = Convert.ToDateTime("15-JUN-2018");

                    DtAMCFrmDt = Convert.ToDateTime("16-JUN-2018");
                    DtAMCToDt = Convert.ToDateTime("15-JUN-2026");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "20-AUG-2017"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END AMALAPURAM COOPERATIVE URBAN BANK

            // ' START SALUR COOPERATIVE URBAN BANK (This bank under AMC)
            else if (bankName.ToUpper().Equals("SALUR"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("01-Jan-2015");
                    DtLicToDt = Convert.ToDateTime("31-Dec-2015");

                    DtAMCFrmDt = Convert.ToDateTime("01-Jan-2017");  // 'AMC start on 01-01-2016
                    DtAMCToDt = Convert.ToDateTime("31-Dec-2025");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "31-May-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)
                    DtLicFrmDt = Convert.ToDateTime("01-Jan-2015");
                    DtLicToDt = Convert.ToDateTime("31-Dec-2015");

                    DtAMCFrmDt = Convert.ToDateTime("01-Jan-2017");
                    DtAMCToDt = Convert.ToDateTime("31-Dec-2025");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "31-May-2015"
                    GetBankDataRet = BankingConstants.DataPresent;

                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END SALUR COOPERATIVE URBAN BANK

            // 'START ELURU COOPERATIVE URBAN BANK

            else if (bankName.ToUpper().Equals("ELURU"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("15-Feb-2016");
                    DtLicToDt = Convert.ToDateTime("14-Feb-2017");

                    DtAMCFrmDt = Convert.ToDateTime("15-Feb-2017");  // ' AMC start on 15-02-2017
                    DtAMCToDt = Convert.ToDateTime("14-Feb-2022");


                    // 'pending license fee collection, comment this code after amount collected
                    // 'strDtlicfeepend = "06-Sep-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("15-Feb-2016");
                    DtLicToDt = Convert.ToDateTime("14-Feb-2017");

                    DtAMCFrmDt = Convert.ToDateTime("15-Feb-2017");   // ' AMC start on 15-02-2017
                    DtAMCToDt = Convert.ToDateTime("14-Feb-2022");

                    // ' pending license fee collection, comment this code for amount collected
                    // 'strDtlicfeepend = "06-Sep-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "102")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("15-Feb-2016");
                    DtLicToDt = Convert.ToDateTime("14-Feb-2017");

                    DtAMCFrmDt = Convert.ToDateTime("15-Feb-2017");   // ' AMC start on 15-02-2017
                    DtAMCToDt = Convert.ToDateTime("14-Feb-2022");

                    // ' pending license fee collection, comment this code for amount collected
                    // 'strDtlicfeepend = "06-Sep-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "103")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-OCT-2017");
                    DtLicToDt = Convert.ToDateTime("15-NOV-2018");

                    DtLicFrmDt = Convert.ToDateTime("01-OCT-2017");  // ' AMC start on 15-11-2018
                    DtAMCToDt = Convert.ToDateTime("14-Feb-2022");

                    // ' pending license fee collection, comment this code for amount collected
                    // 'strDtlicfeepend = "06-Sep-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "104")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-OCT-2017");
                    DtLicToDt = Convert.ToDateTime("15-NOV-2018");

                    DtLicFrmDt = Convert.ToDateTime("01-OCT-2017");  // ' AMC start on 15-nov-2018
                    DtAMCToDt = Convert.ToDateTime("14-Feb-2022");

                    // ' pending license fee collection, comment this code for amount collected
                    // 'strDtlicfeepend = "06-Sep-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END ELURU COOPERATIVE URBAN BANK

            // ' START GUNTUR WOMEN COOPERATIVE URBAN BANK
            else if (bankName.ToUpper().Equals("GUNTUR"))
            {

                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-MAY-2016");
                    DtLicToDt = Convert.ToDateTime("31-AUG-2018");

                    DtAMCFrmDt = Convert.ToDateTime("01-SEP-2018");  // ' AMC start on 01-09-2018
                    DtAMCToDt = Convert.ToDateTime("31-AUG-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "15-JUL-2016"
                    GetBankDataRet = BankingConstants.DataPresent;

                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-MAY-2016");
                    DtLicToDt = Convert.ToDateTime("31-AUG-2018");

                    DtAMCFrmDt = Convert.ToDateTime("01-SEP-2018");  // ' AMC start on 01-09-2018
                    DtAMCToDt = Convert.ToDateTime("31-AUG-2026");

                    // ' pending license fee collection, comment this code for amount collected
                    // 'strDtlicfeepend = "31-OCT-2017"
                    GetBankDataRet = BankingConstants.DataPresent;
                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }

            // ' End GUNTUR WOMEN COOPERATIVE BANK

            // ' START GOKUL COOPERATIVE URBAN BANK
            else if (bankName.ToUpper().Equals("GOKUL"))
            {
                if (branchCode == "999")
                {
                    strliamc = "L";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-Apr-2015");
                    DtLicToDt = Convert.ToDateTime("31-Mar-2015");

                    DtAMCFrmDt = Convert.ToDateTime("01-Apr-2015");
                    DtAMCToDt = Convert.ToDateTime("31-Mar-2016");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }

                else if (branchCode == "101")
                {
                    strliamc = "L";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-Apr-2015");
                    DtLicToDt = Convert.ToDateTime("31-Mar-2015");

                    DtAMCFrmDt = Convert.ToDateTime("01-Apr-2015");
                    DtAMCToDt = Convert.ToDateTime("31-Mar-2016");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "16-Apr-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                } // ' branchCode
            }
            // ' END GOKUL COOPERATIVE URBAN BANK

            // ' START KUPPAM COOPERATIVE URBAN BANK
            else if (bankName.ToUpper().Equals("KUPPAM"))
            {
                if (branchCode == "999")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-JUL-2015");
                    DtLicToDt = Convert.ToDateTime("30-JUN-2016");

                    DtAMCFrmDt = Convert.ToDateTime("01-JUL-2016");
                    DtAMCToDt = Convert.ToDateTime("30-JUN-2018");
                    // ' pending license fee collection, comment this code for amount collected
                    // 'strDtlicfeepend = "31-Dec-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }

                else if (branchCode == "101")
                {
                    strliamc = "A";            // ' License -- L or AMC - A (set by raminfo)

                    DtLicFrmDt = Convert.ToDateTime("01-JUL-2015");
                    DtLicToDt = Convert.ToDateTime("30-JUN-2016");

                    DtAMCFrmDt = Convert.ToDateTime("01-JUL-2016");
                    DtAMCToDt = Convert.ToDateTime("30-JUN-2018");
                    // ' pending license fee collection, comment this code for amount collected
                    // ' strDtlicfeepend = "31-Dec-2015"
                    GetBankDataRet = BankingConstants.DataPresent;
                }
                else
                {
                    GetBankDataRet = BankingConstants.BranchDataNotSet;
                    return GetBankDataRet;
                }
            }

            else
            {
                GetBankDataRet = BankingConstants.BankNameNotSet;
                return GetBankDataRet;
            }

            return GetBankDataRet;
        }

        #endregion
    }
}
