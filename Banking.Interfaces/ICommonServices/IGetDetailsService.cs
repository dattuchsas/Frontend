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
        Task<string> GetDetails(string searchString = "", string applicationDate = "");
        Task<string> GetQueryDisplay(string searchString = "");
        Task<string[,]> GetSCRFlex(string searchString = "", int precision = 0);
        Task<string> GetGenParameters(string searchString = "");
        Task<string> MinimumBalanceCheck(string searchString = "", string chequeValidPeriod = "");
        Task<string> GetBalanceDetails(string searchString = "", string applicationDate = "");
        Task<string> GetMessageCount(string searchString = "", string applicationDate = "", string groupCode = "");
        Task<string> GetCustomerPhoto(string customerId);
        Task<string> GetCustomerSignature(string customerId);
    }
}
