
// move this into social_calendar.js and test thoroughly!

function TriggersViewModel(data) {
  var self, triggerHelper;
  self = this;
  triggerHelper = new TriggerHelper();
  self.triggers = triggerHelper.processTriggers(data);

  self.triggerToAddTitle = ko.observable("");
  self.triggerToAddDate = ko.observable("");
  self.triggerToAddNotes = ko.observable("");
  self.calendarDays = ko.computed(function () { return calendarDays(self.triggers); }, self.triggers);

  // track current trigger
  var _currentTrigger;
  self.currentTrigger = function () {
    return _currentTrigger;
  };
  self.selectTrigger = function () {
    _currentTrigger = this;
  };

  // track current action
  var _currentAction;
  self.currentAction = ko.observable("");
  self.selectAction = function () {
    _currentAction = this;
  };

  self.showActionDialog = function () {
    self.currentAction(this);
    $('#actionDialog').dialog({
      buttons: [
            {
              text: "Ok", click: function () { $(this).dialog("close"); }
            },
            {
              text: "Delete", click: function () {
                self.currentTrigger().actions.remove(self.currentAction());
                $(this).dialog("close");
              }
            }
          ]
    });
    $('#actionDialog .date').blur();
    $('#actionDialog input.date').datepicker("destroy");
    $('#actionDialog input.date').datepicker();
    event.cancelBubble = true;
  };


  // trigger - CREATE
  self.addTrigger = function () {
    var newTrigger = {
      title: this.triggerToAddTitle(),
      date: this.triggerToAddDate(),
      notes: this.triggerToAddNotes(),
      actions: []
    };
    var rtn = triggerHelper.processTrigger(newTrigger, self.triggers);
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
      triggerHelper.postProcessAction(new_action, self.currentTrigger().title, self.triggers);
      this.addActionDate("");
      this.addActionChannel("");
      this.addActionNotes("");
      this.actions.push(new_action);
    }
  };



  // action - DELETE
  self.removeActionFromTrigger = function () {
    // this = the trigger getting the new action.
    if (arguments.length > 0) {
      self.currentTrigger().actions.remove(this);
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
    trigger.niceDate = new Date(trigger.date).formatMMDDYYYY();
    trigger.date = new Date(trigger.date);
    trigger.getRows = function () {
      var _results;
      _results = [];
      for (var num = -7; num <= 7; num++) {
        _results.push(new Date(new Date(trigger.date).addDays(num)));
      }
      return _results;
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

    trigger.actions().map(function (action, actionIndex, actionArray) {
      self.postProcessAction(action, trigger.title, triggers);
    });
  };

  self.postProcessAction = function (action, triggerTitle, triggers) {
    action.niceDate = ko.computed(function () {
      return new Date(action.date()).formatMMDD();
    }, action);
    action.triggerTitle = ko.computed(triggerTitle, triggers);
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


