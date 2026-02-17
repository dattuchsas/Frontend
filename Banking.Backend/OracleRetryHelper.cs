using Banking.Models;
using Oracle.ManagedDataAccess.Client;
using System.Data;
using System.Threading;
using System.Transactions;

namespace Banking.Backend
{
    public class OracleRetryHelper
    {
        private string _connectionString { get; set; } = null!;
        private int _maxRetries { get; set; }
        private int _initialDelayMs { get; set; }

        public OracleRetryHelper(DatabaseSettings databaseSettings)
        {
            _connectionString = databaseSettings.ConnectionString;
            _maxRetries = databaseSettings.MaxRetries;
            _initialDelayMs = databaseSettings.InitialDelayMs;
        }

        public async Task<DataTable> ProcessQueryWithRetryAsync(string query)
        {
            int attempt = 0;
            Exception lastException = null!;
            DataTable dataTable = new DataTable();

            while (attempt < _maxRetries)
            {
                try
                {
                    using var connection = new OracleConnection(_connectionString);
                    await connection.OpenAsync(CancellationToken.None);

                    using var cmd = connection.CreateCommand();
                    cmd.CommandText = query;

                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
                        dataTable.Load(reader);
                    }

                    if (connection.State == ConnectionState.Open)
                    {
                        cmd.Dispose();
                        connection.Close();
                        connection.Dispose();
                    }

                    return dataTable;
                }
                catch (OracleException ex) when (IsTransient(ex))
                {
                    lastException = ex;
                    attempt++;

                    if (attempt >= _maxRetries)
                        break;

                    int delay = _initialDelayMs * (int)Math.Pow(2, attempt - 1);
                    await Task.Delay(delay, CancellationToken.None);
                }
                catch (OracleException ex)
                {
                    throw new Exception(OracleErrorMapper.GetFriendlyMessage(ex));
                }
            }

            throw new InvalidOperationException(
                $"Failed to open Oracle connection after {_maxRetries} attempts.",
                lastException);
        }

        public async Task<int> ProcessNonQueryWithRetryAsync(string query)
        {
            int attempt = 0;
            Exception lastException = null!;

            while (attempt < _maxRetries)
            {
                using var connection = new OracleConnection(_connectionString);
                await connection.OpenAsync(CancellationToken.None);

                await using var transaction = connection.BeginTransaction();

                try
                {
                    using var cmd = connection.CreateCommand();
                    cmd.Transaction = transaction;
                    cmd.CommandText = query;

                    var result = cmd.ExecuteNonQuery();

                    if (connection.State == ConnectionState.Open)
                    {
                        cmd.Dispose();
                        connection.Close();
                        connection.Dispose();
                    }

                    await transaction.CommitAsync(CancellationToken.None);
                    return result;
                }
                catch (OracleException ex) when (IsTransient(ex))
                {
                    lastException = ex;
                    attempt++;

                    if (attempt >= _maxRetries)
                        break;

                    await transaction.RollbackAsync(CancellationToken.None);

                    connection.Close();
                    connection.Dispose();

                    int delay = _initialDelayMs * (int)Math.Pow(2, attempt - 1);
                    await Task.Delay(delay, CancellationToken.None);
                }
                catch (OracleException ex)
                {
                    await transaction.RollbackAsync(CancellationToken.None);
                    connection.Close();
                    connection.Dispose();
                    throw new Exception(OracleErrorMapper.GetFriendlyMessage(ex));
                }
            }

            throw new InvalidOperationException(
                $"Failed to open Oracle connection after {_maxRetries} attempts.",
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

        //static OracleDataReader result = null!;
        //public static async Task<OracleDataReader> ProcessQuery()
        //{
        //    await using var conn = await OpenConnectionWithRetryAsync(_connectionString);
        //    await using var cmd = conn.CreateCommand();
        //    await using var reader = await cmd.ExecuteReaderAsync();

        //    if (!reader.IsClosed)
        //        result = reader;

        //    return result;
        //}

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
