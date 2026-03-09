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
        Task<string> GetDetails(string searchString = "");
        Task<string> GetQueryDisplay(string searchString = "");
        Task<string[,]> GetSCRFlex(string searchString = "", int precision = 0);
    }
}
