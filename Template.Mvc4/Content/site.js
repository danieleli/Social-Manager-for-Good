$(function () {
  //setTimeout(function () {
    $('body').on('click', '.reveal-tab', {}, function () {
      if (this.innerText === "{ - }") {
        this.innerText = "{ + }";
        $(this.previousElementSibling).slideUp('slow');

      } else {
        this.innerText = "{ - }";
        $(this.previousElementSibling).slideDown('fast');
      }
    });
 // }, 700);
});