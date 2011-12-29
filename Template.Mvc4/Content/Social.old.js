var scm;
scm = undefined || {};

scm.TriggerArrayMapper = function() {
  var self=this;
   self.fromJS = function(data) {
    var rtn;
    self.preProcessTriggers(data);
    rtn = ko.mapping.fromJS(data);
    self.postProcessTriggers(rtn());
    return rtn;
  };
  
  self.processTrigger = function(trigger, triggersArray) {
    var rtn;
    self.preProcessTrigger(trigger);
    rtn = ko.mapping.fromJS(trigger);
    self.postProcessTrigger(rtn, triggersArray);
    return rtn;
  };
   
  // pre-processing
  self.preProcessTriggers = function(triggers) {
    return triggers.map(function(trigger, triggerIndex, triggerArray) {
      return self.preProcessTrigger(trigger);
    });
  };
 self.preProcessTrigger = function(trigger) {
    trigger.addActionDate = "";
    trigger.addActionChannel = "";
    trigger.niceDate = new Date(trigger.date).formatMMDDYYYY();
    return trigger.getRows = function() {
      var num;
      var _results = [];
      for(num=-7; num < 7; num++) {
        _results.push(new Date(new Date(trigger.date).addDays(num)));         
      };

      return _results;
    };
  };
   
  // post-processing
  self.postProcessTriggers = function(triggers) {
    return triggers.map(function(trigger, triggerIndex, triggersArray) {
      return self.postProcessTrigger(trigger, triggersArray);
    });
  };
  self.postProcessTrigger = function(trigger, triggersArray) {
    trigger.niceDate = ko.computed(function() {
      return new Date(trigger.date()).formatMMDDYYYY();
    }, trigger);
    return trigger.actions().map(function(action, actionIndex, actionArray) {
      return self.postProcessAction(action, trigger.title, triggersArray);
    });
  };
  self.postProcessAction = function(action, triggerTitle, triggers) {
    action.niceDate = ko.computed(function() {
      return new Date(action.date()).formatMMDD();
    }, action);
    return action.triggerTitle = ko.computed(triggerTitle, triggers);
  };
};


scm.ViewDateRange = function(rawTriggers) {
   var firstDay,lastDay;
   var self = this;
   self.dayCount = (function () {
         if(self.allDates.length > 0){
            firstDay = new Date(self.allDates[0]);
            // start on sunday
            firstDay.addDays(-firstDay.getDay());
            lastDay = new Date(self.allDates[self.allDates.length - 1]);
            // end on saturday
            lastDay.addDays(6-lastDay.getDay());
            return ((lastDay - firstDay) / 86400000) + 1;
         };
         // if no dates then return this week.
         var today = new Date();
         firstDay = new Date(today).addDays(-today.getDay);
         lastDay = new Date(today).addDays(6-today.getDay);
         return 7;
      })();
   self.firstDay = firstDay;
   self.lastDay = lastDay;
   
   self.allDates = (function () {
      var actions = [];
      rawTriggers.map(function (trigger, index, array) {
         actions = actions.concat(trigger.actions());
      });
      var actionDates = actions.map(function(action, actionIndex, actionArray){
         return action.date();
      });
      var triggerDates = rawTriggers.map(function(trigger) {
            return trigger.date();
      });
      var allDates = actionDates.concat(triggerDates);
      
      allDates.sort(function (a, b) {
         var dateA = new Date(a);
         var dateB = new Date(b);
         return dateA - dateB;
      });
      return allDates;
   }());
};
  
 scm.calandarMapper = function(observableTriggers) {
    var calendarDays = function() {
      var triggers, i, dateRange;
      triggers = observableTriggers();
      dateRange = new scm.ViewDateRange(triggers);

      var theDays = (function () {
         var calendarDay, currentDay, rtnDays;
         rtnDays = [];
         for (i = 0; i < dateRange.dayCount; i++) {
            currentDay = new Date(new Date(dateRange.firstDay).addDays(i));

            calendarDay = {
               day: currentDay,
               niceDay: currentDay.formatMMDD(),
               channels: (function () { // <-- make this day items.
                  var myChannels = [];
                  self.allChannels().map(function (currentChannel, index, array) {
                     var innerActions = [];
                     
                     self.allActions().map(function (action, actionIndex, actionArray) {
                        if ((new Date(action.date()).toString() === currentDay.toString()) && (action.channel() === currentChannel)) {
                           innerActions.push(action);
                        }
                     });
                     
                     myChannels = myChannels.concat({channel: currentChannel, actions: innerActions});
                  });
                  return myChannels;
               })()
            };

            rtnDays.push(calendarDay);
         };
         return rtnDays;
      });

      return theDays;
    };
    return ko.computed(calendarDays, self.triggers);   
    
    
};


   


function CampaignsViewModel(data) {
   var self = this;
   var triggerArrayMapper = new scm.TriggerArrayMapper();
   self.triggers = triggerArrayMapper.fromJS(data);
   self.triggerToAddTitle = ko.observable("");
   self.triggerToAddDate = ko.observable("");   

   self.allChannels = function () {
      var temp = [];
      var rtn = [];
      self.allActions().map(function (action, index, array) {
         if ($.inArray(action.channel(), temp) < 0) {
            rtn.push(action.channel());
         }
         temp = rtn.slice(0);
      });
      rtn.sort();
      return rtn;
   };



   self.calendarDays = ko.computed(function () {
      var triggers, rtn, firstDay, lastDay, dayCount, i, calendarDays;
      triggers = self.triggers();
      var allActionsCopy = self.allActions();
      dayCount = (function () {
         if(allActionsCopy.length > 0){
            firstDay = new Date(allActionsCopy[0].date());
            // start on sunday
            firstDay.addDays(-firstDay.getDay());
            lastDay = new Date(allActionsCopy[allActionsCopy.length - 1].date());
            // end on saturday
            lastDay.addDays(6-lastDay.getDay());
            return ((lastDay - firstDay) / 86400000) + 1;
         };
         return 0;
      });

      calendarDays = (function () {
         var calendarDay, currentDay, rtnDays;
         rtnDays = [];
         for (i = 0; i < dayCount; i++) {
            currentDay = new Date(new Date(firstDay).addDays(i));

            calendarDay = {
               day: currentDay,
               niceDay: currentDay.formatMMDD(),
               channels: (function () {
                  var myChannels = [];
                  self.allChannels().map(function (currentChannel, index, array) {
                     var innerActions = [];
                     
                     self.allActions().map(function (action, actionIndex, actionArray) {
                        if ((new Date(action.date()).toString() === currentDay.toString()) && (action.channel() === currentChannel)) {
                           innerActions.push(action);
                        }
                     });
                     
                     myChannels = myChannels.concat({channel: currentChannel, actions: innerActions});
                  });
                  return myChannels;
               })()
            };

            rtnDays.push(calendarDay);
         };
         return rtnDays;
      });

      return calendarDays;
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
         notes: "",
         actions: []
      };
      var rtn = triggerArrayMapper.processTrigger(newTrigger, self.triggers);
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
         var newAction = ko.mapping.fromJS({ date: this.addActionDate(), channel: this.addActionChannel(), id: "new", notes: "", });
         triggerArrayMapper.postProcessAction(newAction, self.currentTrigger().title, self.triggers);
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

      return [trigger1, trigger2];
   },

   getTrigger1: function () {
      return {
         title: "annual meeting2",
         date: new Date("1/15/2012"),
         notes: "notes for annual meeting",
         actions: [
            { channel: "facebook", date: "1/12/2012", id: 1, notes: "a note" },
            { channel: "twitter", date: "1/12/2012", id: 2, notes: "action note" },
            { channel: "twitter", date: "1/15/2012", id: 3, notes: "" }
         ]
      };
   },

   getTrigger2: function () {
      return {
         title: "brown bag2",
         date: new Date("2/15/2012"),
         notes: "order lunch",
         actions: [
            { channel: "meetup", date: "2/12/2012", id: 4, notes: "yet another" },
            { channel: "twitter", date: "2/14/2012", id: 5, notes: "notes, notes, notes" },
         ]
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


