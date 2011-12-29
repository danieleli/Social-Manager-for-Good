$(function () {
   $('.reveal-tab').click(function () {
      if (this.innerText === "{ - }") {
         this.innerText = "{ + }";
         $(this.previousElementSibling).slideUp('slow');
         
      } else {
         this.innerText = "{ - }";
         $(this.previousElementSibling).slideDown('fast');
         
      }

   });
});