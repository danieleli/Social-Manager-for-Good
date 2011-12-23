Date.prototype.formatMMDDYYY =  ->
  return this.getMonth()+1 + '/' + this.getDate() + '/' + this.getFullYear();


channel = 
  (c) ->
    channel: c
channels = 
  (channelsArray) ->
    rtn = new Array();
    rtn.push {channel: channel} for channel in channelsArray;
    rtn

activity =
  (date, channels) -> 
    date: new Date(date),
    niceDate: new Date(date).formatMMDDYYY(),
    channels: channels

trigger =
  (title, activities) ->
    title: title,
    activities: activities


trigger1 =
  new trigger "trigger1", new Array(
    activity "02/01/2012", channels new Array "twitter", "facebook" 
  ,
    activity "01/03/2012", channels new Array "facebook"
  )

trigger2 =
  title: "trigger2"
  activities: new Array(
    activity "02/01/2012", channels new Array "facebook" 
  )

trigger3 = 
  trigger 'trigger3', new Array(
    activity "03/12/2012", channels new Array "myspace", "facebook"
  ,
    activity "03/13/2012", channels new Array "facebook"
  )


data =
  channels: new Array "facebook", "linkedin", "twitter"
  purposes: new Array "recruit", "inform", "feedback"
  triggers: new Array trigger1, trigger2, trigger3 

$ ->
  viewModel =
    triggers: ko.observableArray(ko.toProtectedObservableItemArray(data.triggers))
    selectTrigger: ->
      alert this.title()

  ko.applyBindings viewModel