namespace Banking.Interfaces
{
    public interface INameSearchService
    {
        Task<string> GetCustomerListByName(string customerName);
    }
}
