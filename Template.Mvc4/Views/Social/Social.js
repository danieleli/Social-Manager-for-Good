(function() {
  var data, trigger1, trigger2;

  trigger1 = {
    title: "trigger1",
    activities: new Array({
      date: new Date("01/01/2012"),
      channels: new Array({
        channel: "twitter"
      }, {
        channel: "facebook"
      })
    }, {
      date: new Date("01/03/2012"),
      channels: new Array({
        channel: "facebook"
      })
    }),
    selectTrigger: function(koItem) {
      return alert(koItem.title());
    }
  };

  trigger2 = {
    title: "trigger2",
    activities: new Array({
      date: new Date("02/01/2012"),
      channels: new Array({
        channel: "facebook"
      })
    }, {
      date: new Date("02/03/2012"),
      channels: new Array({
        channel: "linkedin"
      }, {
        channel: "facebook"
      })
    }),
    selectTrigger: function(koItem) {
      return alert(koItem.title());
    }
  };

  data = {
    channels: new Array("facebook", "linkedin", "twitter"),
    purposes: new Array("recruit", "inform", "feedback"),
    triggers: new Array(trigger1, trigger2)
  };

  $(function() {
    var viewModel;
    viewModel = {
      triggers: ko.observableArray(ko.toProtectedObservableItemArray(data.triggers)),
      selectTrigger: function() {
        return this.selectTrigger()(this);
      }
    };
    return ko.applyBindings(viewModel);
  });

}).call(this);