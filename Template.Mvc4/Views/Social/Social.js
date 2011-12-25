(function() {
  var action, loadData, trigger;

  action = function(date, channel) {
    return {
      date: new Date(date),
      niceDate: new Date(date).formatMMDDYYY(),
      channel: channel
    };
  };

  trigger = function(title, date, actions) {
    var num;
    return {
      self: this,
      title: title,
      date: date,
      niceDate: new Date(date).formatMMDDYYY(),
      actions: ko.mapping.fromJS(actions),
      addActionChannel: ko.observable(""),
      addActionDate: ko.observable(""),
      getRows: (function() {
        var _results;
        _results = [];
        for (num = -7; num <= 7; num++) {
          _results.push(new Date(new Date(date).addDays(num)));
        }
        return _results;
      })(),
      actionToAdd: new action("", ""),
      addAction: function() {
        var newAction;
        newAction = action(this.addActionDate(), this.addActionChannel());
        this.addActionChannel("");
        this.addActionDate("");
        return this.actions.push(newAction);
      }
    };
  };

$(function () {
   var data, viewModel;
   data = loadData();
   viewModel = {
      self: this,
      triggers: ko.mapping.fromJS(data.triggers),
      selectTrigger: function () {
         return alert(this.title());
      },
      selectAction: function () {
         return alert(this.date());
      },
      triggerToAddTitle: ko.observable(""),
      triggerToAddDate: ko.observable(""),
      addTrigger: function () {
         var newTrigger;
         newTrigger = trigger(this.triggerToAddTitle(), this.triggerToAddDate(), new Array(action("04/01/2012", "twitter"), action("04/01/2012", "facebook")));
         this.triggerToAddTitle("");
         this.triggerToAddDate("");
         viewModel.triggers.push(newTrigger);
         $('.triggers .tabs').tabs();
         return $('.triggers .details .date').datepicker();
      }
   };
   return ko.applyBindings(viewModel);
});

loadData = function () {
   var data, trigger1, trigger2;
   trigger1 = new trigger("Annual Meeting", "01/15/2012", new Array(action("01/01/2012", "twitter"), action("01/01/2012", "facebook"), action("01/03/2012", "twitter")));
   trigger2 = new trigger("Brown Bag", "02/24/2012", new Array(action("02/01/2012", "twitter"), action("02/01/2012", "meetup"), action("02/03/2012", "linkedin"), action("02/05/2012", "twitter")));
   return data = {
      channels: new Array("facebook", "linkedin", "twitter"),
      purposes: new Array("recruit", "inform", "feedback"),
      triggers: new Array(trigger1, trigger2)
   };
};

}).call(this);
