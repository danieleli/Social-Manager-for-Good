# <reference path="/scripts/knockout-1.3.0beta.debug.js" />
# <reference path="/scripts/jquery-1.6.2.js" />

$ ->
  ko.bindingHandlers.executeOnEnter = init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
    value = undefined
    value = valueAccessor()
    $(element).keypress (event) ->
      keyCode = undefined
      keyCode = (if event.which then event.which else event.keyCode)
      if keyCode is 13
        value.call viewModel
        return false
      true
   