using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Banking.Models.DTO;
using Humanizer;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.Eventing.Reader;
using System.Reflection;
using System.Reflection.Emit;
using System.Runtime.InteropServices;
using System.Text;
using System.Xml.Linq;
using static System.Runtime.CompilerServices.RuntimeHelpers;

namespace Banking.Backend
{
    public class DatabaseFactory : IDatabaseService
    {
        private string _dataLink = ""; // "@DBLINK"; // TODO: Move to settings if needed
        private readonly OracleRetryHelper _oracleRetryHelper;
        private readonly TransactionalFactory _transactionalFactory;
        private string strParamFlds = string.Empty;
        private string strParamVals = string.Empty;

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

        public async Task<string> ProcessDataTransactions(string[,] TransDataArray, string BranchCode = "", string UserCode = "", string MachineID = "", 
            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "", string glcode = "", string moduleid = "")
        {
            string DataTransactionsRet = string.Empty;

            string[,] DataArray;
            string[] AutoType;
            string[] ArrRowValues = new string[1];
            string TransResult = string.Empty, AutoConditioninit = string.Empty, AutoNumValue = string.Empty, AutoNumValueInit = string.Empty;
            string TabFldValues, StrFld, StrTabName, TabWhereCondition, AutoCondition, Autoflds, AccNoPrefix, AccNoSuffix, ActualAccNo, AutoFldNames, AutoPmtCond;
            DataTable Rsnfts, RsAutoPmt, Rstemp;
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

                // Transaction Started
                for (transcount = 0; transcount < DataArray.GetLength(0); transcount++)
                {
                    if (string.IsNullOrWhiteSpace(DataArray[transcount, 1]))
                        continue;

                    StrTabName = DataArray[transcount, 1];
                    StrFld = DataArray[transcount, 2];
                    TabFldValues = DataArray[transcount, 3];
                    ArrRowValues = TabFldValues!.Split("|");

                    // TODO
                    //for (int i = 0; i < ArrRowValues.Length - 1; i++)
                    //{
                    //    if (ArrRowValues[i + 1].Contains("DD-MON-YYYY"))
                    //    {
                    //        ArrRowValues[i] = string.Concat(ArrRowValues[i], ArrRowValues[i + 1]);
                    //        i++;
                    //    }
                    //}

                    TabWhereCondition = DataArray[transcount, 4];

                    if (DataArray[transcount, 0].Trim().ToUpper() == "I")
                    {
                        // For Insert
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
                    //    // For Bulk Insertion
                    //    TransResult = "";
                    //    TransResult = await _transactionalFactory.BulkInsert(StrTabName, StrFld, DataArray[transcount, 3], BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    //}
                    else if (DataArray[transcount, 0].Trim().ToUpper() == "U")
                    {
                        // For Update
                        if (!string.IsNullOrEmpty(Autoflds.Trim()))
                        {
                            // StrFld = StrFld & "," & Autoflds
                            var loopTo3 = ArrRowValues.Length - 1;
                            for (int RowCnt = 0; RowCnt <= loopTo3; RowCnt++)
                                ArrRowValues[RowCnt] = ArrRowValues.ElementAtOrDefault(RowCnt) + "~'" + AutoNumValue + "'";
                        }
                        TransResult = await _transactionalFactory.UpdateRecord(StrTabName, StrFld, ArrRowValues, TabWhereCondition, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    }
                    else if (DataArray[transcount, 0].Trim().ToUpper() == "D")
                    {
                        // For Delete
                        TransResult = await _transactionalFactory.DeleteRecord(StrTabName, TabWhereCondition, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    }
                    //else if (DataArray[transcount, 0].Trim().ToUpper() == "R")
                    //{
                    //    // For Rejection
                    //    TransResult = await _transactionalFactory.RejectRecord(StrTabName, TabWhereCondition, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    //}
                    //else if (DataArray[transcount, 0].Trim().ToUpper() == "SI")
                    //{
                    //    // For Insertion using a Select statement
                    //    TransResult = await _transactionalFactory.InsertUsingSelect(StrTabName, StrFld, ArrRowValues, TabWhereCondition, BRCode, UserId, MachID, applicationDate, DayBeginEndStatusCheckYN);
                    //}

                    // TransResult = "trans1"
                    if (TransResult.Trim() != BankingConstants.TransactionCompleted)
                        throw new Exception();
                }

                DataTransactionsRet = (!string.IsNullOrEmpty(AutoNumValue)) ? string.Concat(BankingConstants.TransactionSuccessful, "|", AutoNumValue) : BankingConstants.TransactionSuccessful;
            }
            catch (Exception ex)
            {
                if (!string.IsNullOrEmpty(AutoNumValueInit))
                {
                    string[] ArrRowValuesInit = [AutoNumValueInit];
                    //string TransResult2 = await ModifyQueriedTrans("GENAUTONUMMAX", "MAXAUTONUM", ArrRowValuesInit, AutoConditioninit, BranchCode, UserCode, MachineID);
                }

                // Connection Failed
                if (!string.IsNullOrEmpty(TransResult.Trim()))
                {
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

        public async Task<DataTable> GetModuleId(string branchCode, string AllModulesYN = "", string UserID = "", string VouchingYN = "", string ModuleCondition = "")
        {
            string strVouchCondition, strQuery = "";

            string strBrcode = branchCode.Trim().ToUpper();
            string strUser = string.IsNullOrWhiteSpace(UserID) ? "" : UserID.Trim().ToUpper();
            string strOptModCond = string.IsNullOrWhiteSpace(ModuleCondition) ? "" : ModuleCondition.Trim();

            if (!string.IsNullOrWhiteSpace(strOptModCond))
                strOptModCond = " and " + strOptModCond;

            // Please do not change this piece of code it will effect the list of modules
            if (VouchingYN.Trim() == "" || VouchingYN.Trim().ToUpper() == "Y")
                strVouchCondition = " and gmm.VOUCHINGYN='Y'"; // returns modules with transaction facility
            else
                strVouchCondition = ""; //returns all modules

            if (AllModulesYN.Trim() == "" || AllModulesYN.Trim() == "Y")
                strQuery = "Select gmt.ModuleID ModuleID,gmt.Narration Narration,gmm.Mastertable Mastertable from GenModuleTypesMST" + _dataLink + " gmt, genmodulemst" + 
                    _dataLink + " gmm where trim(gmt.BranchCode)='" + strBrcode.Trim() + "' and upper(gmt.IMPLEMENTEDYN)='Y' and gmt.ModuleID = gmm.ModuleID " + 
                    strVouchCondition + strOptModCond + " order by gmt.ModuleID";
            else
                strQuery = "Select ModuleID,Narration from GenModuleTypesMST" + _dataLink + "  where trim(BranchCode)='" + strBrcode.Trim() + 
                    "' and upper(IMPLEMENTEDYN)='Y' and ModuleID in (select gmm.moduleid from genmodulemst" + _dataLink + " gmm where trim(gmm.mastertable)is not null " + 
                    strVouchCondition + strOptModCond + " )" + strOptModCond + " order by ModuleID";

            return await ProcessQueryAsync(strQuery);
        }

        // For retrieving Branch Code based On UserID
        public async Task<DataTable> GetBranchCodes(string userId)
        {
            string strUser = userId.Trim().ToUpper();

            string strQuery = "select distinct(Branch.Branchcode) BranchCode,Branch.Narration Narration from genbankbranchmst" + _dataLink + 
                " Branch, GenUserMst" + _dataLink + " GenUser, GENBRANCHPMT BrnchPmt where ((upper(trim(GenUser.userid))='" + strUser + 
                "' and upper(trim(Genuser.ABBUSERYN))='Y') or Branch.branchcode = (select branchcode from genusermst" + _dataLink + 
                " where upper(trim(userid))='" + strUser + "')) AND Branch.Branchcode=BrnchPmt.Branchcode order by BranchCode";

            return await ProcessQueryAsync(strQuery);
        }

        public async Task<DataTable> GetGLCodes(string BRCode, string ModuleCode, string GLCategory = "")
        {
            string strGlCatCondition, strQuery = "";
            string strBranchCode = BRCode.Trim();
            string StrModuleCode = ModuleCode.Trim();

            // Please do not change this piece of code it will effect the list of glcodes
            if (string.IsNullOrWhiteSpace(GLCategory.Trim()) || GLCategory.Trim().ToUpper() == "A") 
                //returns transactional glcodes
                strGlCatCondition = " and glcode in (select glcode from GENGLMASTMST where moduleid='" + StrModuleCode + "' and GLCATEGORY='A')";
            else
                // returns other category glcodes based on the request
                strGlCatCondition = " and glcode in (select glcode from GENGLMASTMST where moduleid='" + StrModuleCode + "' and GLCATEGORY='" + GLCategory + "')";
            
            // *********************************************************************************

            if (StrModuleCode.Trim().ToUpper() == "GL")
                strQuery = "select glcode,Narration from genglsheetmst" + _dataLink + " where (moduleid in (select moduleid " + " from genmoduletypesmst" + _dataLink + 
                    " where upper(trim(implementedyn)) <> 'Y' and branchcode='" + strBranchCode + "') or trim(moduleid)='GL') and (trim(branchcode)='" + strBranchCode + 
                    "') and (status='R') order by glcode";
            else
                strQuery = "select glcode,Narration from genglsheetmst" + _dataLink + "  where moduleid in (select moduleid from genmoduletypesmst" + _dataLink + 
                    " where trim(moduleid)='" + StrModuleCode + "') " + " and trim(branchcode)='" + strBranchCode + "' and status='R' " + strGlCatCondition + 
                    " order by glcode";

            DataTable Rstemp = await ProcessQueryAsync(strQuery);

            if (Rstemp.Rows.Count == 0)
                throw new Exception("Glcodes have not created for this Module.");

            return Rstemp;
        }

        public async Task<DataTable> GetAccountNumbers(string BRCode, string ModuleCode = "", string GLcode = "", string CurrencyCode = "", string AccStatus = "", 
            string TableName = "", string RemType = "", string accSearch = "")
        {
            string status = "", TranStatus = "", strTabName;
            string[] arrStatus;
            string[] arrTrStatus;
            bool blnGLcode = false;

            if (string.IsNullOrWhiteSpace(ModuleCode))
                throw new Exception("Module ID should not be empty");

            DataTable Rstemp;

            string strQuery = "";
            string strBranchCode = BRCode.Trim().ToUpper();
            string strModuleCode = ModuleCode.Trim().ToUpper();
            string strGLCode = GLcode.Trim().ToUpper();
            string strRemType = RemType.Trim().ToUpper();

            if (string.IsNullOrWhiteSpace(AccStatus))
            {
                status = "'R'";
                TranStatus = "'A'";
            }
            else
            {
                arrStatus = AccStatus.Split(",", StringSplitOptions.RemoveEmptyEntries);

                if (arrStatus[0] == "A")
                {
                    status = "";
                    TranStatus = "";
                }
                else
                {
                    arrTrStatus = arrStatus[0].Split("OR", StringSplitOptions.RemoveEmptyEntries);

                    for (int i = 0; i < arrTrStatus.Length; i++)
                        status += "'" + arrTrStatus[i].Trim().ToUpper() + "',";

                    status = status.Substring(0, status.Length - 1);
                    arrTrStatus = null!;

                    arrTrStatus = arrStatus[1].Split(new[] { "OR" }, StringSplitOptions.None);

                    for (int i = 0; i < arrTrStatus.Length; i++)
                        TranStatus += "'" + arrTrStatus[i].Trim().ToUpper() + "',";

                    // Remove trailing comma
                    if (!string.IsNullOrEmpty(TranStatus) && TranStatus.Length > 0)
                        TranStatus = TranStatus.Substring(0, TranStatus.Length - 1);
                }
            }

            if (string.IsNullOrWhiteSpace(TableName))
            {
                strQuery = "select MasterTable,GLCODEYN from genmodulemst" + _dataLink + "  where moduleid ='" + strModuleCode + "'";

                Rstemp = await ProcessQueryAsync(strQuery.ToUpper());

                strTabName = Conversions.ToString(Rstemp.Rows[0]["MasterTable"]);

                if (Conversions.ToString(Rstemp.Rows[0]["MasterTable"])?.ToUpper() == "Y")
                    blnGLcode = true;

                BankingExtensions.ReleaseMemory(Rstemp);

                if (blnGLcode)
                {
                    if (string.IsNullOrWhiteSpace(CurrencyCode.Trim()))
                    {
                        if (string.IsNullOrWhiteSpace(status))
                            strQuery = "select ACCNO,Name,CUSTOMERID,status from " + strTabName + _dataLink + " where upper(trim(branchcode))='" + strBranchCode + "' " +
                                " and upper(trim(glcode))='" + strGLCode.Trim() + "' and upper(trim(status))='R' order by Name";
                        else
                            strQuery = "select ACCNO,Name,CUSTOMERID,status from " + strTabName + _dataLink + " where upper(trim(branchcode))='" + strBranchCode + "' " +
                                " and upper(trim(glcode))='" + strGLCode.Trim() + "' and upper(trim(status)) in (" + status + ") and transtatus in (" + TranStatus + ") ";
                    }
                    else
                    {
                        if (strModuleCode.Equals("SCR"))
                            strQuery = "select ACCNO,Name,Customerid,status from " + strTabName + _dataLink + " where  upper(trim(branchcode))='" + strBranchCode + "' " + 
                                " and upper(trim(glcode))='" + strGLCode.Trim() + "' and upper(trim(status)) in (" + status + ") and transtatus in (" + TranStatus + 
                                ") and upper(trim(currencycode))='" + CurrencyCode.Trim().ToUpper() + "' ";
                        else if (string.IsNullOrWhiteSpace(status))
                            strQuery = "select ACCNO,Name,Customerid,status from " + strTabName + _dataLink + " where upper(trim(branchcode))='" + strBranchCode + "' " + 
                                " and upper(trim(glcode))='" + strGLCode.Trim() + "' and upper(trim(currencycode))='" + CurrencyCode.Trim().ToUpper() + "' ";
                        else
                            strQuery = "select ACCNO,Name,Customerid,status from " + strTabName + _dataLink + " where upper(trim(branchcode))='" + strBranchCode + "' " + 
                                " and upper(trim(glcode))='" + strGLCode.Trim() + "' and upper(trim(status)) in (" + status + ") and transtatus in (" + TranStatus + 
                                ") and upper(trim(currencycode))='" + CurrencyCode.Trim().ToUpper() + "' ";

                        if (!string.IsNullOrWhiteSpace(accSearch))
                        {
                            string[] searchby = accSearch.ToUpper().Split("|");
                            if (searchby[0] == "NAME")
                                strQuery = strQuery + "AND upper(NAME) LIKE '%" + searchby[1] + "%'";
                            else
                                strQuery = strQuery + "AND ACCNO LIKE '" + searchby[1] + "%'";
                        }
                    }
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(status))
                        strQuery = "select ACCNO,Name,CUSTOMERID,status from " + strTabName + _dataLink + " where upper(trim(branchcode))='" + strBranchCode + "' " + 
                            " and upper(trim(status))='R' order by Name";
                    else
                        strQuery = "select ACCNO,Name,CUSTOMERID,status from " + strTabName + _dataLink + " where upper(trim(branchcode))='" + strBranchCode + "' " + 
                                " and upper(trim(status)) in (" + status + ") and transtatus in (" + TranStatus + ") ";
                }
            }
            else
            {
                strTabName = TableName;
                if (string.IsNullOrWhiteSpace(status))
                    strQuery = "select ACCNO,Name,Customerid from " + strTabName + _dataLink + " where upper(trim(branchcode))='" + strBranchCode + "' " + 
                        " and upper(trim(glcode))='" + strGLCode.Trim() + "' and upper(trim(moduleid))='" + ModuleCode.Trim().ToUpper() + "' ";
                else
                    strQuery = "select ACCNO,Name,Customerid from " + strTabName + _dataLink + " where upper(trim(branchcode))='" + strBranchCode + "' " + 
                        " and upper(trim(glcode))='" + strGLCode.Trim() + "' and upper(trim(status)) in ( " + status + ") and transtatus in (" + TranStatus + 
                        ") and upper(trim(moduleid))='" + ModuleCode.Trim().ToUpper() + "' ";
            }

            if (!string.IsNullOrWhiteSpace(strRemType))
                strQuery = strQuery + " and MODEOFREMITTANCE='" + strRemType + "'";

            strQuery = strQuery + " order by Accno";

            strQuery = strQuery.ToUpper();

            return await ProcessQueryAsync(strQuery);
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

        public async Task<DataTable> GLTransactionParameters(string ModuleCode, string GLcode, string TransactionDate, string CurrencyCode = "", string userBranchcode = "", 
            string UserID = "", string machineid = "")
        {
            DataTable RsGLParam = null!, Rstemp = null!, RSModule = null!;

            string strDelimiter = "~";
            string strTabName = "", strQuery = "";

            string strModuleCode = ModuleCode.Trim().ToUpper();
            string strGLCode = GLcode.Trim().ToUpper();
            string TrannDate = string.Format("dd-Mmm-yyyy", TransactionDate);
            string StrCurCode = CurrencyCode.Trim().ToUpper();

            // Aquiring the parameter table name for the given module
            strQuery = "select MasterTable,PMTTABLE from genmodulemst" + _dataLink + " where moduleid ='" + strModuleCode + "'";
            strQuery = strQuery.ToUpper();

            Rstemp = await ProcessQueryAsync(strQuery);

            if (Rstemp.Rows.Count == 0 || (Rstemp.Rows.Count == 1 && Rstemp.Rows[0]["pmttable"] == DBNull.Value))
                throw new Exception("Parameters Not Specified for this Module !");
            else
                strTabName = Conversions.ToString(Rstemp.Rows[0]["pmttable"]).Trim().ToUpper(); // Parameter table name retrieved

            // Calling private function for Gl Parameters from the Moduleparameter table based on the effective date.

            await ModuleParameterRecord(strTabName, "", "", strGLCode, TrannDate, "", "");

            string[] skipColumns = { "BRANCHCODE","CURRENCYCODE","MODULEID","GLCODE","EFFECTIVEDATE","STATUS","APPLICATIONDATE","USERID","MACHINEID","VERIFIEDBY",
                "VERIFIEDMACHINE","APPROVEDBY","APPROVEDMACHINE","SYSTEMDATE" };

            DataRow row = RSModule.Rows.Count > 0 ? RSModule.Rows[0] : null!;

            for (int i = 0; i < RSModule.Columns.Count; i++)
            {
                string colName = RSModule.Columns[i].ColumnName.ToUpper();
                if (!skipColumns.Contains(colName))
                {
                    strParamFlds += RSModule.Columns[i].ColumnName + ",";
                    if (row != null)
                    {
                        var val = row[i] == DBNull.Value ? "" : row[i].ToString();
                        strParamVals += val + strDelimiter;
                    }
                    else
                        strParamVals += "" + strDelimiter;
                }
            }

            string strParamTabs = strTabName;

            // Retrieving data from GENTRANTYPEMST parameter table
            strQuery = "CASHDRYN, CASHCRYN, TRANSFERDRYN, TRANSFERCRYN, CLEARINGDRYN, CLEARINGCRYN";
            string strCondition = " currencycode='" + StrCurCode + "'";

            await ParameterRecord("GENTRANTYPEMST", strQuery, "GENTRANTYPEMSTHIST", strCondition, strModuleCode, strGLCode, 
                StrCurCode, TrannDate, strDelimiter);

            // If ConnError<> "Connected" Then GoTo errhand

            strParamFlds = strParamFlds.Substring(0, strParamFlds.Length - 1);
            strParamVals = strParamVals.Substring(0, strParamVals.Length - 1);
            strParamTabs = strParamTabs + ",GENTRANTYPEMST";

            // If ConnError <> "Connected" Then GoTo errhand

            strQuery = " select " + strParamFlds + " from " + strParamTabs + " where 1=2";

            // Dummy recordset

            await ProcessQueryAsync(strQuery);

            // Entering the parameter data into the dummy recordset.
            string[] arrParamFlds = strParamFlds.Split(",");
            string[] arrParamVals = strParamVals.Split(strDelimiter);

            DataRow newRow = RsGLParam.NewRow();

            for (int i = 0; i < arrParamFlds.Length; i++)
            {
                string value = Conversions.ToString(arrParamVals[i]).Trim();
                newRow[arrParamFlds[i]] = string.IsNullOrEmpty(value) ? DBNull.Value : value;
            }

            RsGLParam.Rows.Add(newRow);

            return RsGLParam;

            //    objErrlog.LogError "GeneralTranQueries", "GLTransactionParameters", Err.Number, Err.Description
        }

        public async Task<DataTable> FXTransactionParameters(string Branchcode, string ModuleCode, string GLcode, string TransactionDate, string FCurrencyCode = "",
            string Accno = "", string CategoryCode = "", string userBranchcode = "", string UserID = "", string machineid = "")
        {
            DataTable RsGLParam = null!, Rstemp = null!, RSModule = null!;
            string StrFxMinMAxTab = "", strFxMinMaxFlds, strFxNotinalCat;

            string strTabName = "", strQuery = "";

            string strDelimiter = "~";

            string StrModuleCode = ModuleCode.Trim().ToUpper();
            string strGLCode = GLcode.Trim().ToUpper();
            string TrannDate = string.Format("dd-Mmm-yyyy", TransactionDate);
            string StrCurCode = FCurrencyCode.Trim().ToUpper();
            string strBranchCode = Branchcode.Trim().ToUpper();
            string strAccno = string.IsNullOrWhiteSpace(Accno) ? "" : Accno.Trim();
            string CatCode = string.IsNullOrWhiteSpace(CategoryCode) ? "" : CategoryCode.Trim().ToUpper();

            // Retrieving the account category code based on moduleid
            if (strAccno != "")
            {
                strQuery = "Select CATEGORYCODE from " + StrModuleCode + "MST" + _dataLink + " where branchcode='" + strBranchCode + "' and accno='" + strAccno + 
                    "' and glcode='" + strGLCode + "'";

                Rstemp = await ProcessQueryAsync(strQuery);

                CatCode = Conversions.ToString(Rstemp.Rows[0]["CategoryCode"]);
            }

            // Aquiring the parameter table name  for the given module.
            strQuery = "select MasterTable,PMTTABLE from genmodulemst" + _dataLink + "  where moduleid ='" + StrModuleCode + "'";

            strQuery = strQuery.ToUpper();

            Rstemp = await ProcessQueryAsync(strQuery);

            if (Rstemp.Rows.Count > 0)
                strTabName = Conversions.ToString(Rstemp.Rows[0]["pmttable"]).Trim().ToUpper();

            // Parameter table name retrieved, calling private function for Gl Parameters from the Moduleparameter table based on the effective date.

            await ModuleParameterRecord(strTabName, "", "", strGLCode, TrannDate, Accno, strBranchCode);

            string[] skipColumns = { "BRANCHCODE","CURRENCYCODE","MODULEID","GLCODE","EFFECTIVEDATE","STATUS","APPLICATIONDATE","USERID","MACHINEID","VERIFIEDBY",
                "VERIFIEDMACHINE","APPROVEDBY","APPROVEDMACHINE","TRANSTATUS", "SYSTEMDATE", "FCURRENCYCODE" };

            DataRow row = RSModule.Rows.Count > 0 ? RSModule.Rows[0] : null!;

            for (int i = 0; i < RSModule.Columns.Count; i++)
            {
                string colName = RSModule.Columns[i].ColumnName.ToUpper();
                if (!skipColumns.Contains(colName))
                {
                    strParamFlds += RSModule.Columns[i].ColumnName + ",";
                    if (row != null)
                    {
                        var val = row[i] == DBNull.Value ? "" : row[i].ToString();
                        strParamVals += val + strDelimiter;
                    }
                    else
                        strParamVals += "" + strDelimiter;
                }
            }

            string strParamTabs = strTabName;

            // Retrieving data from GENTRANTYPEMST parameter table
            strQuery = "CASHDRYN, CASHCRYN, TRANSFERDRYN, TRANSFERCRYN, CLEARINGDRYN, CLEARINGCRYN";
            string strCondition = " currencycode='" + StrCurCode + "'";

            await ParameterRecord("GENTRANTYPEMST", strQuery, "GENTRANTYPEMSTHIST", strCondition, StrModuleCode, strGLCode,
                StrCurCode, TrannDate, strDelimiter);

            strParamTabs = strParamTabs + ",GENTRANTYPEMST";

            // Parameters for minmaxbalance based on forex moduleid
            if (StrModuleCode == "FXDEP")
                StrFxMinMAxTab = "FXDEPMINMAXDTLS";
            else if (StrModuleCode == "FXLOAN")
                StrFxMinMAxTab = "FXLOANMINMAXDTLS";

            strQuery = "Select MINTERM, MINPERIOD, MAXTERM, MAXPERIOD, MINAMOUNT, MAXAMOUNT, TDSYN from " + StrFxMinMAxTab + " where glcode='" + strGLCode + "' and EFFECTIVEDATE = " +
                "(select max(EFFECTIVEDATE) from " + StrFxMinMAxTab + " where glcode='" + strGLCode + "' and EFFECTIVEDATE<='" + TrannDate + "' and FCurrencycode='" + StrCurCode + 
                "' and (categorycode='" + CatCode + "' or categorycode='99')) and (categorycode='" + CatCode + "'  or categorycode='99') and FCurrencycode='" + StrCurCode + "'";

            Rstemp = await ProcessQueryAsync(strQuery);

            // If no records at master table for that effective date then query history table
            if (Rstemp.Rows.Count < 1)
                strQuery = "Select MINTERM, MINPERIOD, MAXTERM, MAXPERIOD, MINAMOUNT, MAXAMOUNT ,TDSYN from " + StrFxMinMAxTab + "HIST where glcode='" + strGLCode + "' and EFFECTIVEDATE " +
                    "= (select max(EFFECTIVEDATE) from " + StrFxMinMAxTab + " where glcode='" + strGLCode + "' and EFFECTIVEDATE<='" + TrannDate + "' and FCurrencycode='" + StrCurCode + 
                    "' and (categorycode='" + CatCode + "' or categorycode='99')) and FCurrencycode='" + StrCurCode + "' and (categorycode='" + CatCode + "'  or categorycode='99')";

            Rstemp = await ProcessQueryAsync(strQuery);

            strParamTabs = strParamTabs + "," + StrFxMinMAxTab;

            row = RSModule.Rows.Count > 0 ? RSModule.Rows[0] : null!;

            for (int i = 0; i < Rstemp.Columns.Count; i++)
            {
                strParamFlds = strParamFlds + RSModule.Columns[i].ColumnName + ",";
                if (Rstemp.Rows.Count > 0)
                {
                    var val = row[i] == DBNull.Value ? "" : row[i].ToString();
                    strParamVals += val + strDelimiter;
                }
                else
                    strParamVals = strParamVals + "" + strDelimiter;
            }

            if (StrModuleCode == "FXDEP")
            {
                strQuery = "Select PERCENTAGE from FXDEPPENALINTDTLS where glcode='" + strGLCode + "' and EFFECTIVEDATE= (select max(EFFECTIVEDATE) from FXDEPPENALINTDTLS where glcode='" + 
                    strGLCode + "' and " + "EFFECTIVEDATE<='" + TrannDate + "' and FCurrencycode='" + StrCurCode + "' and (categorycode='" + CatCode + "' or categorycode='99')) and " +
                    "(categorycode='" + CatCode + "' or categorycode='99') and FCurrencycode='" + StrCurCode + "'";

                Rstemp = await ProcessQueryAsync(strQuery);

                // If no records at master table for that effective date then query history table

                if (Rstemp.Rows.Count < 1)
                {
                    strQuery = "Select PERCENTAGE from FXDEPPENALINTDTLSHIST where glcode='" + strGLCode + "' and EFFECTIVEDATE= (select max(EFFECTIVEDATE) from FXDEPPENALINTDTLSHIST " +
                        "where glcode='" + strGLCode + "' and " + "EFFECTIVEDATE<='" + TrannDate + "' and FCurrencycode='" + StrCurCode + "' and (categorycode='" + CatCode + 
                        "' or categorycode='99')) and FCurrencycode='" + StrCurCode + "' and (categorycode='" + CatCode + "' or categorycode='99')";

                    Rstemp = await ProcessQueryAsync(strQuery);
                }

                strParamTabs = strParamTabs + ",FXDEPPENALINTDTLS";

                row = RSModule.Rows.Count > 0 ? RSModule.Rows[0] : null!;

                for (int i = 0; i < Rstemp.Columns.Count; i++)
                {
                    strParamFlds = strParamFlds + RSModule.Columns[i].ColumnName + ",";
                    if (Rstemp.Rows.Count > 0)
                    {
                        var val = row[i] == DBNull.Value ? "" : row[i].ToString();
                        strParamVals += val + strDelimiter;
                    }
                    else
                        strParamVals = strParamVals + "" + strDelimiter;
                }
            }

            strParamFlds = strParamFlds.Substring(0, strParamFlds.Length - 1);
            strParamVals = strParamVals.Substring(0, strParamVals.Length - 1);

            strQuery = " select " + strParamFlds + " from " + strParamTabs + " where 1=2";

            await ProcessQueryAsync(strQuery);

            // Entering the parameter data into the dummy recordset.
            string[] arrParamFlds = strParamFlds.Split(",");
            string[] arrParamVals = strParamVals.Split(strDelimiter);

            DataRow newRow = RsGLParam.NewRow();

            for (int i = 0; i < arrParamFlds.Length; i++)
            {
                string value = Conversions.ToString(arrParamVals[i]).Trim();
                newRow[arrParamFlds[i]] = string.IsNullOrEmpty(value) ? DBNull.Value : value;
            }

            RsGLParam.Rows.Add(newRow);

            return RsGLParam;

            // errhand:
            //    objErrlog.LogError "GeneralTranQueries", "FXTransactionParameters", Err.Number, Err.Description
        }

        public async Task<DataTable> AccNoTransactionParameters(string Branchcode, string ModuleCode, string GLcode, string TransactionDate, string CurrencyCode = "", string Accno = "", 
            string CategoryCode = "", string ChqBookYN = "", string[] ModuleConditions = null!, string userBranchcode = "", string UserID = "", string machineid = "")
        {
            string[] arrModuleQuery;

            string strDelimiter = "~";
            string strQuery = "", strBrCatCode = "", TDSYN = "";

            string StrModuleCode = ModuleCode.Trim().ToUpper();
            string strGLCode = GLcode.Trim().ToUpper();
            string strBranchCode = Branchcode.Trim().ToUpper();
            string strCurCode = CurrencyCode.Trim().ToUpper();
            string strAccno = string.IsNullOrWhiteSpace(Accno) ? "" : Accno.Trim().ToUpper();
            string CatCode = string.IsNullOrWhiteSpace(CategoryCode) ? "" : CategoryCode.Trim().ToUpper();
            string ChqBkYN = string.IsNullOrWhiteSpace(ChqBookYN) ? "" : ChqBookYN.Trim().ToUpper();
            var arrModCond = ModuleConditions;

            DataTable Rstemp = null!, RsAccParam = null!;

            // Retrieving the account category code based on moduleid
            if (!string.IsNullOrWhiteSpace(strAccno))
            {
                if (StrModuleCode == "SB" || StrModuleCode == "CA" || StrModuleCode == "DEP")
                {
                    strQuery = "Select CHEQUEBOOK, TDSYN, CATEGORYCODE from " + StrModuleCode + "MST" + _dataLink + " where branchcode='" + strBranchCode + "' and accno='" +
                        strAccno + "' and glcode='" + strGLCode + "' and currencycode='" + strCurCode + "'";

                    Rstemp = await ProcessQueryAsync(strQuery);

                    if (Rstemp.Rows.Count > 0)
                    {
                        DataRow row = Rstemp.Rows[0];
                        TDSYN = Convert.IsDBNull(row["TDSYN"]) ? "" : Conversions.ToString(row["TDSYN"]);
                    }
                }
                else if (StrModuleCode == "LOAN")
                {
                    strQuery = "Select CHEQUEBOOK, CATEGORYCODE from " + StrModuleCode + "MST" + _dataLink + " where branchcode='" + strBranchCode + "' and accno='" + 
                        strAccno + "' and glcode='" + strGLCode + "'";

                    Rstemp = await ProcessQueryAsync(strQuery);

                    TDSYN = "";
                }

                if (Rstemp != null && Rstemp.Rows.Count > 0)
                {
                    DataRow row = Rstemp.Rows[0];

                    CatCode = Convert.IsDBNull(row["CategoryCode"]) ? "" : Conversions.ToString(row["CategoryCode"]);
                    ChqBkYN = Convert.IsDBNull(row["CHEQUEBOOK"]) ? "" : Conversions.ToString(row["CHEQUEBOOK"]);
                }
            }

            // Retrieving the branch category code
            Rstemp = await ProcessQueryAsync("Select BRANCHCATCODE from GENBANKBRANCHMST where branchcode='" + strBranchCode + "'");

            if (Rstemp != null && Rstemp.Rows.Count > 0)
            {
                DataRow row = Rstemp.Rows[0];
                strBrCatCode = Convert.IsDBNull(row["BRANCHCATCODE"]) ? "" : Conversions.ToString(row["BRANCHCATCODE"]);
            }

            BankingExtensions.ReleaseMemory(Rstemp!);

            string strParamTabs = "";

            if (strBrCatCode == "99")
                strBrCatCode = "";

            if (CatCode == "99")
                CatCode = "";

            // Retrieving data from GENMINMAXBALANCEMST parameter table
            strQuery = "MINAMOUNT, MAXAMOUNT, MINPERIODYEARS, MINPERIODMON, MINPERIODDAYS, MAXPERIODYEARS, MAXPERIODMON, MAXPERIODDAYS,TDS,MULTIPLESOF";

            string strCondition = " (CATEGORYCODE='" + CatCode + "' or CATEGORYCODE='99') and (BRANCHCATCODE='" + strBrCatCode + "' or BRANCHCATCODE='99') and currencycode='" + 
                strCurCode + "'";

            await ParameterRecord("GENMINMAXBALANCEMST", strQuery, "GENMINMAXBALANCEMSTHIST", strCondition, StrModuleCode, strGLCode,
                strCurCode, TransactionDate, strDelimiter);

            strParamTabs = "GENMINMAXBALANCEMST,";

            // Retrieving data from GENCHARGESMSTHIST parameter table
            strQuery = "OUTRTNCHARGES, OUTRTNFREQ, OUTRTNCHARGEEXEMPT, OUTRTNGLCODE, INWRTNCHARGES, INWRTNFREQ, INWRTNCHARGESEXEMPT, INWRTNGLCODE, STOPPAYCHARGES, STOPPAYFREQ, " +
                "STOPPAYCHARGESEXEMPT, STOPPAYGLCODE, ACCTCLOSCHARGES, ACCOUNTCLOSFREQ, ACCTCLOSCHARGESEXEMPT, ACCTCLOSGLCODE, MINTODCHARGES, MINTODFREQ, MINTODGLCODE, " +
                "CHQISSUECHARGES, CHQISSUEFREQ, CHQISSUECHARGESEXEMPT, CHQISSUEGLCODE, STATEMENTCHARGES, STATEMENTCHRGFREQ, STATEMENTCHARGESEXEMPT, STATEMENTCHRGGLCODE, " +
                "DUPSTATEMENTCHARGES, DUPSTATEMENTCHRGFREQ, DUPSTATEMENTCHARGESEXEMPT, DUPSTATEMENTGLCODE, CHARGESPERFOLIO, FOLIOCHARGESFREQ, ENTRIESPERFOLIO, FOLIOCHARGESGLCODE, " +
                "EXEMPTEDFOLIOS, MINTODCHARGESEXEMPT, CHQVALIDPERIOD,OUTRTNCHARGEEXEMPTUNIT, INWRTNCHARGESEXEMPTUNIT, STOPPAYCHARGESEXEMPTUNIT, ACCTCLOSCHARGESEXEMPTUNIT, " +
                "CHQISSUECHARGESEXEMPTUNIT, STATEMENTCHARGESEXEMPTUNIT, DUPSTATEMENTCHARGESEXEMPTUNIT, MINTODCHARGESEXEMPTUNIT, INWRTNFREQUNITS, OUTRTNFREQUNITS, STOPPAYFREQUNITS, " +
                "ACCOUNTCLOSFREQUNITS, MINTODFREQUNITS, CHQISSUEFREQUNITS, STATEMENTCHRGFREQUNITS, DUPSTATEMENTCHRGFREQUNITS, FOLIOCHARGESFREQUNITS, OUTRTNINITIAL, " +
                "OUTRTNINITIALUNITS, INWRTNINITIAL, INWRTNINITIALUNITS, STOPPAYINITIAL, STOPPAYINITIALUNITS, ACCOUNTCLOSINITIAL, ACCOUNTCLOSINITIALUNITS, MINTODINITIAL, " +
                "MINTODINITIALUNITS, CHQISSUEINITIAL, CHQISSUEINITIALUNITS, STATEMENTINITIAL, STATEMENTINITIALUNITS, DUPSTATEMENTINITIAL, DUPSTATEMENTINITIALUNITS, FOLIOINITIAL, " +
                "FOLIOINITIALUNITS, EXEMPTEDFOLIOSUNITS";

            strCondition = " (CATEGORYCODE='" + CatCode + "' or CATEGORYCODE='99') and (BRANCHCATCODE='" + strBrCatCode + "' or BRANCHCATCODE='99') and currencycode='" + strCurCode + "'";

            await ParameterRecord("GENCHARGESMST", strQuery, "GENCHARGESMSTHIST", strCondition, StrModuleCode, strGLCode,
                strCurCode, TransactionDate, strDelimiter);

            strParamTabs = strParamTabs + "GENCHARGESMST";

            // strParamFlds = Left(strParamFlds, Len(strParamFlds) - 1);

            // If moduleid is deposits than extra parameters from DEPPENALINTDTLS
            if (StrModuleCode == "DEP")
            {
                strCondition = " (CATEGORYCODE='" + CatCode + "' or CATEGORYCODE='99') and currencycode='" + strCurCode + "'";
                await ParameterRecord("DEPPENALINTDTLS", "PNLINTPCNT", "DEPPENALINTDTLSHIST", strCondition, StrModuleCode,
                    strGLCode, strCurCode, TransactionDate, strDelimiter);
                strParamTabs = strParamTabs + ",DEPPENALINTDTLS";
            }

            // Fields for Dummy recordset
            strParamFlds = strParamFlds.Substring(0, strParamFlds.Length - 1);
            strParamVals = strParamVals.Substring(0, strParamVals.Length - 1);

            // Query for Dummy recordset of GENMINMAXBALANCEMST and GENCHARGESMST
            strQuery = " select " + strParamFlds + " from " + strParamTabs + " where 1=2";

            RsAccParam = await ProcessQueryAsync(strQuery);

            // Entering the parameter data into the dummy recordset.
            string[] arrParamFlds = strParamFlds.Split(",");
            string[] arrParamVals = strParamVals.Split(strDelimiter);

            // Adding record to dummy recordset
            DataRow newRow = RsAccParam.NewRow();

            for (int i = 0; i < arrParamFlds.Length; i++)
            {
                string value = Conversions.ToString(arrParamVals[i]).Trim();
                newRow[arrParamFlds[i]] = string.IsNullOrEmpty(value) ? DBNull.Value : value;
            }

            RsAccParam.Rows.Add(newRow);

            return RsAccParam;

            //errhand:
            //objErrlog.LogError "GeneralTranQueries", "DBConnection", Err.Number, Err.Description
        }

        public async Task<string> GetAccountDetail(string BranchCode, string CurrencyCode, string ModuleId, string GlCode, string AccNo)
        {
            double dblLimitAmt, dblLoanSchAmt, dblIntAccr, dblDPAmt, dblOverDueBal, dblLoanPrnc, dblClearBal = 0, dblpendamt = 0;
            string strChqBookYN = "", strOprBy = "", strOprInstr = "", strCustId = "", sBrApplDate, strGetBal, strTotValues = "", strFlds, strWhereCond = "", strMstTable = "";

            AccountBalanceModel accountBalanceModel = new AccountBalanceModel();

            DataTable recIntPaidUpto = null!, recIntAccured = null!, dataTable = null!, recLoanBal = null!, recdepdet = null!, 
                recLoanRecovery = null!, recLoanRecoveryDtls = null!;

            if (ModuleId.Equals("ATM", StringComparison.OrdinalIgnoreCase))
            {
                accountBalanceModel = await GetBalance(BranchCode, CurrencyCode, ModuleId, GlCode, AccNo, "Y");
                strGetBal = accountBalanceModel.GetBalance;

                if (!string.IsNullOrWhiteSpace(strGetBal) && strGetBal!.Substring(0, 5) == "ERROR")
                    throw new Exception();
                
                strTotValues = accountBalanceModel.dblClearBal + "|" + accountBalanceModel.dblUnclrBal + "|" + accountBalanceModel.dblNetBal + "|" + 
                    strCustId + "|" + strOprBy + "|" + strOprInstr + "|" + strChqBookYN + "|" + accountBalanceModel.dblpendamt;
            }

            if (ModuleId.Equals("SB") || ModuleId.Equals("CA") || ModuleId.Equals("LOAN") || ModuleId.Equals("CC") ||
                ModuleId.Equals("PIGMY") || ModuleId.Equals("INV") || ModuleId.Equals("SHARES") || ModuleId.Equals("SCHOOL"))
            {
                // To know Custmer Id, Cheque Book fecility
                accountBalanceModel = await GetBalance(BranchCode, CurrencyCode, ModuleId, GlCode, AccNo, "Y");
                strGetBal = accountBalanceModel.GetBalance;

                if (!string.IsNullOrWhiteSpace(strGetBal) && strGetBal!.Substring(0, 5) == "ERROR")
                    throw new Exception();

                strFlds = "customerid,chequebook,operatinginstr,operatedby";
                strMstTable = accountBalanceModel.StrMstTable;
                strWhereCond = " accno='" + AccNo.Trim() + "' and glcode='" + GlCode.Trim() + "' and branchcode='" + BranchCode.Trim() + "' and Currencycode='" + 
                    CurrencyCode.Trim().ToUpper() + "'";
                dataTable = await SingleRecordSet(strMstTable, strFlds, strWhereCond);

                if (dataTable.Rows.Count > 0)
                {
                    strCustId = Conversions.ToString(dataTable.Rows[0]["customerid"]);
                    strOprInstr = Conversions.ToString(dataTable.Rows[0]["operatinginstr"]);
                    if (!string.IsNullOrWhiteSpace(strOprInstr))
                    {
                        string whCond = "opercode='" + strOprInstr + "'";
                        DataTable recOprInstr = await SingleRecordSet("GENOPERINSTMST", "narration", whCond);
                        if (recOprInstr.Rows.Count > 0)
                            strOprInstr = Conversions.ToString(recOprInstr.Rows[0]["narration"]);
                        BankingExtensions.ReleaseMemory(recOprInstr);
                    }
                    strOprBy = Conversions.ToString(dataTable.Rows[0]["operatedby"]);
                    if (!string.IsNullOrEmpty(Conversions.ToString(dataTable.Rows[0]["chequebook"])))
                        strChqBookYN = "Y";
                    else
                        strChqBookYN = "N";
                }

                // Concatenating all these values with "|" to return function
                if (ModuleId.ToUpper() == "SB" || ModuleId.ToUpper() == "CA" || ModuleId.ToUpper() == "SCHOOL")
                    strTotValues = accountBalanceModel.dblClearBal + "|" + accountBalanceModel.dblUnclrBal + "|" + accountBalanceModel.dblNetBal + "|" + 
                        strCustId + "|" + strOprBy + "|" + strOprInstr + "|" + strChqBookYN + "|" + accountBalanceModel.dblpendamt;
                else
                    strTotValues = accountBalanceModel.dblClearBal + "|" + accountBalanceModel.dblUnclrBal + "|" + accountBalanceModel.dblNetBal + "|" + 
                        strCustId + "|" + strOprBy + "|" + strOprInstr + "|" + strChqBookYN;
            }
            else if (ModuleId.Equals("FXLOANS") || ModuleId.Equals("FXDEP") || ModuleId.Equals("FXBILLS") || ModuleId.Equals("PL") ||
                ModuleId.Equals("MISC") || ModuleId.Equals("BILLS") || ModuleId.Equals("LC") || ModuleId.Equals("LG"))
            {
                accountBalanceModel = await GetBalance(BranchCode, CurrencyCode, ModuleId, GlCode, AccNo, "N");
                strGetBal = accountBalanceModel.GetBalance;

                if (ModuleId.Equals("FXLOANS") || ModuleId.Equals("FXDEP") || ModuleId.Equals("FXBILLS") ||
                    ModuleId.Equals("LC") || ModuleId.Equals("LG"))
                {
                    strTotValues = accountBalanceModel.dblClearBal + "|" + accountBalanceModel.dblUnclrBal + "|" + accountBalanceModel.dblNetBal + "|" +
                        strCustId + "|" + strOprBy + "|" + strOprInstr + "|";
                }
                else if (ModuleId.Equals("PL") || ModuleId.Equals("MISC") || ModuleId.Equals("BILLS"))
                {
                    strTotValues = accountBalanceModel.dblClearBal + "|" + accountBalanceModel.dblUnclrBal + "|" + accountBalanceModel.dblNetBal + "|" + 
                        strCustId + "|" + strOprBy + "|" + strOprInstr + "|" + accountBalanceModel.dblpendamt;
                }
            }

            // LOANS
            if (ModuleId.Equals("LOAN"))
            {
                strFlds = "nvl(SANCTIONEDAMT,0) SANCTIONAMOUNT";
                recLoanBal = await SingleRecordSet(strMstTable, strFlds, strWhereCond);

                if (recLoanBal.Rows.Count > 0)
                    strTotValues = strTotValues + "|" + recLoanBal.Rows[0]["SANCTIONAMOUNT"].ToString();
                else
                    strTotValues = strTotValues + "|" + "0";

                strFlds = "nvl(sum(PRINCIPLEDB),0) principalamt";

                recLoanRecovery = await SingleRecordSet("loanrecoverydaydtls", strFlds, strWhereCond);

                if (recLoanRecovery.Rows.Count > 0)
                    dblLoanPrnc = Convert.ToDouble(recLoanRecovery.Rows[0]["principalamt"]);
                else
                    dblLoanPrnc = 0;

                strFlds = "nvl(sum(PRINCIPLEDB),0) principalamt";

                recLoanRecoveryDtls = await SingleRecordSet("loanrecoverydtls", strFlds, strWhereCond);

                if (recLoanRecoveryDtls.Rows.Count > 0)
                    dblLoanPrnc = dblLoanPrnc + Convert.ToDouble(recLoanRecoveryDtls.Rows[0]["principalamt"]);
                else
                    dblLoanPrnc = dblLoanPrnc + 0;

                strTotValues = strTotValues + "|" + dblLoanPrnc;

                // Get Interest Accrued
                dblIntAccr = await GetIntAccrued(BranchCode, CurrencyCode, ModuleId, GlCode, AccNo);
                strTotValues = strTotValues + "|" + dblIntAccr;

                // Get application date of given branch
                sBrApplDate = await GetBranchApplDate(BranchCode);

                // Get Loan Schedule Amt as on application date
                dblLoanSchAmt = await GetLoanScheduleAmt(BranchCode, CurrencyCode, GlCode, AccNo, sBrApplDate);

                // Calculate Overdue Balance
                dblOverDueBal = 0;
                if (Math.Abs(dblClearBal) > dblLoanSchAmt)
                    dblOverDueBal = Math.Abs(dblClearBal) - dblLoanSchAmt;

                strTotValues = strTotValues + "|" + dblOverDueBal;
                strTotValues = strTotValues + "|" + dblpendamt;
            }

            // Cash Credit
            if (ModuleId.Equals("CC"))
            {
                sBrApplDate = await GetBranchApplDate(BranchCode);
                dblLimitAmt = await GetLimitAmt(BranchCode, CurrencyCode, ModuleId, GlCode, AccNo, sBrApplDate);
                dblDPAmt = await GetDrawingPowerAmt(BranchCode, CurrencyCode, ModuleId, GlCode, AccNo);

                if (Math.Abs(dblDPAmt) > 0)
                    if (Math.Abs(dblDPAmt) < Math.Abs(dblLimitAmt))
                        dblLimitAmt = dblDPAmt;

                strTotValues = strTotValues + "|" + dblLimitAmt;

                // Calculate Overdue Balance
                dblOverDueBal = 0;
                if (Math.Abs(dblClearBal) > Math.Abs(dblLimitAmt))
                    dblOverDueBal = Math.Abs(dblClearBal) - Math.Abs(dblLimitAmt);
                strTotValues = strTotValues + "|" + dblOverDueBal + "|" + dblpendamt;
            }

            // Deposits
            if (ModuleId.Equals("DEP"))
            {
                accountBalanceModel = await GetBalance(BranchCode, CurrencyCode, ModuleId, GlCode, AccNo);
                strGetBal = accountBalanceModel.GetBalance;
                if (!string.IsNullOrWhiteSpace(strGetBal) && strGetBal!.Substring(0, 5) == "ERROR")
                    throw new Exception();

                strTotValues = "";
                int i;
                string strDepMstTab = "DEPMST";
                string strDepIntAccTab = "DEPINTACCRUEDDTLS";
                string strDepIntPaidTab = "DEPINTPAIDTOCUSTOMERDTLS";
                string strFldsMst = "nvl(OPBAL,0) OPENINGAMOUNT,nvl(MATURITYVALUE,0),CUSTOMERID,to_char(OPDATE,'dd-Mon-yyyy') OPDATE,to_char(EFFDATE,'dd-Mon-yyyy') EFFDATE," +
                    "to_char(MATURITYDATE,'dd-Mon-yyyy') MATDATE,OPERATEDBY,ROI,OPERATINGINSTR";
                string strFldsIntAccured = "nvl(sum(INTAMOUNT),0) INTACCURED";
                string strFldsPaidupto = "TO_CHAR(MAX(TO_DATE(TO_CHAR(intpaidupto,'dd-Mon-yyyy'),'dd-Mon-yyyy')),'dd-Mon-yyyy')";
                strWhereCond = " accno='" + AccNo.Trim() + "' and glcode='" + GlCode.Trim().ToUpper() + "' and branchcode='" + BranchCode.Trim() + "' and Currencycode='" + 
                    CurrencyCode + "'";
                string strIntAccuredWhereCond = strWhereCond;

                recdepdet = await SingleRecordSet(strDepMstTab, strFldsMst, strWhereCond);
                if (recdepdet.Rows.Count > 0)
                {
                    foreach (DataColumn col in recdepdet.Columns)
                        strTotValues += recdepdet.Rows[0][col].ToString() + "|";
                    strTotValues = strGetBal + "|" + strTotValues.Substring(0, strTotValues.Length - 1);
                    recIntAccured = await SingleRecordSet(strDepIntAccTab, strFldsIntAccured, strIntAccuredWhereCond);
                    recIntPaidUpto = await SingleRecordSet(strDepIntPaidTab, strFldsPaidupto, strWhereCond);
                    if (recIntAccured.Rows.Count > 0)
                        strTotValues = strTotValues + "|" + recIntAccured.Rows[0].ItemArray[0] + "|" + recIntPaidUpto.Rows[0].ItemArray[0];
                    else
                        strTotValues = strTotValues + "|" + "|";
                }
                else
                    strTotValues = strTotValues + "|NO";
                strTotValues = strTotValues + "|" + dblpendamt;
            }

            // Final total values
            return strTotValues;

            //ErrHand:
            //objErrlog.LogError "AccountDetails", "AccountDetail", Err.Number, Err.Description
        }

        public async Task<string> GetCustomerPhoto(string customerId)
        {
            string sqlQuery = "select CUSTOMERID, photo from genphotomst where customerid = '" + customerId + "' and status = 'R'";

            return await _oracleRetryHelper.GetImage(sqlQuery);
        }

        public async Task<string> GetCustomerSignature(string customerId)
        {
            string sqlQuery = "select CUSTOMERID, signature from gensignaturemst where customerid = '" + customerId + "' and status = 'R'";

            return await _oracleRetryHelper.GetImage(sqlQuery);
        }

        public async Task<string> GetBatchNo(string branchCode)
        {
            if (string.IsNullOrWhiteSpace(branchCode))
                throw new Exception("Branch Code should be sent or Sequence doesnot exists");

            string seqName = "SEQBATCHNO" + branchCode;
            string sqname = "select " + seqName + _dataLink + ".nextval BatchNo from dual";

            DataTable dataTable = await ProcessQueryAsync(sqname);

            string batchNo = "";

            if (dataTable.Rows.Count > 0)
            {
                DataRow row = dataTable.Rows[0];
                batchNo = Conversions.ToString(row["BatchNo"]);
            }
            else
                batchNo = "Batch No is Locked";

            BankingExtensions.ReleaseMemory(dataTable);
            return batchNo;

            //objErrlog.LogError "GeneralTranQueries", "GetBatchno", Err.Number, Err.Description
        }

        public async Task<string> GetTranNo(string branchCode)
        {
            if (string.IsNullOrWhiteSpace(branchCode))
                throw new Exception("Branch Code should be sent or Sequence doesnot exists");

            string seqName = "SEQTRANNO" + branchCode;

            string sqname = "select " + seqName + _dataLink + ".nextval Tranno from dual";

            DataTable dataTable = await ProcessQueryAsync(sqname);

            string tranNo = "";

            if (dataTable.Rows.Count > 0)
            {
                DataRow row = dataTable.Rows[0];
                tranNo = Conversions.ToString(row["tranno"]);
            }
            else
                tranNo = "Tran No is Locked";

            BankingExtensions.ReleaseMemory(dataTable);
            return tranNo;

            // objErrlog.LogError "GeneralTranQueries", "GetTranNo", Err.Number, Err.Description
        }



        #region Private Methods

        private async Task ModuleParameterRecord(string ModulePMTtable, string ModuleMSTtable = "", string Condition = "", string strGLCode = "", 
            string tranDate = "", string strAccNo = "", string strBranchCode = "")
        {
            string CatCode = "";

            // Selecting the Gl Parameters from the Moduleparameter table based on the effective date.

            string strModPmtTab = ModulePMTtable;

            string strQuery = " Select * from " + strModPmtTab + _dataLink + " where glcode='" + strGLCode + "' and EFFECTIVEDATE= (select max(EFFECTIVEDATE) from " + 
                strModPmtTab + _dataLink + " where glcode='" + strGLCode + "' and " + "EFFECTIVEDATE<='" + tranDate + "' " + Condition + ") " + Condition;

            DataTable RSModule = await ProcessQueryAsync(strQuery);

            // Selecting parameters from  module typemsthist table
            if (RSModule.Rows.Count < 1)
                RSModule = null!;

            strQuery = " Select * from " + strModPmtTab + "HIST" + _dataLink + " where glcode='" + strGLCode + "' and EFFECTIVEDATE= (select max(EFFECTIVEDATE) from " +
                strModPmtTab + "HIST" + _dataLink + " where glcode='" + strGLCode + "' and " + "EFFECTIVEDATE<='" + tranDate + "' " + Condition + ") " + Condition;

            RSModule = await ProcessQueryAsync(strQuery);

            if (RSModule.Rows.Count < 1)
                throw new Exception("Parameters not specified for this Component");

            if (ModuleMSTtable.Trim() != "" && strAccNo.Trim() != "")
            {
                strQuery = "Select CATEGORYCODE from " + ModuleMSTtable.Trim() + _dataLink + " where branchcode='" + strBranchCode + "' and glcode='" + strGLCode +
                    "' and Accno='" + strAccNo + "'";

                DataTable Rstemp = await ProcessQueryAsync(strQuery);

                if (Rstemp.Rows.Count == 1)
                    CatCode = Conversions.ToString(Rstemp.Rows[0]["CategoryCode"]);
                else
                    throw new Exception(" Account Holder's Category not specified.");
            }

            //ModuleParameterRecord = ConnError

            //    objErrlog.LogError "GeneralTranQueries", "ModuleParameterRecord", Err.Number, Err.Description
        }

        private async Task ParameterRecord(string PmtDtlsTabName, string PmtFields, string PmtDtlsHistTabName, string Condition,
            string strModuleCode = "", string strGLCode = "", string strCurCode = "", string tranDate = "", string strDelimiter = "")
        {
            string strQuery = "";

            strQuery = " Select " + PmtFields + " from " + PmtDtlsTabName + _dataLink + " where moduleid='" + strModuleCode + "' and glcode='" + strGLCode + 
                "' and status='R' and EFFECTIVEDATE<=(select max(EFFECTIVEDATE) from " + PmtDtlsTabName + _dataLink + " where moduleid='" + strModuleCode + "' and glcode='" + 
                strGLCode + "' and " + Condition + " and status='R' and currencycode='" + strCurCode + "' and EFFECTIVEDATE<='" + tranDate + "') And " + Condition;

            if (PmtDtlsTabName == "DEPPENALINTDTLS")
                strQuery = strQuery + " order by CATEGORYCODE ";

            DataTable Rstemp = await ProcessQueryAsync(strQuery);

            // Selecting parameters from  module typemsthist table
            if (Rstemp.Rows.Count < 1)
                Rstemp = null!;

            strQuery = " Select " + PmtFields + " from " + PmtDtlsHistTabName + _dataLink + " where moduleid='" + strModuleCode + "' and glcode='" + strGLCode + "' and " + 
                Condition + " and EFFECTIVEDATE= (select max(EFFECTIVEDATE) from " + PmtDtlsHistTabName + _dataLink + " where moduleid='" + strModuleCode + "' and glcode='" + 
                strGLCode + "' and " + Condition + " and status='R' and currencycode='" + strCurCode + "' and EFFECTIVEDATE<='" + tranDate + "')";

            if (PmtDtlsHistTabName == "DEPPENALINTDTLSHIST")
                strQuery = strQuery + " order by CATEGORYCODE ";

            Rstemp = await ProcessQueryAsync(strQuery);

            foreach (DataColumn col in Rstemp.Columns)
            {
                strParamFlds += col.ColumnName + ",";

                if (Rstemp.Rows.Count > 0)
                {
                    object val = Rstemp.Rows[0][col];
                    strParamVals += (val == DBNull.Value ? "" : val.ToString()) + strDelimiter;
                }
                else
                    strParamVals += "" + strDelimiter;
            }

            //    objErrlog.LogError "GeneralTranQueries", "ParameterRecord", Err.Number, Err.Description
        }

        private async Task<AccountBalanceModel> GetBalance(string BranchCode, string CurrencyCode, string ModuleId, string GlCode, string AccNo, 
            string NetBalYN = "", string FCurBalYN = "")
        {
            AccountBalanceModel accountBalanceModel = new AccountBalanceModel();
            string strFlds, strWhereCond, strTranTable, FxCurCode = "", strBalTable;

            ModuleId = ModuleId.Trim().ToUpper();
            GlCode = GlCode.Trim().ToUpper();

            //Dim recObj As Object
            DataTable recTabName = null!;

            // To find master, tranday, backup, balance tables for the module id
            if (ModuleId.Equals("FXLOANS") || ModuleId.Equals("FXDEP") || ModuleId.Equals("FXBILLS") || ModuleId.Equals("LC") || 
                ModuleId.Equals("PIGMY") || ModuleId.Equals("LG") || ModuleId.Equals("INV") || ModuleId.Equals("SHARES"))
            {
                strFlds = "MASTERTABLE,BACKUPTABLE,BALANCETABLE";
                strWhereCond = "moduleid='" + ModuleId.Trim().ToUpper() + "'";

                recTabName = await SingleRecordSet("GENMODULEMST", strFlds, strWhereCond, "mastertable");

                if (!string.IsNullOrWhiteSpace(Conversions.ToString(recTabName.Rows[0]["mastertable"])) &&
                    !string.IsNullOrWhiteSpace(Conversions.ToString(recTabName.Rows[0]["BALANCETABLE"])))
                {
                    // To get Current Balance from respective balance tables
                    accountBalanceModel.StrMstTable = Conversions.ToString(recTabName.Rows[0]["mastertable"]);
                    accountBalanceModel.StrBalTable = Conversions.ToString(recTabName.Rows[0]["BALANCETABLE"]);
                    strBalTable = Conversions.ToString(recTabName.Rows[0]["BALANCETABLE"]);
                    if (ModuleId.Trim().ToUpper().Substring(0, 2).Equals("FX") && FCurBalYN.ToUpper() == "Y")
                        strFlds = "nvl(curbal,0) Curbal,nvl(fcurbal,0) FCurbal,FCurrencycode";
                    else
                        strFlds = "nvl(curbal,0) Curbal";

                    strWhereCond = " accno='" + AccNo.Trim() + "' and glcode='" + GlCode.Trim().ToUpper() + "' and branchcode='" + BranchCode.Trim() + 
                        "' and Currencycode='" + CurrencyCode.Trim() + "'";

                    recTabName = await SingleRecordSet(strBalTable, strFlds, strWhereCond);

                    if (recTabName.Rows.Count > 0)
                    {
                        if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN.ToUpper() == "Y")
                        {
                            accountBalanceModel.dblFxClBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["FCurbal"]));
                            FxCurCode = Conversions.ToString(recTabName.Rows[0]["FCurrencycode"]);
                        }
                        else
                            accountBalanceModel.dblFxClBal = 0;
                        accountBalanceModel.dblClBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["Curbal"]));
                    }
                    else
                    {
                        accountBalanceModel.dblClBal = 0;
                        accountBalanceModel.dblFxClBal = 0;
                    }

                    // To find sum(debits) or sum(credits) from respective trandaytables, if any
                    if (ModuleId.Trim().ToUpper().Substring(0, 2) == "FX" && FCurBalYN == "Y")
                        strFlds = "nvl(sum(nvl(amount,0)),0) Amt,nvl(sum(nvl(famount,0)),0) fAmt";
                    else
                        strFlds = "nvl(sum(nvl(amount,0)),0) Amt";

                    strWhereCond = " accno='" + AccNo.Trim().ToUpper() + "' and glcode='" + GlCode.Trim().ToUpper() + "' and branchcode='" + BranchCode.Trim().ToUpper() + 
                        "' and Currencycode='" + CurrencyCode.Trim().ToUpper() + "' and moduleid='" + ModuleId + "' and ((modeoftran in('2','4') and " +
                        "transtatus='A') or (modeoftran in('1','3','5','6')))";

                    strTranTable = "GENTRANSLOG";

                    recTabName = await SingleRecordSet(strTranTable, strFlds, strWhereCond);

                    if (recTabName.Rows.Count > 0)
                    {
                        if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN.ToUpper() == "Y")
                            accountBalanceModel.dblFxTranBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["Famt"]));
                        else
                            accountBalanceModel.dblFxTranBal = 0;
                        accountBalanceModel.dblTranBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["amt"]));
                    }
                    else
                    {
                        accountBalanceModel.dblTranBal = 0;
                        accountBalanceModel.dblFxTranBal = 0;
                    }

                    // To get sum(debits) or sum(credits) from gentranslog, if any
                    if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN.ToUpper() == "Y")
                        strFlds = "nvl(sum(nvl(amount,0)),0) Amt,nvl(sum(nvl(famount,0)),0) fAmt";
                    else
                        strFlds = "nvl(sum(nvl(amount,0)),0) Amt";

                    strWhereCond = "  accno='" + AccNo.Trim() + "' and glcode='" + GlCode + "' AND branchcode='" + BranchCode + "' and upper(Currencycode)='" + 
                        CurrencyCode.ToUpper() + "' and upper(moduleid)='" + ModuleId + "' and (modeoftran in('1','3','5') and upper(transtatus)='P')";

                    strTranTable = "gentemptranslog";

                    recTabName = await SingleRecordSet(strTranTable, strFlds, strWhereCond);

                    if (recTabName.Rows.Count > 0)
                    {
                        if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN.ToUpper() == "Y")
                            accountBalanceModel.dblFxTmpTrnBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["Famt"]));
                        else
                            accountBalanceModel.dblFxTmpTrnBal = 0;
                        accountBalanceModel.dblTmpTrnBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["amt"]));
                    }
                    else
                    {
                        accountBalanceModel.dblTmpTrnBal = 0;
                        accountBalanceModel.dblFxTmpTrnBal = 0;
                    }

                    // Calculating Clear Balance, Unclear Balance, Net Balance
                    accountBalanceModel.dblClearBal = accountBalanceModel.dblClBal + accountBalanceModel.dblTranBal + accountBalanceModel.dblTmpTrnBal;
                    accountBalanceModel.dblFxClearBal = accountBalanceModel.dblFxClBal + accountBalanceModel.dblFxTranBal + accountBalanceModel.dblFxTmpTrnBal;

                    // Calculating Unclear Balance only for domestic purpose
                    if (NetBalYN.ToUpper() == "Y" && (FCurBalYN == "" || FCurBalYN == "N"))
                    {
                        strFlds = "nvl(sum(nvl(amount,0)),0) Amt";
                        strTranTable = "genunclearbalancedtls";
                        strWhereCond = " accno='" + AccNo.Trim() + "' and glcode='" + GlCode + "' and branchcode='" + BranchCode + "' and upper(Currencycode)='" + 
                            CurrencyCode.ToUpper() + "' and upper(moduleid)='" + ModuleId + "'";
                        recTabName = await SingleRecordSet(strTranTable, strFlds, strWhereCond);
                        if (recTabName.Rows.Count > 0)
                            accountBalanceModel.dblUnclrBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["amt"]));
                        else
                            accountBalanceModel.dblUnclrBal = 0;
                        accountBalanceModel.dblNetBal = accountBalanceModel.dblClearBal - accountBalanceModel.dblUnclrBal;

                        // This line of code was uncommented by Radhika Reason: For CC accounts I didnot get balances
                        accountBalanceModel.GetBalance = Conversions.ToString(accountBalanceModel.dblNetBal);
                    }

                    if (NetBalYN == "Y")
                        accountBalanceModel.GetBalance = Conversions.ToString(accountBalanceModel.dblNetBal);
                    else
                    {
                        if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN == "Y")
                            accountBalanceModel.GetBalance = accountBalanceModel.dblClearBal + "~" + accountBalanceModel.dblFxClearBal + "~" + FxCurCode;
                        else
                            accountBalanceModel.GetBalance = Conversions.ToString(accountBalanceModel.dblClearBal);
                    }
                }
            }
            else if (ModuleId.Equals("SB") || ModuleId.Equals("CA") || ModuleId.Equals("SCHOOL") || ModuleId.Equals("DEP") ||
                ModuleId.Equals("LOAN") || ModuleId.Equals("CC") || ModuleId.Equals("PL") || ModuleId.Equals("MISC") || 
                ModuleId.Equals("BILLS") || ModuleId.Equals("ATM"))
            {
                strFlds = "MASTERTABLE,BACKUPTABLE,BALANCETABLE";
                strWhereCond = "moduleid='" + ModuleId + "'";
                recTabName = await SingleRecordSet("GENMODULEMST", strFlds, strWhereCond, "mastertable");


                if (!string.IsNullOrWhiteSpace(Conversions.ToString(recTabName.Rows[0]["mastertable"])) &&
                    !string.IsNullOrWhiteSpace(Conversions.ToString(recTabName.Rows[0]["BALANCETABLE"])))
                {
                    // To get Current Balance from respective balance tables
                    accountBalanceModel.StrMstTable = Conversions.ToString(recTabName.Rows[0]["mastertable"]);
                    accountBalanceModel.StrBalTable = Conversions.ToString(recTabName.Rows[0]["BALANCETABLE"]);

                    strBalTable = Conversions.ToString(recTabName.Rows[0]["BALANCETABLE"]);

                    if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN == "Y")
                        strFlds = "nvl(curbal,0) Curbal,nvl(fcurbal,0) FCurbal,FCurrencycode";
                    else
                        strFlds = "nvl(curbal,0) Curbal";

                    strWhereCond = " accno='" + AccNo.Trim() + "' and glcode='" + GlCode + "' and branchcode='" + BranchCode.Trim() + "' and Currencycode='" +
                        CurrencyCode + "'";

                    recTabName = await SingleRecordSet(strBalTable, strFlds, strWhereCond);

                    if (recTabName.Rows.Count > 0)
                        accountBalanceModel.dblClBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["Curbal"]));
                    else
                        accountBalanceModel.dblClBal = 0;

                    // To find sum(debits) or sum(credits) from respective trandaytables, if any
                    strFlds = "nvl(sum(nvl(amount,0)),0) Amt";
                    strTranTable = "GENTRANSLOG";
                    strWhereCond = "accno='" + AccNo.Trim().ToUpper() + "' and glcode='" + GlCode + "' and branchcode='" + BranchCode.Trim().ToUpper() + 
                        "' and moduleid='" + ModuleId + "' and ((modeoftran in('2','4') and transtatus='A') or (modeoftran in('1','3','5','6'))) and Currencycode='" + 
                        CurrencyCode.Trim().ToUpper() + "'";

                    recTabName = await SingleRecordSet(strTranTable, strFlds, strWhereCond);

                    if (recTabName.Rows.Count > 0)
                    {
                        if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN == "Y")
                            accountBalanceModel.dblFxTranBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["Famt"]));
                        else
                            accountBalanceModel.dblFxTranBal = 0;
                        accountBalanceModel.dblTranBal = Convert.ToDouble(Conversions.ToString(recTabName.Rows[0]["amt"]));
                    }
                    else
                    {
                        accountBalanceModel.dblTranBal = 0;
                        accountBalanceModel.dblFxTranBal = 0;
                    }

                    // To get sum(debits) or sum(credits) from gentranslog, if any
                    if (ModuleId.Trim().ToUpper().StartsWith("FX") && FCurBalYN == "Y")
                        strFlds = "nvl(sum(nvl(amount,0)),0) Amt,nvl(sum(nvl(famount,0)),0) fAmt";
                    else
                        strFlds = "nvl(sum(nvl(amount,0)),0) Amt";

                    strWhereCond = " accno='" + AccNo.Trim() + "' and glcode='" + GlCode + "' and branchcode='" + BranchCode + "' and Currencycode='" + 
                        CurrencyCode.ToUpper() + "' and upper(moduleid)='" + ModuleId + "' and (modeoftran in('1','3','5') and upper(transtatus)='P')";

                    strTranTable = "gentemptranslog";

                    recTabName = await SingleRecordSet(strTranTable, strFlds, strWhereCond);

                    if (recTabName.Rows.Count > 0)
                    {
                        DataRow row = recTabName.Rows[0];

                        if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN == "Y")
                            accountBalanceModel.dblFxTmpTrnBal = Convert.ToDouble(row["Famt"]);
                        else
                            accountBalanceModel.dblFxTmpTrnBal = 0;
                        accountBalanceModel.dblTmpTrnBal = Convert.ToDouble(row["amt"]);
                    }
                    else
                    {
                        accountBalanceModel.dblTmpTrnBal = 0;
                        accountBalanceModel.dblFxTmpTrnBal = 0;
                    }

                    strFlds = "nvl(sum(nvl(amount,0)),0) Amt";
                    strTranTable = "GENTRANSLOG";

                    strWhereCond = " accno='" + AccNo.Trim().ToUpper() + "' and glcode='" + GlCode + "' and branchcode='" + BranchCode.Trim().ToUpper() + 
                        "' and Currencycode='" + CurrencyCode.Trim().ToUpper() + "' and moduleid='" + ModuleId + "' and ((modeoftran in('2','4') and transtatus='P'))";

                    recTabName = await SingleRecordSet(strTranTable, strFlds, strWhereCond);

                    if (recTabName.Rows.Count > 0)
                    {
                        DataRow row = recTabName.Rows[0];

                        accountBalanceModel.dblTranBalp = Convert.ToDouble(row["amt"]);
                        accountBalanceModel.dblpendbalp = Convert.ToDouble(row["amt"]);
                    }
                    else
                    {
                        accountBalanceModel.dblTranBalp = 0;
                        accountBalanceModel.dblpendbalp = 0;
                    }

                    // Calculating Clear Balance, Unclear Balance, Net Balance, account bal
                    accountBalanceModel.dblClearBal = accountBalanceModel.dblClBal + accountBalanceModel.dblTranBal + accountBalanceModel.dblTmpTrnBal;
                    accountBalanceModel.dblpendamt = accountBalanceModel.dblpendbalp;

                    // Calculating Unclear Balance only for domestic purpose
                    if (NetBalYN.ToUpper() == "Y" && (FCurBalYN == "" || FCurBalYN == "N"))
                    {
                        strFlds = "nvl(sum(nvl(amount,0)),0) Amt";
                        strTranTable = "genunclearbalancedtls";

                        strWhereCond =
                        " accno='" + AccNo.Trim() +
                        "' and glcode='" + GlCode.Trim().ToUpper() +
                        "' and branchcode='" + BranchCode +
                        "' and Currencycode='" + CurrencyCode.ToUpper() +
                        "' and moduleid='" + ModuleId.Trim().ToUpper() + "'";

                        recTabName = await SingleRecordSet(strTranTable, strFlds, strWhereCond);

                        if (recTabName.Rows.Count > 0)
                            accountBalanceModel.dblUnclrBal = Convert.ToDouble(recTabName.Rows[0]["amt"]);
                        else
                            accountBalanceModel.dblUnclrBal = 0;

                        recTabName = await SingleRecordSet("GENCONFIGMST", "IMPYN", "CODE='CLGCTS'");

                        string strCtsClg = "N";

                        if (recTabName.Rows.Count > 0)
                            strCtsClg = Conversions.ToString(recTabName.Rows[0]["IMPYN"]);
                        else
                            strCtsClg = "N";

                        // Clearing Bal
                        accountBalanceModel.dblNetBal = accountBalanceModel.dblClearBal - accountBalanceModel.dblUnclrBal + accountBalanceModel.dblpendbalp;
                        if (strCtsClg == "Y")
                        {
                            accountBalanceModel.dblNetBal = Convert.ToDouble(accountBalanceModel.dblClearBal) + accountBalanceModel.dblpendbalp;
                            accountBalanceModel.dblClearBal = Convert.ToDouble(accountBalanceModel.dblClearBal) + Convert.ToDouble(accountBalanceModel.dblUnclrBal);
                        }
                        else
                        {
                            accountBalanceModel.dblNetBal = Convert.ToDouble(accountBalanceModel.dblClearBal) - Convert.ToDouble(accountBalanceModel.dblUnclrBal) + accountBalanceModel.dblpendbalp;
                        }

                        // This line of code was uncommented by Radhika Reason: For CC accounts I didnot get balances
                        accountBalanceModel.GetBalance = Conversions.ToString(accountBalanceModel.dblNetBal);
                    }
                }
                else
                {
                    if (ModuleId.Substring(0, 2) == "FX" && FCurBalYN == "Y")
                        accountBalanceModel.GetBalance = Conversions.ToString(accountBalanceModel.dblClearBal) + "~" + Conversions.ToString(accountBalanceModel.dblFxClearBal) + "~" + FxCurCode;
                    else
                        accountBalanceModel.GetBalance = Conversions.ToString(accountBalanceModel.dblClearBal);
                }

                // We need to handle Recurring type deposits separately
                if (ModuleId.Equals("DEP"))
                {
                    // Check whether given Deposit GL is a RD type or not
                    recTabName = await SingleRecordSet("deptypemst", "nvl(instsyn,'N') InstlmntYN", "upper(trim(moduleid))='DEP' and " +
                        "upper(trim(glcode))='" + GlCode + "'");

                    if (Conversions.ToString(recTabName.Rows[0]["InstlmntYN"]) == "Y") // i.e. Given Deposit GL is of RDtype
                    {
                        // So get & add Interest Accrued to A/C balance
                        strTranTable = "DEPINTACCRUEDDTLS";
                        strFlds = "nvl(SUM(nvl(intamount,0)),0) SumIntAmt";
                        strWhereCond = " accno='" + AccNo.Trim() + "' AND glcode='" + GlCode + "' AND branchcode='" + BranchCode.Trim() + "' AND currencycode='" + 
                            CurrencyCode + "' AND moduleid='DEP'";
                        recTabName = await SingleRecordSet(strTranTable, strFlds, strWhereCond);
                        if (NetBalYN == "Y")
                            accountBalanceModel.GetBalance = Conversions.ToString(accountBalanceModel.dblNetBal);
                        else
                            accountBalanceModel.GetBalance = Conversions.ToString(accountBalanceModel.dblClearBal);
                    }
                }
                else
                    accountBalanceModel.GetBalance = "";
            }

            return accountBalanceModel;

            //ErrHand:
            // objErrlog.LogError "AccountDetails", "GetBalance", Err.Number, Err.Description
        }

        private async Task<double> GetIntAccrued(string BrCode, string CurCode, string ModId, string GlCode, string AccNo)
        {
            string sFlds;
            string sTabName = ModId.Trim().ToUpper() + "INTACCRUEDDTLS";

            if (ModId.ToUpper() == "DEP")
                sFlds = "nvl(SUM(INTAMOUNT),'0') AMT";
            else
                sFlds = "Sum(nvl(debit, 0)) - Sum(nvl(credit, 0))   AMT ";

            string sCond = " ACCNO='" + AccNo + "' and GLCODE='" + GlCode + "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CurCode + "' AND MODULEID='" + ModId + "'";

            DataTable dataTable = await SingleRecordSet(sTabName, sFlds, sCond);

            double dblAmt;

            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                DataRow row = dataTable.Rows[0];
                dblAmt = Convert.IsDBNull(row["amt"]) ? 0 : Convert.ToDouble(row["amt"]);
            }
            else
                dblAmt = 0;

            BankingExtensions.ReleaseMemory(dataTable!);
            return dblAmt;
        }

        private async Task<string> GetBranchApplDate(string BrCode)
        {
            string sCond = " branchcode='" + BrCode + "'";

            DataTable dataTable = await SingleRecordSet("GENAPPLICATIONDATEMST", "to_char(applicationdate,'dd-Mon-yyyy')", sCond);

            if (dataTable != null && dataTable.Rows.Count == 0)
                throw new Exception("Application Date of Given Branch code not found");

            string strResult = Conversions.ToString(dataTable!.Rows[0].ItemArray[0]);
            BankingExtensions.ReleaseMemory(dataTable);
            return strResult;
        }

        private async Task<double> GetLoanScheduleAmt(string BrCode, string CurCode, string GlCode, string AccNo, string CutOffDt)
        {
            string sCond = " ACCNO='" + AccNo + "' and repayduedate = (SELECT MAX(repayduedate) FROM LOANSCHEDULEDTLS b WHERE b.BRANCHCODE=a.BRANCHCODE AND " +
                "b.CURRENCYCODE=a.CURRENCYCODE AND b.glcode=a.glcode AND b.accno=a.accno AND b.repayduedate <='" + CutOffDt + "') AND GLCODE='" + GlCode + 
                "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CurCode + "'";

            DataTable dataTable = await SingleRecordSet("LOANSCHEDULEDTLS a", "NVL(balanceamt,0) AMT", sCond);

            double dblAmt;

            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                DataRow row = dataTable.Rows[0];
                dblAmt = Convert.IsDBNull(row["amt"]) ? 0 : Convert.ToDouble(row["amt"]);
            }
            else
                dblAmt = 0;

            BankingExtensions.ReleaseMemory(dataTable!);
            return dblAmt;
        }

        private async Task<double> GetLimitAmt(string BrCode, string CurCode, string ModId, string GlCode, string AccNo, string BrApplDate)
        {
            string sCond = " LINKEDACCNO='" + AccNo + "' and LINKEDGLCODE='" + GlCode + "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CurCode + 
                "' AND LINKEDMODULEID='" + ModId + "' and closedate is null and status='R' and expirydate >='" + BrApplDate + "'";

            DataTable dataTable = await SingleRecordSet("GENLIMITLNK", "Sum(nvl(LINKEDAMOUNT,0)) amt", sCond);

            double dblLimitAmt;

            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                DataRow row = dataTable.Rows[0];
                dblLimitAmt = Convert.IsDBNull(row["amt"]) ? 0 : Convert.ToDouble(row["amt"]);
            }
            else
                dblLimitAmt = 0;

            BankingExtensions.ReleaseMemory(dataTable!);
            return dblLimitAmt;
        }

        private async Task<double> GetDrawingPowerAmt(string BrCode, string CurCode, string ModId, string GlCode, string AccNo)
        {
            string sCond = " ACCNO='" + AccNo + "' and GLCODE='" + GlCode + "' AND BRANCHCODE='" + BrCode + "' AND CURRENCYCODE='" + CurCode + "' AND MODULEID='" + 
                ModId + "' and status='R'";

            DataTable dataTable = await SingleRecordSet("gendpdtls", "nvl(DRAWINGPOWER,0) amt", sCond);

            double dblLimitAmt;

            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                DataRow row = dataTable.Rows[0];
                dblLimitAmt = Convert.IsDBNull(row["amt"]) ? 0 : Convert.ToDouble(row["amt"]);
            }
            else
                dblLimitAmt = 0;

            BankingExtensions.ReleaseMemory(dataTable!);
            return dblLimitAmt;
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

        #endregion
    }
}
