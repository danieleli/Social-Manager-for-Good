Date.prototype.formatMMDDYYYY = function () {
   return this.getMonth() + 1 + '/' + this.getDate() + '/' + this.getFullYear();
};

Date.prototype.formatMMDD = function () {
   return this.getMonth() + 1 + '/' + this.getDate();
};

Date.prototype.addDays = function (days) {
   days = this.getDate() + days;
   return this.setDate(days);
};