using System.Data;

namespace Banking.Interfaces
{
    public interface IDashboardService
    {
        Task<string> GetHOTRALWBrCode();
        Task<DataTable> GetUserId(string query);
        Task<DataTable> ProcessSingleRecordRequest(string tblName, string fieldName, string whereCondition);
    }
}
