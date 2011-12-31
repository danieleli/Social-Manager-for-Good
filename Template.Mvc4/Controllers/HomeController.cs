using System.Web.Mvc;

namespace SocialManager.Mvc4.Controllers
{
   public class HomeController : Controller
   {
      public ActionResult Index()
      {
         ViewBag.Message = "";

         return View();
      }

      public ActionResult About()
      {
         ViewBag.Message = "";

         return View();
      }

      public ActionResult Contact()
      {
         ViewBag.Message = "";

         return View();
      }

      public ActionResult Analytics()
      {
        return View();
      }

      public ActionResult Javascript()
      {
        return View();
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
