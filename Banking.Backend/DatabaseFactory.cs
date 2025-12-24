using Banking.Interfaces;
using Banking.Models;
using Oracle.ManagedDataAccess.Client;

namespace Banking.Backend
{
    public class DatabaseFactory : IDatabaseService
    {
        private readonly DatabaseSettings _databaseSettings;

        public DatabaseFactory(DatabaseSettings databaseSettings)
        {
            _databaseSettings = databaseSettings;
            OracleRetryHelper.Initialize(_databaseSettings.ConnectionString);
        }

        public async Task<OracleDataReader> ProcessQuery(string query)
        {
            return await OracleRetryHelper.ProcessQueryAsync(query);
        }

        public async Task<OracleDataReader> SingleRecordSet(string TabName, string FldNames, string wherecondition = "", string OrderClause = "", 
            string BranchCode = "", string UserCode = "", string MachineID = "", string CompName = "")
        {
            OracleDataReader oracleDataReader = null!;

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

                oracleDataReader = await OracleRetryHelper.ProcessQueryAsync(strquery);

                if (oracleDataReader.IsClosed)
                    throw new Exception("Records Could Not Be Retrieved For your Query");

                return oracleDataReader;
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

            return oracleDataReader;
        }

        public string ProcessDataTransactions(string[,] TransDataArray, string BranchCode = "", string UserCode = "",
            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "",
            string glcode = "", string moduleid = "")
        {
            string DataTransactionsRet = string.Empty;
            return DataTransactionsRet;

            //string[,] DataArray;
            //string[,] ArrRowValues;
            ////var ArrRowValuesinit = null!;
            //string TabFldValues;
            //string StrFld;
            //string StrTabName;
            //string TabWhereCondition;
            //int transcount;
            //var TransResult = default(string);
            //string TransResult2;
            //string AutoCondition;
            //var AutoConditioninit = default(string);
            //string Autoflds;
            //string Autofldsinit;
            //string AutoNumValue;
            //string AutoNumValueinit;
            //string AccNoPrefix;
            //string AccNoSuffix;
            //string ActualAccNo;
            //string AutoFldNames;
            //string[] AutoType;
            //Variant AutoPmt;
            //string AutoPmtCond;
            //OracleDataReader RsBankPmt;
            //OracleDataReader Rsnfts; // 'vinod
            //string strnfts; // 'vinod
            //int RowCnt;
            //OracleDataReader RsAutoPmt;
            //OracleDataReader Rstemp;
            //string startDate;
            //string InitialiseDate;
            //string InitialValue;
            //object ObjDate;
            //string strDateRes;
            //int intaccnolen;  // 'VINOD

            //try
            //{
            //    //ObjContext = GetObjectContext;
            //    //DataArray = TransDataArray;
            //    //BRCode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(BranchCode))), "", Strings.UCase(Strings.Trim(BranchCode))));
            //    //UserId = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(UserCode))), "", Strings.UCase(Strings.Trim(UserCode))));
            //    //MachID = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(MachineID))), "", Strings.UCase(Strings.Trim(MachineID))));
            //    //AppDate = Conversions.ToString(Interaction.IIf(IsNull(Strings.Trim(AppDate)), Strings.Format(DateTime.Now, "dd-MMM-yyyy"), Strings.Format(ApplicationDate, "dd-MMM-yyyy")));
            //    //glcode = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(glcode))), "", Strings.UCase(Strings.Trim(glcode))));
            //    //moduleid = Conversions.ToString(Interaction.IIf(IsNull(Strings.UCase(Strings.Trim(moduleid))), "", Strings.UCase(Strings.Trim(moduleid))));
            //    //objQuery = ObjContext.CreateInstance("QueryRecordsets.FetchRecordsets");
            //    //ObjTrans = ObjContext.CreateInstance("DataBaseTransactions.TransactionMethods");

            //    //Rstemp = Interaction.CreateObject("ADODB.Recordset");
            //    //Rsnfts = Interaction.CreateObject("adodb.recordset");

            //    Autoflds = "";
            //    AutoNumValue = "";
            //    AutoNumValueinit = "";
            //    AutoFldNames = "";
            //    AccNoPrefix = "";
            //    AccNoSuffix = "";
            //    ActualAccNo = "";

            //    var loopTo = Information.UBound(DataArray);
            //    for (transcount = 0; transcount <= loopTo; transcount++)
            //    {
            //        if (DataArray[transcount, 0] == "A")
            //        {
            //            AutoType = DataArray[transcount, 1].Split("|");

            //            // Aquireing all the parameters for Auto number generation from GENAUTONUMBERPMT table

            //            AutoPmtCond = AutoType[1];
            //            RsAutoPmt = SingleRecordSet("GENAUTONUMBERPMT", "*", AutoPmtCond).Result;

            //            // '''' MsgBox objQuery.ConnError

            //            if (!RsAutoPmt.HasRows)
            //            {
            //                DataTransactionsRet = "Parameters for the AccountNo to be specified";
            //                return DataTransactionsRet;
            //            }
            //            InitialValue = "";
            //            strDateRes = "";

            //            AutoCondition = DataArray[transcount, 4] + " FOR UPDATE";
            //            Rstemp = SingleRecordSet("GENAUTONUMMAX", "*", AutoCondition).Result;
            //            if (Rstemp.HasRows)
            //            {
            //                int cnt = Rstemp.GetOrdinal("MAXAUTONUM");
            //                AutoNumValueinit = Rstemp.GetString(cnt);
            //                AutoConditioninit = DataArray[transcount, 4];
            //            }

            //            TransResult = "";
            //            AutoCondition = DataArray[transcount, 4];

            //            if (AutoType[0].Trim().ToUpper() == "GETAUTONUMBER")
            //            {
            //                int cnt = Rstemp.GetOrdinal("InitialValue");
            //                AutoNumValue = GetAutoNumberAsync("GENAUTONUMMAX", "MAXAUTONUM", AutoCondition, RsAutoPmt.GetString(cnt)).Result;
            //            }
            //            else if (AutoType[0].Trim().ToUpper() == "GETAUTOTEXT")
            //            {
            //                int cnt = Rstemp.GetOrdinal("InitialValue");
            //                AutoNumValue = GetAutoTextAsync("GENAUTONUMMAX", "MAXAUTONUM", RsAutoPmt.GetString(cnt), AutoCondition).Result;
            //            }
            //            else if (AutoType[0].Trim().ToUpper() == "GETMAXACCOUNTNO")
            //            {
            //                int cnt = Rstemp.GetOrdinal("InitialValue");
            //                AutoNumValue = GetMaxAccountNoAsync("GENAUTONUMMAX", "MAXAUTONUM", AutoCondition, RsAutoPmt.GetString(cnt)).Result;
            //            }

            //            if (AutoNumValue.Substring(1, 5) == "ERROR")
            //            {
            //                AutoNumValue = AutoNumValue.Replace( "\n", "");
            //                AutoNumValue = AutoNumValue.Replace( "\r", "");
            //                DataTransactionsRet = AutoNumValue;
            //                return DataTransactionsRet;
            //            }

            //            // ReDim ArrRowValues(0) As Variant

            //            // If ((AutoNumValue = CStr(RsAutoPmt!InitialValue)) Or (AutoNumValue = Val(Rstemp!maxautonum) + 1)) Then

            //            // ReDim ArrRowValuesinit(0) As Variant

            //            int cnt = Rstemp.GetOrdinal("InitialValue");
            //            if ((AutoNumValue ?? "") == (RsAutoPmt.GetString(cnt) ?? ""))
            //            {
            //                Autoflds = DataArray[transcount, 2] + ",MAXAUTONUM";
            //                ArrRowValues.ElementAtOrDefault(0) = DataArray(transcount, 3) + "," + AutoNumValue;

            //                TransResult = "";
            //                TransResult = Conversions.ToString(((dynamic)ObjTrans).InsertRecord("GENAUTONUMMAX", Autoflds, ArrRowValues, BRCode, UserId, MachID, AppDate, "N"));

            //                if (TransResult != "Trans Completed")
            //                {
            //                    ObjContext.SetAbort();
            //                    objQuery = null;
            //                    ObjContext = (object)null;
            //                    ObjTrans = null;
            //                    TransResult = Strings.Replace(TransResult, "\n", "");
            //                    TransResult = Strings.Replace(TransResult, "\r", "");
            //                    DataTransactionsRet = TransResult;
            //                    return DataTransactionsRet;
            //                }
            //            }
            //            else
            //            {
            //                ArrRowValues.ElementAtOrDefault(0) = AutoNumValue;

            //                Autoflds = "MAXAUTONUM";
            //                AutoCondition = DataArray(transcount, 4);

            //                TransResult = Conversions.ToString(((dynamic)objQuery).ModifyQueriedTrans("GENAUTONUMMAX", Autoflds, ArrRowValues, AutoCondition, BRCode, UserId, MachID));
            //                // objQuery = Nothing
            //                if (TransResult != "Trans Completed")
            //                {
            //                    ObjContext.SetAbort();
            //                    ObjContext = (object)null;
            //                    TransResult = Strings.Replace(TransResult, "\n", "");
            //                    TransResult = Strings.Replace(TransResult, "\r", "");
            //                    DataTransactionsRet = TransResult;
            //                    return DataTransactionsRet;
            //                }
            //            }

            //            Rsnfts = ((dynamic)objQuery).singlerecordset("genbankparm", "NFTSCONVYN", "");

            //            if (!Rsnfts.EOF & !Rsnfts.BOF)
            //            {

            //                if (Rsnfts["NFTSCONVYN"] == "Y")  // nfts conversion 16 digits
            //                {

            //                    if (moduleid == "SB" | moduleid == "CA" | moduleid == "CC" | moduleid == "DEP" | moduleid == "LOAN" | moduleid == "LOCKER" | moduleid == "SHARES")
            //                    {

            //                        intaccnolen = Strings.Len(AutoNumValue); // 'vinod
            //                        if (intaccnolen == 16)
            //                        {
            //                            AutoNumValue = AutoNumValue;
            //                        }
            //                        else
            //                        {
            //                            if (intaccnolen == 1)
            //                            {
            //                                AutoNumValue = "000000" + AutoNumValue;
            //                            }
            //                            else if (intaccnolen == 2)
            //                            {
            //                                AutoNumValue = "00000" + AutoNumValue;
            //                            }
            //                            else if (intaccnolen == 3)
            //                            {
            //                                AutoNumValue = "0000" + AutoNumValue;
            //                            }
            //                            else if (intaccnolen == 4)
            //                            {
            //                                AutoNumValue = "000" + AutoNumValue;
            //                            }
            //                            else if (intaccnolen == 5)
            //                            {
            //                                AutoNumValue = "00" + AutoNumValue;
            //                            }
            //                            else if (intaccnolen == 6)
            //                            {
            //                                AutoNumValue = "0" + AutoNumValue;
            //                            }
            //                            else if (intaccnolen == 7)
            //                            {
            //                                AutoNumValue = AutoNumValue;
            //                            }
            //                            AutoNumValue = BRCode + glcode + AutoNumValue;
            //                        }
            //                    }
            //                } // MODULE ID END
            //            } // NFTS CONV END

            //            AccNoPrefix = Strings.Trim(RsAutoPmt["Prefixvalue"]) + "";
            //            AccNoSuffix = Strings.Trim(RsAutoPmt["suffixvalue"]) + "";
            //            ActualAccNo = AutoNumValue;
            //            AutoNumValue = Strings.Trim(RsAutoPmt["Prefixvalue"]) + AutoNumValue + Strings.Trim(RsAutoPmt["suffixvalue"]);

            //        }

            //    }


            //    // *************Transaction Started***************
            //    var loopTo1 = Information.UBound(DataArray);
            //    for (transcount = 0; transcount <= loopTo1; transcount++)
            //    {
            //        StrTabName = DataArray(transcount, 1);
            //        StrFld = DataArray(transcount, 2);
            //        TabFldValues = DataArray(transcount, 3);
            //        ArrRowValues = Strings.Split(TabFldValues, "|", -1);

            //        TabWhereCondition = DataArray(transcount, 4);

            //        if (UCase(Strings.Trim(DataArray(transcount, 0))) == "I")
            //        {
            //            /// ************For Insert****************
            //            if (!string.IsNullOrEmpty(Strings.Trim(Autoflds)))
            //            {
            //                // StrFld = StrFld & "," & Autoflds
            //                AutoFldNames = "";
            //                StrTabName = Strings.UCase(Strings.Trim(StrTabName));

            //                if (StrTabName == "SBMST" | StrTabName == "CAMST" | StrTabName == "LOANMST" | StrTabName == "DEPMST" | StrTabName == "LGMST" | StrTabName == "LOCKERMST" | StrTabName == "FXLGMST" | StrTabName == "FXBILLSMST" | StrTabName == "FXDEPMST" | StrTabName == "CCMST" | StrTabName == "LCMST" | StrTabName == "FXLOANSMST" | StrTabName == "FXLCMST" | StrTabName == "FXFCMST")
            //                {

            //                    AutoFldNames = ",PREFIXVALUE, SUFFIXVALUE, ActualAccNo";
            //                    StrFld = StrFld + AutoFldNames;

            //                }

            //                var loopTo2 = Information.UBound(ArrRowValues);
            //                for (RowCnt = 0; RowCnt <= loopTo2; RowCnt++)
            //                {
            //                    ArrRowValues.ElementAtOrDefault(RowCnt) = ArrRowValues.ElementAtOrDefault(RowCnt) + ",'" + AutoNumValue + "'";

            //                    if (!string.IsNullOrEmpty(AutoFldNames))
            //                    {
            //                        ArrRowValues.ElementAtOrDefault(RowCnt) = ArrRowValues.ElementAtOrDefault(RowCnt) + ",'" + AccNoPrefix + "','" + AccNoSuffix + "','" + ActualAccNo + "'";
            //                    }

            //                }
            //            }
            //            TransResult = "";
            //            TransResult = Conversions.ToString(((dynamic)ObjTrans).InsertRecord(StrTabName, StrFld, ArrRowValues, BRCode, UserId, MachID, AppDate, DayBeginEndStatusCheckYN));
            //        }

            //        else if (UCase(Strings.Trim(DataArray(transcount, 0))) == "BI")
            //        {

            //            /// ************For Bulk Insertion****************
            //            TransResult = "";
            //            TransResult = Conversions.ToString(((dynamic)ObjTrans).BulkInsert(StrTabName, StrFld, (string)DataArray(transcount, 3), BRCode, UserId, MachID, AppDate, DayBeginEndStatusCheckYN));
            //        }


            //        else if (UCase(Strings.Trim(DataArray(transcount, 0))) == "U")
            //        {

            //            /// ************For Update****************
            //            if (!string.IsNullOrEmpty(Strings.Trim(Autoflds)))
            //            {
            //                // StrFld = StrFld & "," & Autoflds
            //                var loopTo3 = Information.UBound(ArrRowValues);
            //                for (RowCnt = 0; RowCnt <= loopTo3; RowCnt++)
            //                    ArrRowValues.ElementAtOrDefault(RowCnt) = ArrRowValues.ElementAtOrDefault(RowCnt) + "~'" + AutoNumValue + "'";
            //            }
            //            TransResult = Conversions.ToString(((dynamic)ObjTrans).UpdateRecord(StrTabName, StrFld, ArrRowValues, TabWhereCondition, BRCode, UserId, MachID, AppDate, DayBeginEndStatusCheckYN));
            //        }

            //        else if (UCase(Strings.Trim(DataArray(transcount, 0))) == "D")
            //        {
            //            /// ************For Delete****************
            //            TransResult = Conversions.ToString(((dynamic)ObjTrans).DeleteRecord(StrTabName, TabWhereCondition, BRCode, UserId, MachID, AppDate, DayBeginEndStatusCheckYN));
            //        }

            //        else if (UCase(Strings.Trim(DataArray(transcount, 0))) == "R")
            //        {
            //            /// ************For Rejection****************
            //            TransResult = Conversions.ToString(((dynamic)ObjTrans).RejectRecord(StrTabName, TabWhereCondition, BRCode, UserId, MachID, AppDate, DayBeginEndStatusCheckYN));
            //        }

            //        else if (UCase(Strings.Trim(DataArray(transcount, 0))) == "SI")
            //        {
            //            /// ************For Insertion using a Select statement ****************
            //            TransResult = Conversions.ToString(((dynamic)ObjTrans).InsertUsingSelect(StrTabName, StrFld, ArrRowValues, TabWhereCondition, BRCode, UserId, MachID, AppDate, DayBeginEndStatusCheckYN));

            //        }

            //        // TransResult = "trans1"
            //        if (Strings.Trim(TransResult) != "Trans Completed")
            //            goto ErrHand;

            //    }


            //    ObjContext.SetComplete();
            //    ObjTrans = null;
            //    ObjContext = (object)null;
            //    objQuery = null;
            //    if (!string.IsNullOrEmpty(AutoNumValue))
            //    {
            //        DataTransactionsRet = "Transaction Sucessful.|" + AutoNumValue;
            //    }
            //    else
            //    {
            //        DataTransactionsRet = "Transaction Sucessful.";
            //    }

            //    return DataTransactionsRet;
            //}
            //catch
            //{


            //    if (!string.IsNullOrEmpty(AutoNumValueinit))
            //    {
            //        ArrRowValuesinit.ElementAtOrDefault(0) = AutoNumValueinit;
            //        Autofldsinit = "MAXAUTONUM";
            //        TransResult2 = Conversions.ToString(((dynamic)objQuery).ModifyQueriedTrans("GENAUTONUMMAX", Autofldsinit, ArrRowValuesinit, AutoConditioninit, BRCode, UserId, MachID));
            //    }

            //    ObjContext.SetAbort();
            //    ObjTrans = null;
            //    ObjContext = (object)null;
            //    objQuery = null;

            //    if (!string.IsNullOrEmpty(Strings.Trim(TransResult)))
            //    {

            //        // *************Connection Failed************
            //        TransResult = Strings.Replace(TransResult, "\n", "");
            //        TransResult = Strings.Replace(TransResult, "\r", "");
            //        DataTransactionsRet = TransResult;
            //    }
            //    else
            //    {
            //        DataTransactionsRet = Information.Err().Number + Information.Err().Description;
            //        DataTransactionsRet = Strings.Replace(DataTransactionsRet, "\n", "");
            //        DataTransactionsRet = Strings.Replace(DataTransactionsRet, "\r", "");
            //    }
            //}

            //return DataTransactionsRet;
        }
        
        public async Task<string> GetAutoNumberAsync(string TabName, string AutoNumFldName, string WhereCondition = "", string InitialNum = "")
        {
            OracleDataReader Rstemp = null!;

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

                if (Rstemp.IsClosed)
                    return GetAutoNumberRet;

                if (Rstemp.HasRows)
                {
                    if (string.IsNullOrEmpty(InitialNum.Trim()))
                        GetAutoNumberRet = Convert.ToString(Rstemp.GetInt32(0) + 1);
                    else if (Rstemp.GetInt32(0) == 0)
                        GetAutoNumberRet = InitialNum;
                    else
                    {
                        IntLen = InitialNum.Length;
                        IntFldLen = Rstemp.GetString(0).Length + 1;
                        strPrefix = "";
                        if (IntFldLen < IntLen)
                        {
                            var loopTo = IntLen - IntFldLen;
                            for (int i = 1; i <= loopTo; i++)
                                strPrefix = strPrefix + "0";
                        }

                        GetAutoNumberRet = strPrefix + Convert.ToString(Rstemp.GetInt32(0) + 1);
                    }
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
            OracleDataReader Rstemp = null!;

            int Txtlen;
            string GetAutoTextRet = string.Empty;
            string StrQuery, AutoFieldName, StrTabName, strCondition, StrAlfhaText, StrAutoText, StrInitialChar;

            try
            {
                StrTabName = TabName.Trim();
                AutoFieldName = AutoNumFldName.Trim();
                strCondition =  string.IsNullOrWhiteSpace(WhereCondition.Trim()) ? "" : WhereCondition.Trim();
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

                if (Rstemp.IsClosed)
                {
                    return GetAutoTextRet;
                }

                StrAutoText = "";
                if (!Rstemp.HasRows || Rstemp.FieldCount == 0)
                {
                    StrAutoText = StrAlfhaText;
                }
                else
                {
                    StrInitialChar = StrAlfhaText.Substring(0, 1);
                    StrAlfhaText = Rstemp.GetString(0).Trim().ToUpper();
                    for (int i = Txtlen; i >= 1; i -= 1)
                    {
                        if (StrAlfhaText[i - 1] < 'Z')
                        {
                            StrAutoText = StrAlfhaText.Substring(0, i - 1) + (char)(StrAlfhaText[i - 1] + 1);
                            if (StrAutoText.Length < Txtlen)
                            {
                                var loopTo = Txtlen - StrAutoText.Length;
                                for (int j = 1; j <= loopTo; j++)
                                    StrAutoText = StrAutoText + StrInitialChar;
                            }
                            break;
                        }
                    }
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
            OracleDataReader Rstemp = null!;
            string GetMaxAccountNoRet = string.Empty;
            string StrQuery, AutoFieldName, StrTabName, strCondition, strPrevAccno;

            try
            {
                StrTabName = TabName.Trim();
                AutoFieldName = AccFldName.Trim();
                strCondition = WhereCondition.Trim();

                StrQuery = "";
                StrQuery = "accno";
                if (!string.IsNullOrEmpty(WhereCondition.Trim()))
                    Rstemp = await SingleRecordSet(StrTabName.Trim(), AutoFieldName, WhereCondition, AutoFieldName);
                else
                    Rstemp = await SingleRecordSet(StrTabName.Trim(), AutoFieldName, string.Empty, AutoFieldName);

                if (Rstemp.IsClosed)
                {
                    // GetMaxAccountNoRet = Conversions.ToString(((dynamic)Objquery).ConnError);
                    return GetMaxAccountNoRet;
                }
                else if (!Rstemp.HasRows)
                {
                    return string.IsNullOrEmpty(InitialAutoText) ? 1.ToString() : InitialAutoText;
                }

                Rstemp.NextResult();
                strPrevAccno = Rstemp.GetString(0) + 1;
                Rstemp.NextResult();
                while (Rstemp.HasRows)
                {
                    if (Rstemp.GetString(0) == strPrevAccno)
                    {
                        strPrevAccno = Rstemp.GetString(0) + 1;
                        Rstemp.NextResult();
                    }
                    else
                    {
                        break;
                    }
                }
                GetMaxAccountNoRet = strPrevAccno;
            }
            catch
            {
                // GetMaxAccountNoRet = Information.Err().Number + " : " + Information.Err().Description;
                GetMaxAccountNoRet = GetMaxAccountNoRet.Replace("\n", "");
                GetMaxAccountNoRet = GetMaxAccountNoRet.Replace("\r", "");
            }
            return GetMaxAccountNoRet;
        }
    }
}
