using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Interfaces
{
    public interface IListService
    {
        Task<List<SelectListItem>> GetServiceList(string searchString = "");
        Task<List<SelectListItem>> GetModuleList(string whereCondition = "");
    }
}
