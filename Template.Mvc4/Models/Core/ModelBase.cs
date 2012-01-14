using System;
using System.ComponentModel.DataAnnotations;

namespace SocialManager.Mvc4.Models.Core
{
  public abstract class ModelBase
  {
    public int Id { get; set; }
    [DisplayFormat(DataFormatString = "mm:hh:ss")]
    public DateTime? ModifyDate { get; set; }
    public string ModifyUser { get; set; }
  }
}