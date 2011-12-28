(function() {

  $(function() {
    $.ajaxSetup({
      cache: false
    });
    return window.CrudHelpers = {
      ajaxAdd: function(url, dataToSave, callback) {
        return this.ajaxModify(url, dataToSave, "POST", "add", callback);
      },
      ajaxUpdate: function(url, dataToSave, successCallback) {
        dataToSave.ModifyDate = new Date();
        return this.ajaxModify(url, dataToSave, "PUT", "update", successCallback);
      },
      ajaxDelete: function(url, dataToSave, successCallback) {
        return this.ajaxModify(url + "/" + dataToSave, null, "DELETE", "deleted", successCallback);
      },
      ajaxModify: function(url, dataToSave, httpVerb, successMessage, callback) {
        return $.ajax(url, {
          data: dataToSave,
          type: httpVerb,
          dataType: 'json',
          contentType: 'application/json',
          success: function(data) {
            return callback(data);
          },
          error: function(data) {
            return humane("An error occured: " + data.responseText);
          }
        });
      }
    };
  });

}).call(this);
