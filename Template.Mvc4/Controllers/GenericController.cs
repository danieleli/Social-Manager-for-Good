using System.Web.Mvc;
using SocialManager.Mvc4.Models;
using SocialManager.Mvc4.Models.Core;

namespace SocialManager.Mvc4.Controllers
{
  public class GenericController<T, TRepo> : Controller
    where T : ModelBase
    where TRepo : IRepository<T>, new()
  {
    protected readonly TRepo _repository;
    protected readonly SocialManagerMvc4Context _context = new SocialManagerMvc4Context();

    #region -- Constructors ---

    public GenericController()
      : this(new TRepo())
    {
    }

    public GenericController(TRepo repository)
    {
      this._repository = repository;
    }

    #endregion // -- Constructors ---

    public virtual ViewResult Index()
    {
      return View(_repository.All);
    }

    public virtual ViewResult Details(int id)
    {
      return View(_repository.Find(id));
    }

    public virtual ActionResult Create()
    {
      return View();
    }

    [HttpPost]
    public ActionResult Create(T model)
    {
      if (ModelState.IsValid)
      {
        _repository.InsertOrUpdate(model);
        _repository.Save();
        if (Request.IsAjaxRequest())
        {
          return Json(model, JsonRequestBehavior.AllowGet);
        }
        return RedirectToAction("Index");
      }
      else
      {
        return View();
      }
    }

    public virtual ActionResult Edit(int id)
    {
      return View(_repository.Find(id));
    }

    [HttpPost]
    public virtual ActionResult Edit(T model)
    {
      if (ModelState.IsValid)
      {
        _repository.InsertOrUpdate(model);
        _repository.Save();
        return RedirectToAction("Index");
      }
      else
      {
        return View();
      }
    }


    public ActionResult Delete(int id)
    {
      return View(_repository.Find(id));
    }

    //
    // POST: /Stores/Delete/5

    [HttpPost, ActionName("Delete")]
    public ActionResult DeleteConfirmed(int id)
    {
      _repository.Delete(id);
      _repository.Save();

      return RedirectToAction("Index");
    }
  }
}