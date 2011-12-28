using System.Web.Mvc;

namespace SocialManager.Mvc4.Controllers
{
   public class HomeController : Controller
   {
      public ActionResult Index()
      {
         ViewBag.Message = "Modify this template to kick-start your ASP.NET MVC application.";

         return View("../social/index");
      }

      public ActionResult About()
      {
         ViewBag.Message = "Your quintessential app description page.";

         return View();
      }

      public ActionResult Contact()
      {
         ViewBag.Message = "Your quintessential contact page.";

         return View();
      }

      public ActionResult TwitterBootStrap()
      {
        return View();
      }

      public ActionResult Javascript()
      {
        return View();
      }

      public ActionResult Groceries()
      {
        return RedirectToAction("Index", "Purchases");
      }

      public ActionResult Gallery()
      {
        return View();
      }

      public ActionResult LessEditor()
      {
        return View();
      }
   }
}
