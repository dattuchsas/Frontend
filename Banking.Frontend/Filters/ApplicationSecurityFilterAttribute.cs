using Humanizer;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Banking.Frontend
{
    public class ApplicationSecurityFilterAttribute : ActionFilterAttribute
    {
        // TODO: Before the action executes
        public override void OnActionExecuting(ActionExecutingContext actionExecutingContext)
        {
            string bankName = actionExecutingContext.HttpContext.Session.GetString("BankColorOption") ?? string.Empty;

            actionExecutingContext.HttpContext.Session.SetString("background", !string.IsNullOrWhiteSpace(bankName) ? $"bg-{bankName.ToLower()}" : "bg-baseBank");
            actionExecutingContext.HttpContext.Session.SetString("header", !string.IsNullOrWhiteSpace(bankName) ? $"hd-{bankName.ToLower()}" : "hd-baseBank");
            actionExecutingContext.HttpContext.Session.SetString("btnBank", !string.IsNullOrWhiteSpace(bankName) ? $"btn{bankName.Camelize()}" : "btnBaseBank");
            actionExecutingContext.HttpContext.Session.SetString("textColor", !string.IsNullOrWhiteSpace(bankName) ? $"bg-text-{bankName.ToLower()}" : "bg-text-baseBank");
        }

        // TODO: After the action executes
        public override void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }
}
