using Banking.Models;
using Banking.Interfaces;
using System.Data;

namespace Banking.Backend
{
    public class DatabaseFactory : IDatabaseService
    {
        private string _dataLink = ""; // "@DBLINK"; // TODO: Move to settings if needed
        private readonly OracleRetryHelper _oracleRetryHelper;
        private readonly TransactionalFactory _transactionalFactory;

        public DatabaseFactory(DatabaseSettings databaseSettings)
        {
            _oracleRetryHelper = new OracleRetryHelper(databaseSettings);
            _transactionalFactory = new TransactionalFactory(databaseSettings);
        }

        public async Task<DataTable> ProcessQueryAsync(string query)
        {
            return await _oracleRetryHelper.ProcessQueryWithRetryAsync(query);
        }

        public async Task<DataTable> SingleRecordSet(string TabName, string FldNames, string wherecondition = "", string OrderClause = "", 
            string BranchCode = "", string UserCode = "", string MachineID = "", string CompName = "")
        {
            DataTable dataTable = null!;

            int subCnt;

            List<string> TableNames;
            List<string> TableAlias;
            List<string> SubQryTabName;
            List<string> tabSubQry;

            var strquery = string.Empty;
            var strTables = string.Empty;
            var BrCode = string.Empty;
            var Userid = string.Empty;
            var MachID = string.Empty;

            string strComponent;

            try
            {
                BrCode = string.IsNullOrWhiteSpace(BranchCode) ? string.Empty : BranchCode.Trim().ToUpper();
                Userid = string.IsNullOrWhiteSpace(UserCode) ? string.Empty : UserCode.Trim().ToUpper();
                MachID = string.IsNullOrWhiteSpace(MachineID) ? string.Empty : MachineID.Trim().ToUpper();
                strComponent = string.IsNullOrWhiteSpace(CompName) ? string.Empty : CompName.Trim().ToUpper();

                TableNames = TabName.Split(',').ToList();

                if (TableNames.Count - 1 < 1)
                {
                    strTables = string.Concat(TableNames[0], " "); //Strings.Trim() + DataLink + " ";
                }
                else
                {
                    strTables = "";
                    for (var ic = 0; ic <= TableNames.Count - 1; ic++)
                    {
                        TableAlias = TableNames[ic].Trim().Split(' ').ToList();

                        // strTables = strTables + TableAlias[0].Trim() + DataLink + " " + TableAlias[1].Trim() + ",";
                        strTables = strTables + TableAlias[0].Trim() + " " + TableAlias[1].Trim() + ",";
                    }

                    strTables = strTables.Substring(0,  strTables.Length - 1);
                }

                string strCondition = "";

                // '''' Cheking for Sub query to concantinate the tablename with dblink
                if (!string.IsNullOrEmpty(wherecondition.Trim()))
                {
                    SubQryTabName = wherecondition.Split(" FROM ").ToList();

                    if (SubQryTabName.Count - 1 > 0) //& !string.IsNullOrEmpty(Strings.Trim(DataLink)))
                    {
                        strCondition = SubQryTabName[0].Trim() + " from ";
                        var loopTo1 = SubQryTabName.Count - 1;
                        for (subCnt = 1; subCnt <= loopTo1; subCnt++)
                        {
                            tabSubQry = SubQryTabName[subCnt].ToUpper().Split(" WHERE ").ToList(); //, , -1);
                            // strCondition = strCondition + Strings.Trim(tabSubQry[0]) + DataLink + " where " + tabSubQry[1] + " ";
                            strCondition = strCondition + tabSubQry[0].Trim() + " where " + tabSubQry[1] + " ";
                            subCnt = subCnt + 1;
                            if (subCnt <= (SubQryTabName.Count - 1))
                            {
                                tabSubQry = SubQryTabName[subCnt].ToUpper().Split(" WHERE ").ToList();  //, " WHERE ", -1);
                                // StrCondition = StrCondition + Strings.Trim(tabSubQry[0]) + DataLink + " where " + tabSubQry[1] + " ";
                                strCondition = strCondition + tabSubQry[0].Trim() + " where " + tabSubQry[1] + " ";
                            }
                        }
                    }
                    else
                    {
                        strCondition = wherecondition;
                    }
                }

                strquery = "";

                if (!string.IsNullOrEmpty(wherecondition.Trim()) & !string.IsNullOrEmpty(OrderClause.Trim()))
                    strquery = "Select " + FldNames + " from  " + strTables + " where " + strCondition + " order by " + OrderClause;
                else if (!string.IsNullOrEmpty(OrderClause.Trim()) & string.IsNullOrEmpty(wherecondition.Trim()))
                    strquery = "Select " + FldNames + " from  " + strTables + " order by " + OrderClause;
                else if (!string.IsNullOrEmpty(wherecondition.Trim()) & string.IsNullOrEmpty(OrderClause.Trim()))
                    strquery = "Select " + FldNames + " from  " + strTables + " where " + strCondition;
                else if (string.IsNullOrEmpty(wherecondition.Trim()) & string.IsNullOrEmpty(OrderClause.Trim()))
                    strquery = "Select " + FldNames + " from  " + strTables;

                dataTable = await ProcessQueryAsync(strquery);

                if (dataTable.Rows.Count == 0)
                    throw new Exception("Records Could Not Be Retrieved For your Query");

                return dataTable;
            }
            catch (Exception ex)
            {
                //strstack = "Error Number: " + Information.Err().Number + " Error Description: " + Information.Err().Description + " Source: " + Information.Err().Source + " Last Dll Error: " + Information.Err().LastDllError + " Help Context: " + Information.Err().HelpContext + " Help File: " + Information.Err().HelpFile;

                //((dynamic)objErrlog).LogError("QueryRecordsets", "SingleRecordSet", Information.Err().Number, Information.Err().Description + " Stack: " + strstack + "  SQL Query: " + strquery);
                //// 'If AdoConnObj.State = 1 Then AdoConnObj.Close
                //AdoConnObj = (object)null;

                //if (ConnError != "Connected")
                //{
                //    // *************Connection Failed************
                //    if (Information.Err().Number == 0)
                //        ConnError = ConnError;
                //    else
                //        ConnError = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description + " : " + strTables;
                //}
                //else
                //{
                //    if (string.IsNullOrEmpty(strComponent))
                //        strComponent = "QUERYRECORDSETS.FETCHRECORDSET / SINGLERECORDDSET";

                //    if (Information.Err().Number == -2147467259)
                //    {
                //        ErrNum = Information.Err().Number.ToString();
                //        errDesc = Information.Err().Description;
                //        clntDesc = "Oracle Error";
                //    }
                //    else if (Strings.UCase(Strings.Trim(Strings.Left(Information.Err().Description, 3))) == "ORA")
                //    {
                //        ErrNum = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), 1, Strings.InStr(1, Information.Err().Description, ":")));
                //        errDesc = Strings.UCase(Strings.Mid(Strings.Trim(Information.Err().Description), Strings.InStr(1, Information.Err().Description, ":")));
                //        clntDesc = "Oracle Error";
                //    }
                //    else
                //    {
                //        ErrNum = Information.Err().Number.ToString();
                //        errDesc = Information.Err().Description;
                //        clntDesc = "Client Error " + Information.Err().Description;
                //    }
                //    clntDesc = "Records Could Not Be Retrieved Due to " + errDesc + " : " + strTables;
                //    objError = Interaction.CreateObject("TrapError.ErrorDescription");
                //    if (string.IsNullOrEmpty(errDesc))
                //    {
                //        errDesc = "abc";
                //    }
                //    ArrError = ((dynamic)objError).ErrorProcess(ErrNum, errDesc, clntDesc + " : Stack : " + Strings.Replace(strstack, "'", "''") + " SQL Query :  " + Strings.Replace(strquery, "'", "''"), strComponent, BrCode, Userid, MachID);
                //    // ''''*************RecordSet Not oppened************
                //    objError = null;
                //    ReDim Me.ArrError(0, 2)
                //    ConnError = this.ArrError(0, 2) + " : " + strTables;
                //}
            }

            return dataTable;
        }

        public async Task<string> ProcessDataTransactions(string[,] TransDataArray, string BranchCode = "", string UserCode = "",
            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "",
            string glcode = "", string moduleid = "")
        {
            string DataTransactionsRet = string.Empty;

            string[,] DataArray;
            string[] ArrRowValues = new string[1];
            string TabFldValues;
            string StrFld;
            string StrTabName;
            string TabWhereCondition;
            string TransResult = string.Empty;
            string AutoCondition;
            string AutoConditioninit = string.Empty;
            string Autoflds;
            string AutoNumValue = string.Empty;
            string AutoNumValueInit = string.Empty;
            string AccNoPrefix;
            string AccNoSuffix;
            string ActualAccNo;
            string AutoFldNames;
            string[] AutoType;
            string AutoPmtCond;
            DataTable Rsnfts;
            DataTable RsAutoPmt;
            DataTable Rstemp;
            int intaccnolen, transcount;

            try
            {
                string BRCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper();
                string UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper();
                string MachID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper();
                string applicationDate = string.Format(string.IsNullOrWhiteSpace(ApplicationDate) ? DateTime.Now.ToString() : ApplicationDate, "dd-MMM-yyyy");

                //glcode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(glcode))), "", Strings.UCase(Strings.Trim(glcode))));
                //moduleid = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(moduleid))), "", Strings.UCase(Strings.Trim(moduleid))));
                //objQuery = ObjContext.CreateInstance("QueryRecordsets.FetchRecordsets");
                //ObjTrans = ObjContext.CreateInstance("DataBaseTransactions.TransactionMethods");

                //Rstemp = Interaction.CreateObject("ADODB.Recordset");
                //Rsnfts = Interaction.CreateObject("adodb.recordset");

                Autoflds = "";
                AutoNumValue = "";
                AutoNumValueInit = "";
                AutoFldNames = "";
                AccNoPrefix = "";
                AccNoSuffix = "";
                ActualAccNo = "";
                DataArray = TransDataArray;

                for (transcount = 0; transcount < DataArray.GetLength(0); transcount++)
                {
                    if (DataArray[transcount, 0] == "A")
                    {
                        AutoType = DataArray[transcount, 1].Split("|");

                        // Aquireing all the parameters for Auto number generation from GENAUTONUMBERPMT table
                        AutoPmtCond = AutoType[1];
                        RsAutoPmt = await SingleRecordSet("GENAUTONUMBERPMT", "*", AutoPmtCond);

                        if (RsAutoPmt.Rows.Count == 0)
                        {
                            DataTransactionsRet = "Parameters for the AccountNo to be specified";
                            return DataTransactionsRet;
                        }

                        AutoCondition = DataArray[transcount, 4] + " FOR UPDATE";
                        Rstemp = await SingleRecordSet("GENAUTONUMMAX", "*", AutoCondition);
                        if (Rstemp.Rows.Count != 0)
                        {
                            AutoNumValueInit = Convert.ToString(Rstemp.Rows[0]["MAXAUTONUM"]) ?? string.Empty;
                            AutoConditioninit = DataArray[transcount, 4];
                        }

                        AutoCondition = DataArray[transcount, 4];

                        if (AutoType[0].Trim().ToUpper() == "GETAUTONUMBER")
                        {
                            AutoNumValue = await GetAutoNumberAsync("GENAUTONUMMAX", "MAXAUTONUM", AutoCondition, Convert.ToString(RsAutoPmt.Rows[0]["InitialValue"]) ?? string.Empty);
                        }
                        else if (AutoType[0].Trim().ToUpper() == "GETAUTOTEXT")
                        {
                            AutoNumValue = await GetAutoTextAsync("GENAUTONUMMAX", "MAXAUTONUM", Convert.ToString(RsAutoPmt.Rows[0]["InitialValue"]) ?? string.Empty, AutoCondition);
                        }
                        else if (AutoType[0].Trim().ToUpper() == "GETMAXACCOUNTNO")
                        {
                            AutoNumValue = await GetMaxAccountNoAsync("GENAUTONUMMAX", "MAXAUTONUM", AutoCondition, Convert.ToString(RsAutoPmt.Rows[0]["InitialValue"]) ?? string.Empty);
                        }

                        if (AutoNumValue.Substring(1, 5) == "ERROR")
                        {
                            AutoNumValue = AutoNumValue.Replace("\n", "");
                            AutoNumValue = AutoNumValue.Replace("\r", "");
                            DataTransactionsRet = AutoNumValue;
                            return DataTransactionsRet;
                        }

                        // If ((AutoNumValue = CStr(RsAutoPmt!InitialValue)) Or (AutoNumValue = Val(Rstemp!maxautonum) + 1)) Then

                        if ((AutoNumValue ?? "") == (Convert.ToString(RsAutoPmt.Rows[0]["InitialValue"]) ?? string.Empty))
                        {
                            Autoflds = DataArray[transcount, 2] + ",MAXAUTONUM";
                            ArrRowValues[0] = DataArray[transcount, 3] + "," + AutoNumValue;

                            TransResult = "";
                            TransResult = await _transactionalFactory.InsertRecord("GENAUTONUMMAX", Autoflds, ArrRowValues, BRCode, UserId, MachID, applicationDate, "N");

                            if (TransResult != "Transaction Completed")
                            {
                                DataTransactionsRet = TransResult.Replace("\n", "").Replace("\r", "");
                                return DataTransactionsRet;
                            }
                        }
                        else
                        {
                            ArrRowValues[0] = AutoNumValue ?? string.Empty;

                            Autoflds = "MAXAUTONUM";
                            AutoCondition = DataArray[transcount, 4];

                            // TransResult = await ModifyQueriedTrans("GENAUTONUMMAX", Autoflds, ArrRowValues, AutoCondition, BRCode, UserId, MachID);

                            if (TransResult != "Trans Completed")
                            {
                                DataTransactionsRet = TransResult.Replace("\n", "").Replace("\r", "");
                                return DataTransactionsRet;
                            }
                        }

                        Rsnfts = await SingleRecordSet("genbankparm", "NFTSCONVYN", "");

                        if (Rsnfts.Rows.Count != 0)
                        {
                            if (Convert.ToString(Rsnfts.Rows[0]["NFTSCONVYN"]) == "Y")  // nfts conversion 16 digits
                            {
                                if (moduleid == "SB" | moduleid == "CA" | moduleid == "CC" | moduleid == "DEP" | moduleid == "LOAN" | moduleid == "LOCKER" | moduleid == "SHARES")
                                {
                                    intaccnolen = (AutoNumValue ?? string.Empty).Length; // 'vinod
                                    if (intaccnolen == 16)
                                    {
                                        AutoNumValue = AutoNumValue ?? string.Empty;
                                    }
                                    else
                                    {
                                        if (intaccnolen == 1)
                                        {
                                            AutoNumValue = "000000" + AutoNumValue;
                                        }
                                        else if (intaccnolen == 2)
                                        {
                                            AutoNumValue = "00000" + AutoNumValue;
                                        }
                                        else if (intaccnolen == 3)
                                        {
                                            AutoNumValue = "0000" + AutoNumValue;
                                        }
                                        else if (intaccnolen == 4)
                                        {
                                            AutoNumValue = "000" + AutoNumValue;
                                        }
                                        else if (intaccnolen == 5)
                                        {
                                            AutoNumValue = "00" + AutoNumValue;
                                        }
                                        else if (intaccnolen == 6)
                                        {
                                            AutoNumValue = "0" + AutoNumValue;
                                        }
                                        else if (intaccnolen == 7)
                                        {
                                            AutoNumValue = AutoNumValue ?? string.Empty;
                                        }
                                        AutoNumValue = BRCode + glcode + AutoNumValue;
                                    }
                                }
                            } // MODULE ID END
                        } // NFTS CONV END

                        AccNoPrefix = Convert.ToString(RsAutoPmt.Rows[0]["Prefixvalue"]) + "";
                        AccNoSuffix = Convert.ToString(RsAutoPmt.Rows[0]["suffixvalue"]) + "";
                        ActualAccNo = AutoNumValue ?? string.Empty;
                        AutoNumValue = Convert.ToString(RsAutoPmt.Rows[0]["Prefixvalue"]) + AutoNumValue + Convert.ToString(RsAutoPmt.Rows[0]["suffixvalue"]);
                    }
                }

                // *************Transaction Started***************
                for (transcount = 0; transcount < DataArray.GetLength(0); transcount++)
                {
                    StrTabName = DataArray[transcount, 1];
                    StrFld = DataArray[transcount, 2];
                    TabFldValues = DataArray[transcount, 3];
                    ArrRowValues = TabFldValues.Split("|");

                    TabWhereCondition = DataArray[transcount, 4];

                    if (DataArray[transcount, 0].Trim().ToUpper() == "I")
                    {
                        /// ************For Insert****************
                        if (!string.IsNullOrEmpty(Autoflds.Trim()))
                        {
                            // StrFld = StrFld & "," & Autoflds
                            AutoFldNames = "";
                            StrTabName = StrTabName.Trim().ToUpper();

                            if (StrTabName == "SBMST" | StrTabName == "CAMST" | StrTabName == "LOANMST" | StrTabName == "DEPMST" | StrTabName == "LGMST" | StrTabName == "LOCKERMST" | StrTabName == "FXLGMST" | StrTabName == "FXBILLSMST" | StrTabName == "FXDEPMST" | StrTabName == "CCMST" | StrTabName == "LCMST" | StrTabName == "FXLOANSMST" | StrTabName == "FXLCMST" | StrTabName == "FXFCMST")
                            {
                                AutoFldNames = ",PREFIXVALUE, SUFFIXVALUE, ActualAccNo";
                                StrFld = StrFld + AutoFldNames;
                            }

                            var loopTo2 = ArrRowValues.Length - 1;
                            for (int RowCnt = 0; RowCnt <= loopTo2; RowCnt++)
                            {
                                ArrRowValues[RowCnt] = ArrRowValues[RowCnt] + ",'" + AutoNumValue + "'";
                                if (!string.IsNullOrEmpty(AutoFldNames))
                                {
                                    ArrRowValues[RowCnt] = ArrRowValues[RowCnt] + ",'" + AccNoPrefix + "','" + AccNoSuffix + "','" + ActualAccNo + "'";
                                }
                            }
                        }
                        TransResult = "";
                        TransResult = await _transactionalFactory.InsertRecord(StrTabName, StrFld, ArrRowValues, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    }
                    //else if (DataArray[transcount, 0].Trim().ToUpper() == "BI")
                    //{
                    //    /// ************For Bulk Insertion****************
                    //    TransResult = "";
                    //    TransResult = await _transactionalFactory.BulkInsert(StrTabName, StrFld, DataArray[transcount, 3], BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    //}
                    //else if (DataArray[transcount, 0].Trim().ToUpper() == "U")
                    //{
                    //    /// ************For Update****************
                    //    if (!string.IsNullOrEmpty(Autoflds.Trim()))
                    //    {
                    //        // StrFld = StrFld & "," & Autoflds
                    //        var loopTo3 = ArrRowValues.Length - 1;
                    //        for (int RowCnt = 0; RowCnt <= loopTo3; RowCnt++)
                    //            ArrRowValues[RowCnt] = ArrRowValues.ElementAtOrDefault(RowCnt) + "~'" + AutoNumValue + "'";
                    //    }
                    //    TransResult = await _transactionalFactory.UpdateRecord(StrTabName, StrFld, ArrRowValues, TabWhereCondition, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    //}
                    //else if (DataArray[transcount, 0].Trim().ToUpper() == "D")
                    //{
                    //    /// ************For Delete****************
                    //    TransResult = await _transactionalFactory.DeleteRecord(StrTabName, TabWhereCondition, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    //}
                    //else if (DataArray[transcount, 0].Trim().ToUpper() == "R")
                    //{
                    //    /// ************For Rejection****************
                    //    TransResult = await _transactionalFactory.RejectRecord(StrTabName, TabWhereCondition, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    //}
                    //else if (DataArray[transcount, 0].Trim().ToUpper() == "SI")
                    //{
                    //    /// ************For Insertion using a Select statement ****************
                    //    TransResult = await _transactionalFactory.InsertUsingSelect(StrTabName, StrFld, ArrRowValues, TabWhereCondition, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    //}

                    // TransResult = "trans1"
                    if (TransResult.Trim() != "Transaction Completed")
                        throw new Exception();
                }

                DataTransactionsRet = (!string.IsNullOrEmpty(AutoNumValue)) ? "Transaction Sucessful.|" + AutoNumValue : "Transaction Sucessful.";
            }
            catch (Exception ex)
            {
                if (!string.IsNullOrEmpty(AutoNumValueInit))
                {
                    string[] ArrRowValuesInit = [AutoNumValueInit];
                    //string TransResult2 = await ModifyQueriedTrans("GENAUTONUMMAX", "MAXAUTONUM", ArrRowValuesInit, AutoConditioninit, BranchCode, UserCode, MachineID);
                }

                if (!string.IsNullOrEmpty(TransResult.Trim()))
                {
                    // *************Connection Failed************
                    DataTransactionsRet = TransResult.Replace("\n", "").Replace("\r", "");
                }
                else
                {
                    //DataTransactionsRet = Information.Err().Number + Information.Err().Description;
                    DataTransactionsRet = DataTransactionsRet.Replace("\n", "").Replace("\r", "");
                }
            }

            return DataTransactionsRet;
        }

        //public async Task<string> ModifyQueriedTrans(string TableName, string FldNames, string[] ArrValues, string wherecondition = "", string BranchCode = "",
        //    string UserCode = "", string MachineID = "")
        //{
        //    string ModifyQueriedTransRet = "";

        //    string[] ArrTempValues, ArrRowValue, ArrFlds;
        //    string strquery;
        //    string Strupdate;
        //    string StrInsert;

        //    var strUpdateRow = "";
        //    string[] StrCondition;
        //    string StrTabName;
        //    string StrFields;

        //    try
        //    {
        //        ArrTempValues = ArrValues;
        //        StrTabName = TableName.Trim().ToUpper();
        //        StrFields = FldNames;

        //        string BRCode = string.IsNullOrWhiteSpace(BranchCode.Trim().ToUpper()) ? "" : BranchCode.Trim().ToUpper();
        //        string UserId = string.IsNullOrWhiteSpace(UserCode.Trim().ToUpper()) ? "" : UserCode.Trim().ToUpper();
        //        string MachID = string.IsNullOrWhiteSpace(MachineID.Trim().ToUpper()) ? "" : MachineID.Trim().ToUpper();

        //        // Spliting the conditions For Different Rows
        //        StrCondition = wherecondition.Split("|");

        //        if (string.IsNullOrEmpty(wherecondition.Trim()))
        //        {
        //            StrCondition[0] = "";
        //        }

        //        var loopTo = ArrTempValues.Length - 1;
        //        for (int RowCnt = 0; RowCnt <= loopTo; RowCnt++)
        //        {
        //            // First passing the data into history tables based on the type of tables.
        //            if ((StrCondition.Length - 1) == (ArrTempValues.Length - 1))
        //            {
        //                if (StrTabName.Substring(0, StrTabName.Length - 3) == "MST" || StrTabName.Substring(0, StrTabName.Length - 3) == "TRN")
        //                    StrInsert = "Insert into " + StrTabName.Trim() + "HIST" + DataLink + " select * from " + StrTabName + "" + DataLink + " Where " + StrCondition[RowCnt];
        //                else if (StrTabName.Substring(0, StrTabName.Length - 3) == "LOG")
        //                    StrInsert = "Insert into " + StrTabName.Trim() + "DEM" + DataLink + " select * from " + StrTabName + "" + DataLink + " Where " + StrCondition[RowCnt];
        //                else
        //                    StrInsert = "";
        //                strquery = "select " + StrFields + " from " + StrTabName.Trim() + DataLink + " where " + StrCondition[RowCnt] + " for update";
        //            }
        //            else
        //            {
        //                if (StrTabName.Substring(0, StrTabName.Length - 3) == "MST" || StrTabName.Substring(0, StrTabName.Length - 3) == "TRN")
        //                    StrInsert = "Insert into " + StrTabName.Trim() + "HIST" + DataLink + " select * from " + StrTabName + "" + DataLink + "";
        //                else if (StrTabName.Substring(0, StrTabName.Length - 3) == "LOG")
        //                    StrInsert = "Insert into " + StrTabName.Trim() + "DEM" + DataLink + " select * from " + StrTabName + "" + DataLink + "";
        //                else
        //                    StrInsert = "";
        //                strquery = "select " + StrFields + " from " + StrTabName.Trim() + DataLink + " for update";
        //            }

        //            if (!string.IsNullOrEmpty(StrInsert.Trim()))
        //                await ProcessQuery(StrInsert);

        //            // AdoConnObj.Execute strquery
        //            // Spliting the Collumn Names (Fields) to build the Update Statement

        //            ArrFlds = StrFields.Split(",");

        //            // Spliting the Collumn Values (Fields Values) to build the Update Statement
        //            ArrRowValue = ArrTempValues[RowCnt].Split("~");

        //            // First concantinating the values for update
        //            var loopTo1 = ArrFlds.Length - 1;
        //            for (int ColCnt = 0; ColCnt <= loopTo1; ColCnt++)
        //                strUpdateRow = strUpdateRow + ArrFlds[ColCnt] + "=" + ArrRowValue[ColCnt] + ",";

        //            // Now building the The Update statement
        //            // If StrCondition(RowCnt) <> "" Then
        //            if ((StrCondition.Length - 1) == (ArrTempValues.Length - 1))
        //            {
        //                Strupdate = "update " + StrTabName + "" + DataLink + " set " + strUpdateRow.Substring(0, strUpdateRow.Length - 1) + " where " + StrCondition[RowCnt];
        //            }
        //            else
        //            {
        //                Strupdate = "update " + StrTabName + "" + DataLink + " set " + strUpdateRow.Substring(0, strUpdateRow.Length - 1);
        //            }

        //            // Executing the update statement Based On Number of Rows
        //            var result = await ProcessQuery(Strupdate);

        //            Strupdate = "";
        //            strUpdateRow = "";

        //            if (result.Count == 0)
        //            {
        //                ModifyQueriedTransRet = "Update Failed due to False Condition !";
        //                return ModifyQueriedTransRet;
        //            }
        //        }
        //        ModifyQueriedTransRet = "Transaction Completed";
        //        return ModifyQueriedTransRet;
        //    }
        //    catch
        //    {
        //        //strstack = "Error Number: " + Information.Err().Number + " Error Description: " + Information.Err().Description + " Source: " + Information.Err().Source + " Last Dll Error: " + Information.Err().LastDllError + " Help Context: " + Information.Err().HelpContext + " Help File: " + Information.Err().HelpFile;
        //        //LogError("QueryRecordsets", "ModifyQueriedTrans", Information.Err().Number, Information.Err().Description + " : Stack : " + strstack + " : SQL Query : " + strquery + " : Insert : " + StrInsert + " : Update : " + Strupdate);
        //        //ModifyQueriedTransRet = "Records Could Not Be Updated Due to : " + Information.Err().Number + " : " + Information.Err().Description + " ! " + StrTabName;
        //        ModifyQueriedTransRet = ModifyQueriedTransRet.Replace("\n", "").Replace("\r", "");
        //    }

        //    return ModifyQueriedTransRet;
        //}

        //public async Task<string> Modify(bool BlnModify, string[] arrTabDetails = null!)
        //{
        //    string ModifyRet = string.Empty;
        //    string[] arrTran;
        //    string strquery;

        //    try
        //    {
        //        if (BlnModify == true)
        //        {
        //            arrTran = arrTabDetails;
        //            if ((arrTran.Length - 1) > 1)
        //            {
        //                strquery = " update " + arrTran[0].Trim() + DataLink + " set " + arrTran[1].Trim() + " where " + arrTran[2];
        //            }
        //            else
        //            {
        //                strquery = " update " + arrTran[0].Trim() + DataLink + " set " + arrTran[1].Trim();
        //            }

        //            var result = await ProcessQuery(strquery);

        //            if (result.Count > 0)
        //            {
        //                ModifyRet = "Modification Completed";
        //            }
        //            else
        //            {
        //                ModifyRet = " Modification Aborted due to false condition.";
        //            }
        //        }
        //        else
        //        {
        //            ModifyRet = "Modification Canceled";
        //        }
        //    }
        //    catch
        //    {
        //        //strstack = "Error Number: " + Information.Err().Number + " Error Description: " + Information.Err().Description + " Source: " + Information.Err().Source + " Last Dll Error: " + Information.Err().LastDllError + " Help Context: " + Information.Err().HelpContext + " Help File: " + Information.Err().HelpFile;
        //        //LogError("QueryRecordsets", "Modify", Information.Err().Number, Information.Err().Description + " : Stack : " + strstack + " :  Update : " + strquery);
        //        // ModifyRet = Information.Err().Number + Information.Err().Description;

        //        ModifyRet = ModifyRet.Replace("\n", "").Replace("\r", "");
        //    }
        //    return ModifyRet;
        //}

        public async Task<string> GetAutoNumberAsync(string TabName, string AutoNumFldName, string WhereCondition = "", string InitialNum = "")
        {
            DataTable Rstemp = null!;

            int IntLen, IntFldLen;
            string GetAutoNumberRet = string.Empty;
            string strQuery, AutoFieldName, StrTabName, strCondition, strPrefix;

            try
            {
                StrTabName = TabName.Trim();
                AutoFieldName = AutoNumFldName.Trim();
                strCondition = WhereCondition.Trim();

                strQuery = "";
                strQuery = "nvl(max(to_number(" + AutoFieldName + ")),0)";
                if (!string.IsNullOrEmpty(WhereCondition.Trim()))
                    Rstemp = await SingleRecordSet(StrTabName.Trim(), strQuery, WhereCondition);
                else
                    Rstemp = await SingleRecordSet(StrTabName.Trim(), strQuery);

                if (Rstemp.Rows.Count == 0)
                    return GetAutoNumberRet;

                if (Rstemp.Rows.Count != 0)
                {
                    //if (string.IsNullOrEmpty(InitialNum.Trim()))
                    //    GetAutoNumberRet = Convert.ToString(Rstemp.GetInt32(0) + 1);
                    //else if (Rstemp.GetInt32(0) == 0)
                    //    GetAutoNumberRet = InitialNum;
                    //else
                    //{
                    //    IntLen = InitialNum.Length;
                    //    IntFldLen = Rstemp.GetString(0).Length + 1;
                    //    strPrefix = "";
                    //    if (IntFldLen < IntLen)
                    //    {
                    //        var loopTo = IntLen - IntFldLen;
                    //        for (int i = 1; i <= loopTo; i++)
                    //            strPrefix = strPrefix + "0";
                    //    }

                    //    GetAutoNumberRet = strPrefix + Convert.ToString(Rstemp.GetInt32(0) + 1);
                    //}
                }
                else if (string.IsNullOrEmpty(InitialNum.Trim()))
                    GetAutoNumberRet = 1.ToString();
                else
                    GetAutoNumberRet = InitialNum;
            }
            catch
            {
                // GetAutoNumberRet = Conversions.ToString("Auto Number Could Not Be Generated Due To Error: Err().Number : Err().Description");
                GetAutoNumberRet = GetAutoNumberRet.Replace("\n", "");
                GetAutoNumberRet = GetAutoNumberRet.Replace("\r", "");
            }

            return GetAutoNumberRet;
        }

        public async Task<string> GetAutoTextAsync(string TabName, string AutoNumFldName, string InitialAutoText, string WhereCondition = "")
        {
            DataTable Rstemp = null!;

            int Txtlen;
            string GetAutoTextRet = string.Empty;
            string StrQuery, AutoFieldName, StrTabName, strCondition, StrAlfhaText, StrAutoText, StrInitialChar;

            try
            {
                StrTabName = TabName.Trim();
                AutoFieldName = AutoNumFldName.Trim();
                strCondition = string.IsNullOrWhiteSpace(WhereCondition.Trim()) ? "" : WhereCondition.Trim();
                StrAlfhaText = InitialAutoText.Trim().ToUpper();
                Txtlen = StrAlfhaText.Length;

                StrQuery = "";
                StrQuery = "nvl(max(upper(" + AutoFieldName + ")),'')";

                if (!string.IsNullOrEmpty(WhereCondition.Trim()))
                {
                    Rstemp = await SingleRecordSet(StrTabName.Trim(), StrQuery, WhereCondition);
                }
                else
                {
                    Rstemp = await SingleRecordSet(StrTabName.Trim(), StrQuery);
                }

                if (Rstemp.Rows.Count == 0)
                {
                    return GetAutoTextRet;
                }

                StrAutoText = "";
                if (Rstemp.Rows.Count != 0)
                {
                    StrAutoText = StrAlfhaText;
                }
                else
                {
                    //StrInitialChar = StrAlfhaText.Substring(0, 1);
                    //StrAlfhaText = Rstemp.GetString(0).Trim().ToUpper();
                    //for (int i = Txtlen; i >= 1; i -= 1)
                    //{
                    //    if (StrAlfhaText[i - 1] < 'Z')
                    //    {
                    //        StrAutoText = StrAlfhaText.Substring(0, i - 1) + (char)(StrAlfhaText[i - 1] + 1);
                    //        if (StrAutoText.Length < Txtlen)
                    //        {
                    //            var loopTo = Txtlen - StrAutoText.Length;
                    //            for (int j = 1; j <= loopTo; j++)
                    //                StrAutoText = StrAutoText + StrInitialChar;
                    //        }
                    //        break;
                    //    }
                    //}
                }
                GetAutoTextRet = StrAutoText;
            }
            catch
            {
                // GetAutoTextRet = Conversions.ToString("Auto Number Could Not Be Generated Due To Error: Err().Number : Err().Description");
                GetAutoTextRet = GetAutoTextRet.Replace("\n", "");
                GetAutoTextRet = GetAutoTextRet.Replace("\r", "");
            }
            return GetAutoTextRet;
        }

        public async Task<string> GetMaxAccountNoAsync(string TabName, string AccFldName, string WhereCondition = "", string InitialAutoText = "")
        {
            DataTable Rstemp = null!;
            string GetMaxAccountNoRet = string.Empty;
            string AutoFieldName, StrTabName, strCondition, strPrevAccno;

            try
            {
                StrTabName = TabName.Trim();
                AutoFieldName = AccFldName.Trim();
                strCondition = WhereCondition.Trim();

                // string StrQuery = "accno";
                if (!string.IsNullOrEmpty(WhereCondition.Trim()))
                    Rstemp = await SingleRecordSet(StrTabName.Trim(), AutoFieldName, WhereCondition, AutoFieldName);
                else
                    Rstemp = await SingleRecordSet(StrTabName.Trim(), AutoFieldName, string.Empty, AutoFieldName);

                if (Rstemp.Rows.Count == 0)
                {
                    return string.IsNullOrEmpty(InitialAutoText) ? 1.ToString() : InitialAutoText;
                }

                //Rstemp.NextResult();
                //strPrevAccno = Rstemp.GetString(0) + 1;
                //Rstemp.NextResult();
                //while (Rstemp.HasRows)
                //{
                //    if (Rstemp.GetString(0) == strPrevAccno)
                //    {
                //        strPrevAccno = Rstemp.GetString(0) + 1;
                //        Rstemp.NextResult();
                //    }
                //    else
                //    {
                //        break;
                //    }
                //}
                //GetMaxAccountNoRet = strPrevAccno;
            }
            catch
            {
                // GetMaxAccountNoRet = Information.Err().Number + " : " + Information.Err().Description;
                GetMaxAccountNoRet = GetMaxAccountNoRet.Replace("\n", "");
                GetMaxAccountNoRet = GetMaxAccountNoRet.Replace("\r", "");
            }
            return GetMaxAccountNoRet;
        }

        //public Variant RecordsetCollection(string[] ArrRecRS)
        //{
        //    Variant RecordsetCollectionRet = default;
        //    string[] TempArr;
        //    string strquery;
        //    int recAff;
        //    try
        //    {
        //        // Fetching the multiple Recordsets.
        //        TempArr = ArrRecRS;

        //        AdoRs = new ADODB.Recordset[Information.UBound(TempArr) + 1];

        //        var loopTo = TempArr.Length - 1;
        //        for (int i = 0; i <= loopTo; i++)
        //        {
        //            strquery = "";
        //            OracleDataReader AdoRs[i];
        //            strquery = "Select " + TempArr(i, 1) + " from  " + TempArr(i, 0) + DataLink + " where " + TempArr(i, 2);
        //            AdoRs[i].Open(strquery, AdoConnObj, adOpenDynamic, adLockOptimistic);
        //        }

        //        RecordsetCollectionRet = AdoRs;

        //        var loopTo1 = Information.UBound(TempArr);
        //        for (int i = 0; i <= loopTo1; i++)
        //            AdoRs[ICount].ActiveConnection = null!;

        //        return RecordsetCollectionRet;
        //    }
        //    catch
        //    {
        //        //if (string.IsNullOrEmpty(ConnError))
        //        //    ConnError = "Connection Failed Due to : " + Information.Err().Number + " : " + Information.Err().Description;
        //        //else
        //        //    ConnError = "Records Could Not Be Retrieved Due to : " + Information.Err().Number + " : " + Information.Err().Description;
        //        //LogError("QueryRecordsets", "RecordsetCollection", Information.Err().Number, Information.Err().Description);
        //    }

        //    return RecordsetCollectionRet;
        //}
    }
}
