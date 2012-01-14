using System.Linq;
using System.Web.Mvc;
using SocialManager.Mvc4.Models;
using SocialManager.Mvc4.Models.Core;

namespace SocialManager.Mvc4.Controllers
{
  public class ContactsController : Controller
  {
    private readonly IRepository<Contact> _contactRepository;

    #region -- Constructor --
    
    public ContactsController()
      : this(new GenericRepository<Contact>())
    {
      // If you are using Dependency Injection, you can delete the following constructor
    }

    public ContactsController(IRepository<Contact> contactRepository)
    {
      this._contactRepository = contactRepository;
    }

    #endregion //-- Constructor --

    public ViewResult Knockout()
    {
      return View();
    }

    public JsonResult KnockoutIndex()
    {
      var contacts = from c in _contactRepository.All
                     select new {c.Id, c.FirstName, c.LastName, c.Title};

      var jsonResult = new JsonResult()
                         {JsonRequestBehavior = JsonRequestBehavior.AllowGet, Data = contacts};
      return jsonResult;
    }

    public ViewResult Index()
    {
      return View(_contactRepository.All);
    }

    public ViewResult Details(int id)
    {
      return View(_contactRepository.Find(id));
    }

    #region -- Create --

    public ActionResult Create()
    {
      return View();
    }

    [HttpPost]
    public ActionResult Create(Contact contact)
    {
      if (ModelState.IsValid)
      {
        _contactRepository.InsertOrUpdate(contact, base.User.Identity.Name);
        _contactRepository.Save();
        if (Request.IsAjaxRequest())
        {
          return Json(contact, JsonRequestBehavior.AllowGet);
        }
        return RedirectToAction("Index");
      }
      else
      {
        return View();
      }
    }

    #endregion //-- Create --

    #region -- Edit --

    public ActionResult Edit(int id)
    {
      return View(_contactRepository.Find(id));
    }

    [HttpPost]
    public ActionResult Edit(Contact contact)
    {
      //TryUpdateModel(contact);
      if (ModelState.IsValid)
      {
        _contactRepository.InsertOrUpdate(contact, this.User.Identity.Name);
        _contactRepository.Save();
        if (Request.IsAjaxRequest())
        {
          return Json(contact, JsonRequestBehavior.AllowGet);
        }
        return RedirectToAction("Index");
      }
      else
      {
        if (Request.IsAjaxRequest())
        {
          return Json(ModelState, JsonRequestBehavior.AllowGet);
        }
        return View();
      }
    }

    #endregion // -- Edit --

    #region -- Delete --
    
    public ActionResult Delete(int id)
    {
      return View(_contactRepository.Find(id));
    }

    [HttpPost, ActionName("Delete")]
    public ActionResult DeleteConfirmed(int id)
    {
      _contactRepository.Delete(id);
      _contactRepository.Save();
      if (Request.IsAjaxRequest())
      {
        return Json("Contact id: " + id + " deleted.", JsonRequestBehavior.AllowGet);
      }
      return RedirectToAction("Index");
    }

    #endregion // -- Delete --
  }
}

