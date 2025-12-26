using Banking.Backend;
using Banking.Interfaces;
using Banking.Models;
using Oracle.ManagedDataAccess.Client;
using System.Reflection.PortableExecutable;

namespace Banking.Services
{
    public class DatabaseService : IDatabaseService
    {
        private DatabaseFactory _databaseFactory;

        public DatabaseService(DatabaseSettings databaseSettings) 
        {
            _databaseFactory = new DatabaseFactory(databaseSettings);
        }

        public async Task<OracleDataReader> ProcessQuery(string query)
        {
            return await _databaseFactory.ProcessQuery(query);
        }

        public async Task<OracleDataReader> SingleRecordSet(string TabName, string FldNames, string wherecondition = "", string OrderClause = "",
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

        public async Task<string> ModifyQueriedTrans(string TableName, string FldNames, string[] ArrValues, string wherecondition = "", string BranchCode = "",
            string UserCode = "", string MachineID = "")
        {
            return await _databaseFactory.ModifyQueriedTrans(TableName, FldNames, ArrValues, wherecondition, BranchCode, UserCode, MachineID);
        }

        public async Task<string> Modify(bool BlnModify, string[] arrTabDetails = null!)
        {
            return await _databaseFactory.Modify(BlnModify, arrTabDetails);
        }

        public async Task<string> GetAutoNumberAsync(string TabName, string AutoNumFldName, string WhereCondition = "", string InitialNum = "")
        {
            return await _databaseFactory.GetAutoNumberAsync(TabName, AutoNumFldName, WhereCondition, InitialNum);
        }

        public async Task<string> GetAutoTextAsync(string TabName, string AutoNumFldName, string InitialAutoText, string WhereCondition = "")
        {
            return await _databaseFactory.GetAutoTextAsync(TabName, AutoNumFldName, InitialAutoText, WhereCondition);
        }

        public async Task<string> GetMaxAccountNoAsync(string TabName, string AccFldName, string WhereCondition = "", string InitialAutoText = "")
        {
            return await _databaseFactory.GetMaxAccountNoAsync(TabName, AccFldName, WhereCondition, InitialAutoText);
        }
    }
}
