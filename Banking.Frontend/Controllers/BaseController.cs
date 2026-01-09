using Banking.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Banking.Frontend.Controllers
{
    [ApplicationSecurityFilter]
    public class BaseController : Controller
    {
        public IOptions<DatabaseSettings> _options;
        public IConfiguration _configuration;
        public string _bankName;

        public BaseController(IConfiguration configuration)
        {
            _configuration = configuration;

            _options = Options.Create(_configuration.GetSection("OracleSettings").Get<DatabaseSettings>() ?? new DatabaseSettings());

            _bankName = _configuration.GetValue<string>("BankName") ?? string.Empty;

            //var colorOptions = _configuration.GetSection("ApplicationColorSettings").Get<List<BaseModel>>() ?? new List<BaseModel>();

            //var bank = colorOptions.FirstOrDefault(x => x.IPAddress.Equals(remoteHost, StringComparison.Ordinal));

            //_baseModel = new BaseModel
            //{
            //    BankName = bank?.BankName ?? string.Empty,
            //    IPAddress = bank?.IPAddress ?? string.Empty
            //};
        }
    }
}
