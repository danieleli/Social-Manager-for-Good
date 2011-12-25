
var trigger1 = {
   Title: "annual meeting",
   Date: new Date("1/15/2012"),
   Actions: null
}

var trigger2 = {
   Title: "brown bag",
   Date: new Date("2/15/2012"),
   Actions: null
}


var data = new Array( trigger1, trigger2 );

$(function () {

   var viewModel = ko.mapping.fromJS(data);
      

});