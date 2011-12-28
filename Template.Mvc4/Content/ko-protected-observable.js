//http://www.knockmeout.net/2011/03/guard-your-model-accept-or-cancel-edits.html

//wrapper to an observable that requires accept/cancel
$(function () {
  ko.protectedObservable = function (initialValue) {
    var result, _actualValue, _tempValue;
    if (initialValue && typeof (initialValue) === "string" && initialValue.indexOf("/Date(") === 0) {
      initialValue = new Date(parseInt(initialValue.match(/\d+/))).toString();
    }
    _actualValue = ko.observable(initialValue);
    _tempValue = initialValue;
    result = ko.dependentObservable({
      read: function () {
        return _actualValue();
      },
      write: function (newValue) {
        return _tempValue = newValue;
      }
    });
    result.commit = function () {
      if (_tempValue !== _actualValue()) {
        return _actualValue(_tempValue);
      }
    };
    result.reset = function () {
      _actualValue.valueHasMutated();
      return _tempValue = _actualValue();
    };
    return result;
  };


  ko.protectedObservableItem = function (item) {
    for (var param in item) {
      if (item.hasOwnProperty(param)) {
        this[param] = ko.protectedObservable(item[param]);
      }
    }

    this.commit = function () {
      for (var property in this) {
        if (this.hasOwnProperty(property) && this[property].commit) this[property].commit();
      }
    }
  };

  ko.toProtectedObservableItemArray = function (sourceArray) {
    var drillItems = ko.utils.arrayMap(sourceArray, function (item) {
      return new ko.protectedObservableItem(item);
    })
    return drillItems;
  };


  ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      //initialize datepicker with some optional options
      var options = allBindingsAccessor().datepickerOptions || {};
      $(element).datepicker(options);

      //handle the field changing
      ko.utils.registerEventHandler(element, "change", function () {
        var observable = valueAccessor();
        observable($(element).datepicker("getDate"));
      });

      //handle disposal (if KO removes by the template binding)
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).datepicker("destroy");
      });

    },
    //update the control when the view model changes
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      $(element).datepicker("setDate", value);
    }
  };
});


     
      