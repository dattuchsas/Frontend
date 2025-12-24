//using Banking.Models;
//using Microsoft.VisualBasic;
//using Oracle.ManagedDataAccess.Client;
//using System.Runtime.Intrinsics.Arm;

//namespace Banking.Backend
//{
//    public class OracleErrorHelper
//    {
//        private readonly DatabaseSettings _databaseSettings;

//        public OracleErrorHelper(DatabaseSettings databaseSettings)
//        {
//            _databaseSettings = databaseSettings;
//            OracleRetryHelper.Initialize(_databaseSettings.ConnectionString);
//        }

//        public async Task<OracleDataReader> ProcessQuery(string query)
//        {
//            return await OracleRetryHelper.ProcessQueryAsync(query);
//        }

//        public async Task ErrorProcess(string ErrNumber, string ErrDesc, string ErrClientDesc, string ComponentName = "",
//            string Branchode = "", string UserId = "", string MachineID = "")
//        {
//            string ErrorProcessRet = "";

//            OracleDataReader RSError;
//            string[,] InsValues;
//            var strResult = "";
//            string FldNames;
//            string TabName;
//            string Condition;
//            string StrComponent;
//            string strquery;
//            string strErrNo;
//            string strErrDesc;
//            string StrClientDesc;
//            string Compname;
//            string StrUserID;
//            string StrMachineID;
//            string StrBranchCode;
//            string[,] ArrError;
//            var resaff = default(int);
//            string OriginalOracleError;

//            try
//            {
//                OriginalOracleError = ErrDesc.Replace("\n", "").Replace("\r", "").Replace("'", "");

//                strquery = "";

//                if (Strings.Right(Strings.Trim(ErrNumber), 1) == ":")
//                {
//                    strErrNo = Strings.UCase(Strings.Trim(Strings.Mid(ErrNumber, 1, Strings.InStr(1, Strings.UCase(Strings.Trim(ErrNumber)), ":") - 1)));
//                }
//                else
//                {
//                    strErrNo = Strings.UCase(Strings.Trim(ErrNumber));
//                }

//                strErrDesc = ErrDesc;
//                StrClientDesc = ErrClientDesc;
//                StrComponent = ComponentName;
//                StrUserID = UserId;
//                StrMachineID = MachineID;
//                StrBranchCode = Strings.UCase(Strings.Trim(Branchode));
//                Condition = " upper(trim(errornumber))='" + Strings.UCase(Strings.Trim(strErrNo)) + "' and upper(trim(oranarration))='" + Strings.UCase(Strings.Trim(strErrDesc)) + "'";
//                ArrError = new string[0, 2];
//                strquery = "Select ErrorNumber,OraNarration,ClientNarration from GENERRORMST where upper(trim(errornumber))='" + Strings.UCase(Strings.Trim(strErrNo)) + "'";
//                RSError = await ProcessQuery(strquery);
//                InsValues = new string[1, 1];
//                ArrError = new string[0, 2];
//                if (!RSError.IsClosed)
//                {
//                    if (!RSError.HasRows)
//                    {
//                        // Insert a new record to the generrormst if the error was generated for the first time
//                        TabName = "GenErrorMst";
//                        FldNames = "ErrorNumber,OraNarration,ClientNarration";
//                        InsValues[0, 0] = "'" + strErrNo + "','" + strErrDesc + "','" + strErrDesc + "'";
//                        strquery = "Insert into GENERRORMST (" + FldNames + ") values (" + InsValues[0, 0] + ")";
//                        RSError = await ProcessQuery(strquery);
//                        if (RSError.RecordsAffected < 1)
//                        {
//                            ArrError[0, 0] = "";
//                            ArrError[0, 1] = strResult;
//                            ArrError[0, 2] = "Data Base Problem.";
//                            return ArrError;
//                        }

//                        if (!RSError.IsClosed)
//                            RSError.Close();

//                        strquery = "Select ErrorNumber,OraNarration,ClientNarration from GENERRORMST where " + " upper(trim(errornumber))='" + Strings.UCase(Strings.Trim(strErrNo)) + "'";

//                        RSError = await ProcessQuery(strquery);
//                    }

//                    // now inserting the error details into th errorlog table
//                    strErrNo = RSError.GetString(RSError.GetOrdinal("errornumber")).ToUpper();
//                    strErrDesc = RSError.GetString(RSError.GetOrdinal("oranarration")).ToUpper();
//                    StrClientDesc = ErrClientDesc;
//                    FldNames = "ErrorNumber,ClientNarration,Branchcode, userid,machineid,systemdate,errordate,ErrorComponent,ORACLENARRATION";

//                    InsValues[0, 0] = "'" + strErrNo + "', '" + StrClientDesc + "','" + StrBranchCode + "','" + StrUserID + "','" + StrMachineID + "', sysdate, to_date('" + Strings.Format(DateTime.Now, "dd-mmm-yy HH:MM:SS") + "','dd-mon-yy HH24:mi:ss'), '" + StrComponent + "','" + OriginalOracleError + "'";

//                    strquery = "insert into GenErrorlog (" + FldNames + ") values (" + InsValues[0, 0] + ")";

//                    RSError = await ProcessQuery(strquery);
//                    if (RSError.RecordsAffected < 1)
//                    {
//                        ArrError[0, 0] = "";
//                        ArrError[0, 1] = strResult;
//                        ArrError[0, 2] = "Data Base Problem. " + strResult;
//                        return ArrError;
//                    }

//                    ArrError[0, 0] = RSError.GetString(RSError.GetOrdinal("errornumber"));
//                    ArrError[0, 1] = RSError.GetString(RSError.GetOrdinal("oranarration"));
//                    ArrError[0, 2] = StrClientDesc;
//                    return ArrError;
//                }
//                else
//                {
//                    goto ErrHand;
//                }
//            }
//            catch(OracleException ex)
//            {
//                ArrError[0, 0] = Information.Err().Number;
//                ArrError[0, 1] = Information.Err().Description;
//                ArrError[0, 2] = Information.Err().Description + ". Error from GenErrorLog and the error occured at client transaction is " + StrClientDesc;
//                return ArrError;
//            }
//        }

//        public void LogError(string ApplName, string ProcName, long ErrNum, string ErrorMsg)
//        {
//            try
//            {
//                string strErrLogPaht;
//                strErrLogPaht = @"C:\Inetpub\wwwroot\eSmartdotnet\errorlog";

//                if (blnDebug == true)
//                {
//                    var fso = new FileSystemObject();

//                    int nUnit;
//                    nUnit = FileSystem.FreeFile();

//                    if (fso.FolderExists(strErrLogPaht) == false)
//                    {
//                        fso.CreateFolder(strErrLogPaht);
//                    }

//                    // This assumes write access to the directory containing the program '
//                    // You will need to choose another directory if this is not possible '
//                    Open(@"C:\Inetpub\wwwroot\eSmartdotnet\errorlog\" + ApplName + ".log");
//                    FileSystem.Print(default #nUnit, "Error in " + ProcName);
//                    FileSystem.Print(default #nUnit, "  " + ErrNum + ", " + ErrorMsg);
//                    FileSystem.Print(default #nUnit, "  " + Strings.Format(DateTime.Now));
//                    FileSystem.Print(default #nUnit, "");
//                    Close[nUnit];
//                }
//                return;
//            }
//            catch
//            {
//                // Failed to write log for some reason.'
//                // Show MsgBox so error does not go unreported '
//                // 'MsgBox "Error in " & ProcName & vbNewLine & _
//                ErrNum(default + ", " + ErrorMsg);
//            }
//        }
//    }
//}
