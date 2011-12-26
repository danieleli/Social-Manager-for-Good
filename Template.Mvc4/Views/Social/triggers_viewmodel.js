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
         trigger.getRows = function () {
            var _results;
            _results = [];
            for (num = -7; num <= 7; num++) {
               _results.push(new Date(new Date(trigger.date).addDays(num)));
            }
            return _results;
         };

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
   self.triggerToAddTitle = ko.observable("");
   self.triggerToAddDate = ko.observable("");

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
      var newTrigger = {
         title: this.triggerToAddTitle(),
         date: this.triggerToAddDate(),
         actions: new Array()
      }
      self.modelUtils.prepTrigger(newTrigger);
      newTrigger = ko.mapping.fromJS(newTrigger);
      this.triggerToAddTitle("");
      this.triggerToAddDate("");
      self.triggers.push(newTrigger);
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
         var newAction = createActionViewModel(this.addActionDate(), this.addActionChannel());
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

$(function () {
   var data = testUtils.getPageData();
   var viewModel = new TriggersViewModel(data);
   ko.applyBindings(viewModel);
})
createActionViewModel = function (date, channel) {
   return {
      date: new Date(date),
      niceDate: new Date(date).formatMMDDYYY(),
      channel: channel
   }
};

createTriggerViewModel = function (date, title) {
   return {
      date: new Date(date),
      niceDate: new Date(date).formatMMDDYYY(),
      title: title,
      actions: new Array()
   }
};

//new Array(createActionViewModel("04/01/2012", "twitter"), createActionViewModel("04/01/2012", "facebook")

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
         actions: new Array(
            { channel: "action1", date: "1/12/2012" },
            { channel: "action2", date: "2/12/2012" }
          )
      }
   },

   getTrigger2: function () {
      return {
         title: "brown bag",
         date: new Date("2/15/2012"),
         actions: new Array()
      }
   },

   refreshTriggers: function (myViewModel) {
      myViewModel.triggers.removeAll();
      var freshTriggers = this.getPageData();
      myViewModel.modelUtils.prepTriggers(freshTriggers);
      myViewModel.triggers.push(ko.mapping.fromJS(freshTriggers[0]));
      myViewModel.triggers.push(ko.mapping.fromJS(freshTriggers[1]));
   }
};


