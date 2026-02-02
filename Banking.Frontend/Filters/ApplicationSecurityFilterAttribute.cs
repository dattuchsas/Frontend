using System.Reflection;
using Banking.Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace Banking.Frontend
{
    public class ApplicationSecurityAttribute : ActionFilterAttribute
    {
        // TODO: Before the action executes
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // 1.Controller name validation
            var controllerName = context.RouteData.Values["controller"]?.ToString();

            if (!string.IsNullOrEmpty(controllerName))
            {
                List<string> controllerNames = typeof(ControllerNames).GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
                    .Where(f => f.IsLiteral && !f.IsInitOnly).Select(x => x.Name).ToList();

                if (!controllerNames.Contains(controllerName))
                {
                    context.HttpContext.Session.Clear();

                    context.Result = new RedirectToRouteResult(
                    new RouteValueDictionary
                            {
                                            { "controller", ControllerNames.Login },
                                            { "action", ActionNames.Index }
                            });
                }
            }

            // 2. Claims validation
            //var user = context.HttpContext.User;

            //if (!user.Identity?.IsAuthenticated ?? true)
            //{
            //    context.Result = new RedirectToRouteResult(
            //    new RouteValueDictionary
            //            {
            //                                { "controller", ControllerNames.Login },
            //                                { "action", ActionNames.Index }
            //            });
            //}

            //var requiredClaim = user.FindFirst("permission");

            //if (requiredClaim == null || requiredClaim.Value != "CanAccess")
            //{
            //    context.Result = new ForbidResult();
            //    return;
            //}

            // 3️. Header validation (example)
            // if (!context.HttpContext.Request.Headers.TryGetValue("X-App-Key", out var appKey)
            //     || appKey != "expected-key")
            // {
            //     context.Result = new BadRequestObjectResult("Invalid App Key");
            //     return;
            // }

            // 4️. Route / action argument validation
            // if (context.ActionArguments.TryGetValue("id", out var id))
            // {
            //     if (id == null || !int.TryParse(id.ToString(), out _))
            //     {
            //         context.Result = new BadRequestObjectResult("Invalid ID");
            //         return;
            //     }
            // }

            // If we reach here → request is valid
            base.OnActionExecuting(context);
        }

        // TODO: After the action executes
        public override void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }
}
