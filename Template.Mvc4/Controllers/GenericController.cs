using System.Web.Mvc;
using SocialManager.Mvc4.Models;
using SocialManager.Mvc4.Models.Core;

namespace SocialManager.Mvc4.Controllers
{
  // ReSharper disable Mvc.ViewNotResolved
  public class GenericController<TModel> : Controller
    where TModel : ModelBase
  {
    protected readonly IRepository<TModel> _repository;
    protected readonly AppDbContext _dbContext = new AppDbContext();

    #region -- Constructors ---

    protected GenericController()
      : this(new GenericRepository<TModel>())
    {
    }

    protected GenericController(IRepository<TModel> repository)
    {
      _repository = repository;
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
    public virtual ActionResult Create(TModel model)
    {
      if (ModelState.IsValid)
      {
        _repository.InsertOrUpdate(model, base.User.Identity.Name);
        _repository.Save();
        if (Request.IsAjaxRequest())
        {
          return Json(model, JsonRequestBehavior.AllowGet);
        }

        return RedirectToAction("Index");
      }
      return View();
    }

    public virtual ActionResult Edit(int id)
    {
      return View(_repository.Find(id));
    }

    [HttpPost]
    public virtual ActionResult Edit(TModel model)
    {
      if (ModelState.IsValid)
      {
        _repository.InsertOrUpdate(model, base.User.Identity.Name);
        _repository.Save();

        return RedirectToAction("Index");
      }
      return View();
    }


    public virtual ActionResult Delete(int id)
    {
      return View(_repository.Find(id));
    }

    [HttpPost, ActionName("Delete")]
    public virtual ActionResult DeleteConfirmed(int id)
    {
      _repository.Delete(id);
      _repository.Save();

      return RedirectToAction("Index");
    }
  }
  // ReSharper restore Mvc.ViewNotResolved
}