using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Data;
using System.Globalization;

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
            DataTable reader = null!;

            try
            {
                // Query to convert
                query = $"select distinct a.branchcode,a.GROUPID from genusermst a, genbankbranchmst b where a.branchcode=b.branchcode and upper(a.userid) = \'{userId.ToUpper()}\'";

                reader = await _databaseFactory.ProcessQueryAsync(query);

                if (reader.Rows.Count != 0)
                {
                    foreach (DataRow item in reader.Rows)
                    {
                        branchCode = Conversions.ToString(item["branchcode"]);
                        userMode = Conversions.ToString(item["GROUPID"]);
                    }
                }

                // Query to convert
                query = "SELECT DEPCERTIFICATE FROM genbankparm";

                reader = await _databaseFactory.ProcessQueryAsync(query);

                if (reader.Rows.Count != 0)
                {
                    foreach (DataRow item in reader.Rows)
                    {
                        bankName = Conversions.ToString(item["DEPCERTIFICATE"]);
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

                reader = await _databaseFactory.ProcessQueryAsync(query);

                if (reader.Rows.Count != 0)
                {
                    foreach (DataRow item in reader.Rows)
                    {
                        dtAppDt = Convert.ToDateTime(Conversions.ToString(item["appdate"]));
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

                // After license or AMC is expired - start appdate is greater than expiry date
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

                BankingExtensions.ReleaseMemory(reader);

                return loginValidateRet;
            }
            catch (Exception ex)
            {
                BankingExtensions.ReleaseMemory(reader);
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetEODProgress(string userId)
        {
            string GetEODProgressRet = string.Empty;
            DataTable reader = null!;
            string query, strDayBeginStatus, strDayEndStatus, strHOdayBeginStatus, strHODayEndStatus;

            try
            {
                query = "SELECT DAYBEGINSTATUS, DAYENDSTATUS, HODAYBEGINSTATUS, HODAYENDSTATUS FROM genapplicationdatemst  where branchcode != '999'";

                reader = await _databaseFactory.ProcessQueryAsync(query);

                if (reader.Rows.Count != 0)
                {
                    foreach (DataRow item in reader.Rows)
                    {
                        strDayBeginStatus = Conversions.ToString(item["DAYBEGINSTATUS"]);
                        strDayEndStatus = Conversions.ToString(item["DAYENDSTATUS"]);
                        strHOdayBeginStatus = Conversions.ToString(item["HODAYBEGINSTATUS"]);
                        strHODayEndStatus = Conversions.ToString(item["HODAYENDSTATUS"]);

                        if (strDayBeginStatus == "O" && strDayEndStatus == "N" && strHOdayBeginStatus == "O" && strHODayEndStatus == "N" ||
                            strDayBeginStatus == "O" && strDayEndStatus == "O" && strHOdayBeginStatus == "O" && strHODayEndStatus == "N")
                            GetEODProgressRet = "YES";
                        else
                        {
                            GetEODProgressRet = "906";
                            break;
                        }
                    }
                }
                else
                    GetEODProgressRet = "906";

                BankingExtensions.ReleaseMemory(reader);

                return GetEODProgressRet;
            }
            catch (Exception ex)
            {
                GetEODProgressRet = "906";
                BankingExtensions.ReleaseMemory(reader);
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedirectModel> LoginCheckProcess(ISession session, string userId, string firstPass, string secPass, 
            string hdndaybegin, string status, string remoteHost, string serverName)
        {
            string[,] trans = new string[1, 5];
            string queryString = string.Empty, strMessage = string.Empty, message = string.Empty, strQuery = string.Empty;

            // Replace the following line in LoginCheckProcess method:
            // using DataTable rs = null!, rs1 = null!, rs2 = null!, rscust = null!, rscnt = null!, 
            //     rsdate = null!, rsLogChk = null!, rsBioChk = null!, recdaybegin = null!, rsValid = null!;

            // With this declaration (remove 'using' for DataTable variables):
            DataTable rs = null!, rs1 = null!, rs2 = null!, rscust = null!, rscnt = null!, rsdate = null!, rsLogChk = null!, rsBioChk = null!, recdaybegin = null!, rsValid = null!;

            try
            {
                string appdate = session.GetString(SessionConstants.ApplicationDate);

                session.SetString(SessionConstants.DayBegin1, hdndaybegin);

                if (!string.IsNullOrWhiteSpace(userId.Trim().ToUpper()))
                {
                    session.SetString(SessionConstants.UserId, userId);
                    session.SetString(SessionConstants.DayBegin, "");
                }
                else
                {
                    userId = session.GetString(SessionConstants.UserId);
                }

                string sessionId = session.GetSessionId();

                session.SetString(SessionConstants.ServerId, serverName);
                session.SetString(SessionConstants.MachineId, remoteHost);

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
                    return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, ErrorMessage = "Connection Failed: " + ex.Message };
                }

                if (rs.Rows.Count != 0)
                {
                    TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;

                    session.SetString(SessionConstants.BranchCode, Conversions.ToString(rs.Rows[0].ItemArray[0]));
                    session.SetString(SessionConstants.BranchNarration, Conversions.ToString(rs.Rows[0].ItemArray[2]).ToLower().Humanize(LetterCasing.Title));
                    session.SetString(SessionConstants.GroupCode, Conversions.ToString(rs.Rows[0].ItemArray[3]));
                    session.SetString(SessionConstants.ABBUser, Conversions.ToString(rs.Rows[0].ItemArray[4]));
                    session.SetString(SessionConstants.UserId, Conversions.ToString(rs.Rows[0].ItemArray[5]));

                    try
                    {
                        rsdate = await _databaseFactory.SingleRecordSet("GENAPPLICATIONDATEMST", "to_char(applicationdate,'dd-Mon-yyyy')", " branchcode='" + Conversions.ToString(rs.Rows[0].ItemArray[0]) + "'");
                    }
                    catch (Exception ex)
                    {
                        // if DB not connected
                        // 2. GENAPPLICATIONDATEMST
                        // strquery = "select to_char(applicationdate,''dd-Mon-yyyy'') from GENAPPLICATIONDATEMST where branchcode=''" & rs(0).value & "''"
                        // LogError - LoginCheck, "GENAPPLICATIONDATEMST", "ErrorMessage", strquery
                        // Redirect to LoginIndex with Error Message
                        return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, ErrorMessage = "Connection Failed: " + ex.Message };
                    }

                    if (rsdate.Rows.Count != 0)
                    {
                        session.SetString(SessionConstants.ApplicationDate, Conversions.ToString(rsdate.Rows[0].ItemArray[0]));

                        try
                        {
                            rs1 = await _databaseFactory.SingleRecordSet("genbranchpmt a, gencurrencytypemst b",
                                "distinct(a.currencycode),b.narration,b.PRECISION,a.CHEQUEVALIDPERIOD,a.CHEQUELENGTH",
                                "a.branchcode='" + Conversions.ToString(rs.Rows[0].ItemArray[0]) + "' and a.currencycode=b.currencycode");
                        }
                        catch (Exception ex)
                        {
                            // if DB not connected
                            // 3. GENBRANCHPMT
                            // strquery = "select distinct(a.currencycode),b.narration,b.PRECISION,a.CHEQUEVALIDPERIOD,a.CHEQUELENGTH from genbranchpmt a, gencurrencytypemst b where a.branchcode=''" & rs(0).value & "'' and a.currencycode=b.currencycode"
                            // LogError - LoginCheck, "GENBRANCHPMT", ErrorMessage, strquery
                            // Redirect to LoginIndex with Error Message
                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, ErrorMessage = "Connection Failed: " + ex.Message };
                        }

                        BankingExtensions.ReleaseMemory(rs);

                        if (rs1.Rows.Count != 0)
                        {
                            string precision = Conversions.ToString(rs1.Rows[0].ItemArray[2]);
                            session.SetString(SessionConstants.CurrencyCode, Conversions.ToString(rs1.Rows[0].ItemArray[0]));
                            session.SetString(SessionConstants.CurrencyNarration, Conversions.ToString(rs1.Rows[0].ItemArray[1]));
                            session.SetInt32("PRECISION", precision.Length - 1);

                            // Cheque Validity Period
                            session.SetString(SessionConstants.ChequeValidPeriod, !string.IsNullOrWhiteSpace(Conversions.ToString(rs1.Rows[0].ItemArray[3])) ? Conversions.ToString(rs1.Rows[0].ItemArray[3]) : "");

                            // Cheque Length
                            session.SetString(SessionConstants.ChequeLength, !string.IsNullOrWhiteSpace(Conversions.ToString(rs1.Rows[0].ItemArray[4])) ? Conversions.ToString(rs1.Rows[0].ItemArray[4]) : "");
                        }

                        BankingExtensions.ReleaseMemory(rs1);

                        try
                        {
                            rscnt = await _databaseFactory.SingleRecordSet("cashcountermst", "counterno", 
                                "cashierid='" + session.GetString(SessionConstants.UserId) + "'");
                        }
                        catch (Exception ex)
                        {
                            // if DB not connected
                            // 4. CASHCOUNTERMST
                            // strquery = "select counterno from cashcountermst where cashierid=''" & session("userid") & "''"
                            // LogError - LoginCheck, "cashcountermst", "ErrMessage", AboveInput
                            // Redirect to LoginIndex with Error Message
                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, ErrorMessage = "Connection Failed: " + ex.Message };
                        }

                        if (rscnt.Rows.Count != 0)
                        {
                            session.SetString(SessionConstants.CounterNo, Conversions.ToString(rscnt.Rows[0].ItemArray[0]));
                        }

                        BankingExtensions.ReleaseMemory(rscnt);
                    }

                    rscust = await _databaseFactory.SingleRecordSet("genbankparm", "NONCUSTOMERID");

                    if (rscust.Rows.Count != 0)
                    {
                        session.SetString(SessionConstants.NonCustomer, Conversions.ToString(rscust.Rows[0].ItemArray[0]));
                    }

                    BankingExtensions.ReleaseMemory(rscust);

                    rs2 = await _databaseFactory.SingleRecordSet("genbankparm", "bankcode,bankname", "");

                    if (rs2.Rows.Count != 0)
                    {
                        session.SetString(SessionConstants.BankCode, Conversions.ToString(rs2.Rows[0].ItemArray[0]));
                        session.SetString(SessionConstants.BankName, Conversions.ToString(rs2.Rows[0].ItemArray[1]));
                    }

                    BankingExtensions.ReleaseMemory(rs2);

                    if (session.GetString(SessionConstants.DayBegin) == "")
                    {
                        var moduleId = session.GetString("moduleid");
                        if (userId.Length != 0 && firstPass.Length != 0 && secPass.Length != 0 || moduleId == "")
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
                                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, ErrorMessage = "Connection Failed: " + ex.Message };
                            }

                            if (rsValid.Rows.Count == 0)
                            {
                                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                    ErrorMessage = $"{userId.ToUpper()} Your account is temporarly disabled. Please contact your Administrator..." };
                            }

                            BankingExtensions.ReleaseMemory(rsValid);

                            // 1.1 Password checking for default password
                            // (i) check the password without encrypting for default passwords
                            // added new code
                            if (status == "ChngPwd1")
                            {
                                var Paswd1 = BankingExtensions.EncodePassword(firstPass.ToUpper(), userId);
                                var chkBio1 = BankingExtensions.EncodePassword(secPass.ToUpper(), userId);

                                session.SetString(SessionConstants.UserId, userId);

                                rsLogChk = await _databaseFactory.SingleRecordSet("GENPROMOTIONSMST", "EMPPWD", "upper(EMPID)='" + userId.ToUpper() + "'");
                                rsBioChk = await _databaseFactory.SingleRecordSet("GENUSERMST", "BIOMETRICS,status", "upper(USERID)='" + userId.ToUpper() + "'");

                                if (rsLogChk.Rows.Count != 0)
                                {
                                    if (firstPass == Conversions.ToString(rsLogChk.Rows[0].ItemArray[0]) || Paswd1 == Conversions.ToString(rsLogChk.Rows[0].ItemArray[0]))
                                    {
                                        if (rsBioChk.Rows.Count != 0)
                                        {
                                            if (secPass == Conversions.ToString(rsBioChk.Rows[0].ItemArray[0]) || chkBio1 == Conversions.ToString(rsBioChk.Rows[0].ItemArray[0]))
                                            {
                                                if (Conversions.ToString(rsBioChk.Rows[0].ItemArray[1]) == "A")
                                                    strMessage = "Successfully Loged in";
                                                else
                                                {
                                                    strMessage = "Not An Approved User...";
                                                    BankingExtensions.ReleaseMemory(rsLogChk);
                                                    BankingExtensions.ReleaseMemory(rsBioChk);
                                                    return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                        ErrorMessage = strMessage };
                                                }
                                            }
                                            else
                                            {
                                                strMessage = "Invalid password OR Username LogonDenied";
                                                BankingExtensions.ReleaseMemory(rsLogChk);
                                                BankingExtensions.ReleaseMemory(rsBioChk);
                                                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                    ErrorMessage = strMessage };
                                            }
                                        }
                                        else
                                        {
                                            strMessage = "Not An Application User";
                                            BankingExtensions.ReleaseMemory(rsLogChk);
                                            BankingExtensions.ReleaseMemory(rsBioChk);
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = strMessage };
                                        }
                                    }
                                    else
                                    {
                                        strMessage = "Invalid Username OR password LogonDenied";
                                        BankingExtensions.ReleaseMemory(rsLogChk);
                                        BankingExtensions.ReleaseMemory(rsBioChk);
                                        return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                            ErrorMessage = strMessage };
                                    }
                                }
                                else
                                {
                                    strMessage = "Invalid Username OR Password LogonDenied";
                                    BankingExtensions.ReleaseMemory(rsLogChk);
                                    BankingExtensions.ReleaseMemory(rsBioChk);
                                    return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                        ErrorMessage = strMessage };
                                }
                                BankingExtensions.ReleaseMemory(rsLogChk);
                                BankingExtensions.ReleaseMemory(rsBioChk);
                                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                    ErrorMessage = strMessage };
                            }
                            // end of new code

                            // 2.Password checking for the existing userid
                            // (i)  check with First Password
                            // (ii) check with Second Password
                            var chkPwd = BankingExtensions.EncodePassword(firstPass.ToUpper(), userId);
                            var chkBio = BankingExtensions.EncodePassword(secPass.ToUpper(), userId);
                            rsLogChk = await _databaseFactory.SingleRecordSet("GENPROMOTIONSMST", "EMPPWD", "upper(EMPID)='" + userId.ToUpper() + "'");
                            rsBioChk = await _databaseFactory.SingleRecordSet("GENUSERMST", "BIOMETRICS,status", "upper(USERID)='" + userId.ToUpper() + "'");

                            if (rsLogChk.Rows.Count != 0)
                            {
                                if (chkPwd == Conversions.ToString(rsLogChk.Rows[0].ItemArray[0]))
                                {
                                    if (rsBioChk.Rows.Count != 0)
                                    {
                                        if (chkBio == Conversions.ToString(rsBioChk.Rows[0].ItemArray[0]))
                                        {
                                            if (Conversions.ToString(rsBioChk.Rows[0].ItemArray[1]) == "A")
                                                strMessage = "Successfully Loged in";
                                            else
                                            {
                                                strMessage = "Not An Approved User...";
                                                BankingExtensions.ReleaseMemory(rsLogChk);
                                                BankingExtensions.ReleaseMemory(rsBioChk);
                                                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                    ErrorMessage = strMessage };
                                            }
                                        }
                                        else
                                        {
                                            strMessage = "Invalid password OR Username LogonDenied";
                                            BankingExtensions.ReleaseMemory(rsLogChk);
                                            BankingExtensions.ReleaseMemory(rsBioChk);
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = strMessage };
                                        }
                                    }
                                    else
                                    {
                                        strMessage = "Not An Application User";
                                        BankingExtensions.ReleaseMemory(rsLogChk);
                                        BankingExtensions.ReleaseMemory(rsBioChk);
                                        return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                            ErrorMessage = strMessage };
                                    }
                                }
                                else
                                {
                                    strMessage = "Invalid Username OR password LogonDenied";
                                    BankingExtensions.ReleaseMemory(rsLogChk);
                                    BankingExtensions.ReleaseMemory(rsBioChk);
                                    return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                        ErrorMessage = strMessage };
                                }
                            }
                            else
                            {
                                strMessage = "Invalid Username OR password LogonDenied";
                                BankingExtensions.ReleaseMemory(rsLogChk);
                                BankingExtensions.ReleaseMemory(rsBioChk);
                                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                    ErrorMessage = strMessage };
                            }

                            BankingExtensions.ReleaseMemory(rsLogChk);
                            BankingExtensions.ReleaseMemory(rsBioChk);

                            // 3.Checking whether UserId Locked OR Not
                            DataTable rsLock = await _databaseFactory.SingleRecordSet("GENUSERMST", "LOCKEDDATE", "upper(userid)='" + userId.ToUpper() + "'");
                            if (rsLock.Rows.Count != 0)
                            {
                                if (!string.IsNullOrWhiteSpace(Conversions.ToString(rsLock.Rows[0].ItemArray[0])))
                                {
                                    strMessage = "UserId Locked";
                                    BankingExtensions.ReleaseMemory(rsLock);
                                    return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                        ErrorMessage = strMessage };
                                }
                            }

                            BankingExtensions.ReleaseMemory(rsLock);

                            // 4.Checking whether User Expirydate is crossed the Applicationdate
                            DataTable rsExpDt = await _databaseFactory.SingleRecordSet("GENUSERMST", "EXPIRYDATE,sysdate", "upper(userid)='" + userId.ToUpper() + "'");
                            session.SetString("ExpiryUserid", "");
                            if (rsExpDt.Rows.Count != 0)
                            {
                                if (!string.IsNullOrWhiteSpace(Conversions.ToString(rsExpDt.Rows[0].ItemArray[0])))
                                {
                                    double days = BankingExtensions.DateDifference("d", Convert.ToDateTime(session.GetString(SessionConstants.ApplicationDate)), 
                                        Convert.ToDateTime(rsExpDt.Rows[0].ItemArray[0]));
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
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = message };
                                        }
                                        session.SetString("ExpiryUserid", message);
                                    }
                                }
                            }

                            BankingExtensions.ReleaseMemory(rsExpDt);

                            // 5.Checking Password ExpiryDate
                            DataTable rsPwdDt = await _databaseFactory.SingleRecordSet("GENPROMOTIONSMST", "PWDEXPIRYDT,sysdate,GRACETIME", "upper(EMPID)='" + userId.ToUpper() + "'");
                            session.SetString("Expirypwd", "");
                            if (rsPwdDt.Rows.Count != 0)
                            {
                                if (!string.IsNullOrWhiteSpace(Conversions.ToString(rsPwdDt.Rows[0].ItemArray[0])))
                                {
                                    double days = BankingExtensions.DateDifference("D", Convert.ToDateTime(session.GetString(SessionConstants.ApplicationDate)), 
                                        Convert.ToDateTime(rsPwdDt.Rows[0].ItemArray[0]));
                                    if (Convert.ToInt32(days) <= Convert.ToInt32(rsPwdDt.Rows[0].ItemArray[2]))
                                    {
                                        message = "Your Password Will Be Expired WithIn " + days + " day(s)";
                                        if (Convert.ToInt32(days) == 0)
                                            message = "Your Password Will Expire Today";
                                        if (Convert.ToInt32(days) < 0)
                                        {
                                            message = "Password Expired, Please Contact Administrator";
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = message };
                                        }
                                        session.SetString("Expirypwd", message);
                                    }
                                }
                            }

                            BankingExtensions.ReleaseMemory(rsPwdDt);

                            // End of New code
                            if (string.IsNullOrWhiteSpace(session.GetString("moduleid")))
                            {
                                strMessage = "Successfully Loged in";
                                status = "Login";
                            }

                            if (status == "Login")
                            {
                                if (strMessage.Equals("Successfully Loged in") || strMessage.Equals("Transaction Completed"))
                                {
                                    string group1 = string.Empty, macid = string.Empty;
                                    int sessions = 0;
                                    DataTable reccheck;

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
                                        return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                            ErrorMessage = "Connection Failed: " + ex.Message };
                                    }

                                    if (reccheck.Rows.Count != 0)
                                    {
                                        sessions = Convert.ToInt32(reccheck.Rows[0].ItemArray[0]);
                                        macid = Conversions.ToString(reccheck.Rows[0].ItemArray[1]);
                                        group1 = Conversions.ToString(reccheck.Rows[0].ItemArray[2]);
                                    }
                                    else
                                    {
                                        BankingExtensions.ReleaseMemory(reccheck);
                                        return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                            ErrorMessage = $"{userId.ToUpper()} Your account is temporarly disabled. Please contact your Administrator..." };
                                    }

                                    if (!group1.Equals("ADMIN"))
                                    {
                                        try
                                        {
                                            reccheck = await _databaseFactory.SingleRecordSet("genmachinedtls",
                                                "machineid",
                                                "upper(branchcode)='" + session.GetString(SessionConstants.BranchCode).ToUpper() + "' and machineipaddress='" + macid + "'");
                                        }
                                        catch (Exception ex)
                                        {
                                            // if DB not connected
                                            // 7. GENMACHINEDTLS
                                            // strquery = "select machineid from genmachinedtls where upper(branchcode)=''" & ucase(session("branchcode")) & "'' and machineipaddress=''" & macid & "''"
                                            // LogError - LoginCheck, "genmachinedtls", 7, AboveInput
                                            // Redirect to Login (useridscreen.aspx) with Error Message
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = "Connection Failed: " + ex.Message };
                                        }

                                        if (reccheck.Rows.Count != 0)
                                        {
                                            if (!macid.Equals("")) // Request.ServerVariables("REMOTE_HOST")))
                                            {
                                                if (!macid.Equals("X"))
                                                {
                                                    BankingExtensions.ReleaseMemory(reccheck);
                                                    return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                        ErrorMessage = $"{userId} Please login from the machine alloted to u.." };
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (!macid.Equals("X"))
                                            {
                                                BankingExtensions.ReleaseMemory(reccheck);
                                                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                    ErrorMessage = $"This Machine {macid} is not identified in {session.GetString(SessionConstants.BranchCode).ToUpper()} " +
                                                    $"branch. Please check the Machine and try again.." };
                                            }
                                            else
                                            {
                                                macid = ""; // Request.ServerVariables("REMOTE_HOST")
                                                reccheck = await _databaseFactory.SingleRecordSet("genmachinedtls", "machineid", "upper(branchcode)='" + 
                                                    session.GetString(SessionConstants.BranchCode).ToUpper() + "' and machineipaddress='" + macid + "'");
                                                if (reccheck.Rows.Count != 0)
                                                {
                                                    //x = 0;   todo
                                                }
                                                else
                                                {
                                                    BankingExtensions.ReleaseMemory(reccheck);
                                                    return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                        ErrorMessage = $"This Machine {macid} is not identified in {session.GetString(SessionConstants.BranchCode).ToUpper()} branch. Please check the Machine and try again.." };
                                                }
                                            }
                                        }
                                    }

                                    try
                                    {
                                        reccheck = await _databaseFactory.SingleRecordSet("genuserlogindtls", "machineid", 
                                            "upper(userid)='" + userId.ToUpper() + "' and upper(machineid)<>'" + session.GetString(SessionConstants.MachineId).ToUpper() + "'");
                                    }
                                    catch (Exception ex)
                                    {
                                        // if DB not connected
                                        // 8 - GENUSERLOGINDTLS
                                        // strquery = "select machineid from genuserlogindtls where upperupper(userid)=''" & ucase(usrid) & "'' and upper(machineid)<>''" & ucase(session("machineid")) & "''"
                                        // LogError - LoginCheck, "genmachinedtls", 8, AboveInput
                                        // Redirect to Login (useridscreen.aspx) with Error Message
                                        return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                            ErrorMessage = "Connection Failed: " + ex.Message };
                                    }

                                    if (reccheck.Rows.Count != 0)
                                    {
                                        if (reccheck.Rows.Count >= Convert.ToInt32(sessions) && group1.Equals("ADMIN"))
                                        {
                                            if (sessions == 0)
                                                sessions = 1;
                                            BankingExtensions.ReleaseMemory(reccheck);
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = $"{userId.ToUpper()} You have already opened {sessions} browsers. Please logout from some browsers and try again..." };
                                        }
                                        else if (group1 != "ADMIN" && Conversions.ToString(reccheck.Rows[0].ItemArray[0]) != Conversions.ToString(session.GetString(SessionConstants.MachineId)))
                                        {
                                            BankingExtensions.ReleaseMemory(reccheck);
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = $"{userId.ToUpper()} You have already opened one browser. Please logout that and try again..." };
                                        }
                                    }

                                    BankingExtensions.ReleaseMemory(reccheck);

                                    char admin = group1.ToUpper().Equals("ADMIN") ? 'Y' : 'N';

                                    //trans[0, 0] = "U";
                                    //trans[0, 1] = "Genuserlogindtls";
                                    //trans[0, 2] = "userid,machineid,branchcode,loginsysdate,adminyn,sessionid";
                                    //trans[0, 3] = "'" + userId + "','" + session.GetString(SessionConstants.MachineId) + "','" + session.GetString(SessionConstants.BranchCode) + "',sysdate,admin,'" + sessionId + "'";
                                    //trans[0, 4] = "";

                                    trans[0, 0] = "I";
                                    trans[0, 1] = "Genuserlogindtls";
                                    trans[0, 2] = "userid,machineid,branchcode,loginsysdate,adminyn,sessionid";
                                    trans[0, 3] = "'" + userId + "','" + session.GetString(SessionConstants.MachineId) + "','" + session.GetString(SessionConstants.BranchCode) + "',sysdate,'" + admin + "','" + sessionId + "'";
                                    trans[0, 4] = "";

                                    strMessage = await _databaseFactory.ProcessDataTransactions(trans, "", "", "", appdate, "N");

                                    if (strMessage.Length >= 11 && strMessage.Substring(0, 11).Equals("Transaction"))
                                    {
                                        string stx = "";
                                        string stn = "";

                                        try
                                        {
                                            recdaybegin = await _databaseFactory.SingleRecordSet("genmodulemst c, genmoduletypesmst d",
                                                "distinct(c.moduleid),initcap(c.narration),moduleorder",
                                                "c.moduleid in(select moduleid from gengroupformsmst where groupcode= (select groupid from genusermst where upper(userid)='" + 
                                                userId.ToUpper() + "') union select distinct moduleid from genuseridformsmst where addoreliminate='A' and upper(userid)='" + 
                                                userId.ToUpper() + "'" + ") and d.implementedyn='Y' and d.moduleid=c.moduleid and d.branchcode='" + 
                                                session.GetString(SessionConstants.BranchCode) + "' and c.parentmoduleid is null order by moduleorder");
                                        }
                                        catch (Exception ex)
                                        {
                                            // if DB not connected
                                            // 9 - GENMODULEMST
                                            // strquery = "select distinct(c.moduleid),initcap(c.narration),moduleorder from genmodulemst c, genmoduletypesmst d where c.moduleid in (select moduleid from gengroupformsmst where groupcode= (select groupid from genusermst where upper(userid)=''" & ucase(usrid) "'') union select distinct moduleid from genuseridformsmst where addoreliminate=''A'' and upper(userid)=''" & ucase(usrid) & "'') and d.implementedyn=''Y'' and d.moduleid=c.moduleid and d.branchcode=''" & session("branchcode") & "'' and c.parentmoduleid is null order by moduleorder"
                                            // objErrlog.LogError("LoginCheck", "genmodulemst", 9, objchk.ConnError & " : SQL Query : " & strquery)
                                            // strerror = objErrlog.ErrorProcess(9, "genmodulemst: " & objchk.ConnError, objchk.ConnError & " : SQL Query : " & strquery, "LoginCheck",, UsrId, session("machineid"))
                                            // Redirect to Login (useridscreen.aspx) with Error Message
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = "Connection Failed: " + ex.Message };
                                        }

                                        if (recdaybegin.Rows.Count == 0)
                                        {
                                            string strm = "Workallotment is not done to this user..";
                                            BankingExtensions.ReleaseMemory(recdaybegin);
                                            return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                                ErrorMessage = strm };
                                        }

                                        foreach (DataRow row in recdaybegin.Rows)
                                        {
                                            stx += row[0].ToString() + ":F|";
                                            stn += "," + row[1].ToString();
                                        }

                                        stx = stx + "$";

                                        session.SetString(SessionConstants.ModNar, stn);
                                        session.SetString(SessionConstants.Mod, stx);
                                        BankingExtensions.ReleaseMemory(recdaybegin);
                                        return new RedirectModel()
                                        {
                                            ControllerName = ControllerNames.Dashboard,
                                            ActionName = ActionNames.Index,
                                            keyValuePairs = new Dictionary<string, string> { { "record", stx } }
                                        };
                                        // return commDict.AddAndReturn(BankingConstants.Screen_Dashboard, stx);
                                    }
                                    else
                                    {
                                        BankingExtensions.ReleaseMemory(recdaybegin);
                                        return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                            ErrorMessage = strMessage };
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
                                    return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                        ErrorMessage = strMessage };
                                }
                            }
                            else if (status == "ChngPwd")
                            {
                                if (strMessage.Equals("Successfully Loged in") || strMessage.Equals("Trans Completed"))
                                {
                                    session.SetString(SessionConstants.UserId, userId);
                                    BankingExtensions.ReleaseMemory(recdaybegin); // ConfirmUserId
                                    return new RedirectModel() { ControllerName = ControllerNames.User, ActionName = ActionNames.Index, 
                                        ErrorMessage = strMessage };
                                }
                                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                                        ErrorMessage = strMessage };
                            }
                        }
                    }
                    else
                    {
                        strMessage = "not a Valid Password for " + userId.ToUpper() + "....";
                        return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                            ErrorMessage = strMessage };
                    }
                }
                else
                {
                    // RecWorkAllotment = nothing

                    DataTable recdaybegin1 = null!;
                    DataTable recdaybegin2 = null!;

                    // rsdate.Close();
                    // rsdate = null!;

                    string stn = "";
                    string stx = "";

                    //if db not connected 
                    //Redirect to useridscreen.aspx. with error message.
                    //return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, ErrorMessage = "Connection Failed: " + ex.Message };
                    // return DictionaryExtensions.AddAndReturn(commDict, BankingConstants.Screen_Login, "Connection Failed.");

                    do
                    {
                        if (Conversions.ToString(recdaybegin.Rows[0].ItemArray[1]) == "0")
                            stx = stx + Conversions.ToString(recdaybegin.Rows[0].ItemArray[0]) + ":F" + "|";
                        else
                            stx = stx + Conversions.ToString(recdaybegin.Rows[0].ItemArray[0]) + ":T" + "|";

                        stn = stn + "," + Conversions.ToString(recdaybegin.Rows[0].ItemArray[2]);

                    } while (recdaybegin.Rows.Count > 0);

                    BankingExtensions.ReleaseMemory(recdaybegin);

                    stx = stx + "$";

                    if (stn.Length == 0)
                    {
                        stn = stn + "$";

                        // if db not connected.
                        // Redirect to useridscreen.aspx with message - ConnError
                        // return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, ErrorMessage = "Connection Failed: " + ex.Message };
                        // return DictionaryExtensions.AddAndReturn(commDict, BankingConstants.Screen_Login, "Connection Failed.");

                        do
                        {
                            stx = stx + Conversions.ToString(recdaybegin.Rows[0].ItemArray[0]) + ":F" + "|";
                            stn = stn + "," + Conversions.ToString(recdaybegin.Rows[0].ItemArray[1]);
                        } while (recdaybegin1.Rows.Count > 0);

                        BankingExtensions.ReleaseMemory(recdaybegin1);

                        // if DB not connected.
                        // Redirect to useridscreen.aspx with message - ConnError
                        // return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, ErrorMessage = "Connection Failed: " + ex.Message };
                        // return DictionaryExtensions.AddAndReturn(commDict, BankingConstants.Screen_Login, "Connection Failed.");

                        do
                        {
                            stx = stx + Conversions.ToString(recdaybegin.Rows[0].ItemArray[0]) + ":F" + "|";
                            stn = stn + "," + Conversions.ToString(recdaybegin.Rows[0].ItemArray[1]);
                            // Response.Write(recdaybegin2(1).value)
                        } while (recdaybegin2.Rows.Count > 0);

                        BankingExtensions.ReleaseMemory(recdaybegin2);

                        session.SetString(SessionConstants.ModNar, stn);
                        session.SetString(SessionConstants.Mod, stx);

                        // 'stx="genworkallotmentmst a,genmoduleactivitylog b" & " a.moduleid,nvl(b.daybeginstatus,'N')" & "a.moduleid=b.moduleid(+) and upper(a.userid)='" & ucase(usrid) & "' and to_char(daybegindate(+),'dd - Mon - yyyy')='" & rsdate(0) &"'"
                        return new RedirectModel()
                        {
                            ControllerName = ControllerNames.Dashboard,
                            ActionName = ActionNames.Index,
                            keyValuePairs = new Dictionary<string, string> { { "record", stx } }
                        };
                    }
                }

                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index };
            }
            catch (Exception ex)
            {
                return new RedirectModel() { ControllerName = ControllerNames.Login, ActionName = ActionNames.Index, 
                    ErrorMessage = "Connection Failed!" };
            }
        }
       
        public  async Task<RedirectModel> Logout(ISession session)
        {
            string[,] trans = new string[2, 5];
            string queryString = string.Empty, strMessage = string.Empty, message = string.Empty, strQuery = string.Empty;

            string sessionId = session.GetSessionId();
            string macid = session.GetString(SessionConstants.MachineId);
            string userid = session.GetString(SessionConstants.UserId);

            trans[0, 0] = "U";
            trans[0, 1] = "Genuserlogindtls";
            trans[0, 2] = "logoutsysdate,logoutstatus";
            trans[0, 3] = "sysdate~'N'";
            trans[0, 4] = "upper(userid)='" + userid.ToUpper() + "'and upper(machineid)='" + macid + "'and sessionid='" + sessionId + "'";

            trans[1, 0] = "D";
            trans[1, 1] = "Genuserlogindtls";
            trans[1, 2] = "";
            trans[1, 3] = "";
            trans[1,4]= "upper(userid)='" + userid.ToUpper() + "'and upper(machineid)='" + macid + "'and sessionid='"  + sessionId + "'";

            strMessage = await _databaseFactory.ProcessDataTransactions(trans, "", "", "","","", "N");

            return new RedirectModel() { ControllerName = ControllerNames.Login, 
                ActionName = ActionNames.Index, ErrorMessage = strMessage };
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
