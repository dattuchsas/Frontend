using Banking.APIService.LoginService;
using Banking.Models;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Frontend.Controllers
{
    public class LoginController : BaseController
    {
        private readonly ILogger<LoginController> _logger;
        private LoginService _loginService;

        public LoginController(ILogger<LoginController> logger, IConfiguration configuration) : base(configuration)
        {
            _loginService = new LoginService(_bankingBaseService);
            _logger = logger;
        }

        public ActionResult Index()
        {
            _logger.LogInformation("Login Page");
            ViewData["Title"] = "Login Page";
            return View();
        }

        // GET: LoginController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: LoginController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: LoginController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(LoginModel loginModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return View(loginModel);
                }


                var result = _loginService.GetEODProgress(loginModel.Username);

                if (result.Equals("906"))
                {

                }
                else
                {
                    var data = _loginService.ValidateUser(loginModel.Username);
                }
                    // Second Password - txtBio

                    //if (stri == "906")
                    //{
                    //alert("HO Day End in Progress, please wait some time.")
                    //window.document.frmlogin.txtUid.value = ""
                    //window.document.frmlogin.txtPwd.value = ""
                    //window.document.frmlogin.txtBio.value = ""
                    //return
                    //}

                    // else

                    // txtUsr not empty, call LoginValidate(UsrId)

                    // capture result from LoginValDisplay, execute the result based on the below condition

                    //if (stri.substring(0, 3) == "NoA")
                    //{
                    //    alert(stri.substring(4))
                    //    window.document.frmlogin.hdndaybegin.value = "notover"
                    //    LoginChk()
                    //    return;
                    //}
                    //else if (stri.substring(0, 3) == "NoL")
                    //{
                    //    alert(stri.substring(4))
                    //    window.document.frmlogin.hdndaybegin.value = "notover"
                    //    LoginChk()
                    //    return;
                    //}
                    //else if (stri.substring(0, 3) == "NoP")
                    //{
                    //    alert(stri.substring(4))
                    //    window.document.frmlogin.hdndaybegin.value = "notover"
                    //    LoginChk()
                    //    return;
                    //}
                    //else if (stri.substring(0, 3) == "Noo")
                    //{
                    //    alert(stri.substring(4))
                    //    window.document.frmlogin.hdndaybegin.value = "notover"
                    //    LoginChk()
                    //    return;
                    //}
                    //else if (stri.substring(0, 3) == "Mes")
                    //{
                    //    alert(stri.substring(4))
                    //    window.document.frmlogin.hdndaybegin.value = "over"
                    //    LoginChk()
                    //    return;
                    //}
                    //else if (stri.substring(0, 3) == "DLL")
                    //{
                    //    alert(stri.substring(4))
                    //    //window.document.frmlogin.hdndaybegin.value = "over"
                    //    //LoginChk()
                    //    return;
                    //}
                    //else
                    //{
                    //    window.document.frmlogin.hdndaybegin.value = "over"
                    //    LoginChk()
                    //    return;
                    //}

                    //function LoginChk()
                    //{
                    //    var fPwd, Biopwd, cmpVal1, cmpVal2
                    //    fPwd = window.document.frmlogin.txtPwd.value
                    //    Biopwd = window.document.frmlogin.txtBio.value
                    //    cmpVal1 = window.document.frmlogin.txtUid.value + "1"
                    //    cmpVal2 = window.document.frmlogin.txtUid.value + "2"
                    //    window.document.frmlogin.cmdOk.disabled = false

                    //    if (window.document.frmlogin.txtUid.value == "")
                    //    {
                    //        alert("User Id should not be empty")
                    //    }
                    //    else if (window.document.frmlogin.txtPwd.value == "")
                    //    {
                    //        alert("Password should not be empty")
                    //    }
                    //    else if (window.document.frmlogin.txtBio.value == "")
                    //    {
                    //        alert("Second Password should not be empty")
                    //    }
                    //    else if (fPwd == cmpVal1 && Biopwd == cmpVal2)
                    //    {
                    //        alert("Change Your Default Passwords Then Login")
                    //    }
                    //    else
                    //    {
                    //        window.document.frmlogin.cmdOk.disabled = true
                    //        window.document.frmlogin.status.value = ""
                    //        window.document.frmlogin.status.value = "Login"
                    //        window.document.frmlogin.action = "LoginCheck.aspx"
                    //        window.document.frmlogin.method = "post"
                    //        window.document.frmlogin.submit()
                    //    }
                    //}

                    return RedirectToAction(nameof(Index), "Home");
            }
            catch
            {
                return View();
            }
        }

        // GET: LoginController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: LoginController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: LoginController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: LoginController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
