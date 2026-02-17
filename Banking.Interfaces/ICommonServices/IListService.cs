using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Interfaces
{
    public interface IListService
    {
        Task<List<SelectListItem>> GetServiceList(string searchType = "", string whereCondition = "", string orderClause = "");
    }
}
