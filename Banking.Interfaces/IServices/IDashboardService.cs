using System.Data;

namespace Banking.Interfaces
{
    public interface IDashboardService
    {
        Task<DataTable> GetUserModuleList(string fields, string condition);
        Task<DataTable> GetServiceVirtualDirectoryDetails(string fields, string condition);
        Task<string> GetHOTRALWBrCode();
    }
}
