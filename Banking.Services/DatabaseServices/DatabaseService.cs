using Banking.Backend;
using Banking.Interfaces;
using Banking.Models;
using Oracle.ManagedDataAccess.Client;

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

        public string ProcessDataTransactions(string[,] TransDataArray, string BranchCode = "", string UserCode = "",
            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "",
            string glcode = "", string moduleid = "")
        {
            return string.Empty;
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
