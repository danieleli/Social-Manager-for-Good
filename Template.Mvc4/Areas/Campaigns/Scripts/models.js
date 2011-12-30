var Topic = function (id, title, date, notes, actions) {
   return {
      id: id,
      title: title,
      date: new Date(date),
      notes: notes,
      actions: actions
   };
};

var Action = function (id, channel, date, notes) {
   return {
      id: id,
      channel: channel,
      date: new Date(date),
      notes: notes
   };
};