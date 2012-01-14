using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SocialManager.Mvc4.Models;
using SocialManager.Mvc4.Models.Core;

namespace SocialManager.Mvc4.Controllers
{
  public class FooController : GenericController<Foo>
  {
    public FooController() : base() { }
    public FooController(IRepository<Foo> repo) : base(repo) { }
  }
  
  
}
