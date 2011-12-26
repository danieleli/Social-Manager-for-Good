var action = function (date, channel) {
   return {
      date: date,
      niceDate: new Date(date).formatMMDDYYY(),
      channel: channel
   };
};

var trigger = function (title, date, actions) {
   var num;
   return {
      self: this,
      title: title,
      date: date,
      niceDate: new Date(date).formatMMDDYYY(),
      actions: ko.mapping.fromJS(actions),
      addActionChannel: ko.observable(""),
      addActionDate: ko.observable(""),
      getRows: (function () {
         var _results;
         _results = [];
         for (num = -7; num <= 7; num++) {
            _results.push(new Date(new Date(date).addDays(num)));
         }
         return _results;
      } ()),
      actionToAdd: new action("", ""),
      addAction: function () {
         var newAction;
         newAction = action(this.addActionDate(), this.addActionChannel());
         this.addActionChannel("");
         this.addActionDate("");
         return this.actions.push(newAction);
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
         title: "annual meeting",
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
         title: "brown bag",
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

function TriggersViewModel(data) {
   var self = this;

   self.modelUtils = {
      prepTriggers: function (triggers) {
         var i = 0;
         for (i = 0; i < triggers.length; i++) {
            this.prepTrigger(triggers[i]);
         }
      },
      prepTrigger: function (trigger) {
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
         //        var x = 0;
         //        for (x = 0; x < trigger.actions.length; x++) {
         //           this.prepAction(trigger.actions[x]);
         //        },
      }
   };




   //      prepAction: function (action) {
   //         var self = action;
   //         self.niceDate = ko.computed(function () {
   //            return new Date(self.date).formatMMDD();
   //         }, self);


   self.postProcessTrigger = function (trigger) {
      trigger.niceDate = ko.computed(function () {
         return new Date(trigger.date()).formatMMDDYYYY();
      }, trigger);

      trigger.actions().map(function (action, actionIndex, actionArray) {
         action.niceDate = ko.computed(function () {
            return new Date(action.date()).formatMMDD();
         }, action);

      });
   };


   // add view fields for each trigger.
   self.modelUtils.prepTriggers(data);
   self.triggers = ko.mapping.fromJS(data);
   self.triggers().map(function (trigger, triggerIndex, triggerArray) {
      self.postProcessTrigger(trigger);
   });






   // add trigger fields
   self.triggerToAddTitle = ko.observable("");
   self.triggerToAddDate = ko.observable("");

   // track current trigger
   var _currentTrigger;
   self.currentTrigger = function () {
      return _currentTrigger;
   };
   self.selectTrigger = function () {
      _currentTrigger = this;
   };

   self.showActionDialog = function () {
      self.currentAction(this);
      $('#actionDialog').dialog({ buttons:
            [
               { text: "Ok", click: function () { $(this).dialog("close"); } },
               { text: "Delete", click: function () {
                     self.currentTrigger().actions.remove(self.currentAction());
                     $(this).dialog("close");
                  } 
               }
            ]
      });
      $('#actionDialog input.date').datepicker();
      event.cancelBubble = true;
   }
   // track current trigger
   var _currentAction;
   self.currentAction = ko.observable("");
   self.selectAction = function () {
      _currentAction = this;
   };

   // create / delete trigger
   self.addTrigger = function () {
      var newTrigger = {
         title: this.triggerToAddTitle(),
         date: this.triggerToAddDate(),
         actions: []
      };
      self.modelUtils.prepTrigger(newTrigger);
      newTrigger = ko.mapping.fromJS(newTrigger);
      self.postProcessTrigger(newTrigger);
      this.triggerToAddTitle("");
      this.triggerToAddDate("");
      self.triggers.push(newTrigger);
      $('.triggers .tabs').tabs();
      return $('.triggers .details .date').datepicker();
   };
   self.removeTrigger = function () {
      self.triggers.remove(this);
   };

   // create / delete trigger.action
   self.addActionToTrigger = function () {
      // this = the trigger getting the new action.
      if (arguments.length > 0) {
         var newAction = createActionViewModel(this.addActionDate(), this.addActionChannel());
         this.addActionDate("");
         this.addActionChannel("");
         this.actions.push(newAction);
      }
   };
   self.removeActionFromTrigger = function () {
      // this = the trigger getting the new action.
      if (arguments.length > 0) {
         self.currentTrigger().actions.remove(this);
      }
   };
   createActionViewModel = function (date, channel) {
      var myDate = ko.observable((new Date(date)).formatMMDDYYYY());
      return {
         date: myDate,
         niceDate: ko.computed(function () {
            return new Date(myDate()).formatMMDD();
         }, this),
         channel: ko.observable(channel)
      }
   };

   createTriggerViewModel = function (date, title) {
      var myDate = ko.observable(new Date(date));
      return {
         date: new Date(date),
         niceDate: ko.computed(function () {
            return new Date(myDate()).formatMMDDYYYY();
         }, this),
         title: title,
         actions: new []()
      };
   };
};

$(function () {
   var data = testUtils.getPageData();
   var viewModel = new TriggersViewModel(data);
   ko.applyBindings(viewModel);
   $('.tabs').tabs();
   $(document).on("click", '.summary', function () {
      $(this.parentNode).children('.details').toggle('fast');
   });
   $('input.date').datepicker();
});


loadData = function () {
   var data, trigger1, trigger2;
   trigger1 = new trigger("Annual Meeting", "01/15/2012", new [](
    action("01/01/2012", "twitter"), action("01/01/2012", "facebook"), action("01/03/2012", "twitter")));
   trigger2 = new trigger("Brown Bag", "02/24/2012", new [](action("02/01/2012", "twitter"), action("02/01/2012", "meetup"), action("02/03/2012", "linkedin"), action("02/05/2012", "twitter")));
   data = {
      channels: new []("facebook", "linkedin", "twitter"),
      purposes: new []("recruit", "inform", "feedback"),
      triggers: new [](trigger1, trigger2)
   };
   return data;
};




