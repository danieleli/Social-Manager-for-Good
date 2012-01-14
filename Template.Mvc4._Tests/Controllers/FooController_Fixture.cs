using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using NUnit.Framework;
using Rhino.Mocks;
using SocialManager.Mvc4.Controllers;
using SocialManager.Mvc4.Models;
using SocialManager.Mvc4.Models.Core;

namespace SocialManager.Mvc4._Tests.Controllers
{
  [TestFixture]
  public class FooController_Fixture
  {
    readonly FooController controller;
    readonly IRepository<Foo> modelRepo;
    

    public FooController_Fixture()
    {
      modelRepo = MockRepository.GenerateStrictMock<IRepository<Foo>>();
      controller = new FooController(modelRepo);
    }

    [Test]
    public void Index_Test()
    {
      // Arrange
      var returnItems = new List<Foo>() { new Foo() { Id = 1 }, new Foo() { Id = 2 } };
      modelRepo.Expect(action => action.All).Return(returnItems.AsQueryable());

      // Act
      var result = controller.Index();

      // Assert
      Assert.That(result.Model, Is.InstanceOf<IEnumerable<Foo>>(), "TypeOf Model");
      var typedModel = (IEnumerable<Foo>)result.Model;
      Assert.That(typedModel.Count(), Is.EqualTo(2), "Model Items");
    }

  }
}
