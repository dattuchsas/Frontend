using Banking.Models;
using Microsoft.AspNetCore.Http;
using System.Data;

namespace Banking.Interfaces
{
    public interface ILoginService
    {
        Task<string> LoginValidate(string userId);
        Task<string> GetEODProgress(string userId);
        Task<RedirectModel> LoginCheckProcess(ISession session, string userId, string firstPass, string secPass, string hdndaybegin, string status, string remoteHost);
        Task<RedirectModel> Logout(ISession session);
    }
}
