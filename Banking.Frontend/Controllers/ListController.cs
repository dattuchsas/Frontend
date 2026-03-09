using Banking.Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Frontend.Controllers
{
    public class ListController : BaseController
    {
        public ListController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) 
            : base(configuration, httpContextAccessor)
        {
        }

        // ServiceId
        public async Task<IActionResult> GetServiceIdList(string searchString)
        {
            List<SelectListItem> list = await _listService.GetServiceList(searchString);

            return Json(list);
        }

        // TELLERMODULEID OR MATTELLERMODULEID OR AUTOTELLERMODULEID
        public async Task<IActionResult> GetModuleIdList(string searchString)
        {
            var list = await _listService.GetModuleId(searchString);

            return Json(list);
        }

        public async Task<IActionResult> GenOnBlur(string searchString)
        {
            var item = await _listService.GetOnBlur(searchString);

            return Json(item);
        }

        public async Task<IActionResult> ListGLQuery(string searchString = "", string hidsearch = "")
        {
            var item = await _listService.GetGLQuery(searchString, hidsearch, Conversions.ToString(session.GetString(SessionConstants.UserId)));

            return Json(item);
        }

        public async Task GetTransList(string searchString = "", string hidsearch = "")
        {
            await _listService.GetTransList(searchString, hidsearch, Conversions.ToString(session.GetString(SessionConstants.UserId)));

            // return Json(item);
        }
    }
}
