using Banking.Models;
using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace Banking.Backend
{
    public class OracleErrorHelper
    {
        private const bool blnDebug = true;
        private readonly OracleRetryHelper _oracleRetryHelper;

        public OracleErrorHelper(DatabaseSettings databaseSettings)
        {
            _oracleRetryHelper = new OracleRetryHelper(databaseSettings);
        }

        public async Task<DataTable> ProcessQueryAsync(string query)
        {
            return await _oracleRetryHelper.ProcessQueryWithRetryAsync(query);
        }

        //public async Task<string[,]> ErrorProcess(string ErrNumber, string ErrDesc, string ErrClientDesc, string ComponentName = "",
        //    string Branchode = "", string UserId = "", string MachineID = "")
        //{
        //    List<Dictionary<string, object>> RSError;
        //    string[,] InsValues;
        //    string FldNames;
        //    string Condition;
        //    string strquery;
        //    string strErrNo;
        //    string strErrDesc;
        //    string StrUserID;
        //    string StrMachineID;
        //    string StrBranchCode;
        //    string[,] ArrError = new string[0, 2];
        //    string OriginalOracleError;

        //    try
        //    {
        //        OriginalOracleError = ErrDesc.Replace("\n", "").Replace("\r", "").Replace("'", "");

        //        strquery = "";

        //        if (ErrNumber.Trim()[^1].ToString() == ":")
        //        {
        //            strErrNo = ErrNumber.Trim().Split(':')[0].ToUpper();
        //        }
        //        else
        //        {
        //            strErrNo = ErrNumber.Trim().ToUpper();
        //        }

        //        strErrDesc = ErrDesc;
        //        StrUserID = UserId;
        //        StrMachineID = MachineID;
        //        StrBranchCode = Branchode.Trim().ToUpper();
        //        Condition = " upper(trim(errornumber))='" + strErrNo.Trim().ToUpper() + "' and upper(trim(oranarration))='" + strErrDesc.Trim().ToUpper() + "'";
        //        ArrError = new string[0, 2];
        //        strquery = "Select ErrorNumber,OraNarration,ClientNarration from GENERRORMST where upper(trim(errornumber))='" + strErrNo.Trim().ToUpper() + "'";

        //        RSError = await ProcessQuery(strquery);

        //        InsValues = new string[1, 1];
        //        ArrError = new string[0, 2];
        //        if (RSError.Count != 0)
        //        {
        //            if (RSError.Count != 0)
        //            {
        //                // Insert a new record to the generrormst if the error was generated for the first time
        //                FldNames = "ErrorNumber,OraNarration,ClientNarration";
        //                InsValues[0, 0] = "'" + strErrNo + "','" + strErrDesc + "','" + strErrDesc + "'";
        //                strquery = "Insert into GENERRORMST (" + FldNames + ") values (" + InsValues[0, 0] + ")";
        //                RSError = await ProcessQuery(strquery);
        //                if (RSError.Count < 1)
        //                {
        //                    ArrError[0, 0] = "";
        //                    ArrError[0, 1] = "";
        //                    ArrError[0, 2] = "Data Base Problem.";
        //                    return ArrError;
        //                }

        //                strquery = "Select ErrorNumber,OraNarration,ClientNarration from GENERRORMST where " + " upper(trim(errornumber))='" + strErrNo.Trim().ToUpper() + "'";

        //                RSError = await ProcessQuery(strquery);
        //            }

        //            // now inserting the error details into th errorlog table
        //            strErrNo = (Convert.ToString(RSError[0]["errornumber"]) ?? string.Empty).ToUpper();
        //            strErrDesc = (Convert.ToString(RSError[0]["oranarration"]) ?? string.Empty).ToUpper();
        //            FldNames = "ErrorNumber,ClientNarration,Branchcode, userid,machineid,systemdate,errordate,ErrorComponent,ORACLENARRATION";

        //            InsValues[0, 0] = "'" + strErrNo + "', '" + ErrClientDesc + "','" + StrBranchCode + "','" + StrUserID + "','" + StrMachineID + 
        //                "', sysdate, to_date('" + string.Format(DateTime.Now.ToString(), "dd-mmm-yy HH:MM:SS") + "','dd-mon-yy HH24:mi:ss'), '" + 
        //                ComponentName + "','" + OriginalOracleError + "'";

        //            strquery = "insert into GenErrorlog (" + FldNames + ") values (" + InsValues[0, 0] + ")";

        //            RSError = await ProcessQuery(strquery);

        //            if (RSError.Count < 1)
        //            {
        //                ArrError[0, 0] = "";
        //                ArrError[0, 1] = "";
        //                ArrError[0, 2] = "Data Base Problem. " + "";
        //                return ArrError;
        //            }

        //            ArrError[0, 0] = RSError.GetString(RSError.GetOrdinal("errornumber"));
        //            ArrError[0, 1] = RSError.GetString(RSError.GetOrdinal("oranarration"));
        //            ArrError[0, 2] = ErrClientDesc;
        //            return ArrError;
        //        }
        //        else
        //        {
        //            throw new Exception();
        //        }
        //    }
        //    catch (OracleException ex)
        //    {
        //        ArrError[0, 0] = ex.Errors[0]?.Number.ToString() ?? string.Empty;
        //        ArrError[0, 1] = ex.Errors[0]?.Message ?? string.Empty;
        //        ArrError[0, 2] = ex.Errors[0]?.Message + ". Error from GenErrorLog and the error occured at client transaction is " + ErrClientDesc;
        //        return ArrError;
        //    }
        //}

        //public async Task LogError(string ApplName, string ProcName, long ErrNum, string ErrorMsg)
        //{
        //    try
        //    {
        //        if (blnDebug == true)
        //        {
        //            string logDir = @"C:\Inetpub\wwwroot\eSmartdotnet\errorlog";
        //            string logFile = Path.Combine(logDir, string.Concat(ApplName, "_", DateTime.Now.ToString("dd_MM_yyyy")) + ".log");

        //            // Ensure directory exists
        //            if (!Directory.Exists(logDir))
        //                Directory.CreateDirectory(logDir);

        //            if (!File.Exists(logFile))
        //                File.Create(logFile).Dispose();

        //            // Open file with async support
        //            using (var stream = new FileStream(
        //                logFile,
        //                FileMode.Append,
        //                FileAccess.Write,
        //                FileShare.Read,
        //                bufferSize: 4096,
        //                useAsync: true))
        //            using (var writer = new StreamWriter(stream))
        //            {
        //                await writer.WriteLineAsync($"Error in {ProcName}");
        //                await writer.WriteLineAsync($"  {ErrNum}, {ErrorMsg}");
        //                await writer.WriteLineAsync($"  {DateTime.Now}");
        //                await writer.WriteLineAsync();
        //                await writer.FlushAsync();
        //            }
        //        }
        //    }
        //    catch
        //    {
        //        // Failed to write log for some reason.'
        //        // Show MsgBox so error does not go unreported '
        //        // 'MsgBox "Error in " & ProcName & vbNewLine & _
        //        // ErrNum(default + ", " + ErrorMsg);
        //    }
        //}
    }
}
