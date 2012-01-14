using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SocialManager.Mvc4.Models.Core;

namespace SocialManager.Mvc4.Models
{
  public class Foo : ModelBase
  {
    public string Name { get; set; }
    public string AccountNumber { get; set; }
  }
}