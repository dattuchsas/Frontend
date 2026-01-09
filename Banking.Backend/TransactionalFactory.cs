using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using System.Data;

namespace Banking.Backend
{
    public class TransactionalFactory : ITransactionalService
    {
        private string dataLink = ""; // "@DBLINK"; // TODO: Move to settings if needed
        private string applicationDate = string.Empty;
        private string connError = string.Empty;
        private readonly OracleRetryHelper _oracleRetryHelper;

        public TransactionalFactory(DatabaseSettings databaseSettings)
        {
            _oracleRetryHelper = new OracleRetryHelper(databaseSettings);
        }

        private async Task<DataTable> ProcessQueryAsync(string query)
        {
            return await _oracleRetryHelper.ProcessQueryWithRetryAsync(query);
        }

        private async Task<int> ProcessNonQueryAsync(string query)
        {
            return await _oracleRetryHelper.ProcessNonQueryWithRetryAsync(query);
        }

        public async Task<string> InsertRecord(string TableName, string FldNames, string[] ArrValues, string BranchCode = "", string UserCode = "",
            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        {
            int oracleDataReader = 0;
            string strInsert = string.Empty;
            string InsertRecordRet = string.Empty;
            string[] ArrTempValues;
            string StrTabName;

            try
            {
                ArrTempValues = ArrValues;
                StrTabName = TableName.Trim().ToUpper();

                applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

                // Checking day begin status and day end status.
                if (DayBeginEndStatusCheckYN != "N")
                {
                    OracleQueryModel queryModel = new()
                    {
                        TableName = StrTabName,
                        FieldNames = FldNames,
                        BranchCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper(),
                        UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper(),
                        MachineID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper(),
                        ArrValues = ArrTempValues,
                        QueryType = OracleQueryType.Insert
                    };

                    connError = await CheckDayBeginDayEndStatus(queryModel);

                    if (connError != "CONTINUE")
                        throw new Exception();
                }

                connError = "Connected";

                // Checking day begin status and day end status.
                var loopTo = (long)ArrTempValues.Length - 1;
                for (int i = 0; i <= loopTo; i++)
                {
                    strInsert = "insert into " + StrTabName.Trim() + dataLink + " (" + FldNames + ") " + " values (" + ArrTempValues[i] + ")";

                    oracleDataReader = await ProcessNonQueryAsync(strInsert);

                    if (oracleDataReader == 0)
                    {
                        // LogError("DataBaseTransactions", "InsertRecord", Information.Err().Number, InsertRecordRet + ": " + StrInsert);
                        return "Insert Failed !";
                    }
                }

                InsertRecordRet = BankingConstants.TransactionCompleted;
            }
            catch (Exception ex)
            {
                InsertRecordRet = ProcessError(ex, connError, BankingConstants.DBTrans_Insert);
            }

            return InsertRecordRet;
        }

        //public async Task<string> BulkInsert(string TableName, string FldNames, string sQueryToGetValues, string BranchCode = "", string UserCode = "",
        //    string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        //{
        //    string BulkInsertRet = string.Empty;
        //    string StrInsert, StrTabName, strfields;

        //    try
        //    {                
        //        StrTabName = TableName.Trim().ToUpper();
        //        strfields = FldNames;
        //        applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

        //        // Checking day begin status and day end status.
        //        if (DayBeginEndStatusCheckYN != "N")
        //        {
        //            OracleQueryModel queryModel = new()
        //            {
        //                TableName = StrTabName,
        //                FieldNames = FldNames,
        //                BranchCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper(),
        //                UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper(),
        //                MachineID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper(),
        //                QueryType = OracleQueryType.Insert
        //            };

        //            connError = await CheckDayBeginDayEndStatus(queryModel);

        //            if (connError != "CONTINUE")
        //                throw new Exception();
        //        }

        //        // Checking day begin status and day end status.
        //        // StrInsert = "insert into " & Trim(StrTabName) & DataLink & " (" & strfields & ") " & " values (" & ArrTempValues(ICount) & ")"
        //        if (strfields.Trim() == "*")
        //            StrInsert = "insert into " + StrTabName.Trim() + dataLink + " " + sQueryToGetValues;
        //        else
        //            StrInsert = "insert into " + StrTabName.Trim() + dataLink + " (" + strfields + ") " + " " + sQueryToGetValues;

        //        await ProcessQuery(StrInsert);

        //        BulkInsertRet = BankingConstants.TransactionCompleted;
        //    }
        //    catch (Exception ex)
        //    {
        //        BulkInsertRet = ProcessError(ex, connError, BankingConstants.DBTrans_BulkInsert);
        //    }

        //    return BulkInsertRet;
        //}

        public async Task<string> UpdateRecord(string TableName, string FldNames, string[] Arrvalues, string WhereCondition = "", string BranchCode = "",
            string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        {
            string UpdateRecordRet = string.Empty;

            string[] ArrTempValues;
            string[] ArrRowValue;
            string[] arrflds;
            string strquery;
            var Strupdate = default(string);
            string StrInsert;
            int ColCnt;
            int RowCnt;

            var strUpdateRow = default(string);
            string[] StrCondition;
            string StrTabName;
            string strfields;
            try
            {
                connError = "";

                ArrTempValues = Arrvalues;
                StrTabName = TableName.Trim().ToUpper();
                strfields = FldNames;

                applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

                // Spliting the conditions For Different Rows
                if (DayBeginEndStatusCheckYN != "N")
                {
                    OracleQueryModel queryModel = new()
                    {
                        TableName = StrTabName,
                        FieldNames = FldNames,
                        BranchCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper(),
                        UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper(),
                        MachineID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper(),
                        ArrValues = ArrTempValues,
                        Condition = WhereCondition,
                        QueryType = OracleQueryType.Update
                    };

                    // Check for day begin and day end status is required
                    connError = await CheckDayBeginDayEndStatus(queryModel);

                    if (connError != "CONTINUE")
                        throw new Exception();
                }

                connError = "Connected";

                StrCondition = WhereCondition.Split("|");

                // Roll back segment for large transactions
                // If Right(StrTabName, 3) = "LOG" Then
                //     AdoConnObj.Execute ("SET TRANSACTION USE ROLLBACK SEGMENT RBS7")
                // End If

                if (string.IsNullOrEmpty(WhereCondition.Trim()))
                {
                    StrCondition[0] = "";
                }

                // Checking if the record is to be send to the respective history table.
                bool BlnHistStatus = false;
                string strHistExt = "";

                DataTable rsHistCol;
                DataTable rsHistExt;

                rsHistCol = await ProcessQueryAsync("Select * from GENHISTNOTREQUIREDCOLNAME");
                rsHistExt = await ProcessQueryAsync("Select * from GENHISTNOTREQUIREDTABEXTNS");

                arrflds = strfields.Split(",");

                if (rsHistExt.Rows.Count>0)
                {
                    // Load the OracleDataReader into a DataTable
                    //DataTable histExtTable = new DataTable();
                    //histExtTable.Load(rsHistExt);

                    foreach (DataRow row in rsHistExt.Rows)
                    {
                        string tabExtName = row["TABEXTENSIONNAME"].ToString().Trim().ToUpperInvariant() ?? string.Empty;
                        string tabBkPExtName = row["TABBKPEXTENSIONNAME"].ToString().Trim() ?? string.Empty;

                        if (!string.IsNullOrEmpty(tabExtName) &&
                            StrTabName.Length >= tabExtName.Length &&
                            StrTabName.Substring(StrTabName.Length - tabExtName.Length).ToUpperInvariant() == tabExtName)
                        {
                            strHistExt = tabBkPExtName;
                            BlnHistStatus = true;
                            break; // exit loop once match is found
                        }
                    }
                }

                if (rsHistCol.Rows.Count>0)
                {
                    //DataTable histTable = new DataTable();
                    //histTable.Load(rsHistCol);

                    if (BlnHistStatus && arrflds.Length <= rsHistCol.Rows.Count)
                    {
                        for (int i = 0; i < arrflds.Length; i++)
                        {
                            BlnHistStatus = false;

                            foreach (DataRow row in rsHistCol.Rows)
                            {
                                if (row[0].ToString().Trim().Equals(arrflds[i].Trim(), StringComparison.OrdinalIgnoreCase))
                                {
                                    BlnHistStatus = true;
                                    break;
                                }
                            }

                            if (!BlnHistStatus)
                                break;
                        }
                    }
                    else
                    {
                        BlnHistStatus = false;
                    }
                }

                rsHistCol = null!;
                rsHistExt = null!;

                var loopTo3 = ArrTempValues.Length - 1;
                for (RowCnt = 0; RowCnt <= loopTo3; RowCnt++)
                {
                    // First passing the data into history tables based on the type of tables.
                    StrInsert = "";
                    if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
                    {
                        if ((StrCondition.Length - 1) == (ArrTempValues.Length - 1) && !string.IsNullOrEmpty(WhereCondition.Trim()))
                        {
                            StrInsert = "Insert into " + StrTabName.Trim() + strHistExt + dataLink + " select * from " + StrTabName + "" + dataLink + " Where " + StrCondition[RowCnt];
                        }
                        else
                        {
                            StrInsert = "Insert into " + StrTabName.Trim() + strHistExt + dataLink + " select * from " + StrTabName + "" + dataLink + "";
                        }
                    }

                    if (!string.IsNullOrEmpty(StrInsert.Trim()))
                        await ProcessQueryAsync(StrInsert);

                    // Spliting the Collumn Names (Fields) to build the Update Statement
                    arrflds = strfields.Split(",");

                    // ****** Spliting the Collumn Values (Fields Values) to build the Update Statement
                    ArrRowValue = ArrTempValues[RowCnt].Split("~");

                    /// *******  first concantinating the values for update ***********
                    var loopTo4 = arrflds.Length - 1;
                    for (ColCnt = 0; ColCnt <= loopTo4; ColCnt++)
                        strUpdateRow = strUpdateRow + arrflds[ColCnt] + "=" + ArrRowValue[ColCnt] + ",";

                    // Now building the The Update statement
                    if ((StrCondition.Length - 1) == (ArrTempValues.Length - 1) && !string.IsNullOrEmpty(WhereCondition.Trim()))
                    {
                        Strupdate = "update " + StrTabName + "" + dataLink + " set " + strUpdateRow?.Substring(0, strUpdateRow.Length - 1) + " where " + StrCondition[RowCnt];
                        strquery = "select " + strfields + " from " + StrTabName.Trim() + dataLink + " where " + StrCondition[RowCnt] + " for update";
                    }
                    else
                    {
                        strquery = "select " + strfields + " from " + StrTabName.Trim() + dataLink + " for update";
                        Strupdate = "update " + StrTabName + "" + dataLink + " set " + strUpdateRow?.Substring(0, strUpdateRow.Length - 1);
                    }

                    // Executing the update statement Based On Number of Rows

                    await ProcessQueryAsync(strquery);

                    var result = await ProcessNonQueryAsync(Strupdate);

                    Strupdate = "";
                    strUpdateRow = "";

                    if (result== 0)
                    {
                        UpdateRecordRet = "Update Failed due to False Condition ! " + StrTabName;

                        //if (blnLogErrors == true)
                        //    LogError("DataBaseTransactions", "UpdateRecord", "0", UpdateRecordRet + ": " + Strupdate);

                        
                        rsHistCol = null!;

                        
                        rsHistExt = null!;

                        return UpdateRecordRet;
                    }
                }

                UpdateRecordRet = BankingConstants.TransactionCompleted;

              
                rsHistCol = null!;

               
                rsHistExt = null!;
            }
            catch (Exception ex)
            {
                UpdateRecordRet = ProcessError(ex, connError, BankingConstants.DBTrans_Update);
            }

            return UpdateRecordRet;
        }

        public async Task<string> DeleteRecord(string TableName,string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        {
            string DeleteRecordRet = string.Empty;
            string StrDelete;
            string StrTabName;
            string[] StrCondition;
            string StrInsert;

            try
            {
                connError = "";
                StrDelete = "";
                StrTabName = "";
                StrTabName = TableName.Trim().ToUpper();

                applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

                // Checking day begin status and day end status.
                if (DayBeginEndStatusCheckYN != "N")
                {
                    OracleQueryModel queryModel = new()
                    {
                        TableName = StrTabName,
                        BranchCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper(),
                        UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper(),
                        MachineID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper(),
                        Condition = WhereCondition,
                        QueryType = OracleQueryType.Delete
                    };

                    connError = await CheckDayBeginDayEndStatus(queryModel);

                    if (connError != "CONTINUE")
                        throw new Exception();
                }

                // First passing the data into History tables before deleting the data from original tables
                bool BlnHistStatus = false;
                string strHistExt = "";

                DataTable rsHistExt;

                rsHistExt = await ProcessQueryAsync("Select * from GENHISTNOTREQUIREDTABEXTNS");
                foreach (DataRow row in rsHistExt.Rows)
                

                //while (rsHistExt.Rows.Count > 0)
                {
                    // Get the trimmed and uppercased TABEXTENSIONNAME from the reader
                    string TABEXTENSIONNAME = Convert.ToString(row["TABEXTENSIONNAME"]) ?? string.Empty;
                    string tabExtName = TABEXTENSIONNAME.Trim().ToUpper();

                    // Get the rightmost part of StrTabName that matches the length of TABEXTENSIONNAME
                    string strTabNameRight = StrTabName.Length >= tabExtName.Length
                        ? StrTabName.Substring(StrTabName.Length - tabExtName.Length)
                        : StrTabName;

                    if (strTabNameRight.ToUpper() == tabExtName)
                    {
                        string TABBKPEXTENSIONNAME = Convert.ToString(row["TABBKPEXTENSIONNAME"]) ?? string.Empty;

                        strHistExt = TABBKPEXTENSIONNAME;
                        BlnHistStatus = false;
                        break; // Exit the loop when a match is found
                    }
                }

                StrInsert = "";

                if (!string.IsNullOrEmpty(WhereCondition.Trim()))
                {
                    StrCondition = WhereCondition.Split("|");
                    var loopTo1 = StrCondition.Length - 1;
                    for (int i = 0; i <= loopTo1; i++)
                    {
                        if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
                        {
                            // First passing the data into history tables based on the type of tables.
                            StrInsert = "Insert into " + StrTabName.Trim() + strHistExt + dataLink + " select * from " +
                                StrTabName.Trim() + "" + dataLink + " Where " + StrCondition[i];
                        }
                        else
                        {
                            StrInsert = "";
                        }

                        StrDelete = "Delete from  " + StrTabName.Trim() + dataLink + " where " + StrCondition[i];

                        if (!string.IsNullOrEmpty(StrInsert))
                            await ProcessNonQueryAsync(StrInsert);

                        var result = await ProcessNonQueryAsync(StrDelete);

                        if (result == 0)
                        {
                            DeleteRecordRet = "Delete Failed due to False Condition !";
                            //if (blnLogErrors == true)
                            //    LogError("DataBaseTransactions", "DeleteRecord", Information.Err().Number, DeleteRecordRet + ": " + StrDelete);
                           
                            rsHistExt = null!;
                            return DeleteRecordRet;
                        }
                    }
                }
                else
                {
                    if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
                    {
                        StrInsert = "Insert into " + StrTabName.Trim() + strHistExt + dataLink + " select * from " + StrTabName.Trim() + "" + dataLink + "";
                    }
                    else
                    {
                        StrInsert = "";
                    }

                    StrDelete = "Delete from  " + StrTabName.Trim() + dataLink + "";

                    if (!string.IsNullOrEmpty(StrInsert))
                        await ProcessNonQueryAsync(StrInsert);

                    var result = await ProcessNonQueryAsync(StrDelete);

                    if (result == 0)
                    {
                        DeleteRecordRet = "Delete Failed due to False Condition !";
                        //if (blnLogErrors == true)
                        //    LogError("DataBaseTransactions", "DeleteRecord", Information.Err().Number, DeleteRecordRet + ": " + StrDelete);
                        
                        rsHistExt = null!;
                        return DeleteRecordRet;
                    }
                }

                DeleteRecordRet = BankingConstants.TransactionCompleted;

                
                rsHistExt = null!;
            }
            catch (Exception ex)
            {
                DeleteRecordRet = ProcessError(ex, connError, BankingConstants.DBTrans_Delete);
            }

            return DeleteRecordRet;
        }

        //public async Task<string> DeleteRecordOnly(string TableName, string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
        //    string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        //{
        //    string DeleteRecordOnlyRet = string.Empty;
        //    string StrDelete;
        //    string StrTabName;
        //    string[] StrCondition;

        //    try
        //    {
        //        connError = "";

        //        StrDelete = "";
        //        StrTabName = "";
        //        StrTabName = TableName.Trim().ToUpper();

        //        applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

        //        // Checking day begin status and day end status.
        //        if (DayBeginEndStatusCheckYN != "N")
        //        {
        //            OracleQueryModel queryModel = new()
        //            {
        //                TableName = StrTabName,
        //                BranchCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper(),
        //                UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper(),
        //                MachineID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper(),
        //                Condition = WhereCondition,
        //                QueryType = OracleQueryType.Delete
        //            };

        //            connError = await CheckDayBeginDayEndStatus(queryModel);

        //            if (connError != "CONTINUE")
        //                throw new Exception();
        //        }

        //        // First passing the data into History tables before deleting the data from original tables
        //        if (!string.IsNullOrEmpty(WhereCondition.Trim()))
        //        {
        //            StrCondition = WhereCondition.Split("|");
        //            var loopTo = StrCondition.Length - 1;
        //            for (int i = 0; i <= loopTo; i++)
        //            {
        //                StrDelete = "Delete from  " + StrTabName.Trim() + dataLink + " where " + StrCondition[i];
        //                var result = await ProcessQuery(StrDelete);
        //                if (result.RecordsAffected == 0)
        //                {
        //                    DeleteRecordOnlyRet = "Delete Failed due to False Condition !";
        //                    //if (blnLogErrors == true)
        //                    //    LogError("DataBaseTransactions", "DeleteRecordOnly", Information.Err().Number, DeleteRecordOnlyRet + ": " + StrDelete);
        //                    return DeleteRecordOnlyRet;
        //                }
        //            }
        //        }
        //        else
        //        {
        //            StrDelete = "Delete from  " + StrTabName.Trim() + dataLink + "";
        //            var result = await ProcessQuery(StrDelete);
        //            if (result.RecordsAffected == 0)
        //            {
        //                DeleteRecordOnlyRet = "Delete Failed due to False Condition !";
        //                //if (blnLogErrors == true)
        //                //    LogError("DataBaseTransactions", "DeleteRecordOnly", Information.Err().Number, DeleteRecordOnlyRet + ": " + StrDelete);
        //                return DeleteRecordOnlyRet;
        //            }
        //        }

        //        DeleteRecordOnlyRet = BankingConstants.TransactionCompleted;
        //    }
        //    catch(Exception ex)
        //    {
        //        DeleteRecordOnlyRet = ProcessError(ex, connError, BankingConstants.DBTrans_DeleteRecOnly);
        //    }

        //    return DeleteRecordOnlyRet;
        //}

        //public async Task<string> DeleteRecordGen(string TableName, string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
        //    string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        //{
        //    string DeleteRecordGenRet = string.Empty;
        //    string StrDelete;
        //    string StrTabName;
        //    string[] StrCondition;
        //    string StrInsert;
        //    string StrInserttrns;

        //    try
        //    {
        //        connError = "";

        //        StrDelete = "";
        //        StrTabName = "";
        //        StrTabName = TableName.Trim().ToUpper();

        //        applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

        //        // Checking day begin status and day end status.
        //        if (DayBeginEndStatusCheckYN != "N")
        //        {
        //            OracleQueryModel queryModel = new()
        //            {
        //                TableName = StrTabName,
        //                BranchCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper(),
        //                UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper(),
        //                MachineID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper(),
        //                Condition = WhereCondition,
        //                QueryType = OracleQueryType.Delete
        //            };

        //            connError = await CheckDayBeginDayEndStatus(queryModel);

        //            if (connError != "CONTINUE")
        //                throw new Exception();
        //        }

        //        // First passing the data into History tables before deleting the data from original tables
        //        bool BlnHistStatus = false;

        //        OracleDataReader rsHistExt;

        //        rsHistExt = await ProcessQuery("Select * from GENHISTNOTREQUIREDTABEXTNS");

        //        string strHistExt = "";

        //        while (rsHistExt.Read())
        //        {
        //            string tabExtName = rsHistExt.GetString(rsHistExt.GetOrdinal("TABEXTENSIONNAME")).Trim().ToUpper();

        //            // Get the rightmost part of StrTabName that matches the length of TABEXTENSIONNAME
        //            string strTabNameRight = StrTabName.Length >= tabExtName.Length
        //                ? StrTabName.Substring(StrTabName.Length - tabExtName.Length)
        //                : StrTabName;

        //            if (strTabNameRight.ToUpper() == tabExtName)
        //            {
        //                strHistExt = rsHistExt.GetString(rsHistExt.GetOrdinal("TABBKPEXTENSIONNAME"));
        //                BlnHistStatus = false;
        //                break;
        //            }
        //        }

        //        StrInsert = "";

        //        if (!string.IsNullOrEmpty(WhereCondition.Trim()))
        //        {
        //            StrCondition = WhereCondition.Split("|");

        //            var loopTo1 = StrCondition.Length - 1;
        //            for (int i = 0; i <= loopTo1; i++)
        //            {
        //                if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
        //                {
        //                    // First passing the data into history tables based on the type of tables.
        //                    StrInsert = "Insert into " + StrTabName.Trim() + strHistExt + dataLink + " select * from " + 
        //                        StrTabName.Trim() + "" + dataLink + " Where " + StrCondition[i];
        //                }
        //                else
        //                {
        //                    StrInsert = "";
        //                }

        //                if (StrTabName.ToUpper() == "GENTRANSLOG")
        //                {
        //                    StrInserttrns = "";
        //                    StrInserttrns = "INSERT INTO GENDELETEDTRANSLOG(BRANCHCODE, CURRENCYCODE, MODULEID, GLCODE, ACCNO, " + 
        //                        " BATCHNO, TRANNO, AMOUNT,MODEOFTRAN, ENTEREDTIMEBAL, VERIFIEDTIMEBAL, APPROVEDTIMEBAL, DAYENDBAL," + 
        //                        " EFFECTIVEDATE, CUSTOMERID, NAME, CHQNO,CHQSERIESNO, CHQFVG, CHQDATE, TOKENNO, CASHPAIDYN, " + 
        //                        " CASHIERID, SYSTEMGENERATEDYN, RATE, FCURRENCYCODE, FAMOUNT,LINKMODULEID, LINKGLCODE, " + 
        //                        " LINKACCNO, LINKACCTYPE, REMARKS, SERVICEID, CLGRATETYPE, RESPONDINGBRANCHCODE," + 
        //                        " RESPONDINGSECTIONCODE, EXCEPTIONYN, RESPONDINGBANKCODE, RATEREFCODE, " + 
        //                        " APPROVEDSYSTEMDATE, VERIFIEDSYSTEMDATE,APPROVEDDATE, APPLICATIONDATE, USERID, MACHINEID, " + 
        //                        " TRANSTATUS, SYSTEMDATE, VERIFIEDBY, VERIFIEDMACHINE,APPROVEDBY, APPROVEDMACHINE,SYSTEMYEAR, " + 
        //                        " ABBBRANCHCODE, ABBAPPLICATIONDATE, ABBYN, DELETEDUSERID, DELETEDMACHINEID,DELETEDTRANSTATUS) " + 
        //                        " SELECT BRANCHCODE, CURRENCYCODE, MODULEID, GLCODE, ACCNO, BATCHNO, TRANNO, AMOUNT, MODEOFTRAN," + 
        //                        " ENTEREDTIMEBAL,VERIFIEDTIMEBAL, APPROVEDTIMEBAL, DAYENDBAL, EFFECTIVEDATE, CUSTOMERID, NAME, " + 
        //                        " CHQNO, CHQSERIESNO, CHQFVG,CHQDATE, TOKENNO, CASHPAIDYN, CASHIERID, SYSTEMGENERATEDYN, RATE, " + 
        //                        " FCURRENCYCODE, FAMOUNT, LINKMODULEID,LINKGLCODE, LINKACCNO, LINKACCTYPE, REMARKS, SERVICEID," + 
        //                        " CLGRATETYPE, RESPONDINGBRANCHCODE, RESPONDINGSECTIONCODE,EXCEPTIONYN, RESPONDINGBANKCODE," + 
        //                        " RATEREFCODE, APPROVEDSYSTEMDATE, VERIFIEDSYSTEMDATE, APPROVEDDATE,APPLICATIONDATE, USERID," + 
        //                        " MACHINEID, TRANSTATUS, SYSTEMDATE, VERIFIEDBY, VERIFIEDMACHINE, APPROVEDBY,APPROVEDMACHINE, " + 
        //                        " SYSTEMYEAR, ABBBRANCHCODE, ABBAPPLICATIONDATE, ABBYN,'" + UserCode + "','" + MachineID + "','P' " + " FROM GENTRANSLOG Where" + StrCondition[i];

        //                    if (!string.IsNullOrEmpty(StrInserttrns))
        //                        await ProcessQuery(StrInserttrns);
        //                }

        //                StrDelete = "Delete from  " + StrTabName.Trim() + dataLink + " where " + StrCondition[i];

        //                if (!string.IsNullOrEmpty(StrInsert))
        //                    await ProcessQuery(StrInsert);

        //                var result = await ProcessQuery(StrDelete);

        //                if (result.RecordsAffected == 0)
        //                {
        //                    DeleteRecordGenRet = "Delete Failed due to False Condition !";
        //                    //if (blnLogErrors == true)
        //                    //    LogError("DataBaseTransactions", "DeleteRecordGen", Information.Err().Number, DeleteRecordGenRet + ": " + StrDelete);

        //                    if (!rsHistExt.IsClosed)
        //                        rsHistExt.Close();
        //                    rsHistExt = null!;

        //                    return DeleteRecordGenRet;
        //                }
        //            }
        //        }
        //        else
        //        {
        //            if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
        //            {
        //                StrInsert = "Insert into " + StrTabName.Trim() + strHistExt + dataLink + " select * from " + StrTabName.Trim() + "" + dataLink + "";
        //            }
        //            else
        //            {
        //                StrInsert = "";
        //            }

        //            StrDelete = "Delete from  " + StrTabName.Trim() + dataLink + "";

        //            if (!string.IsNullOrEmpty(StrInsert))
        //                await ProcessQuery(StrInsert);

        //            var result = await ProcessQuery(StrDelete);

        //            if (result.RecordsAffected == 0)
        //            {
        //                DeleteRecordGenRet = "Delete Failed due to False Condition !";
        //                //if (blnLogErrors == true)
        //                //    LogError("DataBaseTransactions", "DeleteRecordGen", Information.Err().Number, DeleteRecordGenRet + ": " + StrDelete);

        //                if (!rsHistExt.IsClosed)
        //                    rsHistExt.Close();
        //                rsHistExt = null!;

        //                return DeleteRecordGenRet;
        //            }
        //        }

        //        DeleteRecordGenRet = BankingConstants.TransactionCompleted;

        //        if (!rsHistExt.IsClosed)
        //            rsHistExt.Close();
        //        rsHistExt = null!;
        //    }
        //    catch(Exception ex)
        //    {
        //        DeleteRecordGenRet = ProcessError(ex, connError, BankingConstants.DBTrans_DeleteRecGen);
        //    }

        //    return DeleteRecordGenRet;
        //}

        //public async Task<string> RejectRecord(string TableName, string WhereCondition = "", string BranchCode = "", string UserCode = "", string MachineID = "",
        //    string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        //{
        //    string[] StrCondition;
        //    string StrTabName, strHistTab;
        //    string RejectRecordRet = string.Empty;
        //    string StrInsert = string.Empty;
        //    string StrDeleteMst = string.Empty;
        //    string StrDeleteHist = string.Empty;

        //    try
        //    {
        //        connError = "";

        //        StrTabName = TableName.Trim().ToUpper();
        //        strHistTab = TableName.Trim().ToUpper() + "HIST";

        //        applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

        //        // Checking day begin status and day end status.
        //        if (DayBeginEndStatusCheckYN != "N")
        //        {
        //            OracleQueryModel queryModel = new()
        //            {
        //                TableName = StrTabName,
        //                BranchCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper(),
        //                UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper(),
        //                MachineID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper(),
        //                Condition = WhereCondition,
        //                QueryType = OracleQueryType.Insert
        //            };

        //            connError = await CheckDayBeginDayEndStatus(queryModel);

        //            if (connError != "CONTINUE")
        //                throw new Exception();
        //        }

        //        connError = "Connected";

        //        // Spliting the conditions For Different Rows
        //        if (!string.IsNullOrEmpty(WhereCondition.Trim()))
        //        {
        //            StrCondition = WhereCondition.Split("|");

        //            var loopTo = StrCondition.Length - 1;
        //            for (int i = 0; i <= loopTo; i++)
        //            {
        //                StrDeleteMst = "Delete from  " + StrTabName.Trim() + dataLink + " where " + StrCondition[i];

        //                StrInsert = "Insert into " + StrTabName.Trim() + dataLink + " select * from " + StrTabName.Trim() + "Hist" + dataLink + " Where " + 
        //                    StrCondition[i] + " and to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss') in " + 
        //                    " (select max(to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss')) from " + StrTabName.Trim() + "Hist" + 
        //                    dataLink + " Where " + StrCondition[i] + ") and " + " to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy') in " + 
        //                    " (select max(to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy')) from " + StrTabName.Trim() + "Hist" + dataLink + " Where " + 
        //                    StrCondition[i] + ")";

        //                StrDeleteHist = "Delete from " + StrTabName.Trim() + "Hist" + dataLink + " Where " + StrCondition[i] + " " +
        //                    "and to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss') in " + 
        //                    " (select max(to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss')) from " + StrTabName.Trim() + "Hist" + dataLink + 
        //                    " Where " + StrCondition[i] + ") and " + " to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy') in " + 
        //                    " (select max(to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy')) from " + StrTabName.Trim() + "Hist" + dataLink + " Where " + 
        //                    StrCondition[i] + ")";

        //                var result = await ProcessQuery(StrDeleteMst);

        //                if (result.RecordsAffected > 1)
        //                {
        //                    RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
        //                    //if (blnLogErrors == true)
        //                    //    LogError("DataBaseTransactions", "RejectRecord", 999, RejectRecordRet + ": " + StrDeleteMst);
        //                    return RejectRecordRet;
        //                }

        //                var result1 = await ProcessQuery(StrInsert);

        //                if (result1.RecordsAffected < 1)
        //                {
        //                    RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
        //                    //if (blnLogErrors == true)
        //                    //    LogError("DataBaseTransactions", "RejectRecord", 999, RejectRecordRet + ": " + StrInsert);
        //                    return RejectRecordRet;
        //                }

        //                var result2 = await ProcessQuery(StrDeleteHist);

        //                if (result2.RecordsAffected > 1)
        //                {
        //                    RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
        //                    //if (blnLogErrors == true)
        //                    //    LogError("DataBaseTransactions", "RejectRecord", 999, Operators.ConcatenateObject(RejectRecordRet + ": ", StrDeleteHist));
        //                    return RejectRecordRet;
        //                }
        //            }
        //        }
        //        else
        //        {
        //            StrDeleteMst = "Delete from  " + StrTabName.Trim() + dataLink;

        //            StrInsert = "Insert into " + StrTabName.Trim() + dataLink + " select * from " + StrTabName.Trim() + "Hist" + dataLink + 
        //                " Where to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss') in " + " " +
        //                "(select max(to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss')) from " + StrTabName.Trim() + "Hist" + 
        //                dataLink + ") and " + " to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy') in " + 
        //                " (select max(to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy')) from " + StrTabName.Trim() + "Hist" + dataLink + ")";

        //            StrDeleteHist = " Delete from " + StrTabName.Trim() + "Hist" + dataLink + 
        //                " Where to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss') in " + 
        //                " (select max(to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss')) from " + StrTabName.Trim() + "Hist" + 
        //                dataLink + ") and " + " to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy') in " + 
        //                " (select max(to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy')) from " + StrTabName.Trim() + "Hist" + dataLink + ")";

        //            var result = await ProcessQuery(StrDeleteMst);

        //            if (result.RecordsAffected > 1)
        //            {
        //                RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
        //                //if (blnLogErrors == true)
        //                //    LogError("DataBaseTransactions", "RejectRecord", 999, RejectRecordRet + "" + StrDeleteMst);
        //                return RejectRecordRet;
        //            }

        //            var result1 = await ProcessQuery(StrInsert);
        //            if (result1.RecordsAffected < 1)
        //            {
        //                RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
        //                //if (blnLogErrors == true)
        //                //    LogError("DataBaseTransactions", "RejectRecord", 999, RejectRecordRet + "" + StrInsert);
        //                return RejectRecordRet;
        //            }

        //            var result2 = await ProcessQuery(StrDeleteHist);
        //            if (result2.RecordsAffected > 1)
        //            {
        //                RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
        //                //if (blnLogErrors == true)
        //                //    LogError("DataBaseTransactions", "RejectRecord", 999, Operators.ConcatenateObject(RejectRecordRet + "", StrDeleteHist));
        //                return RejectRecordRet;
        //            }
        //        }

        //        RejectRecordRet = BankingConstants.TransactionCompleted;
        //    }
        //    catch(Exception ex)
        //    {
        //        RejectRecordRet = ProcessError(ex, connError, BankingConstants.DBTrans_Reject);
        //    }

        //    return RejectRecordRet;
        //}

        //public async Task<string> InsertUsingSelect(string TableName, string FldNames, string[] ArrValues, string WhereCondition = "", string BranchCode = "",
        //    string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        //{
        //    string Strupdate;
        //    string[] StrCondition;
        //    string InsertUsingSelectRet = string.Empty;

        //    try
        //    {
        //        connError = "";

        //        // ****** Spliting the conditions For Different Rows
        //        StrCondition = WhereCondition.Split("|");

        //        if (string.IsNullOrEmpty(WhereCondition.Trim()))
        //        {
        //            StrCondition[0] = "";
        //        }

        //        var loopTo = ArrValues.Length - 1;
        //        for (int RowCnt = 0; RowCnt <= loopTo; RowCnt++)
        //        {
        //            Strupdate = "Insert into " + TableName.Trim().ToUpper() + dataLink + "(" + FldNames + ") " + ArrValues[RowCnt] + " Where " + WhereCondition;

        //            var result = await ProcessQuery(Strupdate);

        //            Strupdate = "";

        //            if (result.RecordsAffected == 0)
        //            {
        //                InsertUsingSelectRet = "Inwertion Failed due to False Condition ! " + TableName;

        //                //if (blnLogErrors == true)
        //                //    LogError("DataBaseTransactions", "InsertUsingSelect", 999, InsertUsingSelectRet + ": " + Strupdate);

        //                return InsertUsingSelectRet;
        //            }
        //        }

        //        InsertUsingSelectRet = BankingConstants.TransactionCompleted;
        //    }
        //    catch(Exception ex)
        //    {
        //        InsertUsingSelectRet = ProcessError(ex, connError, BankingConstants.DBTrans_InsertUsingSelect);
        //    }

        //    return InsertUsingSelectRet;
        //}

        //public async Task<string> InsertUsingSelectHist(string TableName, string FldNames, string[] ArrValues, string WhereCondition = "", string BranchCode = "",
        //    string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
        //{
        //    OracleDataReader rsHistCol;
        //    OracleDataReader rsHistExt;

        //    string InsertUsingSelectHistRet = string.Empty;
        //    string[] arrflds, StrCondition;

        //    try
        //    {
        //        connError = "";
        //        TableName = TableName.Trim().ToUpper();

        //        string BRCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper();
        //        string UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper();
        //        string MachID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper();
        //        applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

        //        // ****** Spliting the conditions For Different Rows
        //        StrCondition = WhereCondition.Split("|");

        //        if (string.IsNullOrEmpty(WhereCondition.Trim()))
        //        {
        //            StrCondition[0] = "";
        //        }

        //        // Checking if the record is to be send to the respective history table.

        //        bool BlnHistStatus = false;
        //        string strHistExt = "";

        //        rsHistCol = await ProcessQuery("Select * from GENHISTNOTREQUIREDCOLNAME");
        //        rsHistExt = await ProcessQuery("Select * from GENHISTNOTREQUIREDTABEXTNS");

        //        arrflds = FldNames.Split(",");

        //        if (rsHistExt.HasRows)
        //        {
        //            // Load OracleDataReader into a DataTable
        //            DataTable histExtTable = new DataTable();
        //            histExtTable.Load(rsHistExt);

        //            foreach (DataRow row in histExtTable.Rows)
        //            {
        //                string tabExtName = row["TABEXTENSIONNAME"].ToString().Trim().ToUpperInvariant() ?? string.Empty;
        //                string tabBkPExtName = row["TABBKPEXTENSIONNAME"].ToString().Trim() ?? string.Empty;

        //                if (!string.IsNullOrEmpty(tabExtName) &&
        //                    TableName.Length >= tabExtName.Length &&
        //                    TableName.Substring(TableName.Length - tabExtName.Length).ToUpperInvariant() == tabExtName)
        //                {
        //                    strHistExt = tabBkPExtName;
        //                    BlnHistStatus = true;
        //                    break; // exit loop once match is found
        //                }
        //            }
        //        }

        //        if (rsHistCol.HasRows)
        //        {
        //            // Load the OracleDataReader into a DataTable
        //            DataTable histColTable = new DataTable();
        //            histColTable.Load(rsHistCol);

        //            if (BlnHistStatus && arrflds.Length <= histColTable.Rows.Count)
        //            {
        //                foreach (string field in arrflds)
        //                {
        //                    bool found = false;

        //                    foreach (DataRow row in histColTable.Rows)
        //                    {
        //                        string colValue = row[0].ToString().Trim().ToUpperInvariant() ?? string.Empty;
        //                        if (!string.IsNullOrEmpty(colValue) &&
        //                            colValue == field.Trim().ToUpperInvariant())
        //                        {
        //                            found = true;
        //                            break; // field found, stop scanning rows
        //                        }
        //                    }

        //                    if (!found)
        //                    {
        //                        BlnHistStatus = false;
        //                        break; // one field not found, stop scanning arrflds
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                BlnHistStatus = false;
        //            }
        //        }

        //        rsHistCol = null!;
        //        rsHistExt = null!;

        //        var loopTo3 = ArrValues.Length - 1;
        //        for (int RowCnt = 0; RowCnt <= loopTo3; RowCnt++)
        //        {
        //            string Strupdate = string.Empty, StrInsert = string.Empty;

        //            // First passing the data into history tables based on the type of tables.
        //            if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
        //            {
        //                if ((StrCondition.Length - 1) == (ArrValues.Length - 1) & !string.IsNullOrEmpty(WhereCondition.Trim()))
        //                {
        //                    StrInsert = "Insert into " + TableName.Trim() + strHistExt + dataLink + " select * from " + TableName + "" + dataLink + " Where " + StrCondition[RowCnt];
        //                }
        //                else
        //                {
        //                    StrInsert = "Insert into " + TableName.Trim() + strHistExt + dataLink + " select * from " + TableName + "" + dataLink + "";
        //                }
        //            }

        //            if (!string.IsNullOrEmpty(StrInsert.Trim()))
        //                await ProcessQuery(StrInsert);

        //            // insert using select statement
        //            Strupdate = "Insert into " + TableName.Trim() + dataLink + "(" + FldNames + ") " + ArrValues[RowCnt] + " Where " + WhereCondition;

        //            var result = await ProcessQuery(Strupdate);

        //            Strupdate = "";

        //            if (result.RecordsAffected == 0)
        //            {
        //                InsertUsingSelectHistRet = "Inwertion Failed due to False Condition ! " + TableName;

        //                //if (blnLogErrors == true)
        //                //    LogError("DataBaseTransactions", "InsertUsingSelectHist", 999, InsertUsingSelectHistRet + ": " + Strupdate);

        //                if (!rsHistCol.IsClosed)
        //                    rsHistCol.Close();
        //                rsHistCol = null!;

        //                if (!rsHistExt.IsClosed)
        //                    rsHistExt.Close();
        //                rsHistExt = null!;

        //                return InsertUsingSelectHistRet;
        //            }
        //        }

        //        if (!rsHistCol.IsClosed)
        //            rsHistCol.Close();
        //        rsHistCol = null!;

        //        if (!rsHistExt.IsClosed)
        //            rsHistExt.Close();
        //        rsHistExt = null!;

        //        InsertUsingSelectHistRet = BankingConstants.TransactionCompleted;
        //    }
        //    catch(Exception ex)
        //    {
        //        InsertUsingSelectHistRet = ProcessError(ex, connError, BankingConstants.DBTrans_InsertUsingSelectHist);
        //    }

        //    return InsertUsingSelectHistRet;
        //}

        private async Task<string> CheckDayBeginDayEndStatus(OracleQueryModel oracleQueryModel)
        {
            string CheckDayBeginDayEndStatusRet = string.Empty;
            string strquery, strtempCode;
            string[]? arrflds;
            string[] arrChkVal;
            string[] ArrCond;
            bool BlnUserMach, blnbrCode;
            int intArrChk;

            try
            {
                BlnUserMach = false;
                blnbrCode = false;
                DataTable RsTemp = null!;

                // if branchcode parameter not available from the frontend then collect it from the values of the transarray.
                if (string.IsNullOrEmpty(oracleQueryModel.BranchCode) | string.IsNullOrEmpty(oracleQueryModel.UserId) | string.IsNullOrEmpty(oracleQueryModel.MachineID))
                {
                    arrflds = oracleQueryModel.FieldNames?.Split(",");

                    // Insert - if the transaction is insert
                    if (oracleQueryModel.QueryType == OracleQueryType.Insert)
                    {
                        arrChkVal = oracleQueryModel.ArrValues[0].Split(",");

                        // to trap the userid and machineid position in the values. intArrChk
                        intArrChk = (arrChkVal.Length - 1) - (arrflds.Length - 1);
                        strquery = "select * from " + oracleQueryModel.TableName + dataLink + " where 1=2";

                        RsTemp = await ProcessQueryAsync(strquery);

                        var loopTo = RsTemp.Rows.Count - 1;
                        foreach (DataRow item in RsTemp.Rows)
                        {
                            //if (item.ItemArray[0].Trim().ToUpper() == "USERID" || RsTemp.GetName(i).Trim().ToUpper() == "APPROVEDBY"
                            //    || RsTemp.GetName(i).Trim().ToUpper() == "VERIFIEDBY" || RsTemp.GetName(i).Trim().ToUpper() == "MACHINEID"
                            //    || RsTemp.GetName(i).Trim().ToUpper() == "APPROVEDMACHINE" || RsTemp.GetName(i).Trim().ToUpper() == "VERIFIEDMACHINE")
                            //{
                            //    BlnUserMach = true;
                            //}
                            //else if (RsTemp.GetName(i).Trim().ToUpper() == "BRANCHCODE")
                            //{
                            //    blnbrCode = true;
                            //}
                        }

                        //for (int i = 0; i <= loopTo; i++)
                        //{
                        //}

                        var loopTo1 = (long)arrflds.Length - 1;
                        for (int i = 0; i <= loopTo1; i++)
                        {
                            if (arrflds[i].Trim().ToUpper() == "BRANCHCODE")
                            {
                                strtempCode = arrChkVal[i].Trim().ToUpper();
                                // MsgBox BRCode
                                // MsgBox TableName
                                if (strtempCode[^1].ToString() == "'")
                                {
                                    // please do not change the below coding line it gives branch code with out single quotes
                                    oracleQueryModel.BranchCode = strtempCode.Substring(1, strtempCode.Length - 2);
                                }
                                else
                                {
                                    oracleQueryModel.BranchCode = strtempCode;
                                }
                            }
                            // MsgBox BRCode
                            // MsgBox TableName
                            else if (arrflds[i].Trim().ToUpper() == "USERID")
                            {
                                strtempCode = (arrChkVal[i - intArrChk]).Trim().ToUpper();
                                if (strtempCode[^1].ToString() == "'")
                                {
                                    // please do not change the below coding line it gives userid with out single quotes
                                    oracleQueryModel.UserId = strtempCode.Substring(2, strtempCode.Length - 2);
                                }
                            }
                            else if (arrflds[i].Trim().ToUpper() == "MACHINEID")
                            {
                                strtempCode = arrChkVal[i - intArrChk].Trim().ToUpper();
                                if (strtempCode[^1].ToString() == "'")
                                {
                                    // ''''''''''please do not change the below coding line it gives machineid with out single quotes
                                    oracleQueryModel.MachineID = strtempCode.Substring(2, strtempCode.Length - 2);
                                }
                            }
                        }
                    }

                    // if the transaction is update
                    else if (oracleQueryModel.QueryType == OracleQueryType.Update)
                    {
                        arrChkVal = oracleQueryModel.ArrValues[0].Split("~");
                        if (!string.IsNullOrEmpty(oracleQueryModel.Condition))
                        {
                            ArrCond = oracleQueryModel.Condition.Split("|");
                            strquery = "select * from " + oracleQueryModel.TableName + dataLink + " where " + ArrCond[0];
                        }
                        else
                        {
                            strquery = "select * from " + oracleQueryModel.TableName + dataLink;
                        }

                        RsTemp = await ProcessQueryAsync(strquery);

                        if (RsTemp.Rows.Count == 0)
                        {
                            CheckDayBeginDayEndStatusRet = "Records not available for Modification";
                            // LogError("DataBaseTransactions", "CheckDayBeginDayEndStatus", 999, CheckDayBeginDayEndStatusRet + ": " + strquery);
                            // ErrNum = "MODCHK";
                            RsTemp = null!;
                            return CheckDayBeginDayEndStatusRet;
                        }

                        //// please do not change the below coding lines it gives branch code with out single quotes
                        //var loopTo2 = RsTemp.FieldCount - 1;
                        //for (int i = 0; i <= loopTo2; i++)
                        //{
                        //    if (RsTemp.GetName(i).Trim().ToUpper() == "BRANCHCODE")
                        //    {
                        //        oracleQueryModel.BranchCode = RsTemp.GetString(i).Trim().ToUpper();
                        //        blnbrCode = true;
                        //    }
                        //    else if (RsTemp.GetName(i).Trim().ToUpper() == "USERID" || RsTemp.GetName(i).Trim().ToUpper() == "APPROVEDBY"
                        //        || RsTemp.GetName(i).Trim().ToUpper() == "VERIFIEDBY" || RsTemp.GetName(i).Trim().ToUpper() == "MACHINEID"
                        //        || RsTemp.GetName(i).Trim().ToUpper() == "APPROVEDMACHINE" || RsTemp.GetName(i).Trim().ToUpper() == "VERIFIEDMACHINE")
                        //    {
                        //        BlnUserMach = true;
                        //    }
                        //}

                        if (BlnUserMach == true)
                        {
                            var loopTo3 = (long)arrflds.Length - 1;
                            for (int i = 0; i <= loopTo3; i++)
                            {
                                if (arrflds[i].Trim().ToUpper() == "USERID" || arrflds[i].Trim().ToUpper() == "APPROVEDBY" || arrflds[i].Trim().ToUpper() == "VERIFIEDBY")
                                {
                                    strtempCode = arrChkVal[i].Trim().ToUpper();
                                    if (strtempCode[^1].ToString() == "'")
                                    {
                                        // please do not change the below coding lines it gives userid with out single quotes
                                        oracleQueryModel.UserId = strtempCode.Substring(1, strtempCode.Length - 2);
                                    }
                                }
                                else if (arrflds[i].Trim().ToUpper() == "MACHINEID" || arrflds[i].Trim().ToUpper() == "APPROVEDMACHINE" || arrflds[i].Trim().ToUpper() == "VERIFIEDMACHINE")
                                {
                                    strtempCode = arrChkVal[i].Trim().ToUpper();
                                    if (strtempCode[^1].ToString() == "'")
                                    {
                                        // please do not change the below coding line it gives machineid with out single quotes
                                        oracleQueryModel.MachineID = strtempCode.Substring(1, strtempCode.Length - 2);
                                    }
                                }
                            }
                        }
                    }

                    // if the transaction is delete or reject
                    else if (oracleQueryModel.QueryType == OracleQueryType.Delete || oracleQueryModel.QueryType == OracleQueryType.Reject)
                    {
                        if (!string.IsNullOrEmpty(oracleQueryModel.Condition))
                        {
                            ArrCond = oracleQueryModel.Condition.Split("|");
                            strquery = "select * from " + oracleQueryModel.TableName + dataLink + " where " + ArrCond[0];
                        }
                        else
                        {
                            strquery = "select * from " + oracleQueryModel.TableName + dataLink;
                        }

                        RsTemp = await ProcessQueryAsync(strquery);

                        if (RsTemp.Rows.Count == 0)
                        {
                            CheckDayBeginDayEndStatusRet = "Records not available for Deletion or Rejection.";
                            // LogError("DataBaseTransactions", "CheckDayBeginDayEndStatus", 999, CheckDayBeginDayEndStatusRet + ": " + strquery);
                            // ErrNum = "DELREJCHK";
                            RsTemp = null!;
                            return CheckDayBeginDayEndStatusRet;
                        }

                        //var loopTo4 = RsTemp.FieldCount - 1;
                        //for (int i = 0; i <= loopTo4; i++)
                        //{
                        //    if (RsTemp.GetName(i).Trim().ToUpper() == "BRANCHCODE")
                        //    {
                        //        oracleQueryModel.BranchCode = RsTemp.GetString(i).Trim().ToUpper();
                        //        blnbrCode = true;
                        //    }
                        //}
                    }
                }

                // if branchcode is found then check for the dayend or daybegin status else assumed that branch is not implemented.
                if (blnbrCode == true)
                {
                    if (string.IsNullOrEmpty(oracleQueryModel.BranchCode))
                    {
                        // ErrNum = "BANKCHK";
                        CheckDayBeginDayEndStatusRet = "Branch Not Available";
                    }
                    else
                    {
                        strquery = "select * from GENAPPLICATIONDATEMST where upper(branchcode)='" + oracleQueryModel.BranchCode.ToUpper() + "'";

                        RsTemp = await ProcessQueryAsync(strquery);

                        if (RsTemp.Rows.Count > 0)
                        {
                            var beginStatus = RsTemp.Rows[0].ItemArray[0]; // .GetOrdinal("DAYBEGINSTATUS");
                            var endStatus = RsTemp.Rows[0].ItemArray[1];  //.GetOrdinal("DAYENDSTATUS");

                            //if (RsTemp.GetString(beginStatus) == "O" && RsTemp.GetString(endStatus) == "N")
                            //{
                            //    CheckDayBeginDayEndStatusRet = "CONTINUE";
                            //}
                            //else if (RsTemp.GetString(beginStatus) == "O" && RsTemp.GetString(endStatus) == "O")
                            //{
                            //    CheckDayBeginDayEndStatusRet = "Your Branch End Over or Day Begin Not Started. Please Check ! ";
                            //    // ErrNum = "DAYBEGCHK";
                            //}
                            //else if (RsTemp.GetString(beginStatus) != "O" && RsTemp.GetString(endStatus) == "O")
                            //{
                            //    CheckDayBeginDayEndStatusRet = " Your Branch Day End Over. Please Check !";
                            //    // ErrNum = "DAYENDCHK";
                            //}
                        }
                        else
                        {
                            // ErrNum = "BRANCHCHK";
                            CheckDayBeginDayEndStatusRet = "Operation of this Branch is not started.";
                        }
                    }
                }
                else
                {
                    CheckDayBeginDayEndStatusRet = "CONTINUE";
                }

                RsTemp = null!;
            }
            catch (Exception ex)
            {
                //if (blnLogErrors == true)
                //    LogError("DataBaseTransactions", "CheckDayBeginDayEndStatus", Information.Err().Number, Information.Err().Description);
                CheckDayBeginDayEndStatusRet = "Error Occurec No: "; // + Information.Err().Number + " " + Information.Err().Description;
            }
            return CheckDayBeginDayEndStatusRet;
        }

        private static string ProcessError(Exception ex, string connError, string transType)
        {
            string result = string.Empty;

            #region Insert Record Error Handling

            // Insert Record **************
            // LogError("DataBaseTransactions", "InsertRecord", Information.Err().Number, Information.Err().Description + StrInsert);

            if (string.IsNullOrEmpty(connError))
            {
                // Connection Failed
                // result = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
                result = result.Replace("\n", "").Replace("\r", "");
            }
            else
            {
                //if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
                //{
                //    ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
                //    errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
                //    clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " Due to " + errDesc;
                //    arrErrSplit = Strings.Split(errDesc, "(");

                //    if (Information.UBound(arrErrSplit) > 0)
                //    {
                //        errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
                //    }
                //}
                //else if (ConnError != "Connected")
                //{
                //    if (string.IsNullOrEmpty(ErrNum))
                //        ErrNum = "INSCHK";
                //    errDesc = ConnError;
                //    clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " " + ConnError;
                //}
                //else
                //{
                //    ErrNum = Information.Err().Number.ToString();`
                //    errDesc = Information.Err().Description;
                //    clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " " + Information.Err().Description;
                //}

                /// clntDesc = "Records Could Not Be Inserted Due to " & errDesc
                // ErrorProcess(ErrNum, errDesc, clntDesc, transType, BRCode, UserId, MachID);
                // *************RecordSet Not oppened************
                // InsertRecordRet = this.ArrError(0, 2);

                /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            }

            #endregion

            #region Bulk Insert Error Handling

            //Variant arrErrSplit;
            //if (string.IsNullOrEmpty(ConnError))
            //{

            //    if (blnLogErrors == true)
            //        ((dynamic)objErrlog).LogError("DataBaseTransactions", "BulkInsert", Information.Err().Number, Information.Err().Description);

            //    // *************Connection Failed************
            //    AdoConnObj = (object)null;
            //    BulkInsertRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
            //    BulkInsertRet = Strings.Replace(BulkInsertRet, "\n", "");
            //    BulkInsertRet = Strings.Replace(BulkInsertRet, "\r", "");
            //}
            //else
            //{
            //    AdoConnObj = (object)null;
            //    if (string.IsNullOrEmpty(strComponent))
            //    {
            //        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / BulkInsert";
            //    }

            //    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
            //    {

            //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
            //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
            //        clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " Due to " + errDesc;
            //        arrErrSplit = Strings.Split(errDesc, "(");

            //        if (Information.UBound(arrErrSplit) > 0)
            //        {
            //            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
            //        }
            //    }


            //    else if (ConnError != "Connected")
            //    {
            //        if (string.IsNullOrEmpty(ErrNum))
            //            ErrNum = "INSCHK";
            //        errDesc = ConnError;
            //        clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " " + ConnError;
            //    }
            //    else
            //    {
            //        ErrNum = Information.Err().Number.ToString();
            //        errDesc = Information.Err().Description;
            //        clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " " + Information.Err().Description;
            //    }
            //    /// clntDesc = "Records Could Not Be Inserted Due to " & errDesc
            //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
            //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
            //    // ''''*************RecordSet Not oppened************
            //    objError = null;
            //    BulkInsertRet = this.ArrError(0, 2);

            //    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            //}

            #endregion

            #region Insert Using Select Hist Error Handling

            //Variant arrErrSplit;

            //if (blnLogErrors == true)
            //    ((dynamic)objErrlog).LogError("DataBaseTransactions", "InsertUsingSelectHist", Information.Err().Number, Information.Err().Description + StrInsert);

            //if (RsTemp.State == 1)
            //    RsTemp.Close();
            //RsTemp = default;
            //if (AdoConnObj.State == 1)
            //    AdoConnObj.Close();
            //AdoConnObj = (object)null;


            //if (string.IsNullOrEmpty(ConnError))
            //{

            //    // *************Connection Failed************
            //    AdoConnObj = (object)null;
            //    InsertUsingSelectHistRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
            //    InsertUsingSelectHistRet = Strings.Replace(InsertUsingSelectHistRet, "\n", "");
            //    InsertUsingSelectHistRet = Strings.Replace(InsertUsingSelectHistRet, "\r", "");
            //}
            //else
            //{
            //    AdoConnObj = (object)null;
            //    if (string.IsNullOrEmpty(strComponent))
            //    {
            //        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / InsertUsingSelectHist";
            //    }

            //    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
            //    {
            //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
            //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + errDesc;
            //        arrErrSplit = Strings.Split(errDesc, "(");

            //        if (Information.UBound(arrErrSplit) > 0)
            //        {
            //            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
            //        }
            //    }



            //    else if (ConnError != "Connected")
            //    {
            //        if (string.IsNullOrEmpty(ErrNum))
            //            ErrNum = "UPDCHK";
            //        errDesc = ConnError;
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + ConnError;
            //    }
            //    else
            //    {
            //        ErrNum = Information.Err().Number.ToString();
            //        errDesc = Information.Err().Description;
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + Information.Err().Description;
            //    }
            //    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
            //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
            //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
            //    // ''''*************RecordSet Not oppened************
            //    objError = null;
            //    InsertUsingSelectHistRet = this.ArrError(0, 2);
            //    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            //}

            #endregion

            #region Insert Using Select Error Handling

            //Variant arrErrSplit;

            //if (blnLogErrors == true)
            //    ((dynamic)objErrlog).LogError("DataBaseTransactions", "InsertUsingSelect", Information.Err().Number, Information.Err().Description + StrInsert);

            //if (RsTemp.State == 1)
            //    RsTemp.Close();
            //RsTemp = default;
            //if (AdoConnObj.State == 1)
            //    AdoConnObj.Close();
            //AdoConnObj = (object)null;


            //if (string.IsNullOrEmpty(ConnError))
            //{

            //    // *************Connection Failed************
            //    AdoConnObj = (object)null;
            //    InsertUsingSelectRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
            //    InsertUsingSelectRet = Strings.Replace(InsertUsingSelectRet, "\n", "");
            //    InsertUsingSelectRet = Strings.Replace(InsertUsingSelectRet, "\r", "");
            //}
            //else
            //{
            //    AdoConnObj = (object)null;
            //    if (string.IsNullOrEmpty(strComponent))
            //    {
            //        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / InsertUsingSelect";
            //    }

            //    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
            //    {
            //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
            //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + errDesc;
            //        arrErrSplit = Strings.Split(errDesc, "(");

            //        if (Information.UBound(arrErrSplit) > 0)
            //        {
            //            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
            //        }
            //    }



            //    else if (ConnError != "Connected")
            //    {
            //        if (string.IsNullOrEmpty(ErrNum))
            //            ErrNum = "UPDCHK";
            //        errDesc = ConnError;
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + ConnError;
            //    }
            //    else
            //    {
            //        ErrNum = Information.Err().Number.ToString();
            //        errDesc = Information.Err().Description;
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + Information.Err().Description;
            //    }
            //    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
            //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
            //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
            //    // ''''*************RecordSet Not oppened************
            //    objError = null;
            //    InsertUsingSelectRet = this.ArrError(0, 2);
            //    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            //}

            #endregion

            #region Reject Record Error Handling

            //Variant arrErrSplit;
            //if (string.IsNullOrEmpty(ConnError))
            //{

            //    if (blnLogErrors == true)
            //        ((dynamic)objErrlog).LogError("DataBaseTransactions", "RejectRecord", Information.Err().Number, Operators.ConcatenateObject(Information.Err().Description + " Insert: " + StrInsert + " Insert hist: ", StrDeleteHist));

            //    // *************Connection Failed************
            //    AdoConnObj = (object)null;
            //    RejectRecordRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
            //    RejectRecordRet = Strings.Replace(RejectRecordRet, "\n", "");
            //    RejectRecordRet = Strings.Replace(RejectRecordRet, "\r", "");
            //}
            //else
            //{
            //    AdoConnObj = (object)null;
            //    if (string.IsNullOrEmpty(strComponent))
            //    {
            //        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / REJECTRECORD";
            //    }

            //    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
            //    {
            //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
            //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
            //        clntDesc = "Error ! Records Could Not Be Rejected Due to " + errDesc;
            //        arrErrSplit = Strings.Split(errDesc, "(");

            //        if (Information.UBound(arrErrSplit) > 0)
            //        {
            //            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
            //        }
            //    }



            //    else if (ConnError != "Connected")
            //    {
            //        if (string.IsNullOrEmpty(ErrNum))
            //            ErrNum = "REJCHK";
            //        errDesc = ConnError;
            //        clntDesc = ConnError;
            //    }
            //    else
            //    {
            //        ErrNum = Information.Err().Number.ToString();
            //        errDesc = Information.Err().Description;
            //        clntDesc = Conversions.ToString(Operators.ConcatenateObject(Operators.ConcatenateObject(Operators.ConcatenateObject("Error ! Records Could Not Be Rejected Due to " + Information.Err().Description + " " + StrDeleteMst + " ", StrDeleteHist), " "), StrInsert));
            //    }
            //    /// clntDesc = "Records Could Not Be Deleted Due to " & errDesc
            //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
            //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc + " : " + StrTabName, strComponent, BRCode, UserId, MachID);
            //    // ''''*************RecordSet Not oppened************
            //    objError = null;
            //    RejectRecordRet = this.ArrError(0, 2);
            //    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            //}

            #endregion

            #region Delete Record Gen Error Handling

            //Variant arrErrSplit;
            //if (string.IsNullOrEmpty(ConnError))
            //{

            //    if (blnLogErrors == true)
            //        ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecordGen", Information.Err().Number, Information.Err().Description + StrDelete);
            //    // *************Connection Failed************
            //    if (rsHistExt.State == 1)
            //        rsHistExt.Close();
            //    rsHistExt = (object)null;
            //    if (AdoConnObj.State == 1)
            //        AdoConnObj.Close();
            //    AdoConnObj = (object)null;

            //    DeleteRecordGenRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
            //    DeleteRecordGenRet = Strings.Replace(DeleteRecordGenRet, "\n", "");
            //    DeleteRecordGenRet = Strings.Replace(DeleteRecordGenRet, "\r", "");
            //}

            //else
            //{
            //    AdoConnObj = (object)null;
            //    if (string.IsNullOrEmpty(strComponent))
            //    {
            //        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / DeleteRecordGen";
            //    }

            //    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
            //    {
            //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
            //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + errDesc;
            //        arrErrSplit = Strings.Split(errDesc, "(");

            //        if (Information.UBound(arrErrSplit) > 0)
            //        {
            //            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
            //        }
            //    }



            //    else if (ConnError != "Connected")
            //    {
            //        if (string.IsNullOrEmpty(ErrNum))
            //            ErrNum = "DELCHK";
            //        errDesc = ConnError;
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + ConnError;
            //    }
            //    else
            //    {
            //        ErrNum = Information.Err().Number.ToString();
            //        errDesc = Information.Err().Description;
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + Information.Err().Description;
            //    }
            //    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
            //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
            //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
            //    // ''''*************RecordSet Not oppened************
            //    objError = null;
            //    DeleteRecordGenRet = this.ArrError(0, 2);

            //    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            //}

            #endregion

            #region Delete Record Only Error Handling

            //Variant arrErrSplit;
            //if (string.IsNullOrEmpty(ConnError))
            //{

            //    if (blnLogErrors == true)
            //        ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecordOnly", Information.Err().Number, Information.Err().Description + StrDelete);
            //    // *************Connection Failed************
            //    if (rsHistExt.State == 1)
            //        rsHistExt.Close();
            //    rsHistExt = (object)null;
            //    if (AdoConnObj.State == 1)
            //        AdoConnObj.Close();
            //    AdoConnObj = (object)null;

            //    DeleteRecordOnlyRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
            //    DeleteRecordOnlyRet = Strings.Replace(DeleteRecordOnlyRet, "\n", "");
            //    DeleteRecordOnlyRet = Strings.Replace(DeleteRecordOnlyRet, "\r", "");
            //}

            //else
            //{
            //    AdoConnObj = (object)null;
            //    if (string.IsNullOrEmpty(strComponent))
            //    {
            //        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / DeleteRecordOnly";
            //    }

            //    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
            //    {
            //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
            //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + errDesc;
            //        arrErrSplit = Strings.Split(errDesc, "(");

            //        if (Information.UBound(arrErrSplit) > 0)
            //        {
            //            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
            //        }
            //    }



            //    else if (ConnError != "Connected")
            //    {
            //        if (string.IsNullOrEmpty(ErrNum))
            //            ErrNum = "DELCHK";
            //        errDesc = ConnError;
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + ConnError;
            //    }
            //    else
            //    {
            //        ErrNum = Information.Err().Number.ToString();
            //        errDesc = Information.Err().Description;
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + Information.Err().Description;
            //    }
            //    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
            //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
            //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
            //    // ''''*************RecordSet Not oppened************
            //    objError = null;
            //    DeleteRecordOnlyRet = this.ArrError(0, 2);

            //    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            //}

            #endregion

            #region Delete Record Error Handling

            //Variant arrErrSplit;
            //if (string.IsNullOrEmpty(ConnError))
            //{

            //    if (blnLogErrors == true)
            //        ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecord", Information.Err().Number, Information.Err().Description + StrDelete);
            //    // *************Connection Failed************
            //    if (rsHistExt.State == 1)
            //        rsHistExt.Close();
            //    rsHistExt = (object)null;
            //    if (AdoConnObj.State == 1)
            //        AdoConnObj.Close();
            //    AdoConnObj = (object)null;

            //    DeleteRecordRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
            //    DeleteRecordRet = Strings.Replace(DeleteRecordRet, "\n", "");
            //    DeleteRecordRet = Strings.Replace(DeleteRecordRet, "\r", "");
            //}

            //else
            //{
            //    AdoConnObj = (object)null;
            //    if (string.IsNullOrEmpty(strComponent))
            //    {
            //        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / DELETERECORD";
            //    }

            //    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
            //    {
            //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
            //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + errDesc;
            //        arrErrSplit = Strings.Split(errDesc, "(");

            //        if (Information.UBound(arrErrSplit) > 0)
            //        {
            //            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
            //        }
            //    }



            //    else if (ConnError != "Connected")
            //    {
            //        if (string.IsNullOrEmpty(ErrNum))
            //            ErrNum = "DELCHK";
            //        errDesc = ConnError;
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + ConnError;
            //    }
            //    else
            //    {
            //        ErrNum = Information.Err().Number.ToString();
            //        errDesc = Information.Err().Description;
            //        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + Information.Err().Description;
            //    }
            //    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
            //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
            //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
            //    // ''''*************RecordSet Not oppened************
            //    objError = null;
            //    DeleteRecordRet = this.ArrError(0, 2);

            //    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            //}

            #endregion

            #region Update Record Error Handling

            //Variant arrErrSplit;

            //if (blnLogErrors == true)
            //    ((dynamic)objErrlog).LogError("DataBaseTransactions", "UpdateRecord", Information.Err().Number, Information.Err().Description + Strupdate);

            //if (rsHistCol.State == 1)
            //    rsHistCol.Close();
            //rsHistCol = (object)null;
            //if (rsHistExt.State == 1)
            //    rsHistExt.Close();
            //rsHistExt = (object)null;
            //if (AdoConnObj.State == 1)
            //    AdoConnObj.Close();
            //AdoConnObj = (object)null;

            //if (string.IsNullOrEmpty(ConnError))
            //{

            //    // *************Connection Failed************
            //    AdoConnObj = (object)null;
            //    UpdateRecordRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
            //    UpdateRecordRet = Strings.Replace(UpdateRecordRet, "\n", "");
            //    UpdateRecordRet = Strings.Replace(UpdateRecordRet, "\r", "");
            //}
            //else
            //{
            //    AdoConnObj = (object)null;
            //    if (string.IsNullOrEmpty(strComponent))
            //    {
            //        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / UPDATERECORD";
            //    }

            //    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
            //    {
            //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
            //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + errDesc;
            //        arrErrSplit = Strings.Split(errDesc, "(");

            //        if (Information.UBound(arrErrSplit) > 0)
            //        {
            //            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
            //        }
            //    }



            //    else if (ConnError != "Connected")
            //    {
            //        if (string.IsNullOrEmpty(ErrNum))
            //            ErrNum = "UPDCHK";
            //        errDesc = ConnError;
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + ConnError;
            //    }
            //    else
            //    {
            //        ErrNum = Information.Err().Number.ToString();
            //        errDesc = Information.Err().Description;
            //        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + Information.Err().Description;
            //    }
            //    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
            //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
            //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
            //    // ''''*************RecordSet Not oppened************
            //    objError = null;
            //    UpdateRecordRet = this.ArrError(0, 2);
            //    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
            //}

            #endregion

            return result;
        }
    }
}
