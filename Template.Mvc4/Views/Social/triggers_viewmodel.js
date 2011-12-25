function TriggersViewModel(data) {
   var self = this;
   
   self.modelUtils = {
      prepTriggers: function (triggers) {
         for (var i = 0; i < triggers.length; i++) {
            this.prepTrigger(triggers[i]);
         }
      },
      prepTrigger: function (trigger) {
         trigger.addActionDate = "";
         trigger.addActionChannel = "";
         trigger.niceDate = new Date(trigger.date).formatMMDDYYY();
         for (var i = 0; i < trigger.actions.length; i++) {
            prepAction(trigger.actions[i]);
         }
      },
      prepTrigger: function (trigger) {
         trigger.addActionDate = "";
         trigger.addActionChannel = "";
         trigger.niceDate = new Date(trigger.date).formatMMDDYYY();
         for (var i = 0; i < trigger.actions.length; i++) {
            this.prepAction(trigger.actions[i]);
         }
      },
      prepAction: function (action) {
         action.niceDate = new Date(action.date).formatMMDDYYY();
      }
   };
   
   // add view fields for each trigger.
   self.modelUtils.prepTriggers(data);
   self.triggers = ko.mapping.fromJS(data);
   
   
   // add trigger fields
   triggerToAddTitle = ko.observable("");
   triggerToAddDate = ko.observable("");
   
   // track current trigger
   var _currentTrigger;
   self.currentTrigger = function () {
      return _currentTrigger;
   }
   self.selectTrigger = function () {
      _currentTrigger = this;
   };
   
   // create / delete trigger
   self.addTrigger = function () {
      var newTrigger;
      newTrigger = trigger(this.triggerToAddTitle(), this.triggerToAddDate(), new Array(createActionViewModel("04/01/2012", "twitter"), createActionViewModel("04/01/2012", "facebook")));
      this.triggerToAddTitle("");
      this.triggerToAddDate("");
      viewModel.triggers.push(newTrigger);
      $('.triggers .tabs').tabs();
      return $('.triggers .details .date').datepicker();
   };
   self.removeTrigger = function () {
      self.triggers.remove(this);
   }

   // create / delete trigger.action
   self.addActionToTrigger = function () {
      // this = the trigger getting the new action.
      if (arguments.length > 0) {
         var newAction = createActionViewModel(this.addActionDate(), this.addActionChannel())
         this.addActionDate("");
         this.addActionChannel("");
         this.actions.push(newAction);
      };
   };
   self.removeActionFromTrigger = function () {
      // this = the trigger getting the new action.
      if (arguments.length > 0) {
         self.currentTrigger().actions.remove(this);
      };
   };

   self.selectAction = function () {
      alert(this.date());
   };

};

createActionViewModel = function (date, channel) {
   return {
      date: new Date(date),
      niceDate: new Date(date).formatMMDDYYY(),
      channel: channel
   }
};


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


