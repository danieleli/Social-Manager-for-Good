Date.prototype.formatMMDDYYY =  ->
  return this.getMonth()+1 + '/' + this.getDate() + '/' + this.getFullYear();

Date.prototype.formatMMDD =  ->
  return this.getMonth()+1 + '/' + this.getDate() 

Date.prototype.addDays= (days) ->
  days = this.getDate() + days;
  return this.setDate(days);

action  = 
  (date, channel) -> 
    date: new Date(date),
    niceDate: new Date(date).formatMMDDYYY(),
    channel: channel

trigger =
  (title, date, actions) ->
    title: title,
    date: date,
    niceDate: new Date(date).formatMMDDYYY(),
    actions: actions,
    addActionChannel: "x",
    addActionDate: new Date(),
    getRows: ((new Date(new Date(date).addDays(num))) for num in [-7..7]),
    actionToAdd: new action("", ""),
    addAction: ->
      newAction = action this.addActionDate, this.addActionChannel
      this.addActionChannel = ""
      this.addActionDate = "01/01/2012"
      this.actions().push new ko.protectedObservableItem newAction



loadData = ->
  trigger1 =
    new trigger "Annual Meeting", "01/15/2012", new Array(
      action "01/01/2012", "twitter"
      action "01/01/2012", "facebook"
      action "01/03/2012", "twitter"
    )

  trigger2 =
    new trigger "Brown Bag", "02/24/2012", new Array(
      action "02/01/2012", "twitter"
      action "02/01/2012", "meetup"
      action "02/03/2012", "linkedin"
      action "02/05/2012", "twitter"
    )

  data =
    channels: new Array "facebook", "linkedin", "twitter"
    purposes: new Array "recruit", "inform", "feedback"
    triggers: new Array trigger1, trigger2

$ ->
  data = loadData()
  viewModel = 
    self=this
    triggers: ko.observableArray(ko.toProtectedObservableItemArray(data.triggers))
    selectTrigger: ->
      alert this.title()
    selectAction: ->
      alert this.date()
    triggerToAddTitle: ko.observable ""
    triggerToAddDate: ko.observable ""
    addTrigger: ->
      newTrigger = trigger this.triggerToAddTitle(),this.triggerToAddDate(), new Array()
      this.triggerToAddTitle ""
      this.triggerToAddDate ""
      viewModel.triggers.push new ko.protectedObservableItem newTrigger
      $('.triggers .tabs').tabs();
      $('.triggers .details .date').datepicker();



  ko.applyBindings viewModel