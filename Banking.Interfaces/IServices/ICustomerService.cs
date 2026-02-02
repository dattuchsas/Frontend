using Banking.Models;

namespace Banking.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerModel> GetCustomerDetails(string custId = "");
    }
}
