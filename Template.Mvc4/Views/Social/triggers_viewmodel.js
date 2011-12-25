function TriggerViewModel(data) {
   var self = this;

   self.prepTrigger = function (trigger) {
      trigger.addActionDate = "";
      trigger.addActionChannel = "";
   }
   
   self.prepTriggers = function (triggers) {
      for (var i = 0; i < triggers.length; i++) {
         self.prepTrigger(triggers[0]);
      }
   };

   // add view fields for each trigger.
   self.prepTriggers(data);
   self.triggers = ko.mapping.fromJS(data);

   self.addActionToTrigger = function () {
      // this = the trigger getting the new action.
      if (arguments.length > 0) {
         var newAction = createActionViewModel(this.addActionDate(), this.addActionChannel())
         this.addActionDate("");
         this.addActionChannel("");
         this.Actions.push(newAction);
      };
   };
   
   createActionViewModel = function (date, channel) {
      return {
         date: new Date(date),
         niceDate: new Date(date).formatMMDDYYY(),
         channel: channel
      }
   };
   
};


