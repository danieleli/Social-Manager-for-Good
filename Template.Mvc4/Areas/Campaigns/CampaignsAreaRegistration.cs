using System.Web.Mvc;

namespace SocialManager.Mvc4.Areas.Campaigns
{
  public class CampaignsAreaRegistration : AreaRegistration
  {
    public override string AreaName
    {
      get
      {
        return "Campaigns";
      }
    }

    public override void RegisterArea(AreaRegistrationContext context)
    {
      context.MapRoute(
          "Campaigns_default",
          "Campaigns/{controller}/{action}/{id}",
          new { action = "Index", id = UrlParameter.Optional }
          
      );

      context.MapRoute(
          "Social",
          "Social",
          new { controller="Social", action = "Index", id = UrlParameter.Optional }

      );
    }
  }
}
