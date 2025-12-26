namespace Banking.Interfaces
{
    public interface ITransactionalService
    {
        Task<string> InsertRecord(string TableName, string FldNames, string[] ArrValues, string BranchCode = "", string UserCode = "",
            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");

        Task<string> BulkInsert(string TableName, string FldNames, string sQueryToGetValues, string BranchCode = "", string UserCode = "",
            string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");

        Task<string> UpdateRecord(string TableName, string FldNames, string[] Arrvalues, string WhereCondition = "", string BranchCode = "",
            string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");

        Task<string> DeleteRecord(string TableName, string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");

        Task<string> DeleteRecordOnly(string TableName, string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");

        Task<string> DeleteRecordGen(string TableName, string WhereCondition, string BranchCode = "", string UserCode = "", string MachineID = "",
            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");

        Task<string> RejectRecord(string TableName, string WhereCondition = "", string BranchCode = "", string UserCode = "", string MachineID = "",
            string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");

        Task<string> InsertUsingSelect(string TableName, string FldNames, string[] ArrValues, string WhereCondition = "", string BranchCode = "",
            string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");

        Task<string> InsertUsingSelectHist(string TableName, string FldNames, string[] ArrValues, string WhereCondition = "", string BranchCode = "",
            string UserCode = "", string MachineID = "", string ApplicationDate = "", string DayBeginEndStatusCheckYN = "");
    }
}
