using Banking.Models;
using Microsoft.AspNetCore.Http;

namespace Banking.Interfaces
{
    public interface ISBCAAccountOpeningService
    {
        Task<string> SBCAAccountOpening(ISession session, SBCAAccountOpeningModel accountopeningmodel);
        Task<SBCAAccountOpeningModel> GetSBCAAccountOpeningDetails(ISession session,string brcode = "", string moduleid = "", string glcode = "", string accno = "");
    }
}
