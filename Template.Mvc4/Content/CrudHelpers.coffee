$ -> 

  $.ajaxSetup cache: false
  window.CrudHelpers =
    ajaxAdd: (url, dataToSave, callback) ->
      this.ajaxModify url, dataToSave, "POST", "add", callback

    ajaxUpdate: (url, dataToSave, successCallback) ->
      dataToSave.ModifyDate = new Date()
      this.ajaxModify url, dataToSave, "PUT", "update", successCallback

    ajaxDelete: (url, dataToSave, successCallback) ->
      this.ajaxModify url + "/"+ dataToSave, null, "DELETE", "deleted", successCallback

    ajaxModify: (url, dataToSave, httpVerb, successMessage, callback) ->
      $.ajax url, 
         data: dataToSave, 
         type: httpVerb, 
         dataType: 'json', 
         contentType: 'application/json',
         success: (data) ->  
           callback data  
         error: (data) -> 
           humane "An error occured: " + data.responseText
  
   