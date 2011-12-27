


function TriggersViewModel(data) {
   var self = this;
   self.triggers = [];
   var triggerHelper = new TriggerHelper();

   self.initialize = function (myData) {
      self.triggers = triggerHelper.processTriggers(myData);

      self.triggerToAddTitle = ko.observable("");
      self.triggerToAddDate = ko.observable("");
   };

   self.initialize(data);

   self.allActions = ko.computed(function () {
      var triggers = self.triggers();
      var actions = [];
      var rtn = triggers.map(function (trigger, index, array) {
         actions = actions.concat(trigger.actions());
         return actions;
      });
      return actions;
   }, self.triggers);
   
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

      $('#actionDialog input.date').datepicker();
      event.cancelBubble = true;
   }


   // trigger - CREATE
   self.addTrigger = function () {
      var newTrigger = {
         title: this.triggerToAddTitle(),
         date: this.triggerToAddDate(),
         actions: []
      };
      var rtn = triggerHelper.processTrigger(newTrigger);
      this.triggerToAddTitle("");
      this.triggerToAddDate("");
      self.triggers.push(rtn);
      $('.triggers .tabs').tabs();
      return $('.triggers .details .date').datepicker();
   };

   // trigger - DELETE
   self.removeTrigger = function () {
      self.triggers.remove(this);
   };

   // action - CREATE
   self.addActionToTrigger = function () {
      // this = the trigger getting the new action.
      if (arguments.length > 0) {
         var newAction = ko.mapping.fromJS({ date: this.addActionDate(), channel: this.addActionChannel() });
         triggerHelper.postProcessAction(newAction);
         this.addActionDate("");
         this.addActionChannel("");
         this.actions.push(newAction);
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

testUtils = {
   getPageData: function () {
      var trigger1 = this.getTrigger1();
      var trigger2 = this.getTrigger2();
      var pageData = new Array(trigger1, trigger2);

      return pageData;
   },

   getTrigger1: function () {
      return {
         title: "annual meeting2",
         date: new Date("1/15/2012"),
         actions: [
            { channel: "facebook", date: "1/12/2012" },
            { channel: "twitter", date: "1/12/2012" },
            { channel: "twitter", date: "1/15/2012" }
         ]
      };
   },

   getTrigger2: function () {
      return {
         title: "brown bag2",
         date: new Date("2/15/2012"),
         actions: []
      };
   },

   refreshTriggers: function (myViewModel) {
      myViewModel.triggers.removeAll();
      var freshTriggers = this.getPageData();
      myViewModel.modelUtils.prepTriggers(freshTriggers);
      myViewModel.triggers.push(ko.mapping.fromJS(freshTriggers[0]));
      myViewModel.triggers.push(ko.mapping.fromJS(freshTriggers[1]));
   }
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

   self.processTrigger = function (trigger) {
      self.preProcessTrigger(trigger);
      var rtn = ko.mapping.fromJS(trigger);
      self.postProcessTrigger(rtn);
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
      trigger.niceDate = new Date(trigger.date).formatMMDDYYYY();
      trigger.getRows = function () {
         var _results;
         _results = [];
         for (num = -7; num <= 7; num++) {
            _results.push(new Date(new Date(trigger.date).addDays(num)));
         }
         return _results;
      }
   };

   // post-processing
   self.postProcessTriggers = function (triggers) {
      triggers.map(function (trigger, index, array) {
         self.postProcessTrigger(trigger);
      });
   };
   self.postProcessTrigger = function (trigger) {
      // add calulated fields to viewModel.
      trigger.niceDate = ko.computed(function () {
         return new Date(trigger.date()).formatMMDDYYYY();
      }, trigger);

      trigger.actions().map(function (action, actionIndex, actionArray) {
         self.postProcessAction(action);
      });
   };

   self.postProcessAction = function (action) {
      action.niceDate = ko.computed(function () {
         return new Date(action.date()).formatMMDD();
      }, action);
   }
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


