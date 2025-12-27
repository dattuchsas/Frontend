using System.Data;

namespace Banking.Interfaces
{
    public interface IDatabaseService
    {
        Task<DataTable> ProcessQueryAsync(string query);

        Task<DataTable> SingleRecordSet(string TabName, string FldNames, string wherecondition = "", string OrderClause = "",
            string BranchCode = "", string UserCode = "", string MachineID = "", string CompName = "");

        Task<string> ProcessDataTransactions(string[,] TransDataArray, string BranchCode = "", string UserCode = "",
            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "",
            string glcode = "", string moduleid = "");

        //Task<string> ModifyQueriedTrans(string TableName, string FldNames, string[] ArrValues, string wherecondition = "", string BranchCode = "",
        //    string UserCode = "", string MachineID = "");

        //Task<string> Modify(bool BlnModify, string[] arrTabDetails = null!);

        //Task<string> GetAutoNumberAsync(string TabName, string AutoNumFldName, string WhereCondition = "", string InitialNum = "");

        //Task<string> GetAutoTextAsync(string TabName, string AutoNumFldName, string InitialAutoText, string WhereCondition = "");

        //Task<string> GetMaxAccountNoAsync(string TabName, string AccFldName, string WhereCondition = "", string InitialAutoText = "");
    }
}
