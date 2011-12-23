trigger1 =
  title: "trigger1"
  activities: new Array(
    date: new Date "01/01/2012"
    channels: new Array "facebook", "twitter"
  ,
    date: new Date "01/03/2012"
    channels: new Array "facebook", "linkedin" 
  )
  selectTrigger: (koItem) -> 
    alert koItem.title()


trigger2 =
  title: "trigger2"
  activities: new Array(
    date: new Date "02/01/2012"
    channels: new Array "twitter"
  ,
    date: new Date "02/03/2012"
    channels: new Array "linkedin", "facebook" 
  )
  selectTrigger: (koItem) -> 
    alert koItem.title()

data =
  channels: new Array "facebook", "linkedin", "twitter"
  purposes: new Array "recruit", "inform", "feedback"
  triggers: new Array trigger1, trigger2 

$ ->
  viewModel =
    triggers: ko.observableArray(ko.toProtectedObservableItemArray(data.triggers))
    selectTrigger: ->
      this.selectTrigger() this

  ko.applyBindings viewModel