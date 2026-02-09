using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Microsoft.AspNetCore.Mvc;

public class MenuViewComponent : ViewComponent
{
    private readonly IMenuService _menuService;
    private ISession session => HttpContext.Session;

    public MenuViewComponent(IMenuService menuService)
    {
        _menuService = menuService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        // You can access everything here
        // HttpContext, User, Session, RouteData, etc.

        string controllerName = Conversions.ToString(session!.GetString(SessionConstants.ControllerName));
        string selectedModule = Conversions.ToString(session!.GetString(SessionConstants.SelectedModule));
        string groupCode = Conversions.ToString(session!.GetString(SessionConstants.GroupCode));

        BaseModel model = new BaseModel
        {
            ApplicationDate = Conversions.ToString(session!.GetString(SessionConstants.ApplicationDate)),
            UserId = Conversions.ToString(session!.GetString(SessionConstants.UserId)),
            Branch = Conversions.ToString(session!.GetString(SessionConstants.BranchCode))
        };

        if (!controllerName.Equals(ControllerNames.Login) && !controllerName.Equals(ControllerNames.Dashboard))
            model.MenuDetails = await _menuService.GetUserMenu(model.UserId.ToUpper(), selectedModule, groupCode);

        return View(model);
    }
}
