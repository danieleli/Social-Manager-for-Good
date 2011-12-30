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




var dummyTriggers =
[
   {
      id: 1,
      name: "topic1",
      date: "1/1/2000",
      notes: "somenotes",
      actions:
      [
         {
            id: 1,
            channel: "twitter",
            date: "12/15/1999",
            notes: "action1notes"
         }, {
            id: 2,
            channel: "facebook",
            date: "12/30/1999",
            notes: "action2notes"
         }
      ]
   }, {
      test: 1,
      test2: 2
   }
];