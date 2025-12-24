//using Banking.Models;
//using Banking.Interfaces;
//using Oracle.ManagedDataAccess.Client;
//using System.Threading.Tasks;
//using Banking.Framework;

//namespace Banking.Backend
//{
//    public class TransactionalFactory : ITransactionalService
//    {
//        private string dataLink = string.Empty;
//        private string applicationDate = string.Empty;
//        private readonly DatabaseSettings _databaseSettings;

//        public TransactionalFactory(DatabaseSettings databaseSettings)
//        {
//            _databaseSettings = databaseSettings;
//            OracleRetryHelper.Initialize(_databaseSettings.ConnectionString);
//        }

//        public async Task<OracleDataReader> ProcessQuery(string query)
//        {
//            return await OracleRetryHelper.ProcessQueryAsync(query);
//        }

//        public async Task<string> InsertRecord(string TableName, string FldNames, string[] ArrValues, string BranchCode = "", string UserCode = "",
//            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            OracleDataReader oracleDataReader = null!;
//            string connError = string.Empty, strInsert = string.Empty;
//            string InsertRecordRet = string.Empty;
//            string[] ArrTempValues;
//            string StrTabName;

//            try
//            {
//                ArrTempValues = Arrvalues;  
//                StrTabName = TableName.Trim().ToUpper();

//                applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

//                // Checking day begin status and day end status.
//                if (DayBeginEndStatusCheckYN != "N")
//                {
//                    OracleQueryModel queryModel = new()
//                    {
//                        TableName = StrTabName,
//                        FieldNames = FldNames,
//                        BranchCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper(),
//                        UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper(),
//                        MachineID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper(),
//                        ArrValues = ArrTempValues,
//                        QueryType = OracleQueryType.Insert
//                    };

//                    connError = await CheckDayBeginDayEndStatus(queryModel);

//                    if (connError != "CONTINUE")
//                        throw new Exception();
//                }

//                connError = "Connected";
                
//                // Checking day begin status and day end status.
//                var loopTo = (long)ArrTempValues.Length - 1;
//                for (int i = 0; i <= loopTo; i++)
//                {
//                    strInsert = "insert into " + StrTabName.Trim() + dataLink + " (" + FldNames + ") " + " values (" + ArrTempValues[i] + ")";
//                    oracleDataReader = await ProcessQuery(strInsert);

//                    if (oracleDataReader.RecordsAffected == 0)
//                    {
//                        InsertRecordRet = "Insert Failed !";
//                        // LogError("DataBaseTransactions", "InsertRecord", Information.Err().Number, InsertRecordRet + ": " + StrInsert);
//                        return InsertRecordRet;
//                    }
//                }
//                InsertRecordRet = "Transaction Completed";
//            }
//            catch (Exception ex)
//            {
//                InsertRecordRet = ProcessError(ex, connError, BankingConstants.DBTrans_Insert);
//            }

//            return InsertRecordRet;
//        }

//        public string BulkInsert(string TableName, string FldNames, string sQueryToGetValues, string BranchCode = "", string UserCode = "",
//            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            string BulkInsertRet = default;
//            Variant ArrTempValues;


//            // ************Oppening the connection to DataLink*************
//            string StrInsert;
//            string StrTabName;
//            string strfields;
//            string StrArrValues;
//            try
//            {
//                ConnError = "";
//                DBConnection();

//                if (ConnError != "Connected")
//                {
//                    BulkInsertRet = ConnError;
//                    BulkInsertRet = Strings.Replace(BulkInsertRet, "\n", "");
//                    BulkInsertRet = Strings.Replace(BulkInsertRet, "\r", "");
//                    return BulkInsertRet;
//                }


//                // *************Connection oppened Sucessfully*************
//                // ArrTempValues = Arrvalues
//                StrTabName = Strings.UCase(Strings.Trim(TableName));
//                strfields = FldNames;
//                BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), "", Strings.UCase(Strings.Trim(BranchCode))));
//                UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
//                MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
//                AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(ApplicationDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
//                // '''''''*************** checking day begin status and day end status.***************
//                if (DayBeginEndStatusCheckYN != "N")
//                {
//                    // ConnError = CheckDayBeginDayEndStatus("I", StrTabName, strfields, ArrTempValues)
//                    ConnError = CheckDayBeginDayEndStatus("I", StrTabName, strfields);

//                    if (ConnError != "CONTINUE")
//                        goto errhand;
//                }

//                ConnError = "Connected";
//                // '''''''*************** checking day begin status and day end status.***************
//                RecAffect = 0L;
//                // StrInsert = "insert into " & Trim(StrTabName) & DataLink & " (" & strfields & ") " _
//                // & " values (" & ArrTempValues(ICount) & ")"
//                if (Strings.Trim(strfields) == "*")
//                {
//                    StrInsert = "insert into " + Strings.Trim(StrTabName) + DataLink + " " + sQueryToGetValues;
//                }
//                else
//                {
//                    StrInsert = "insert into " + Strings.Trim(StrTabName) + DataLink + " (" + strfields + ") " + " " + sQueryToGetValues;
//                }
//                AdoConnObj.Execute(StrInsert, RecAffect);
//                StrInsert = "";

//                // Don't check for no. of rows effected/inserted
//                // If RecAffect = 0 Then
//                // BulkInsert = "Insert Failed !"
//                // Set AdoConnObj = Nothing
//                // Exit Function
//                // End If

//                AdoConnObj = (object)null;
//                BulkInsertRet = "Trans Completed";


//                // ''''******************************ERROR HANDLING*****************************************
//                return BulkInsertRet;
//            }
//            catch
//            {

//                Variant arrErrSplit;
//                if (string.IsNullOrEmpty(ConnError))
//                {

//                    if (blnLogErrors == true)
//                        ((dynamic)objErrlog).LogError("DataBaseTransactions", "BulkInsert", Information.Err().Number, Information.Err().Description);

//                    // *************Connection Failed************
//                    AdoConnObj = (object)null;
//                    BulkInsertRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                    BulkInsertRet = Strings.Replace(BulkInsertRet, "\n", "");
//                    BulkInsertRet = Strings.Replace(BulkInsertRet, "\r", "");
//                }
//                else
//                {
//                    AdoConnObj = (object)null;
//                    if (string.IsNullOrEmpty(strComponent))
//                    {
//                        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / BulkInsert";
//                    }

//                    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                    {

//                        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                        clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " Due to " + errDesc;
//                        arrErrSplit = Strings.Split(errDesc, "(");

//                        if (Information.UBound(arrErrSplit) > 0)
//                        {
//                            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                        }
//                    }


//                    else if (ConnError != "Connected")
//                    {
//                        if (string.IsNullOrEmpty(ErrNum))
//                            ErrNum = "INSCHK";
//                        errDesc = ConnError;
//                        clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " " + ConnError;
//                    }
//                    else
//                    {
//                        ErrNum = Information.Err().Number.ToString();
//                        errDesc = Information.Err().Description;
//                        clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " " + Information.Err().Description;
//                    }
//                    /// clntDesc = "Records Could Not Be Inserted Due to " & errDesc
//                    objError = Interaction.CreateObject("TrapError.ErrorDescription");
//                    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
//                    // ''''*************RecordSet Not oppened************
//                    objError = null;
//                    BulkInsertRet = this.ArrError(0, 2);

//                    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//                }
//            }

//            return BulkInsertRet;

//        }

//        public string UpdateRecord(string TableName, string FldNames, Variant Arrvalues, string WhereCondition = "", string BranchCode = "",
//            string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            string UpdateRecordRet = default;

//            Variant ArrTempValues;
//            Variant ArrRowValue;
//            Variant arrflds;
//            string strquery;
//            var Strupdate = default(string);
//            string StrInsert;
//            int ColCnt;
//            int RowCnt;
//            // ************Oppening the connection to DataLink*************
//            var strUpdateRow = default(string);
//            Variant StrCondition;
//            string StrTabName;
//            string strfields;
//            try
//            {
//                ConnError = "";
//                DBConnection();

//                if (ConnError != "Connected")
//                {
//                    UpdateRecordRet = ConnError;
//                    UpdateRecordRet = Strings.Replace(UpdateRecordRet, "\n", "");
//                    UpdateRecordRet = Strings.Replace(UpdateRecordRet, "\r", "");
//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;
//                    return UpdateRecordRet;
//                }


//                // *************Connection oppened Sucessfully*************
//                ArrTempValues = Arrvalues;
//                StrTabName = Strings.UCase(Strings.Trim(TableName));
//                strfields = FldNames;
//                BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), " ", Strings.UCase(Strings.Trim(BranchCode))));
//                UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
//                MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
//                AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(ApplicationDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
//                // ****** Spliting the conditions For Different Rows
//                // ConnError = ""
//                if (DayBeginEndStatusCheckYN != "N")
//                {
//                    // ''''''''''check for day begin and day end status is required
//                    ConnError = CheckDayBeginDayEndStatus("U", StrTabName, strfields, ArrTempValues, WhereCondition);
//                    if (ConnError != "CONTINUE")
//                        goto errhand;
//                }
//                ConnError = "Connected";

//                StrCondition = Strings.Split(WhereCondition, "|", -1);
//                // '''''''''' Roll back segment for large transactions
//                // ''''If Right(StrTabName, 3) = "LOG" Then
//                // ''''    AdoConnObj.Execute ("SET TRANSACTION USE ROLLBACK SEGMENT RBS7")
//                // ''''End If

//                if (string.IsNullOrEmpty(Strings.Trim(WhereCondition))) /* TODO ERROR: Skipped SkippedTokensTrivia
//        As*/ /* TODO ERROR: Skipped SkippedTokensTrivia
//        Variant*/
//                {
//                    ;
//#error Cannot convert ReDimStatementSyntax - see comment for details
//                    /* Cannot convert ReDimStatementSyntax, System.InvalidCastException: Unable to cast object of type 'Microsoft.CodeAnalysis.VisualBasic.Symbols.ExtendedErrorTypeSymbol' to type 'Microsoft.CodeAnalysis.IArrayTypeSymbol'.
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.CreateNewArrayAssignment(ExpressionSyntax vbArrayExpression, ExpressionSyntax csArrayExpression, List`1 convertedBounds)
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<ConvertRedimClauseAsync>d__42.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<<VisitReDimStatement>b__41_0>d.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.Common.AsyncEnumerableTaskExtensions.<SelectAsync>d__3`2.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.Common.AsyncEnumerableTaskExtensions.<SelectManyAsync>d__0`2.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<VisitReDimStatement>d__41.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.PerScopeStateVisitorDecorator.<AddLocalVariablesAsync>d__6.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.CommentConvertingMethodBodyVisitor.<DefaultVisitInnerAsync>d__3.MoveNext()

//                    Input:
//                                ReDim StrCondition(0) As Variant

//                     */
//                    StrCondition[0] = "";
//                }
//                // ''''''''*************************************************************************************
//                // '''checking if the record is to be send to the respective history table.
//                // ''''''''*************************************************************************************
//                BlnHistStatus = false;
//                strHistExt = "";
//                rsHistCol = Interaction.CreateObject("ADODB.Recordset");
//                rsHistExt = Interaction.CreateObject("ADODB.Recordset");

//                rsHistCol = AdoConnObj.Execute("Select * from GENHISTNOTREQUIREDCOLNAME", RecAffect);
//                rsHistExt = AdoConnObj.Execute("Select * from GENHISTNOTREQUIREDTABEXTNS", RecAffect);
//                arrflds = Strings.Split(strfields, ",", -1);
//                rsHistExt.MoveFirst();
//                var loopTo = rsHistExt.RecordCount - 1;
//                for (ICount = 0L; ICount <= loopTo; ICount++)
//                {
//                    if (Strings.Right(StrTabName, Len(Strings.Trim(rsHistExt["TABEXTENSIONNAME"]))) == UCase(Strings.Trim(rsHistExt["TABEXTENSIONNAME"])))
//                    {
//                        strHistExt = Strings.Trim(rsHistExt["TABBKPEXTENSIONNAME"]);
//                        BlnHistStatus = true;
//                        break;
//                    }
//                    rsHistExt.MoveNext();
//                }

//                if (BlnHistStatus == true & Information.UBound(arrflds) <= rsHistCol.RecordCount)
//                {
//                    var loopTo1 = (long)Information.UBound(arrflds);
//                    for (ICount = 0L; ICount <= loopTo1; ICount++)
//                    {
//                        rsHistCol.MoveFirst();
//                        var loopTo2 = rsHistCol.RecordCount - 1;
//                        for (ColCnt = 0; ColCnt <= loopTo2; ColCnt++)
//                        {

//                            if (UCase(Strings.Trim(this.rsHistCol(0))) == UCase(Strings.Trim(arrflds[ICount])))
//                            {
//                                BlnHistStatus = true;
//                                break;
//                            }
//                            else
//                            {
//                                BlnHistStatus = false;
//                            }

//                            rsHistCol.MoveNext();
//                        }
//                        if (BlnHistStatus == false)
//                            break;
//                    }
//                }
//                else
//                {
//                    BlnHistStatus = false;
//                }

//                // Set rsHistCol = Nothing
//                // Set rsHistExt = Nothing

//                // ''''''''*************************************************************************************
//                // ''''''''*************************************************************************************

//                var loopTo3 = Information.UBound(ArrTempValues);
//                for (RowCnt = 0; RowCnt <= loopTo3; RowCnt++)
//                {
//                    RecAffect = 0L;

//                    // '''''' First passing the data into history tables based on the type of tables.
//                    StrInsert = "";
//                    if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
//                    {

//                        if (Information.UBound(StrCondition) == Information.UBound(ArrTempValues) & !string.IsNullOrEmpty(Strings.Trim(WhereCondition)))
//                        {

//                            StrInsert = "Insert into " + Strings.Trim(StrTabName) + strHistExt + DataLink + " select * from " + StrTabName + "" + DataLink + " Where " + StrCondition[RowCnt];
//                        }
//                        else
//                        {

//                            StrInsert = "Insert into " + Strings.Trim(StrTabName) + strHistExt + DataLink + " select * from " + StrTabName + "" + DataLink + "";

//                        }

//                    }

//                    if (!string.IsNullOrEmpty(Strings.Trim(StrInsert)))
//                        AdoConnObj.Execute(StrInsert);


//                    // '''****** Spliting the Collumn Names (Fields) to build the Update Statement

//                    arrflds = Strings.Split(strfields, ",", -1);

//                    // ****** Spliting the Collumn Values (Fields Values) to build the Update Statement
//                    ArrRowValue = Strings.Split(ArrTempValues[RowCnt], "~", -1);

//                    /// *******  first concantinating the values for update ***********
//                    var loopTo4 = Information.UBound(arrflds);
//                    for (ColCnt = 0; ColCnt <= loopTo4; ColCnt++)


//                        strUpdateRow = strUpdateRow + arrflds[ColCnt] + "=" + ArrRowValue[ColCnt] + ",";

//                    // ******* Now building the The Update statement ********
//                    // '''If StrCondition(RowCnt) <> "" Then
//                    if (Information.UBound(StrCondition) == Information.UBound(ArrTempValues) & !string.IsNullOrEmpty(Strings.Trim(WhereCondition)))
//                    {

//                        Strupdate = "update " + StrTabName + "" + DataLink + " set " + Strings.Mid(strUpdateRow, 1, Strings.Len(strUpdateRow) - 1) + " where " + StrCondition[RowCnt];


//                        strquery = "select " + strfields + " from " + Strings.Trim(StrTabName) + DataLink + " where " + StrCondition[RowCnt] + " for update";
//                    }
//                    else
//                    {

//                        strquery = "select " + strfields + " from " + Strings.Trim(StrTabName) + DataLink + " for update";
//                        Strupdate = "update " + StrTabName + "" + DataLink + " set " + Strings.Mid(strUpdateRow, 1, Strings.Len(strUpdateRow) - 1);

//                    }

//                    // ***** Executing the update statement Based On Number of Rows ********'

//                    AdoConnObj.Execute(strquery);

//                    AdoConnObj.Execute(Strupdate, RecAffect);
//                    Strupdate = "";
//                    strUpdateRow = "";

//                    if (RecAffect == 0L)
//                    {
//                        UpdateRecordRet = "Update Failed due to False Condition ! " + StrTabName;

//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "UpdateRecord", "0", UpdateRecordRet + ": " + Strupdate);

//                        if (rsHistCol.State == 1)
//                            rsHistCol.Close();
//                        rsHistCol = (object)null;
//                        if (rsHistExt.State == 1)
//                            rsHistExt.Close();
//                        rsHistExt = (object)null;
//                        if (AdoConnObj.State == 1)
//                            AdoConnObj.Close();
//                        AdoConnObj = (object)null;
//                        return UpdateRecordRet;
//                    }
//                }

//                UpdateRecordRet = "Trans Completed";

//                if (rsHistCol.State == 1)
//                    rsHistCol.Close();
//                rsHistCol = (object)null;
//                if (rsHistExt.State == 1)
//                    rsHistExt.Close();
//                rsHistExt = (object)null;
//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;



//                // ''''******************************ERROR HANDLING*****************************************
//                return UpdateRecordRet;
//            }
//            catch
//            {

//                Variant arrErrSplit;

//                if (blnLogErrors == true)
//                    ((dynamic)objErrlog).LogError("DataBaseTransactions", "UpdateRecord", Information.Err().Number, Information.Err().Description + Strupdate);

//                if (rsHistCol.State == 1)
//                    rsHistCol.Close();
//                rsHistCol = (object)null;
//                if (rsHistExt.State == 1)
//                    rsHistExt.Close();
//                rsHistExt = (object)null;
//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;

//                if (string.IsNullOrEmpty(ConnError))
//                {

//                    // *************Connection Failed************
//                    AdoConnObj = (object)null;
//                    UpdateRecordRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                    UpdateRecordRet = Strings.Replace(UpdateRecordRet, "\n", "");
//                    UpdateRecordRet = Strings.Replace(UpdateRecordRet, "\r", "");
//                }
//                else
//                {
//                    AdoConnObj = (object)null;
//                    if (string.IsNullOrEmpty(strComponent))
//                    {
//                        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / UPDATERECORD";
//                    }

//                    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                    {
//                        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + errDesc;
//                        arrErrSplit = Strings.Split(errDesc, "(");

//                        if (Information.UBound(arrErrSplit) > 0)
//                        {
//                            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                        }
//                    }



//                    else if (ConnError != "Connected")
//                    {
//                        if (string.IsNullOrEmpty(ErrNum))
//                            ErrNum = "UPDCHK";
//                        errDesc = ConnError;
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + ConnError;
//                    }
//                    else
//                    {
//                        ErrNum = Information.Err().Number.ToString();
//                        errDesc = Information.Err().Description;
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + Information.Err().Description;
//                    }
//                    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
//                    objError = Interaction.CreateObject("TrapError.ErrorDescription");
//                    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
//                    // ''''*************RecordSet Not oppened************
//                    objError = null;
//                    UpdateRecordRet = this.ArrError(0, 2);
//                    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//                }
//            }

//            return UpdateRecordRet;
//        }

//        public string DeleteRecord(string TableName, string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
//            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            string DeleteRecordRet = default;
//            string StrDelete;
//            string StrTabName;
//            // '''************Oppening the connection to DataLink*************
//            Variant StrCondition;
//            string StrInsert;
//            try
//            {
//                ConnError = "";
//                DBConnection();
//                // ''''' If connection failed then
//                if (ConnError != "Connected")
//                {
//                    DeleteRecordRet = ConnError;
//                    DeleteRecordRet = Strings.Replace(DeleteRecordRet, "\n", "");
//                    DeleteRecordRet = Strings.Replace(DeleteRecordRet, "\r", "");

//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;
//                    return DeleteRecordRet;
//                }


//                // '''*************Connection oppened Sucessfully*************
//                StrDelete = "";
//                StrTabName = "";
//                StrCondition = "";
//                StrTabName = Strings.UCase(Strings.Trim(TableName));
//                BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), "", Strings.UCase(Strings.Trim(BranchCode))));
//                UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
//                MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
//                AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(ApplicationDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
//                // ConnError = ""

//                if (DayBeginEndStatusCheckYN != "N")
//                {
//                    ConnError = CheckDayBeginDayEndStatus("D", StrTabName, Condition: WhereCondition);
//                    if (ConnError != "CONTINUE")
//                        goto errhand;
//                }
//                ConnError = "Connected";



//                // '''First passing the data into History tables before deleting the data from original tables
//                BlnHistStatus = false;

//                rsHistExt = Interaction.CreateObject("ADODB.Recordset");
//                // '''

//                rsHistExt = AdoConnObj.Execute("Select * from GENHISTNOTREQUIREDTABEXTNS", RecAffect);
//                strHistExt = "";
//                rsHistExt.MoveFirst();
//                var loopTo = rsHistExt.RecordCount - 1;
//                for (ICount = 0L; ICount <= loopTo; ICount++)
//                {
//                    if (Strings.Right(StrTabName, Len(Strings.Trim(rsHistExt["TABEXTENSIONNAME"]))) == UCase(Strings.Trim(rsHistExt["TABEXTENSIONNAME"])))
//                    {
//                        strHistExt = rsHistExt["TABBKPEXTENSIONNAME"];
//                        BlnHistStatus = false;
//                        break;
//                    }
//                    rsHistExt.MoveNext();
//                }

//                RecAffect = 0L;
//                StrInsert = "";

//                if (!string.IsNullOrEmpty(Strings.Trim(WhereCondition)))
//                {
//                    StrCondition = Strings.Split(WhereCondition, "|", -1);
//                    var loopTo1 = (long)Information.UBound(StrCondition);
//                    for (ICount = 0L; ICount <= loopTo1; ICount++)
//                    {
//                        if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
//                        {
//                            // '''' First passing the data into history tables based on the type of tables.
//                            StrInsert = "Insert into " + Strings.Trim(StrTabName) + strHistExt + DataLink + " select * from " + Strings.Trim(StrTabName) + "" + DataLink + " Where " + StrCondition[ICount];

//                        }
//                        else
//                        {

//                            StrInsert = "";

//                        }


//                        StrDelete = "Delete from  " + Strings.Trim(StrTabName) + DataLink + " where " + StrCondition[ICount];

//                        if (!string.IsNullOrEmpty(StrInsert))
//                            AdoConnObj.Execute(StrInsert);
//                        AdoConnObj.Execute(StrDelete, RecAffect);

//                        if (RecAffect == 0L)
//                        {
//                            DeleteRecordRet = "Delete Failed due to False Condition !";
//                            if (blnLogErrors == true)
//                                ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecord", Information.Err().Number, DeleteRecordRet + ": " + StrDelete);

//                            if (rsHistExt.State == 1)
//                                rsHistExt.Close();
//                            rsHistExt = (object)null;
//                            if (AdoConnObj.State == 1)
//                                AdoConnObj.Close();
//                            AdoConnObj = (object)null;
//                            return DeleteRecordRet;
//                        }

//                    }
//                }

//                else
//                {
//                    if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
//                    {
//                        StrInsert = "Insert into " + Strings.Trim(StrTabName) + strHistExt + DataLink + " select * from " + Strings.Trim(StrTabName) + "" + DataLink + "";
//                    }
//                    else
//                    {

//                        StrInsert = "";

//                    }


//                    StrDelete = "Delete from  " + Strings.Trim(StrTabName) + DataLink + "";
//                    if (!string.IsNullOrEmpty(StrInsert))
//                        AdoConnObj.Execute(StrInsert);
//                    AdoConnObj.Execute(StrDelete, RecAffect);

//                    if (RecAffect == 0L)
//                    {
//                        DeleteRecordRet = "Delete Failed due to False Condition !";
//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecord", Information.Err().Number, DeleteRecordRet + ": " + StrDelete);

//                        if (rsHistExt.State == 1)
//                            rsHistExt.Close();
//                        rsHistExt = (object)null;
//                        if (AdoConnObj.State == 1)
//                            AdoConnObj.Close();
//                        AdoConnObj = (object)null;
//                        return DeleteRecordRet;
//                    }


//                }

//                DeleteRecordRet = "Trans Completed";

//                if (rsHistExt.State == 1)
//                    rsHistExt.Close();
//                rsHistExt = (object)null;
//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;


//                // ''''******************************ERROR HANDLING*****************************************
//                return DeleteRecordRet;
//            }
//            catch
//            {

//                Variant arrErrSplit;
//                if (string.IsNullOrEmpty(ConnError))
//                {

//                    if (blnLogErrors == true)
//                        ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecord", Information.Err().Number, Information.Err().Description + StrDelete);
//                    // *************Connection Failed************
//                    if (rsHistExt.State == 1)
//                        rsHistExt.Close();
//                    rsHistExt = (object)null;
//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;

//                    DeleteRecordRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                    DeleteRecordRet = Strings.Replace(DeleteRecordRet, "\n", "");
//                    DeleteRecordRet = Strings.Replace(DeleteRecordRet, "\r", "");
//                }

//                else
//                {
//                    AdoConnObj = (object)null;
//                    if (string.IsNullOrEmpty(strComponent))
//                    {
//                        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / DELETERECORD";
//                    }

//                    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                    {
//                        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + errDesc;
//                        arrErrSplit = Strings.Split(errDesc, "(");

//                        if (Information.UBound(arrErrSplit) > 0)
//                        {
//                            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                        }
//                    }



//                    else if (ConnError != "Connected")
//                    {
//                        if (string.IsNullOrEmpty(ErrNum))
//                            ErrNum = "DELCHK";
//                        errDesc = ConnError;
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + ConnError;
//                    }
//                    else
//                    {
//                        ErrNum = Information.Err().Number.ToString();
//                        errDesc = Information.Err().Description;
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + Information.Err().Description;
//                    }
//                    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
//                    objError = Interaction.CreateObject("TrapError.ErrorDescription");
//                    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
//                    // ''''*************RecordSet Not oppened************
//                    objError = null;
//                    DeleteRecordRet = this.ArrError(0, 2);

//                    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//                }
//            }

//            return DeleteRecordRet;
//        }

//        public string DeleteRecordOnly(string TableName, string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
//            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            string DeleteRecordOnlyRet = default;
//            string StrDelete;
//            string StrTabName;
//            // '''************Oppening the connection to DataLink*************
//            Variant StrCondition;
//            string StrInsert;
//            try
//            {
//                ConnError = "";
//                DBConnection();
//                // ''''' If connection failed then
//                if (ConnError != "Connected")
//                {
//                    DeleteRecordOnlyRet = ConnError;
//                    DeleteRecordOnlyRet = Strings.Replace(DeleteRecordOnlyRet, "\n", "");
//                    DeleteRecordOnlyRet = Strings.Replace(DeleteRecordOnlyRet, "\r", "");

//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;
//                    return DeleteRecordOnlyRet;
//                }


//                // '''*************Connection oppened Sucessfully*************
//                StrDelete = "";
//                StrTabName = "";
//                StrCondition = "";
//                StrTabName = Strings.UCase(Strings.Trim(TableName));
//                BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), "", Strings.UCase(Strings.Trim(BranchCode))));
//                UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
//                MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
//                AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(ApplicationDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
//                // ConnError = ""

//                if (DayBeginEndStatusCheckYN != "N")
//                {
//                    ConnError = CheckDayBeginDayEndStatus("D", StrTabName, Condition: WhereCondition);
//                    if (ConnError != "CONTINUE")
//                        goto errhand;
//                }
//                ConnError = "Connected";



//                // '''First passing the data into History tables before deleting the data from original tables


//                RecAffect = 0L;
//                StrInsert = "";

//                if (!string.IsNullOrEmpty(Strings.Trim(WhereCondition)))
//                {
//                    StrCondition = Strings.Split(WhereCondition, "|", -1);
//                    var loopTo = (long)Information.UBound(StrCondition);
//                    for (ICount = 0L; ICount <= loopTo; ICount++)
//                    {

//                        StrDelete = "Delete from  " + Strings.Trim(StrTabName) + DataLink + " where " + StrCondition[ICount];

//                        AdoConnObj.Execute(StrDelete, RecAffect);

//                        if (RecAffect == 0L)
//                        {
//                            DeleteRecordOnlyRet = "Delete Failed due to False Condition !";
//                            if (blnLogErrors == true)
//                                ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecordOnly", Information.Err().Number, DeleteRecordOnlyRet + ": " + StrDelete);

//                            if (AdoConnObj.State == 1)
//                                AdoConnObj.Close();
//                            AdoConnObj = (object)null;
//                            return DeleteRecordOnlyRet;
//                        }

//                    }
//                }

//                else
//                {


//                    StrDelete = "Delete from  " + Strings.Trim(StrTabName) + DataLink + "";
//                    AdoConnObj.Execute(StrDelete, RecAffect);

//                    if (RecAffect == 0L)
//                    {
//                        DeleteRecordOnlyRet = "Delete Failed due to False Condition !";
//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecordOnly", Information.Err().Number, DeleteRecordOnlyRet + ": " + StrDelete);

//                        if (AdoConnObj.State == 1)
//                            AdoConnObj.Close();
//                        AdoConnObj = (object)null;
//                        return DeleteRecordOnlyRet;
//                    }


//                }

//                DeleteRecordOnlyRet = "Trans Completed";

//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;


//                // ''''******************************ERROR HANDLING*****************************************
//                return DeleteRecordOnlyRet;
//            }
//            catch
//            {

//                Variant arrErrSplit;
//                if (string.IsNullOrEmpty(ConnError))
//                {

//                    if (blnLogErrors == true)
//                        ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecordOnly", Information.Err().Number, Information.Err().Description + StrDelete);
//                    // *************Connection Failed************
//                    if (rsHistExt.State == 1)
//                        rsHistExt.Close();
//                    rsHistExt = (object)null;
//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;

//                    DeleteRecordOnlyRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                    DeleteRecordOnlyRet = Strings.Replace(DeleteRecordOnlyRet, "\n", "");
//                    DeleteRecordOnlyRet = Strings.Replace(DeleteRecordOnlyRet, "\r", "");
//                }

//                else
//                {
//                    AdoConnObj = (object)null;
//                    if (string.IsNullOrEmpty(strComponent))
//                    {
//                        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / DeleteRecordOnly";
//                    }

//                    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                    {
//                        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + errDesc;
//                        arrErrSplit = Strings.Split(errDesc, "(");

//                        if (Information.UBound(arrErrSplit) > 0)
//                        {
//                            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                        }
//                    }



//                    else if (ConnError != "Connected")
//                    {
//                        if (string.IsNullOrEmpty(ErrNum))
//                            ErrNum = "DELCHK";
//                        errDesc = ConnError;
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + ConnError;
//                    }
//                    else
//                    {
//                        ErrNum = Information.Err().Number.ToString();
//                        errDesc = Information.Err().Description;
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + Information.Err().Description;
//                    }
//                    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
//                    objError = Interaction.CreateObject("TrapError.ErrorDescription");
//                    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
//                    // ''''*************RecordSet Not oppened************
//                    objError = null;
//                    DeleteRecordOnlyRet = this.ArrError(0, 2);

//                    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//                }
//            }

//            return DeleteRecordOnlyRet;
//        }

//        public string DeleteRecordGen(string TableName, string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
//            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            string DeleteRecordGenRet = default;
//            string StrDelete;
//            string StrTabName;
//            // '''************Oppening the connection to DataLink*************
//            Variant StrCondition;
//            string StrInsert;
//            string StrInserttrns;
//            try
//            {
//                ConnError = "";
//                DBConnection();
//                // ''''' If connection failed then
//                if (ConnError != "Connected")
//                {
//                    DeleteRecordGenRet = ConnError;
//                    DeleteRecordGenRet = Strings.Replace(DeleteRecordGenRet, "\n", "");
//                    DeleteRecordGenRet = Strings.Replace(DeleteRecordGenRet, "\r", "");

//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;
//                    return DeleteRecordGenRet;
//                }


//                // '''*************Connection oppened Sucessfully*************
//                StrDelete = "";
//                StrTabName = "";
//                StrCondition = "";
//                StrTabName = Strings.UCase(Strings.Trim(TableName));
//                BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), "", Strings.UCase(Strings.Trim(BranchCode))));
//                UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
//                MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
//                AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(ApplicationDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
//                // ConnError = ""

//                if (DayBeginEndStatusCheckYN != "N")
//                {
//                    ConnError = CheckDayBeginDayEndStatus("D", StrTabName, Condition: WhereCondition);
//                    if (ConnError != "CONTINUE")
//                        goto errhand;
//                }
//                ConnError = "Connected";



//                // '''First passing the data into History tables before deleting the data from original tables
//                BlnHistStatus = false;

//                rsHistExt = Interaction.CreateObject("ADODB.Recordset");
//                // '''

//                rsHistExt = AdoConnObj.Execute("Select * from GENHISTNOTREQUIREDTABEXTNS", RecAffect);
//                strHistExt = "";
//                rsHistExt.MoveFirst();
//                var loopTo = rsHistExt.RecordCount - 1;
//                for (ICount = 0L; ICount <= loopTo; ICount++)
//                {
//                    if (Strings.Right(StrTabName, Len(Strings.Trim(rsHistExt["TABEXTENSIONNAME"]))) == UCase(Strings.Trim(rsHistExt["TABEXTENSIONNAME"])))
//                    {
//                        strHistExt = rsHistExt["TABBKPEXTENSIONNAME"];
//                        BlnHistStatus = false;
//                        break;
//                    }
//                    rsHistExt.MoveNext();
//                }

//                RecAffect = 0L;
//                StrInsert = "";

//                if (!string.IsNullOrEmpty(Strings.Trim(WhereCondition)))
//                {
//                    StrCondition = Strings.Split(WhereCondition, "|", -1);
//                    var loopTo1 = (long)Information.UBound(StrCondition);
//                    for (ICount = 0L; ICount <= loopTo1; ICount++)
//                    {
//                        if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
//                        {
//                            // '''' First passing the data into history tables based on the type of tables.
//                            StrInsert = "Insert into " + Strings.Trim(StrTabName) + strHistExt + DataLink + " select * from " + Strings.Trim(StrTabName) + "" + DataLink + " Where " + StrCondition[ICount];

//                        }
//                        else
//                        {

//                            StrInsert = "";

//                        }

//                        if (Strings.UCase(StrTabName) == "GENTRANSLOG")
//                        {
//                            StrInserttrns = "";
//                            StrInserttrns = "INSERT INTO GENDELETEDTRANSLOG(BRANCHCODE, CURRENCYCODE, MODULEID, GLCODE, ACCNO, " + " BATCHNO, TRANNO, AMOUNT,MODEOFTRAN, ENTEREDTIMEBAL, VERIFIEDTIMEBAL, APPROVEDTIMEBAL, DAYENDBAL," + " EFFECTIVEDATE, CUSTOMERID, NAME, CHQNO,CHQSERIESNO, CHQFVG, CHQDATE, TOKENNO, CASHPAIDYN, " + " CASHIERID, SYSTEMGENERATEDYN, RATE, FCURRENCYCODE, FAMOUNT,LINKMODULEID, LINKGLCODE, " + " LINKACCNO, LINKACCTYPE, REMARKS, SERVICEID, CLGRATETYPE, RESPONDINGBRANCHCODE," + " RESPONDINGSECTIONCODE, EXCEPTIONYN, RESPONDINGBANKCODE, RATEREFCODE, " + " APPROVEDSYSTEMDATE, VERIFIEDSYSTEMDATE,APPROVEDDATE, APPLICATIONDATE, USERID, MACHINEID, " + " TRANSTATUS, SYSTEMDATE, VERIFIEDBY, VERIFIEDMACHINE,APPROVEDBY, APPROVEDMACHINE,SYSTEMYEAR, " + " ABBBRANCHCODE, ABBAPPLICATIONDATE, ABBYN, DELETEDUSERID, DELETEDMACHINEID,DELETEDTRANSTATUS) " + " SELECT BRANCHCODE, CURRENCYCODE, MODULEID, GLCODE, ACCNO, BATCHNO, TRANNO, AMOUNT, MODEOFTRAN," + " ENTEREDTIMEBAL,VERIFIEDTIMEBAL, APPROVEDTIMEBAL, DAYENDBAL, EFFECTIVEDATE, CUSTOMERID, NAME, " + " CHQNO, CHQSERIESNO, CHQFVG,CHQDATE, TOKENNO, CASHPAIDYN, CASHIERID, SYSTEMGENERATEDYN, RATE, " + " FCURRENCYCODE, FAMOUNT, LINKMODULEID,LINKGLCODE, LINKACCNO, LINKACCTYPE, REMARKS, SERVICEID," + " CLGRATETYPE, RESPONDINGBRANCHCODE, RESPONDINGSECTIONCODE,EXCEPTIONYN, RESPONDINGBANKCODE," + " RATEREFCODE, APPROVEDSYSTEMDATE, VERIFIEDSYSTEMDATE, APPROVEDDATE,APPLICATIONDATE, USERID," + " MACHINEID, TRANSTATUS, SYSTEMDATE, VERIFIEDBY, VERIFIEDMACHINE, APPROVEDBY,APPROVEDMACHINE, " + " SYSTEMYEAR, ABBBRANCHCODE, ABBAPPLICATIONDATE, ABBYN,'" + UserCode + "','" + MachineID + "','P' " + " FROM GENTRANSLOG Where" + StrCondition[ICount];

//                            if (!string.IsNullOrEmpty(StrInserttrns))
//                                AdoConnObj.Execute(StrInserttrns);


//                        }

//                        StrDelete = "Delete from  " + Strings.Trim(StrTabName) + DataLink + " where " + StrCondition[ICount];

//                        if (!string.IsNullOrEmpty(StrInsert))
//                            AdoConnObj.Execute(StrInsert);
//                        AdoConnObj.Execute(StrDelete, RecAffect);

//                        if (RecAffect == 0L)
//                        {
//                            DeleteRecordGenRet = "Delete Failed due to False Condition !";
//                            if (blnLogErrors == true)
//                                ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecordGen", Information.Err().Number, DeleteRecordGenRet + ": " + StrDelete);

//                            if (rsHistExt.State == 1)
//                                rsHistExt.Close();
//                            rsHistExt = (object)null;
//                            if (AdoConnObj.State == 1)
//                                AdoConnObj.Close();
//                            AdoConnObj = (object)null;
//                            return DeleteRecordGenRet;
//                        }

//                    }
//                }

//                else
//                {
//                    if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
//                    {
//                        StrInsert = "Insert into " + Strings.Trim(StrTabName) + strHistExt + DataLink + " select * from " + Strings.Trim(StrTabName) + "" + DataLink + "";
//                    }
//                    else
//                    {

//                        StrInsert = "";

//                    }


//                    StrDelete = "Delete from  " + Strings.Trim(StrTabName) + DataLink + "";
//                    if (!string.IsNullOrEmpty(StrInsert))
//                        AdoConnObj.Execute(StrInsert);
//                    AdoConnObj.Execute(StrDelete, RecAffect);

//                    if (RecAffect == 0L)
//                    {
//                        DeleteRecordGenRet = "Delete Failed due to False Condition !";
//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecordGen", Information.Err().Number, DeleteRecordGenRet + ": " + StrDelete);

//                        if (rsHistExt.State == 1)
//                            rsHistExt.Close();
//                        rsHistExt = (object)null;
//                        if (AdoConnObj.State == 1)
//                            AdoConnObj.Close();
//                        AdoConnObj = (object)null;
//                        return DeleteRecordGenRet;
//                    }


//                }

//                DeleteRecordGenRet = "Trans Completed";

//                if (rsHistExt.State == 1)
//                    rsHistExt.Close();
//                rsHistExt = (object)null;
//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;


//                // ''''******************************ERROR HANDLING*****************************************
//                return DeleteRecordGenRet;
//            }
//            catch
//            {

//                Variant arrErrSplit;
//                if (string.IsNullOrEmpty(ConnError))
//                {

//                    if (blnLogErrors == true)
//                        ((dynamic)objErrlog).LogError("DataBaseTransactions", "DeleteRecordGen", Information.Err().Number, Information.Err().Description + StrDelete);
//                    // *************Connection Failed************
//                    if (rsHistExt.State == 1)
//                        rsHistExt.Close();
//                    rsHistExt = (object)null;
//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;

//                    DeleteRecordGenRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                    DeleteRecordGenRet = Strings.Replace(DeleteRecordGenRet, "\n", "");
//                    DeleteRecordGenRet = Strings.Replace(DeleteRecordGenRet, "\r", "");
//                }

//                else
//                {
//                    AdoConnObj = (object)null;
//                    if (string.IsNullOrEmpty(strComponent))
//                    {
//                        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / DeleteRecordGen";
//                    }

//                    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                    {
//                        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + errDesc;
//                        arrErrSplit = Strings.Split(errDesc, "(");

//                        if (Information.UBound(arrErrSplit) > 0)
//                        {
//                            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                        }
//                    }



//                    else if (ConnError != "Connected")
//                    {
//                        if (string.IsNullOrEmpty(ErrNum))
//                            ErrNum = "DELCHK";
//                        errDesc = ConnError;
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + ConnError;
//                    }
//                    else
//                    {
//                        ErrNum = Information.Err().Number.ToString();
//                        errDesc = Information.Err().Description;
//                        clntDesc = "Error ! Records Could Not Be Deleted from " + StrTabName + " Due to " + Information.Err().Description;
//                    }
//                    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
//                    objError = Interaction.CreateObject("TrapError.ErrorDescription");
//                    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
//                    // ''''*************RecordSet Not oppened************
//                    objError = null;
//                    DeleteRecordGenRet = this.ArrError(0, 2);

//                    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//                }
//            }

//            return DeleteRecordGenRet;
//        }

//        // The functionality of this method is to reject the Modification of a record and place the original record back to the specified table

//        public string RejectRecord(string TableName, string WhereCondition = "", string BranchCode = "", string UserCode = "", string MachineID = "",
//            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            string RejectRecordRet = default;


//            Variant ArrTempValues;
//            Variant ArrRowValue;
//            Variant arrflds;
//            string strquery;
//            string Strupdate;
//            var StrInsert = default(string);
//            int ColCnt;
//            int RowCnt;
//            string strUpdateRow;
//            Variant StrCondition;
//            string StrTabName;
//            string strfields;
//            // ************Oppening the connection to DataLink*************
//            string strHistTab;
//            var StrDeleteMst = default(string);
//            var StrDeleteHist = default(object);
//            try
//            {
//                ConnError = "";
//                DBConnection();

//                if (ConnError != "Connected")
//                {
//                    RejectRecordRet = ConnError;
//                    RejectRecordRet = Strings.Replace(RejectRecordRet, "\n", "");
//                    RejectRecordRet = Strings.Replace(RejectRecordRet, "\r", "");
//                    return RejectRecordRet;
//                }

//                StrTabName = Strings.UCase(Strings.Trim(TableName));
//                strHistTab = Strings.UCase(Strings.Trim(TableName)) + "HIST";
//                BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), "", Strings.UCase(Strings.Trim(BranchCode))));
//                UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
//                MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
//                AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(AppDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
//                if (DayBeginEndStatusCheckYN != "N")
//                {
//                    ConnError = CheckDayBeginDayEndStatus("R", StrTabName, Condition: WhereCondition);
//                    if (ConnError != "CONTINUE")
//                        goto errhand;
//                }
//                ConnError = "Connected";

//                // ****** Spliting the conditions For Different Rows
//                if (!string.IsNullOrEmpty(Strings.Trim(WhereCondition)))
//                {
//                    StrCondition = Strings.Split(WhereCondition, "|", -1);


//                    RecAffect = 0L;

//                    var loopTo = (long)Information.UBound(StrCondition);
//                    for (ICount = 0L; ICount <= loopTo; ICount++)
//                    {

//                        StrDeleteMst = "Delete from  " + Strings.Trim(StrTabName) + DataLink + " where " + StrCondition[ICount];

//                        StrInsert = "Insert into " + Strings.Trim(StrTabName) + DataLink + " select * from " + Strings.Trim(StrTabName) + "Hist" + DataLink + " Where " + StrCondition[ICount] + " and to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss') in " + " (select max(to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss')) from " + Strings.Trim(StrTabName) + "Hist" + DataLink + " Where " + StrCondition[ICount] + ") and " + " to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy') in " + " (select max(to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy')) from " + Strings.Trim(StrTabName) + "Hist" + DataLink + " Where " + StrCondition[ICount] + ")";







//                        StrDeleteHist = "Delete from " + Strings.Trim(StrTabName) + "Hist" + DataLink + " Where " + StrCondition[ICount] + " and to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss') in " + " (select max(to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss')) from " + Strings.Trim(StrTabName) + "Hist" + DataLink + " Where " + StrCondition[ICount] + ") and " + " to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy') in " + " (select max(to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy')) from " + Strings.Trim(StrTabName) + "Hist" + DataLink + " Where " + StrCondition[ICount] + ")";






//                        AdoConnObj.Execute(StrDeleteMst, RecAffect);
//                        if (RecAffect > 1L)
//                        {
//                            RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
//                            if (blnLogErrors == true)
//                                ((dynamic)objErrlog).LogError("DataBaseTransactions", "RejectRecord", 999, RejectRecordRet + ": " + StrDeleteMst);
//                            return RejectRecordRet;
//                        }

//                        AdoConnObj.Execute(StrInsert, RecAffect);
//                        if (RecAffect < 1L)
//                        {
//                            RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
//                            if (blnLogErrors == true)
//                                ((dynamic)objErrlog).LogError("DataBaseTransactions", "RejectRecord", 999, RejectRecordRet + ": " + StrInsert);
//                            return RejectRecordRet;
//                        }

//                        AdoConnObj.Execute(StrDeleteHist, RecAffect);
//                        if (RecAffect > 1L)
//                        {
//                            RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
//                            if (blnLogErrors == true)
//                                ((dynamic)objErrlog).LogError("DataBaseTransactions", "RejectRecord", 999, Operators.ConcatenateObject(RejectRecordRet + ": ", StrDeleteHist));
//                            return RejectRecordRet;
//                        }

//                    }
//                }

//                else
//                {
//                    StrDeleteMst = "Delete from  " + Strings.Trim(StrTabName) + DataLink;

//                    StrInsert = "Insert into " + Strings.Trim(StrTabName) + DataLink + " select * from " + Strings.Trim(StrTabName) + "Hist" + DataLink + " Where to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss') in " + " (select max(to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss')) from " + Strings.Trim(StrTabName) + "Hist" + DataLink + ") and " + " to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy') in " + " (select max(to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy')) from " + Strings.Trim(StrTabName) + "Hist" + DataLink + ")";







//                    StrDeleteHist = " Delete from " + Strings.Trim(StrTabName) + "Hist" + DataLink + " Where to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss') in " + " (select max(to_date(to_char(systemdate,'dd-Mon-yyyy HH24:mi:ss'),'dd-Mon-yyyy HH24:mi:ss')) from " + Strings.Trim(StrTabName) + "Hist" + DataLink + ") and " + " to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy') in " + " (select max(to_date(to_char(APPLICATIONDATE,'dd-Mon-yyyy'),'dd-Mon-yyyy')) from " + Strings.Trim(StrTabName) + "Hist" + DataLink + ")";







//                    AdoConnObj.Execute(StrDeleteMst, RecAffect);
//                    if (RecAffect > 1L)
//                    {
//                        RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "RejectRecord", 999, RejectRecordRet + "" + StrDeleteMst);
//                        return RejectRecordRet;
//                    }

//                    AdoConnObj.Execute(StrInsert, RecAffect);
//                    if (RecAffect < 1L)
//                    {
//                        RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "RejectRecord", 999, RejectRecordRet + "" + StrInsert);
//                        return RejectRecordRet;
//                    }

//                    AdoConnObj.Execute(StrDeleteHist, RecAffect);
//                    if (RecAffect > 1L)
//                    {
//                        RejectRecordRet = "Reject failed due to false condition with : " + StrTabName;
//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "RejectRecord", 999, Operators.ConcatenateObject(RejectRecordRet + "", StrDeleteHist));
//                        return RejectRecordRet;
//                    }
//                }

//                AdoConnObj = (object)null;
//                RejectRecordRet = "Trans Completed";
//                return RejectRecordRet;
//            }
//            catch
//            {

//                Variant arrErrSplit;
//                if (string.IsNullOrEmpty(ConnError))
//                {

//                    if (blnLogErrors == true)
//                        ((dynamic)objErrlog).LogError("DataBaseTransactions", "RejectRecord", Information.Err().Number, Operators.ConcatenateObject(Information.Err().Description + " Insert: " + StrInsert + " Insert hist: ", StrDeleteHist));

//                    // *************Connection Failed************
//                    AdoConnObj = (object)null;
//                    RejectRecordRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                    RejectRecordRet = Strings.Replace(RejectRecordRet, "\n", "");
//                    RejectRecordRet = Strings.Replace(RejectRecordRet, "\r", "");
//                }
//                else
//                {
//                    AdoConnObj = (object)null;
//                    if (string.IsNullOrEmpty(strComponent))
//                    {
//                        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / REJECTRECORD";
//                    }

//                    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                    {
//                        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                        clntDesc = "Error ! Records Could Not Be Rejected Due to " + errDesc;
//                        arrErrSplit = Strings.Split(errDesc, "(");

//                        if (Information.UBound(arrErrSplit) > 0)
//                        {
//                            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                        }
//                    }



//                    else if (ConnError != "Connected")
//                    {
//                        if (string.IsNullOrEmpty(ErrNum))
//                            ErrNum = "REJCHK";
//                        errDesc = ConnError;
//                        clntDesc = ConnError;
//                    }
//                    else
//                    {
//                        ErrNum = Information.Err().Number.ToString();
//                        errDesc = Information.Err().Description;
//                        clntDesc = Conversions.ToString(Operators.ConcatenateObject(Operators.ConcatenateObject(Operators.ConcatenateObject("Error ! Records Could Not Be Rejected Due to " + Information.Err().Description + " " + StrDeleteMst + " ", StrDeleteHist), " "), StrInsert));
//                    }
//                    /// clntDesc = "Records Could Not Be Deleted Due to " & errDesc
//                    objError = Interaction.CreateObject("TrapError.ErrorDescription");
//                    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc + " : " + StrTabName, strComponent, BRCode, UserId, MachID);
//                    // ''''*************RecordSet Not oppened************
//                    objError = null;
//                    RejectRecordRet = this.ArrError(0, 2);
//                    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//                }
//            }

//            return RejectRecordRet;
//        }

//        public string InsertUsingSelect(string TableName, string FldNames, Variant Arrvalues, string WhereCondition = "", string BranchCode = "",
//            string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            string InsertUsingSelectRet = default;

//            ADODB.Recordset RsTemp;
//            Variant ArrTempValues;
//            Variant ArrRowValue;
//            Variant arrflds;
//            string strquery;
//            string Strupdate;
//            string StrInsert;
//            int ColCnt;
//            int RowCnt;
//            // ************Oppening the connection to DataLink*************
//            string strUpdateRow;
//            Variant StrCondition;
//            string StrTabName;
//            string strfields;
//            try
//            {
//                ConnError = "";
//                DBConnection();

//                if (ConnError != "Connected")
//                {
//                    InsertUsingSelectRet = ConnError;
//                    InsertUsingSelectRet = Strings.Replace(InsertUsingSelectRet, "\n", "");
//                    InsertUsingSelectRet = Strings.Replace(InsertUsingSelectRet, "\r", "");

//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;
//                    return InsertUsingSelectRet;
//                }

//                // *************Connection oppened Sucessfully*************
//                RsTemp = Interaction.CreateObject("Adodb.Recordset");
//                ArrTempValues = Arrvalues;
//                StrTabName = Strings.UCase(Strings.Trim(TableName));
//                strfields = FldNames;
//                BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), " ", Strings.UCase(Strings.Trim(BranchCode))));
//                UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
//                MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
//                AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(ApplicationDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
//                // ****** Spliting the conditions For Different Rows

//                ConnError = "Connected";

//                StrCondition = Strings.Split(WhereCondition, "|", -1);

//                if (string.IsNullOrEmpty(Strings.Trim(WhereCondition))) /* TODO ERROR: Skipped SkippedTokensTrivia
//        As*/ /* TODO ERROR: Skipped SkippedTokensTrivia
//        Variant*/
//                {
//                    ;
//#error Cannot convert ReDimStatementSyntax - see comment for details
//                    /* Cannot convert ReDimStatementSyntax, System.InvalidCastException: Unable to cast object of type 'Microsoft.CodeAnalysis.VisualBasic.Symbols.ExtendedErrorTypeSymbol' to type 'Microsoft.CodeAnalysis.IArrayTypeSymbol'.
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.CreateNewArrayAssignment(ExpressionSyntax vbArrayExpression, ExpressionSyntax csArrayExpression, List`1 convertedBounds)
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<ConvertRedimClauseAsync>d__42.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<<VisitReDimStatement>b__41_0>d.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.Common.AsyncEnumerableTaskExtensions.<SelectAsync>d__3`2.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.Common.AsyncEnumerableTaskExtensions.<SelectManyAsync>d__0`2.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<VisitReDimStatement>d__41.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.PerScopeStateVisitorDecorator.<AddLocalVariablesAsync>d__6.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.CommentConvertingMethodBodyVisitor.<DefaultVisitInnerAsync>d__3.MoveNext()

//                    Input:
//                                ReDim StrCondition(0) As Variant

//                     */
//                    StrCondition[0] = "";
//                }

//                var loopTo = Information.UBound(ArrTempValues);
//                for (RowCnt = 0; RowCnt <= loopTo; RowCnt++)
//                {
//                    RecAffect = 0L;

//                    Strupdate = "Insert into " + Strings.Trim(StrTabName) + DataLink + "(" + FldNames + ") " + ArrTempValues[RowCnt] + " Where " + WhereCondition;

//                    AdoConnObj.Execute(Strupdate, RecAffect);
//                    Strupdate = "";
//                    strUpdateRow = "";

//                    if (RecAffect == 0L)
//                    {
//                        InsertUsingSelectRet = "Inwertion Failed due to False Condition ! " + StrTabName;
//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "InsertUsingSelect", 999, InsertUsingSelectRet + ": " + Strupdate);

//                        if (RsTemp.State == 1)
//                            RsTemp.Close();
//                        RsTemp = default;
//                        if (AdoConnObj.State == 1)
//                            AdoConnObj.Close();
//                        AdoConnObj = (object)null;

//                        return InsertUsingSelectRet;
//                    }
//                }


//                if (RsTemp.State == 1)
//                    RsTemp.Close();
//                RsTemp = default;
//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;



//                InsertUsingSelectRet = "Trans Completed";


//                // ''''******************************ERROR HANDLING*****************************************
//                return InsertUsingSelectRet;
//            }
//            catch
//            {

//                Variant arrErrSplit;

//                if (blnLogErrors == true)
//                    ((dynamic)objErrlog).LogError("DataBaseTransactions", "InsertUsingSelect", Information.Err().Number, Information.Err().Description + StrInsert);

//                if (RsTemp.State == 1)
//                    RsTemp.Close();
//                RsTemp = default;
//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;


//                if (string.IsNullOrEmpty(ConnError))
//                {

//                    // *************Connection Failed************
//                    AdoConnObj = (object)null;
//                    InsertUsingSelectRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                    InsertUsingSelectRet = Strings.Replace(InsertUsingSelectRet, "\n", "");
//                    InsertUsingSelectRet = Strings.Replace(InsertUsingSelectRet, "\r", "");
//                }
//                else
//                {
//                    AdoConnObj = (object)null;
//                    if (string.IsNullOrEmpty(strComponent))
//                    {
//                        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / InsertUsingSelect";
//                    }

//                    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                    {
//                        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + errDesc;
//                        arrErrSplit = Strings.Split(errDesc, "(");

//                        if (Information.UBound(arrErrSplit) > 0)
//                        {
//                            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                        }
//                    }



//                    else if (ConnError != "Connected")
//                    {
//                        if (string.IsNullOrEmpty(ErrNum))
//                            ErrNum = "UPDCHK";
//                        errDesc = ConnError;
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + ConnError;
//                    }
//                    else
//                    {
//                        ErrNum = Information.Err().Number.ToString();
//                        errDesc = Information.Err().Description;
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + Information.Err().Description;
//                    }
//                    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
//                    objError = Interaction.CreateObject("TrapError.ErrorDescription");
//                    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
//                    // ''''*************RecordSet Not oppened************
//                    objError = null;
//                    InsertUsingSelectRet = this.ArrError(0, 2);
//                    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//                }
//            }
//        }

//        public string InsertUsingSelectHist(string TableName, string FldNames, Variant Arrvalues, string WhereCondition = "", string BranchCode = "",
//            string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "")
//        {
//            string InsertUsingSelectHistRet = default;

//            ADODB.Recordset RsTemp;
//            Variant ArrTempValues;
//            Variant ArrRowValue;
//            Variant arrflds;
//            string strquery;
//            string Strupdate;
//            string StrInsert;
//            int ColCnt;
//            int RowCnt;
//            string strUpdateRow;
//            Variant StrCondition;
//            string StrTabName;
//            string strfields;
//            // ************Oppening the connection to DataLink*************
//            string StrDelete;
//            try
//            {
//                ConnError = "";
//                DBConnection();

//                if (ConnError != "Connected")
//                {
//                    InsertUsingSelectHistRet = ConnError;
//                    InsertUsingSelectHistRet = Strings.Replace(InsertUsingSelectHistRet, "\n", "");
//                    InsertUsingSelectHistRet = Strings.Replace(InsertUsingSelectHistRet, "\r", "");

//                    if (AdoConnObj.State == 1)
//                        AdoConnObj.Close();
//                    AdoConnObj = (object)null;
//                    return InsertUsingSelectHistRet;
//                }

//                // *************Connection oppened Sucessfully*************
//                RsTemp = Interaction.CreateObject("Adodb.Recordset");
//                ArrTempValues = Arrvalues;
//                StrTabName = Strings.UCase(Strings.Trim(TableName));
//                strfields = FldNames;
//                BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), " ", Strings.UCase(Strings.Trim(BranchCode))));
//                UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
//                MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
//                AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(ApplicationDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
//                // ****** Spliting the conditions For Different Rows

//                ConnError = "Connected";

//                StrCondition = Strings.Split(WhereCondition, "|", -1);

//                if (string.IsNullOrEmpty(Strings.Trim(WhereCondition))) /* TODO ERROR: Skipped SkippedTokensTrivia
//        As*/ /* TODO ERROR: Skipped SkippedTokensTrivia
//        Variant*/
//                {
//                    ;
//#error Cannot convert ReDimStatementSyntax - see comment for details
//                    /* Cannot convert ReDimStatementSyntax, System.InvalidCastException: Unable to cast object of type 'Microsoft.CodeAnalysis.VisualBasic.Symbols.ExtendedErrorTypeSymbol' to type 'Microsoft.CodeAnalysis.IArrayTypeSymbol'.
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.CreateNewArrayAssignment(ExpressionSyntax vbArrayExpression, ExpressionSyntax csArrayExpression, List`1 convertedBounds)
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<ConvertRedimClauseAsync>d__42.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<<VisitReDimStatement>b__41_0>d.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.Common.AsyncEnumerableTaskExtensions.<SelectAsync>d__3`2.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.Common.AsyncEnumerableTaskExtensions.<SelectManyAsync>d__0`2.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.MethodBodyExecutableStatementVisitor.<VisitReDimStatement>d__41.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.PerScopeStateVisitorDecorator.<AddLocalVariablesAsync>d__6.MoveNext()
//                    --- End of stack trace from previous location where exception was thrown ---
//                       at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
//                       at ICSharpCode.CodeConverter.CSharp.CommentConvertingMethodBodyVisitor.<DefaultVisitInnerAsync>d__3.MoveNext()

//                    Input:
//                                ReDim StrCondition(0) As Variant

//                     */
//                    StrCondition[0] = "";
//                }


//                // ''''''''*************************************************************************************
//                // '''checking if the record is to be send to the respective history table.
//                // ''''''''*************************************************************************************
//                BlnHistStatus = false;
//                strHistExt = "";
//                rsHistCol = Interaction.CreateObject("ADODB.Recordset");
//                rsHistExt = Interaction.CreateObject("ADODB.Recordset");

//                rsHistCol = AdoConnObj.Execute("Select * from GENHISTNOTREQUIREDCOLNAME", RecAffect);
//                rsHistExt = AdoConnObj.Execute("Select * from GENHISTNOTREQUIREDTABEXTNS", RecAffect);
//                arrflds = Strings.Split(strfields, ",", -1);
//                rsHistExt.MoveFirst();
//                var loopTo = rsHistExt.RecordCount - 1;
//                for (ICount = 0L; ICount <= loopTo; ICount++)
//                {
//                    if (Strings.Right(StrTabName, Len(Strings.Trim(rsHistExt["TABEXTENSIONNAME"]))) == UCase(Strings.Trim(rsHistExt["TABEXTENSIONNAME"])))
//                    {
//                        strHistExt = Strings.Trim(rsHistExt["TABBKPEXTENSIONNAME"]);
//                        BlnHistStatus = true;
//                        break;
//                    }
//                    rsHistExt.MoveNext();
//                }

//                if (BlnHistStatus == true & Information.UBound(arrflds) <= rsHistCol.RecordCount)
//                {
//                    var loopTo1 = (long)Information.UBound(arrflds);
//                    for (ICount = 0L; ICount <= loopTo1; ICount++)
//                    {
//                        rsHistCol.MoveFirst();
//                        var loopTo2 = rsHistCol.RecordCount - 1;
//                        for (ColCnt = 0; ColCnt <= loopTo2; ColCnt++)
//                        {

//                            if (UCase(Strings.Trim(this.rsHistCol(0))) == UCase(Strings.Trim(arrflds[ICount])))
//                            {
//                                BlnHistStatus = true;
//                                break;
//                            }
//                            else
//                            {
//                                BlnHistStatus = false;
//                            }

//                            rsHistCol.MoveNext();
//                        }
//                        if (BlnHistStatus == false)
//                            break;
//                    }
//                }
//                else
//                {
//                    BlnHistStatus = false;
//                }

//                // Set rsHistCol = Nothing
//                // Set rsHistExt = Nothing

//                // ''''''''*************************************************************************************
//                // ''''''''*************************************************************************************

//                var loopTo3 = Information.UBound(ArrTempValues);
//                for (RowCnt = 0; RowCnt <= loopTo3; RowCnt++)
//                {
//                    RecAffect = 0L;


//                    // '''''' First passing the data into history tables based on the type of tables.
//                    StrInsert = "";
//                    if (BlnHistStatus == false & !string.IsNullOrEmpty(strHistExt))
//                    {

//                        if (Information.UBound(StrCondition) == Information.UBound(ArrTempValues) & !string.IsNullOrEmpty(Strings.Trim(WhereCondition)))
//                        {

//                            StrInsert = "Insert into " + Strings.Trim(StrTabName) + strHistExt + DataLink + " select * from " + StrTabName + "" + DataLink + " Where " + StrCondition[RowCnt];
//                        }
//                        // StrDelete = "Delete from " & Trim(StrTabName) & " Where " & StrCondition(RowCnt)

//                        else
//                        {

//                            StrInsert = "Insert into " + Strings.Trim(StrTabName) + strHistExt + DataLink + " select * from " + StrTabName + "" + DataLink + "";
//                            // StrDelete = "Delete from " & Trim(StrTabName)

//                        }

//                    }

//                    if (!string.IsNullOrEmpty(Strings.Trim(StrInsert)))
//                        AdoConnObj.Execute(StrInsert);
//                    // '''''' deleting the data from the main table
//                    // If Trim(StrDelete) <> "" Then AdoConnObj.Execute StrDelete



//                    // 'insert using select statement

//                    Strupdate = "Insert into " + Strings.Trim(StrTabName) + DataLink + "(" + FldNames + ") " + ArrTempValues[RowCnt] + " Where " + WhereCondition;

//                    AdoConnObj.Execute(Strupdate, RecAffect);
//                    Strupdate = "";
//                    strUpdateRow = "";

//                    if (RecAffect == 0L)
//                    {
//                        InsertUsingSelectHistRet = "Inwertion Failed due to False Condition ! " + StrTabName;
//                        if (blnLogErrors == true)
//                            ((dynamic)objErrlog).LogError("DataBaseTransactions", "InsertUsingSelectHist", 999, InsertUsingSelectHistRet + ": " + Strupdate);

//                        if (RsTemp.State == 1)
//                            RsTemp.Close();
//                        RsTemp = default;
//                        if (AdoConnObj.State == 1)
//                            AdoConnObj.Close();
//                        AdoConnObj = (object)null;

//                        if (rsHistCol.State == 1)
//                            rsHistCol.Close();
//                        rsHistCol = (object)null;
//                        if (rsHistExt.State == 1)
//                            rsHistExt.Close();
//                        rsHistExt = (object)null;
//                        return InsertUsingSelectHistRet;
//                    }
//                }


//                if (RsTemp.State == 1)
//                    RsTemp.Close();
//                RsTemp = default;
//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;
//                if (rsHistCol.State == 1)
//                    rsHistCol.Close();
//                rsHistCol = (object)null;
//                if (rsHistExt.State == 1)
//                    rsHistExt.Close();
//                rsHistExt = (object)null;


//                InsertUsingSelectHistRet = "Trans Completed";


//                // ''''******************************ERROR HANDLING*****************************************
//                return InsertUsingSelectHistRet;
//            }
//            catch
//            {

//                Variant arrErrSplit;

//                if (blnLogErrors == true)
//                    ((dynamic)objErrlog).LogError("DataBaseTransactions", "InsertUsingSelectHist", Information.Err().Number, Information.Err().Description + StrInsert);

//                if (RsTemp.State == 1)
//                    RsTemp.Close();
//                RsTemp = default;
//                if (AdoConnObj.State == 1)
//                    AdoConnObj.Close();
//                AdoConnObj = (object)null;


//                if (string.IsNullOrEmpty(ConnError))
//                {

//                    // *************Connection Failed************
//                    AdoConnObj = (object)null;
//                    InsertUsingSelectHistRet = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                    InsertUsingSelectHistRet = Strings.Replace(InsertUsingSelectHistRet, "\n", "");
//                    InsertUsingSelectHistRet = Strings.Replace(InsertUsingSelectHistRet, "\r", "");
//                }
//                else
//                {
//                    AdoConnObj = (object)null;
//                    if (string.IsNullOrEmpty(strComponent))
//                    {
//                        strComponent = "DATABASETRANSACTIONS.TRANSACTIONS / InsertUsingSelectHist";
//                    }

//                    if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                    {
//                        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + errDesc;
//                        arrErrSplit = Strings.Split(errDesc, "(");

//                        if (Information.UBound(arrErrSplit) > 0)
//                        {
//                            errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                        }
//                    }



//                    else if (ConnError != "Connected")
//                    {
//                        if (string.IsNullOrEmpty(ErrNum))
//                            ErrNum = "UPDCHK";
//                        errDesc = ConnError;
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + ConnError;
//                    }
//                    else
//                    {
//                        ErrNum = Information.Err().Number.ToString();
//                        errDesc = Information.Err().Description;
//                        clntDesc = "Error ! Records Could Not Be Modified on " + StrTabName + " Due to " + Information.Err().Description;
//                    }
//                    // clntDesc = "Records Could Not Be Modified Due to " & errDesc
//                    objError = Interaction.CreateObject("TrapError.ErrorDescription");
//                    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc, strComponent, BRCode, UserId, MachID);
//                    // ''''*************RecordSet Not oppened************
//                    objError = null;
//                    InsertUsingSelectHistRet = this.ArrError(0, 2);
//                    /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//                }
//            }
//        }

//        private async Task<string> CheckDayBeginDayEndStatus(OracleQueryModel oracleQueryModel)
//        {
//            string CheckDayBeginDayEndStatusRet = string.Empty;
//            string strquery, strtempCode;
//            string[] arrflds;
//            string[] arrChkVal;
//            string[] ArrCond;
//            bool BlnUserMach, blnbrCode;
//            int intArrChk;

//            try
//            {
//                BlnUserMach = false;
//                blnbrCode = false;
//                OracleDataReader RsTemp = null!;

//                // if branchcode parameter not available from the frontend then collect it from the values of the transarray.
//                if (string.IsNullOrEmpty(oracleQueryModel.BranchCode) | string.IsNullOrEmpty(oracleQueryModel.UserId) | string.IsNullOrEmpty(oracleQueryModel.MachineID))
//                {
//                    arrflds = oracleQueryModel.FieldNames.Split(",");

//                    // Insert - if the transaction is insert
//                    if (oracleQueryModel.QueryType == OracleQueryType.Insert)
//                    {
//                        arrChkVal = oracleQueryModel.ArrValues[0].Split(",");

//                        // to trap the userid and machineid position in the values. intArrChk
//                        intArrChk = (arrChkVal.Length - 1) - (arrflds.Length - 1);
//                        strquery = "select * from " + oracleQueryModel.TableName + dataLink + " where 1=2";

//                        RsTemp = await ProcessQuery(strquery);

//                        var loopTo = RsTemp.FieldCount - 1;
//                        for (int i = 0; i <= loopTo; i++)
//                        {
//                            if (RsTemp.GetName(i).Trim().ToUpper() == "USERID" || RsTemp.GetName(i).Trim().ToUpper() == "APPROVEDBY"
//                                || RsTemp.GetName(i).Trim().ToUpper() == "VERIFIEDBY" || RsTemp.GetName(i).Trim().ToUpper() == "MACHINEID"
//                                || RsTemp.GetName(i).Trim().ToUpper() == "APPROVEDMACHINE" || RsTemp.GetName(i).Trim().ToUpper() == "VERIFIEDMACHINE")
//                            {
//                                BlnUserMach = true;
//                            }
//                            else if (RsTemp.GetName(i).Trim().ToUpper() == "BRANCHCODE")
//                            {
//                                blnbrCode = true;
//                            }
//                        }

//                        var loopTo1 = (long)arrflds.Length - 1;
//                        for (int i = 0; i <= loopTo1; i++)
//                        {
//                            if (arrflds[i].Trim().ToUpper() == "BRANCHCODE")
//                            {
//                                strtempCode = arrChkVal[i].Trim().ToUpper();
//                                // MsgBox BRCode
//                                // MsgBox TableName
//                                if (strtempCode[^1].ToString() == "'")
//                                {
//                                    // please do not change the below coding line it gives branch code with out single quotes
//                                    oracleQueryModel.BranchCode = strtempCode.Substring(1, strtempCode.Length - 2);
//                                }
//                                else
//                                {
//                                    oracleQueryModel.BranchCode = strtempCode;
//                                }
//                            }
//                            // MsgBox BRCode
//                            // MsgBox TableName
//                            else if (arrflds[i].Trim().ToUpper() == "USERID")
//                            {
//                                strtempCode = (arrChkVal[i - intArrChk]).Trim().ToUpper();
//                                if (strtempCode[^1].ToString() == "'")
//                                {
//                                    // please do not change the below coding line it gives userid with out single quotes
//                                    oracleQueryModel.UserId = strtempCode.Substring(2, strtempCode.Length - 2);
//                                }
//                            }
//                            else if (arrflds[i].Trim().ToUpper() == "MACHINEID")
//                            {
//                                strtempCode = arrChkVal[i - intArrChk].Trim().ToUpper();
//                                if (strtempCode[^1].ToString() == "'")
//                                {
//                                    // ''''''''''please do not change the below coding line it gives machineid with out single quotes
//                                    oracleQueryModel.MachineID = strtempCode.Substring(2, strtempCode.Length - 2);
//                                }
//                            }
//                        }
//                    }

//                    // if the transaction is update
//                    else if (oracleQueryModel.QueryType == OracleQueryType.Update)
//                    {
//                        arrChkVal = oracleQueryModel.ArrValues[0].Split("~");
//                        if (!string.IsNullOrEmpty(oracleQueryModel.Condition))
//                        {
//                            ArrCond = oracleQueryModel.Condition.Split("|");
//                            strquery = "select * from " + oracleQueryModel.TableName + dataLink + " where " + ArrCond[0];
//                        }
//                        else
//                        {
//                            strquery = "select * from " + oracleQueryModel.TableName + dataLink;
//                        }

//                        RsTemp = await ProcessQuery(strquery);

//                        if (!RsTemp.HasRows)
//                        {
//                            CheckDayBeginDayEndStatusRet = "Records not available for Modification";
//                            // LogError("DataBaseTransactions", "CheckDayBeginDayEndStatus", 999, CheckDayBeginDayEndStatusRet + ": " + strquery);
//                            // ErrNum = "MODCHK";
//                            if (!RsTemp.IsClosed)
//                                RsTemp.Close();
//                            RsTemp = null!;
//                            return CheckDayBeginDayEndStatusRet;
//                        }

//                        // please do not change the below coding lines it gives branch code with out single quotes
//                        var loopTo2 = RsTemp.FieldCount - 1;
//                        for (int i = 0; i <= loopTo2; i++)
//                        {
//                            if (RsTemp.GetName(i).Trim().ToUpper() == "BRANCHCODE")
//                            {
//                                oracleQueryModel.BranchCode = RsTemp.GetString(i).Trim().ToUpper();
//                                blnbrCode = true;
//                            }
//                            else if (RsTemp.GetName(i).Trim().ToUpper() == "USERID" || RsTemp.GetName(i).Trim().ToUpper() == "APPROVEDBY"
//                                || RsTemp.GetName(i).Trim().ToUpper() == "VERIFIEDBY" || RsTemp.GetName(i).Trim().ToUpper() == "MACHINEID"
//                                || RsTemp.GetName(i).Trim().ToUpper() == "APPROVEDMACHINE" || RsTemp.GetName(i).Trim().ToUpper() == "VERIFIEDMACHINE")
//                            {
//                                BlnUserMach = true;
//                            }
//                        }

//                        if (BlnUserMach == true)
//                        {
//                            var loopTo3 = (long)arrflds.Length - 1;
//                            for (int i = 0; i <= loopTo3; i++)
//                            {
//                                if (arrflds[i].Trim().ToUpper() == "USERID" || arrflds[i].Trim().ToUpper() == "APPROVEDBY" || arrflds[i].Trim().ToUpper() == "VERIFIEDBY")
//                                {
//                                    strtempCode = arrChkVal[i].Trim().ToUpper();
//                                    if (strtempCode[^1].ToString() == "'")
//                                    {
//                                        // please do not change the below coding lines it gives userid with out single quotes
//                                        oracleQueryModel.UserId = strtempCode.Substring(1, strtempCode.Length - 2);
//                                    }
//                                }
//                                else if (arrflds[i].Trim().ToUpper() == "MACHINEID" || arrflds[i].Trim().ToUpper() == "APPROVEDMACHINE" || arrflds[i].Trim().ToUpper() == "VERIFIEDMACHINE")
//                                {
//                                    strtempCode = arrChkVal[i].Trim().ToUpper();
//                                    if (strtempCode[^1].ToString() == "'")
//                                    {
//                                        // please do not change the below coding line it gives machineid with out single quotes
//                                        oracleQueryModel.MachineID = strtempCode.Substring(1, strtempCode.Length - 2);
//                                    }
//                                }
//                            }
//                        }
//                    }

//                    // if the transaction is delete or reject
//                    else if (oracleQueryModel.QueryType == OracleQueryType.Delete || oracleQueryModel.QueryType == OracleQueryType.Reject)
//                    {
//                        if (!string.IsNullOrEmpty(oracleQueryModel.Condition))
//                        {
//                            ArrCond = oracleQueryModel.Condition.Split("|");
//                            strquery = "select * from " + oracleQueryModel.TableName + dataLink + " where " + ArrCond[0];
//                        }
//                        else
//                        {
//                            strquery = "select * from " + oracleQueryModel.TableName + dataLink;
//                        }

//                        RsTemp = await ProcessQuery(strquery);

//                        if (!RsTemp.HasRows)
//                        {
//                            CheckDayBeginDayEndStatusRet = "Records not available for Deletion or Rejection.";
//                            // LogError("DataBaseTransactions", "CheckDayBeginDayEndStatus", 999, CheckDayBeginDayEndStatusRet + ": " + strquery);
//                            // ErrNum = "DELREJCHK";

//                            if (!RsTemp.IsClosed)
//                                RsTemp.Close();
//                            RsTemp = null!;
//                            return CheckDayBeginDayEndStatusRet;
//                        }

//                        var loopTo4 = RsTemp.FieldCount - 1;
//                        for (int i = 0; i <= loopTo4; i++)
//                        {
//                            if (RsTemp.GetName(i).Trim().ToUpper() == "BRANCHCODE")
//                            {
//                                oracleQueryModel.BranchCode = RsTemp.GetString(i).Trim().ToUpper();
//                                blnbrCode = true;
//                            }
//                        }
//                    }
//                }

//                // if branchcode is found then check for the dayend or daybegin status else assumed that branch is not implemented.
//                if (blnbrCode == true)
//                {
//                    if (string.IsNullOrEmpty(oracleQueryModel.BranchCode))
//                    {
//                        // ErrNum = "BANKCHK";
//                        CheckDayBeginDayEndStatusRet = "Branch Not Available";
//                    }
//                    else
//                    {
//                        strquery = "select * from GENAPPLICATIONDATEMST where upper(branchcode)='" + oracleQueryModel.BranchCode.ToUpper() + "'";

//                        if (!RsTemp.IsClosed)
//                            RsTemp.Close();

//                        RsTemp = await ProcessQuery(strquery);

//                        int recordCount = 0;
//                        while (RsTemp.Read())
//                        {
//                            recordCount++;
//                        }

//                        if (recordCount > 0)
//                        {
//                            var beginStatus = RsTemp.GetOrdinal("DAYBEGINSTATUS");
//                            var endStatus = RsTemp.GetOrdinal("DAYENDSTATUS");

//                            if (RsTemp.GetString(beginStatus) == "O" && RsTemp.GetString(endStatus) == "N")
//                            {
//                                CheckDayBeginDayEndStatusRet = "CONTINUE";
//                            }
//                            else if (RsTemp.GetString(beginStatus) == "O" && RsTemp.GetString(endStatus) == "O")
//                            {
//                                CheckDayBeginDayEndStatusRet = "Your Branch End Over or Day Begin Not Started. Please Check ! ";
//                                // ErrNum = "DAYBEGCHK";
//                            }
//                            else if (RsTemp.GetString(beginStatus) != "O" && RsTemp.GetString(endStatus) == "O")
//                            {
//                                CheckDayBeginDayEndStatusRet = " Your Branch Day End Over. Please Check !";
//                                // ErrNum = "DAYENDCHK";
//                            }
//                        }
//                        else
//                        {
//                            // ErrNum = "BRANCHCHK";
//                            CheckDayBeginDayEndStatusRet = "Operation of this Branch is not started.";
//                        }
//                    }
//                }
//                else
//                {
//                    CheckDayBeginDayEndStatusRet = "CONTINUE";
//                }
//                if (!RsTemp.IsClosed)
//                    RsTemp.Close();
//                RsTemp = null!;
//            }
//            catch (Exception ex)
//            {
//                //if (blnLogErrors == true)
//                //    LogError("DataBaseTransactions", "CheckDayBeginDayEndStatus", Information.Err().Number, Information.Err().Description);
//                CheckDayBeginDayEndStatusRet = "Error Occurec No: "; // + Information.Err().Number + " " + Information.Err().Description;
//            }
//            return CheckDayBeginDayEndStatusRet;
//        }

//        private static string ProcessError(Exception ex, string connError, string transType)
//        {
//            string[] arrErrSplit;
//            string result = string.Empty;

//            // LogError("DataBaseTransactions", "InsertRecord", Information.Err().Number, Information.Err().Description + StrInsert);

//            if (string.IsNullOrEmpty(connError))
//            {
//                // Connection Failed
//                // result = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
//                result = result.Replace("\n", "").Replace("\r", "");
//            }
//            else
//            {
//                //if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
//                //{
//                //    ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
//                //    errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
//                //    clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " Due to " + errDesc;
//                //    arrErrSplit = Strings.Split(errDesc, "(");

//                //    if (Information.UBound(arrErrSplit) > 0)
//                //    {
//                //        errDesc = UCase(arrErrSplit[0]) + " " + UCase(Strings.Mid(Strings.Trim(arrErrSplit[1]), InStr(1, arrErrSplit[1], ")") + 1));
//                //    }
//                //}
//                //else if (ConnError != "Connected")
//                //{
//                //    if (string.IsNullOrEmpty(ErrNum))
//                //        ErrNum = "INSCHK";
//                //    errDesc = ConnError;
//                //    clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " " + ConnError;
//                //}
//                //else
//                //{
//                //    ErrNum = Information.Err().Number.ToString();`
//                //    errDesc = Information.Err().Description;
//                //    clntDesc = "Error ! Records Could Not Be Inserted into " + StrTabName + " " + Information.Err().Description;
//                //}

//                /// clntDesc = "Records Could Not Be Inserted Due to " & errDesc
//                // ErrorProcess(ErrNum, errDesc, clntDesc, transType, BRCode, UserId, MachID);
//                // *************RecordSet Not oppened************
//                // InsertRecordRet = this.ArrError(0, 2);

//                /// ConnError = "Records Could Not Be Retrieved Due to : " & Err.Number & " : " & Err.Description
//            }
//            return result;
//        }
//    }
//}
