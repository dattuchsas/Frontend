using Microsoft.AspNetCore.Http;

namespace Banking.Interfaces
{
    public interface ILoginService
    {
        Task<string> LoginValidate(string userId);
        Task<string> GetEODProgress(string userId);
        Task<IDictionary<string, string>> LoginCheckProcess(ISession session, string userId, string firstPass, string secPass, string hdndaybegin, string status, string remoteHost);
    }
}
