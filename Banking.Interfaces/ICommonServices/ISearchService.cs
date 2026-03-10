namespace Banking.Interfaces
{
    public interface ISearchService
    {
        Task<string> GetCustomerListByName(string customerName);
    }
}
