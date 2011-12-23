(function() {

  $(function() {
    return ko.bindingHandlers.executeOnEnter = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value;
        value = void 0;
        value = valueAccessor();
        return $(element).keypress(function(event) {
          var keyCode;
          keyCode = void 0;
          keyCode = (event.which ? event.which : event.keyCode);
          if (keyCode === 13) {
            value.call(viewModel);
            return false;
          }
          return true;
        });
      }
    };
  });

}).call(this);
