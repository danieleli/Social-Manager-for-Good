
// move this into social_calendar.js and test thoroughly!

function TriggersViewModel(data) {
  var self, trigger_helper;
  self = this;
  trigger_helper = new TriggerHelper();
  self.triggers = trigger_helper.processTriggers(data);

  self.triggerToAddTitle = ko.observable("");
  self.triggerToAddDate = ko.observable("");
  self.triggerToAddNotes = ko.observable("");
  self.calendarDays = ko.computed(function () { return calendarDays(self.triggers); }, self.triggers);

  // track current trigger
  var current_trigger;
  self.currentTrigger = function () {
    return current_trigger;
  };
  self.selectTrigger = function () {
    current_trigger = this;
  };

  // track current action
  self.currentAction = ko.observable("");
  self.showActionDialog = function () {
    self.currentAction(this);
    $('#actionDialog').dialog({
      buttons: [
            {
              text: "Ok", click: function () { $(this).dialog("close"); }
            },
            {
              text: "Delete", click: function () {
                self.currentAction().remove();
                $(this).dialog("close");
              }
            }
          ]
    });
    $('#actionDialog').parent().css("opacity", ".9");
    $('#actionDialog .date').blur();
    $('#actionDialog input.date').datepicker("destroy");
    $('#actionDialog input.date').datepicker();
    event.cancelBubble = true;
  };



  // trigger - CREATE
  self.addTrigger = function () {
    var new_trigger = {
      title: this.triggerToAddTitle(),
      date: this.triggerToAddDate(),
      notes: this.triggerToAddNotes(),
      actions: []
    };
    var rtn = trigger_helper.processTrigger(new_trigger, self.triggers);
    this.triggerToAddTitle("");
    this.triggerToAddDate("");
    this.triggerToAddNotes("");
    self.triggers.push(rtn);
    $('.triggers .tabs').tabs();
    $('.triggers .details .date').datepicker();
    $('.summary').last().click();
    $('.summary').last().parent().children(".details").children('.reveal-tab').click();
  };

  // trigger - DELETE
  self.removeTrigger = function () {
    self.triggers.remove(this);
  };

  // action - CREATE
  self.addActionToTrigger = function () {
    // this = the trigger getting the new action.
    if (arguments.length > 0) {
      var new_action = ko.mapping.fromJS({ date: this.addActionDate(), channel: this.addActionChannel(), id: "new", notes: "" });
      trigger_helper.postProcessAction(new_action, self.currentTrigger().title, self.triggers);
      this.addActionDate("");
      this.addActionChannel("");
      this.addActionNotes("");
      this.actions.push(new_action);
    }
  };

};

function TriggerHelper() {
  var self = this;

  // processing
  self.processTriggers = function (data) {
    self.preProcessTriggers(data);
    var rtn = ko.mapping.fromJS(data);
    self.postProcessTriggers(rtn());
    return rtn;
  };

  self.processTrigger = function (trigger, triggers) {
    self.preProcessTrigger(trigger);
    var rtn = ko.mapping.fromJS(trigger);
    self.postProcessTrigger(rtn, triggers);
    return rtn;
  };

  // pre-processing
  self.preProcessTriggers = function (triggers) {
    triggers.map(function (trigger, triggerIndex, triggerArray) {
      self.preProcessTrigger(trigger);
    });
  };

  self.preProcessTrigger = function (trigger) {
    // add viewModel fields so ko.mapping can make them observable.
    trigger.addActionDate = "";
    trigger.addActionChannel = "";
    trigger.addActionNotes = "";
    trigger.isSelected = false;
    trigger.hasHover = false;
    trigger.niceDate = new Date(trigger.date).formatMMDDYYYY();
    trigger.date = new Date(trigger.date);
    trigger.getRows = function () {
      var results;
      results = [];
      for (var num = -7; num <= 7; num++) {
        results.push(new Date(new Date(trigger.date).addDays(num)));
      }
      return results;
    };
    trigger.actions.map(function (action, actionIndex, actionArray) {
      //action.date = new Date(action.date);
    });
  };

  // post-processing
  self.postProcessTriggers = function (triggers) {
    triggers.map(function (trigger, index, array) {
      self.postProcessTrigger(trigger, triggers);
    });
  };
  self.postProcessTrigger = function (trigger, triggers) {
    // add calulated fields to viewModel.
    trigger.niceDate = ko.computed(function () {
      return new Date(trigger.date()).formatMMDDYYYY();
    }, trigger);

    trigger.toggleSelectedState = function () {
      trigger.isSelected(!trigger.isSelected());
    };

    trigger.isHighlighted = ko.computed(function () {
      return (trigger.hasHover() || trigger.isSelected());
    }, triggers);

    trigger.setHover = function () {
      trigger.hasHover(!trigger.hasHover());
    };
    
    trigger.actions().map(function (action, actionIndex, actionArray) {
      self.postProcessAction(action, trigger, triggers);
    });
  };

  self.postProcessAction = function (action, trigger, triggers) {
    action.niceDate = ko.computed(function () {
      return new Date(action.date()).formatMMDD();
    }, action);
    action.triggerTitle = ko.computed(trigger.title, triggers);
    action.isHighlighted = ko.computed(function () {
       return (trigger.hasHover() || trigger.isSelected());
    }, triggers);
    action.remove = function () {
      trigger.actions.remove(action);
    };
  };
};

//var action = function (date, channel) {
//   alert(2);
//   return {
//      date: date,
//      niceDate: new Date(date).formatMMDDYYY(),
//      channel: channel
//   };
//};

//var trigger = function (title, date, actions) {
//   var num;
//   alert(1);
//   return {
//      self: this,
//      title: title,
//      date: date,
//      niceDate: new Date(date).formatMMDDYYY(),
//      actions: ko.mapping.fromJS(actions),
//      addActionChannel: ko.observable(""),
//      addActionDate: ko.observable(""),
//      getRows: (function () {
//         var _results;
//         _results = [];
//         for (num = -7; num <= 7; num++) {
//            _results.push(new Date(new Date(date).addDays(num)));
//         }
//         return _results;
//      } ()),
//      actionToAdd: new action("", ""),
//      addAction: function () {
//         var newAction;
//         newAction = action(this.addActionDate(), this.addActionChannel());
//         this.addActionChannel("");
//         this.addActionDate("");
//         return this.actions.push(newAction);
//      }
//   };
//};


