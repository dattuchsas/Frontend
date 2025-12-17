using Banking.APIService;
using Microsoft.AspNetCore.Mvc;
using System.Configuration;

namespace Banking.Frontend.Controllers
{
    public class BaseController : Controller
    {
        public BankingBaseService _bankingBaseService;
        public IConfiguration _configuration;

        public string BaseAddress { get; set; }
        public string ApiKey { get; set; }
        public string SecretToken { get; set; }
        public HttpClient httpClient { get; set; }

        public BaseController(IConfiguration configuration)
        {
            _configuration = configuration;
            if (httpClient == null!)
            {
                httpClient = new HttpClient();
            }

            BaseAddress = _configuration.GetValue<string>("APIURL") ?? string.Empty;
            ApiKey = _configuration.GetValue<string>("ApiKey") ?? string.Empty;
            SecretToken = "TestBankingApplication";

            _bankingBaseService = new BankingBaseService(BaseAddress, httpClient, ApiKey, SecretToken);
        }
    }
}
