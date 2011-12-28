using System.ComponentModel.DataAnnotations;
using SocialManager.Mvc4.Models.Core;

namespace SocialManager.Mvc4.Models
{


  public class Contact : ModelBase
  {
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }


  }

}