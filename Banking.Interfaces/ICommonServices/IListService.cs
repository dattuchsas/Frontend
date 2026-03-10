using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Interfaces
{
    public interface IListService
    {
        Task<List<SelectListItem>> GetServiceList(string searchString = "");
        Task<List<SelectListItem>> GetModuleList(string whereCondition = "");
        Task<List<SelectListItem>> GetModuleId(string searchString = "");
        Task<List<SelectListItem>> GetGLQuery(string searchString = "", string hidsearch = "", string userId = "");
        Task GetTransList(string searchString = "", string hidsearch = "", string userId = "");
        Task<string> GetOnBlur(string searchString = "");
    }
}
