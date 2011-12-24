(function() {
  var action, data, trigger, trigger1, trigger2;

  Date.prototype.formatMMDDYYY = function() {
    return this.getMonth() + 1 + '/' + this.getDate() + '/' + this.getFullYear();
  };

  Date.prototype.formatMMDD = function() {
    return this.getMonth() + 1 + '/' + this.getDate();
  };

  Date.prototype.addDays = function(days) {
    days = this.getDate() + days;
    return this.setDate(days);
  };

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
      title: title,
      date: new Date(date),
      niceDate: new Date(date).formatMMDDYYY(),
      actions: actions,
      getRows: (function() {
        var _results;
        _results = [];
        for (num = -7; num <= 7; num++) {
          _results.push(new Date(new Date(date).addDays(num)));
        }
        return _results;
      })()
    };
  };

  trigger1 = new trigger("Annual Meeting", "01/15/2012", new Array(action("01/01/2012", "twitter"), action("01/01/2012", "facebook"), action("01/03/2012", "twitter")));

  trigger2 = new trigger("Brown Bag", "02/24/2012", new Array(action("02/01/2012", "twitter"), action("02/01/2012", "meetup"), action("02/03/2012", "linkedin"), action("02/05/2012", "twitter")));

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
        return alert(this.title());
      },
      selectAction: function() {
        return alert(this.date());
      },
      triggerToAddTitle: ko.observable(""),
      triggerToAddDate: ko.observable(""),
      addTrigger: function() {
        var newTrigger;
        newTrigger = trigger(this.triggerToAddTitle(), this.triggerToAddDate(), new Array());
        this.triggerToAddTitle("");
        this.triggerToAddDate("");
        viewModel.triggers.push(new ko.protectedObservableItem(newTrigger));
        $('.triggers .tabs').tabs();
        return $('.triggers .details .date').datepicker();
      }
    };
    return ko.applyBindings(viewModel);
  });

}).call(this);
