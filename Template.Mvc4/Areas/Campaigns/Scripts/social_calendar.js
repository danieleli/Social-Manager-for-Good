var calendarDays = function (campaigns) {
   var firstDay, lastDay;
   var rtnDays = [];
   var self = this;

   var itemDates = (function () {
      var myDates = [];
      campaigns().map(function (campaign) {
         myDates.push(campaign.date());
         campaign.actions().map(function (action) {
            myDates.push(action.date());
         });
      });

      return myDates.sort(function (a, b) {
         return a - b;
      });
   } ());

   var count = (function () {
      if (itemDates.length === 0) return 0;

      firstDay = new Date(itemDates[0]);
      firstDay.addDays(-firstDay.getDay());  // start on sunday
      lastDay = new Date(itemDates[itemDates.length - 1]);
      lastDay.addDays(6 - lastDay.getDay()); // end on saturday
      return ((lastDay - firstDay) / 86400000) + 1;
   } ());

   for (var i = 0; i < count; i++) {
      rtnDays.push(new CalendarDay(new Date(firstDay).addDays(i), campaigns));
   }
   return rtnDays;
};

var CalendarDay = function (date, campaigns) {
   var myDate = new Date(date);
   return {
     date: myDate,
     niceDay: myDate.formatMMDD(),
      actions: (function () {
         var rtnActions = [];
         campaigns().map(function (campaign) {
            campaign.actions().map(function (action) {
               if (action.date().toString() === myDate.toString()) {
                  rtnActions.push({
                     channel: action.channel,
                     campaignTitle: campaign.title
                  });
               };
            });
         });
         return rtnActions;
      }()),
      campaigns: (function () {
         var rtncampaigns = [];
         campaigns().map(function (campaign) {
            if (campaign.date().toString() === myDate.toString()) {
               rtncampaigns.push(campaign);
            }
         });
         return rtncampaigns;
      }())
   };
};

//self.allActions = function () {
//   var rtn = [];
//   self.triggers().map(function (trigger, index, array) {
//      rtn = rtn.concat(trigger.actions());
//   });
//   rtn.sort(function (a, b) {
//      var dateA = new Date(a.date());
//      var dateB = new Date(b.date());
//      return dateA - dateB;
//   });
//   return rtn;
//};

//self.calendarDays = ko.computed(function () {
//   var triggers, firstDay, lastDay, dayCount, i, calendarDays;
//   triggers = self.triggers();
//   var allActionsCopy = self.allActions();
//   dayCount = (function () {
//      if (allActionsCopy.length > 0) {
//         firstDay = new Date(allActionsCopy[0].date());
//         // start on sunday
//         firstDay.addDays(-firstDay.getDay());
//         lastDay = new Date(allActionsCopy[allActionsCopy.length - 1].date());
//         // end on saturday
//         lastDay.addDays(6 - lastDay.getDay());
//         return ((lastDay - firstDay) / 86400000) + 1;
//      };
//      return 0;
//   } ());

//   calendarDays = (function () {
//      var calendarDay, currentDay, rtnDays;
//      rtnDays = [];
//      for (i = 0; i < dayCount; i++) {
//         currentDay = new Date(new Date(firstDay).addDays(i));

//         calendarDay = {
//            day: currentDay,
//            niceDay: currentDay.formatMMDD(),
//            channels: (function () {
//               var rtn = [];
//               self.allChannels().map(function (currentChannel, index, array) {
//                  var innerActions = [];

//                  self.allActions().map(function (action, actionIndex, actionArray) {
//                     if ((new Date(action.date()).toString() === currentDay.toString()) && (action.channel() === currentChannel)) {
//                        innerActions.push(action);
//                     }
//                  });


//                  rtn = rtn.concat({ channel: currentChannel, actions: innerActions });
//               });
//               return rtn;
//            })()
//         };

//         rtnDays.push(calendarDay);
//      };
//      return rtnDays;
//   })();

//   return calendarDays;
//}, self.triggers);
