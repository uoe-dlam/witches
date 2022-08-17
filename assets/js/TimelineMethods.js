
const TimelineMethods = {
  checkDateInRange: function (date, dateRange) {
    return date >= dateRange[0] && date <= dateRange[1]
  },
  getRangeLengthYears: function (dateRange) {
    return Math.abs(dateRange[0].getUTCFullYear() - dateRange[1].getUTCFullYear())
  },
  padTo2Digits: function (num) {
    return num.toString().padStart(2, '0');
  },
  formatDate: function (date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  },
  getTimelineData5Yearly: function (dateRange, rangeLengthYears) {
    let dates = {};
    let markerDates = {};
    let startDateFormatted = this.formatDate(dateRange[0]);
    let lastDateAdded = dateRange[0];

    dates[lastDateAdded] = startDateFormatted;
    markerDates[lastDateAdded] = startDateFormatted;

    let noDatesTotal = Math.round(rangeLengthYears / 5) - 1;
    let noDatesAdded = 1;

    while (noDatesAdded < noDatesTotal) {
      let newDate = new Date(lastDateAdded);
      newDate.setFullYear(newDate.getFullYear() + 5);
      let newDateFormatted = this.formatDate(newDate);

      if (noDatesAdded % 4 === 0) {
        markerDates[newDate] = newDateFormatted;
      }

      dates[newDate] = newDateFormatted;
      lastDateAdded = newDate;
      noDatesAdded += 1;
    }

    return [dates, markerDates]
  },
  getTimelineData: function (dateRange) {
    let rangeLengthYears = this.getRangeLengthYears(dateRange);

    if (rangeLengthYears > 100) {
      return this.getTimelineData5Yearly(dateRange, rangeLengthYears);
    }
    return [null, null]

  }
}

export default TimelineMethods