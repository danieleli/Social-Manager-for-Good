﻿using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SocialManager.Mvc4.Controllers;

namespace SocialManager.Mvc4._Tests.Controllers
{
   [TestClass]
   public class HomeControllerTest
   {
      [TestMethod, Ignore]
      public void Index()
      {
         // Arrange
         HomeController controller = new HomeController();

         // Act
         ViewResult result = controller.Index() as ViewResult;

         // Assert
         Assert.AreEqual("Modify this template to kick-start your ASP.NET MVC application.", result.ViewBag.Message);
      }

      [TestMethod]
      public void About()
      {
         // Arrange
         HomeController controller = new HomeController();

         // Act
         ViewResult result = controller.About() as ViewResult;

         // Assert
         Assert.IsNotNull(result);
      }

      [TestMethod]
      public void Contact()
      {
         // Arrange
         HomeController controller = new HomeController();

         // Act
         ViewResult result = controller.Contact() as ViewResult;

         // Assert
         Assert.IsNotNull(result);
      }
   }
}
