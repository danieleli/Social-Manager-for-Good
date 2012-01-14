using System;
using System.Linq;
using System.ServiceModel.Web;
using SocialManager.Mvc4.Models;
using SocialManager.Mvc4.Models.Core;

namespace SocialManager.Mvc4.Api
{
  public class ContactsApi
  {
    private readonly IRepository<Contact> _contactRepository;

    #region -- Constructor --
    
    public ContactsApi()
      : this(new GenericRepository<Contact>())
    {
      // If you are using Dependency Injection, you can delete the following constructor
    }

    public ContactsApi(IRepository<Contact> contactRepository)
    {
      this._contactRepository = contactRepository;
    }

    #endregion //-- Constructor --

    [WebGet(UriTemplate = "")]
    public IQueryable<Contact> GetAll()
    {
      return _contactRepository.All;
    }

    [WebInvoke(UriTemplate = "", Method = "POST")]
    public Contact Create(Contact instance)
    {
      instance.ModifyDate = DateTime.Now;
      _contactRepository.InsertOrUpdate(instance, "api");
      _contactRepository.Save();
      return instance;
    }

    [WebGet(UriTemplate = "{id}")]
    public Contact Get(int id)
    {
      return _contactRepository.Find(id);
    }

    [WebInvoke(UriTemplate = "{id}", Method = "PUT")]
    public Contact Update(string id, Contact instance)
    {
      _contactRepository.InsertOrUpdate(instance, "api");
      _contactRepository.Save();
      return instance;
    }

    [WebInvoke(UriTemplate = "{id}", Method = "DELETE")]
    public string Delete(int id)
    {
      _contactRepository.Delete(id);
      return "Contact id: " + id + " deleted.";
    }
  }
}