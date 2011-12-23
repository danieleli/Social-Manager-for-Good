trigger1 =
  title: "trigger1"
  activities: new Array(
    date: new Date("01/01/2012")
    channels: new Array("facebook", "twitter")
  ,
    date: new Date("01/03/2012")
    channels: new Array("facebook", "linkedin")
  )
  selectTrigger: (item) -> 
    alert item

data =
  channels: new Array("facebook", "linkedin", "twitter")
  purposes: new Array("recruit", "inform", "feedback")
  triggers: new Array(trigger1)

$ ->
  viewModel =
    triggers: ko.observableArray(ko.toProtectedObservableItemArray(data.triggers))
    selectTrigger: ->
      this.selectTrigger()(this.title()); 
  ko.applyBindings viewModel