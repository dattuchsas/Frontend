using Oracle.ManagedDataAccess.Client;

namespace Banking.Backend
{
    public static class OracleRetryHelper
    {
        private static string _connectionString { get; set; } = null!;
        private static OracleConnection connection = null!;
        static OracleDataReader result = null!;

        public static void Initialize(string connectionString)
        {
            _connectionString = connectionString;
        }

        public static async Task<OracleDataReader> ProcessQueryAsync(string query)
        {
            string strResult = string.Empty;
            try
            {
                OracleCommand cmd = await CommandAsync(query);
                return await cmd.ExecuteReaderAsync();
            }
            catch (OracleException ex)
            {
                string friendlyMessage = OracleErrorMapper.GetFriendlyMessage(ex);
                throw new Exception($"Error Details: {friendlyMessage}");
            }
        }

        public static async Task<OracleCommand> CommandAsync(string query)
        {
            try
            {
                return await CreateCommandAsync(query);
            }
            catch (OracleException ex)
            {
                string friendlyMessage = OracleErrorMapper.GetFriendlyMessage(ex);
                throw new Exception($"Error Details: {friendlyMessage}");
            }
        }

        private static async Task<OracleCommand> CreateCommandAsync(string sql)
        {
            try
            {
                var conn = await OpenConnectionWithRetryAsync(_connectionString);
                var cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.CommandTimeout = 5;
                return cmd;
            }
            catch (OracleException ex)
            {
                string friendlyMessage = OracleErrorMapper.GetFriendlyMessage(ex);
                throw new Exception($"Error Details: {friendlyMessage}");
            }
        }

        private static async Task<OracleConnection> OpenConnectionWithRetryAsync(
            string connectionString,
            int maxRetries = 5,
            int initialDelayMs = 500)
        {
            int attempt = 0;
            Exception lastException = null!;

            while (attempt < maxRetries)
            {
                try
                {
                    connection = new OracleConnection(connectionString);
                    await connection.OpenAsync(CancellationToken.None);
                    return connection;
                }
                catch (OracleException ex) when (IsTransient(ex))
                {
                    lastException = ex;
                    attempt++;

                    if (attempt >= maxRetries)
                        break;

                    int delay = initialDelayMs * (int)Math.Pow(2, attempt - 1);
                    await Task.Delay(delay, CancellationToken.None);
                }
                catch (OracleException ex)
                {
                    throw new Exception(OracleErrorMapper.GetFriendlyMessage(ex));
                }
            }

            throw new InvalidOperationException(
                $"Failed to open Oracle connection after {maxRetries} attempts.",
                lastException);
        }

        private static bool IsTransient(OracleException ex)
        {
            // Common transient Oracle error codes
            return ex.Number switch
            {
                12170 => true, // TNS: Connect timeout
                12541 => true, // TNS: No listener
                12560 => true, // TNS: Protocol adapter error
                12545 => true, // Target host or object does not exist
                12537 => true, // Connection closed
                17002 => true, // Network adapter error
                _ => false
            };
        }

        //public void DBConnection()
        //{
        //    int intRetrycnt;
        //    int intMaxRetCnt;
        //    object objdblink;
        //    string strpassword;
        //    Variant ArrLink;
        //    object objPwd;
        //    var resDBdate = new ADODB.Recordset();
        //    string strUserid;
        //    string strDataSource;
        //    string strSupreUserPassword;
        //    string strUserName;
        //    ADODB.Connection AdoScConnObj;
        //    string strLineno;
        //    string ErrNum;
        //    string errDesc;
        //    // 'Set objPwd = CreateObject("GeneratePwd.clsGeneratePassword")
        //    strSupreUserPassword = "RamSmart2020"; // 'objPwd.getMUP()
        //    strUserid = "v3"; // 'objPwd.getMU()
        //    strDataSource = "v3"; // 'objPwd.getDS()
        //    intMaxRetCnt = 5;

        //    // ************Oppening the connection to dblink*************
        //    intRetrycnt = 0;
        //    try
        //    {
        //        // ''' calling shared property manager for dblink



        //        AdoScConnObj = default;

        //        // '    strpassword = "RA1715141464430"
        //        // '    'strUserid = "v"
        //        // '    strUserName = "v3"
        //        // '    ConnError = ""
        //        AdoConnObj = Interaction.CreateObject("Adodb.Connection");
        //        AdoConnObj = new ADODB.Connection();

        //        AdoConnObj.CursorLocation = adUseClient;
        //        AdoConnObj.Open("Provider=MSDAORA.1;data source=" + strDataSource + ";Password=" + strSupreUserPassword + ";User ID=" + strUserid + "; Pooling=true;Min Pool Size=10;Max Pool Size=100;");
        //        // AdoConnObj.Open "Provider=MSDAORA.1;data source=V3;Password=esmart;User ID=V3"


        //        if (AdoConnObj.State == 1)
        //            ConnError = "Connected";


        //        return;
        //    }
        //    catch
        //    {
        //        if (Information.Err().Number == -2147467259)
        //        {
        //            if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-12154")
        //            {
        //                ConnError = "Please enter correct connect string in TNS names or TNS:could not resolve service name";
        //            }
        //            else if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-12535" | Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-12560")
        //            {
        //                ConnError = "Server or Network not available (Check your Network/Server ) or TNS:operation timed out ";
        //            }
        //            else if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-12514")
        //            {
        //                ConnError = "Server not up (Please startup the database.) or " + '\r' + '\r' + "Verify the Serviece name Mentioned in Tnsnames file is correct (TNS:listener could not resolve SERVICE_NAME given in connect descriptor)";
        //                ConnError = "Server not up or verify names in tns name or Listener could not  resolved";
        //            }
        //            else if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-12505")
        //            {
        //                ConnError = "Server is up But Oracle instance not yet started or TNS:listener could not resolve SID given in connect descriptor";
        //            }
        //            else if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-12545")
        //            {
        //                ConnError = "Please Verify your systems Network connection to the Server OR Please Verify the HOST Mentioned in the Tnsnames file is correct or ORA-12545: Connect failed because target host or object does not exist";
        //            }
        //            else if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-01034")
        //            {
        //                ConnError = "Database is NOT STARTED UP to connect. To start database please click on Start Up DB button.";
        //            }
        //            else if (intMaxRetCnt == intRetrycnt)
        //            {
        //                ConnError = "Connection Failed Please try again";
        //            }
        //            else
        //            {
        //                intRetrycnt = intRetrycnt + 1;
        //                Sleep(1000L);
        //                continue;
        //            }
        //        }

        //        else if (Information.Err().Number == -2147217843)
        //        {
        //            if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-01017")
        //            {
        //                if (strUserName == "scott")
        //                {
        //                    ConnError = "User/password not found while trying to get dbdate.";
        //                }
        //                else if (strUserName == "v3")
        //                {
        //                    ConnError = "Main UserName/password not Tallied.";
        //                }
        //            }
        //        }
        //        else if (Information.Err().Number == -2147217865)
        //        {
        //            if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-00942")
        //            {
        //                ConnError = "DBDATE: Table or View does not exist.";
        //            }
        //        }
        //        else if (Information.Err().Number == -2147217900)
        //        {
        //            if (Strings.Mid(Information.Err().Description, 1, Strings.InStr(1, Information.Err().Description, ":", Constants.vbTextCompare) - 1) == "ORA-00904")
        //            {
        //                ConnError = "DBDATE: Grant Not Given.";
        //            }
        //        }
        //        /// End If
        //        else if (intMaxRetCnt == intRetrycnt)
        //        {
        //            ConnError = "Connection Failed Please try again";
        //        }
        //        else
        //        {
        //            intRetrycnt = intRetrycnt + 1;
        //            VBTest.ReportOnly.Sleep(1000L);
        //            Resume
        //                }
        //        if (blnLogErrors == true)
        //            ((dynamic)objErrlog).LogError("DataBaseTransactions", "DBConnection" + strLineno, Information.Err().Number, Information.Err().Description);

        //        objError = Interaction.CreateObject("TrapError.ErrorDescription");
        //        ErrNum = Information.Err().Number.ToString();
        //        errDesc = Information.Err().Description;
        //        strComponent = Information.Err().Source + "- DBConnection - at Lineno : " + strLineno;
        //        ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, "", strComponent, "", "", "");

        //        if (AdoConnObj.State == 1)
        //            AdoConnObj.Close();
        //        AdoConnObj = (object)null;
        //        objError = null;
        //    }
        //}
    }
}
