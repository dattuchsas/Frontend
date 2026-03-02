using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Frontend.Controllers
{
    public class ListController : BaseController
    {
        public ListController(ILogger<LoginController> logger, IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
        }

        // ServiceId
        [HttpGet]
        public async Task<IActionResult> GetServiceIdList(string searchString)
        {
            List<SelectListItem> list = await _listService.GetServiceList(searchString);

            return Json(list);
        }

        // TellerModuleId or MatTellerModuleId or AutoTellerModuleId
        [HttpGet]
        public async Task<IActionResult> GetModuleIdList(string searchString)
        {
            var list = await _listService.GetModuleId(searchString);

            return Json(list);
        }
    }
}
