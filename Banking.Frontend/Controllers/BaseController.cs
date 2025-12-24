using Banking.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Banking.Frontend.Controllers
{
    public class BaseController : Controller
    {
        public IOptions<DatabaseSettings> _options;
        public IConfiguration _configuration;

        public BaseController(IConfiguration configuration)
        {
            _configuration = configuration;

            _options = Options.Create(_configuration.GetSection("OracleSettings").Get<DatabaseSettings>() ?? new DatabaseSettings());
        }
    }
}
