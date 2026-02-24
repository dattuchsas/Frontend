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

        [HttpGet]
        public async Task<IActionResult> GetServiceIdList(string searchString)
        {
            List<SelectListItem> list = await _listService.GetServiceList(searchString);

            return Json(list);
        }

        [HttpGet]
        public async Task<IActionResult> GetModuleIdList(string searchString)
        {
            List<SelectListItem> list = await _listService.GetServiceList(searchString);

            return Json(list);
        }
    }
}
