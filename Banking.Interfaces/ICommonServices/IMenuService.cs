using Banking.Models;

namespace Banking.Interfaces
{
    public interface IMenuService
    {
        Task GetUserModules(string userId, string branchCode);
        Task<List<Menu>> GetUserMenu(string userId, string moduleId, string groupCode);
    }
}
