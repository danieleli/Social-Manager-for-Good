(function() {

  $(function() {
    var baseUrl;
    $("#contactDialog").hide();
    baseUrl = "/api/contacts";
    return $.getJSON(baseUrl, function(jsonData) {
      var viewModel;
      viewModel = {
        contacts: ko.observableArray(ko.toProtectedObservableItemArray(jsonData)),
        contactToAddFirst: ko.observable(""),
        contactToAddLast: ko.observable(""),
        selectedContact: ko.observable(null),
        addContact: function() {
          var newContact;
          newContact = {
            FirstName: this.contactToAddFirst(),
            LastName: this.contactToAddLast()
          };
          this.contactToAddFirst("");
          this.contactToAddLast("");
          return CrudHelpers.ajaxAdd(baseUrl + "", ko.toJSON(newContact), function(data) {
            return viewModel.contacts.push(new ko.protectedObservableItem(data));
          });
        },
        selectContact: function() {
          return viewModel.selectedContact(this);
        }
      };
      $(document).on("click", ".contact-delete", function() {
        var itemToRemove;
        itemToRemove = ko.dataFor(this);
        return CrudHelpers.ajaxDelete(baseUrl, viewModel.selectedContact().Id().toString(), function(data) {
          viewModel.contacts.remove(itemToRemove);
          return humane(data);
        });
      });
      $(document).on("click", ".contact-edit", function() {
        return $("#contactDialog").dialog({
          buttons: {
            Save: function() {
              var contactId, currentContact;
              viewModel.selectedContact().commit();
              currentContact = viewModel.selectedContact();
              currentContact.ModifyDate = void 0;
              contactId = currentContact.Id();
              $(this).dialog("close");
              return CrudHelpers.ajaxUpdate(baseUrl + "/" + contactId, ko.toJSON(currentContact), function(data) {
                return humane("Contact Id: " + data.Id + " updated.");
              });
            },
            Cancel: function() {
              return $(this).dialog("close");
            }
          },
          width: 500,
          title: "Edit Contact"
        });
      });
      return ko.applyBindings(viewModel);
    });
  });

}).call(this);
