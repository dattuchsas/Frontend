namespace Banking.APIService.LoginService
{
    public class LoginService : BankingBaseService
    {
        public const string _baseRoute = "login";

        public LoginService(BankingBaseService bankingBaseService) 
            : base(bankingBaseService.BaseAddress, bankingBaseService.HttpClient, bankingBaseService.ApiKey, bankingBaseService.SecretToken)
        {
        }

        public async Task<string> ValidateUser(string userId)
        {
            return await ProcessBankingAPIResponseAsync(this, "GET", $"{_baseRoute}/", $"validateUser/{userId}"); 
        }

        public async Task<string> GetEODProgress(string userId)
        {
            return await ProcessBankingAPIResponseAsync(this, "GET", $"{_baseRoute}/", $"getEODProgress/{userId}");
        }
    }
}
