using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Interfaces
{
    public interface ITransactionalService
    {
        Task<List<SelectListItem>> GetBranchCodesByUserId(string userId);
    }
}
