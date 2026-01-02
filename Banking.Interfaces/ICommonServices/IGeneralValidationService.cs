namespace Banking.Interfaces
{
    public interface IGeneralValidationService
    {
        Task<string> GetHOTRALWBrCode();
    }
}
