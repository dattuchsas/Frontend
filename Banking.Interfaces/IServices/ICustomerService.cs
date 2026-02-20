using Banking.Models;
using Microsoft.AspNetCore.Http;

namespace Banking.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerModel> GetCustomerDetails(ISession session, string custId = "");
        Task<CustomerModel> NewCustomer(ISession session, string custId = "");
        Task<string> SaveCustomer(ISession session, CustomerModel customerModel, List<KYC> kycDocuments);
        Task<string> UpdateCustomer(ISession session, CustomerModel customerModel, List<KYC> kycDocuments, List<Relation> relations);
        Task<string> GetCustomerListByName(string name);
        Task<string> GetMemberNameById(string memberId);
    }
}
