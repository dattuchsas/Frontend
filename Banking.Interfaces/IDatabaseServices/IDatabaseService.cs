using System.Data;

namespace Banking.Interfaces
{
    public interface IDatabaseService
    {
        Task<DataTable> ProcessQueryAsync(string query);

        Task<DataTable> SingleRecordSet(string TabName, string FldNames, string wherecondition = "", string OrderClause = "",
            string BranchCode = "", string UserCode = "", string MachineID = "", string CompName = "");

        Task<string> ProcessDataTransactions(string[,] TransDataArray, string BranchCode = "", string UserCode = "", string MachineID = "", 
            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "", string glcode = "", string moduleid = "");

        Task<DataTable> GetModuleId(string branchCode, string AllModulesYN = "", string UserID = "", string VouchingYN = "", string ModuleCondition = "");

        Task<DataTable> GetBranchCodes(string userId);

        Task<DataTable> GetGLCodes(string BRCode, string ModuleCode, string GLCategory = "");

        Task<DataTable> GetAccountNumbers(string BRCode, string ModuleCode = "", string GLcode = "", string CurrencyCode = "", string AccStatus = "",
            string TableName = "", string RemType = "", string accSearch = "");

        //Task<string> ModifyQueriedTrans(string TableName, string FldNames, string[] ArrValues, string wherecondition = "", string BranchCode = "",
        //    string UserCode = "", string MachineID = "");

        //Task<string> Modify(bool BlnModify, string[] arrTabDetails = null!);

        //Task<string> GetAutoNumberAsync(string TabName, string AutoNumFldName, string WhereCondition = "", string InitialNum = "");

        //Task<string> GetAutoTextAsync(string TabName, string AutoNumFldName, string InitialAutoText, string WhereCondition = "");

        //Task<string> GetMaxAccountNoAsync(string TabName, string AccFldName, string WhereCondition = "", string InitialAutoText = "");

        Task<DataTable> GLTransactionParameters(string ModuleCode, string GLcode, string TransactionDate, string CurrencyCode = "", string userBranchcode = "",
            string UserID = "", string machineid = "");

        Task<DataTable> FXTransactionParameters(string Branchcode, string ModuleCode, string GLcode, string TransactionDate, string FCurrencyCode = "", string Accno = "", 
            string CategoryCode = "", string userBranchcode = "", string UserID = "", string machineid = "");

        Task<DataTable> AccNoTransactionParameters(string Branchcode, string ModuleCode, string GLcode, string TransactionDate, string CurrencyCode = "", string Accno = "",
            string CategoryCode = "", string ChqBookYN = "", string[] ModuleConditions = null!, string userBranchcode = "", string UserID = "", string machineid = "");

        Task<string> GetAccountDetail(string BranchCode, string CurrencyCode, string ModuleId, string GlCode, string AccNo);

        Task<string> GetCustomerPhoto(string customerId);

        Task<string> GetCustomerSignature(string customerId);

        Task<string> GetBatchNo(string branchCode);

        Task<string> GetTranNo(string branchCode);
    }
}
