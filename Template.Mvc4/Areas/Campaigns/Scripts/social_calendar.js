var calendarDays = function (campaigns) {
   var first_day, last_day;
   var rtn_days = [];
   var self = this;

   var item_dates = (function () {
      var my_dates = [];
      campaigns().map(function (campaign) {
         my_dates.push(new Date(campaign.date()));
         campaign.actions().map(function (action) {
            my_dates.push(new Date(action.date()));
         });
      });

      return my_dates.sort(function (a, b) {
         return a - b;
      });
   } ());

   var date_range_length = (function () {
      if (item_dates.length === 0) return 0;

      first_day = new Date(item_dates[0]);
      first_day.addDays(-first_day.getDay());  // start on sunday
      last_day = new Date(item_dates[item_dates.length - 1]);
      last_day.addDays(6 - last_day.getDay()); // end on saturday
      return ((last_day - first_day) / 86400000) + 1;
   } ());

   for (var i = 0; i < date_range_length; i++) {
      rtn_days.push(new CalendarDay(new Date(first_day).addDays(i), campaigns));
   }
   return rtn_days;
};

var CalendarDay = function (date, campaigns) {
  var my_date = new Date(date);
  return {
    date: my_date,
    niceDay: my_date.formatMMDD(),
    actions: (function () {
      var rtn_actions = [];
      campaigns().map(function (campaign) {
        campaign.actions().map(function (action) {
          if (new Date(action.date()).toString() === my_date.toString()) {
            action.campaignTitle = ko.computed(function () { return campaign.title; }, campaigns);
            rtn_actions.push(action);
          };
        });
      });
      return rtn_actions;
    } ()),
    campaigns: (function () {
      var rtn_campaigns = [];
      campaigns().map(function (campaign) {
        if (new Date(campaign.date()).toString() === my_date.toString()) {
          rtn_campaigns.push(campaign);
        }
      });
      return rtn_campaigns;
    } ())
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
