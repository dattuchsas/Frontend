namespace Banking.Interfaces
{
    public interface IGetDetailsService
    {
        Task<string> GetAadhaarDetails(string aadhaarNumber);
        Task<string> GetPANDetails(string panNumber);
        Task<string> SearchCustomer(string searchString);
        Task<string> PANDefuctInfo(string searchString);
        Task<string> GetModifiedCustomerPANDetails(string searchString);
        Task<string> GetModifiedCustomerAadhaarDetails(string searchString);
    }
}
