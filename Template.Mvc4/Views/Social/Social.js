(function() {
  var activity, channel, channels, data, trigger, trigger1, trigger2, trigger3;

  Date.prototype.formatMMDDYYY = function() {
    return this.getMonth() + 1 + '/' + this.getDate() + '/' + this.getFullYear();
  };

  channel = function(c) {
    return {
      channel: c
    };
  };

  channels = function(channelsArray) {
    var channel, rtn, _i, _len;
    rtn = new Array();
    for (_i = 0, _len = channelsArray.length; _i < _len; _i++) {
      channel = channelsArray[_i];
      rtn.push({
        channel: channel
      });
    }
    return rtn;
  };

  activity = function(date, channels) {
    return {
      date: new Date(date),
      niceDate: new Date(date).formatMMDDYYY(),
      channels: channels
    };
  };

  trigger = function(title, activities) {
    return {
      title: title,
      activities: activities
    };
  };

  trigger1 = new trigger("trigger1", new Array(activity("02/01/2012", channels(new Array("twitter", "facebook"))), activity("01/03/2012", channels(new Array("facebook")))));

  trigger2 = {
    title: "trigger2",
    activities: new Array(activity("02/01/2012", channels(new Array("facebook"))))
  };

  trigger3 = trigger('trigger3', new Array(activity("03/12/2012", channels(new Array("myspace", "facebook"))), activity("03/13/2012", channels(new Array("facebook")))));

  data = {
    channels: new Array("facebook", "linkedin", "twitter"),
    purposes: new Array("recruit", "inform", "feedback"),
    triggers: new Array(trigger1, trigger2, trigger3)
  };

  $(function() {
    var viewModel;
    viewModel = {
      triggers: ko.observableArray(ko.toProtectedObservableItemArray(data.triggers)),
      selectTrigger: function() {
        return alert(this.title());
      }
    };
    return ko.applyBindings(viewModel);
  });

}).call(this);
