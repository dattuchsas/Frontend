using Banking.Backend;
using Banking.Interfaces;
using Banking.Models;
using Oracle.ManagedDataAccess.Client;
using System.Data;
using System.Reflection.PortableExecutable;

namespace Banking.Services
{
    public class DatabaseService : IDatabaseService
    {
        private DatabaseFactory _databaseFactory;
        private readonly OracleRetryHelper _oracleRetryHelper;  

        public DatabaseService(DatabaseSettings databaseSettings)
        {
            _oracleRetryHelper = new OracleRetryHelper(databaseSettings);
            _databaseFactory = new DatabaseFactory(databaseSettings);
        }

        public async Task<DataTable> ProcessQueryAsync(string query)
        {
            return await _oracleRetryHelper.ProcessQueryWithRetryAsync(query);
        }

        public async Task<DataTable> SingleRecordSet(string TabName, string FldNames, string wherecondition = "", string OrderClause = "",
            string BranchCode = "", string UserCode = "", string MachineID = "", string CompName = "")
        {
            return await _databaseFactory.SingleRecordSet(TabName, FldNames, wherecondition, OrderClause, BranchCode, UserCode, MachineID, CompName);
        }

        public async Task<string> ProcessDataTransactions(string[,] TransDataArray, string BranchCode = "", string UserCode = "",
            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "",
            string glcode = "", string moduleid = "")
        {
            return await _databaseFactory.ProcessDataTransactions(TransDataArray, BranchCode, UserCode, MachineID, ApplicationDate, DayBeginEndStatusCheckYN, glcode, moduleid);
        }

        public async Task<DataTable> GetModuleId(string branchCode, string AllModulesYN = "", string UserID = "", string VouchingYN = "", string ModuleCondition = "")
        {
            return await _databaseFactory.GetModuleId(branchCode, AllModulesYN, UserID, VouchingYN, ModuleCondition);
        }

        public async Task<DataTable> GetBranchCodes(string userId)
        {
            return await _databaseFactory.GetBranchCodes(userId);
        }

        public async Task<DataTable> GetGLCodes(string BRCode, string ModuleCode, string GLCategory = "")
        {
            return await _databaseFactory.GetGLCodes(BRCode, ModuleCode, GLCategory);
        }

        public async Task<DataTable> GetAccountNumbers(string BRCode, string ModuleCode = "", string GLcode = "", string CurrencyCode = "", string AccStatus = "",
            string TableName = "", string RemType = "", string accSearch = "")
        {
            return await _databaseFactory.GetAccountNumbers(BRCode, ModuleCode, GLcode, CurrencyCode, AccStatus, TableName, RemType, accSearch);
        }

        public async Task<DataTable> GLTransactionParameters(string ModuleCode, string GLcode, string TransactionDate, string CurrencyCode = "", string userBranchcode = "",
            string UserID = "", string machineid = "")
        {
            return await _databaseFactory.GLTransactionParameters(ModuleCode, GLcode, TransactionDate, CurrencyCode, userBranchcode, UserID, machineid);
        }

        public async Task<DataTable> FXTransactionParameters(string Branchcode, string ModuleCode, string GLcode, string TransactionDate, string FCurrencyCode = "", string Accno = "",
            string CategoryCode = "", string userBranchcode = "", string UserID = "", string machineid = "")
        {
            return await _databaseFactory.FXTransactionParameters(Branchcode, ModuleCode, GLcode, TransactionDate, FCurrencyCode, Accno, CategoryCode, userBranchcode, 
                UserID, machineid);
        }

        public async Task<DataTable> AccNoTransactionParameters(string Branchcode, string ModuleCode, string GLcode, string TransactionDate, string CurrencyCode = "", string Accno = "",
            string CategoryCode = "", string ChqBookYN = "", string[] ModuleConditions = null!, string userBranchcode = "", string UserID = "", string machineid = "")
        {
            return await _databaseFactory.AccNoTransactionParameters(Branchcode, ModuleCode, GLcode, TransactionDate, CurrencyCode, Accno, CategoryCode, ChqBookYN, 
                ModuleConditions, userBranchcode, UserID, machineid);
        }

        //public async Task<string> ModifyQueriedTrans(string TableName, string FldNames, string[] ArrValues, string wherecondition = "", string BranchCode = "",
        //    string UserCode = "", string MachineID = "")
        //{
        //    return await _databaseFactory.ModifyQueriedTrans(TableName, FldNames, ArrValues, wherecondition, BranchCode, UserCode, MachineID);
        //}

        //public async Task<string> Modify(bool BlnModify, string[] arrTabDetails = null!)
        //{
        //    return await _databaseFactory.Modify(BlnModify, arrTabDetails);
        //}

        //public async Task<string> GetAutoNumberAsync(string TabName, string AutoNumFldName, string WhereCondition = "", string InitialNum = "")
        //{
        //    return await _databaseFactory.GetAutoNumberAsync(TabName, AutoNumFldName, WhereCondition, InitialNum);
        //}

        //public async Task<string> GetAutoTextAsync(string TabName, string AutoNumFldName, string InitialAutoText, string WhereCondition = "")
        //{
        //    return await _databaseFactory.GetAutoTextAsync(TabName, AutoNumFldName, InitialAutoText, WhereCondition);
        //}

        //public async Task<string> GetMaxAccountNoAsync(string TabName, string AccFldName, string WhereCondition = "", string InitialAutoText = "")
        //{
        //    return await _databaseFactory.GetMaxAccountNoAsync(TabName, AccFldName, WhereCondition, InitialAutoText);
        //}
    }
}
