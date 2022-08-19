
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
  getTimelineYearlyData: function (
    dateRange, rangeLengthYears, 
    dateFrequency, markerFrequencyModulo
    ) {
    let dates = [];
    let markerDates = {};
    let startDateFormatted = this.formatDate(dateRange[0]);
    let lastDateAdded = dateRange[0];

    dates.push({
      date: lastDateAdded,
      label: startDateFormatted
    })
    markerDates[lastDateAdded] = startDateFormatted;

    let noDatesTotal = Math.round(rangeLengthYears / dateFrequency);
    let noDatesAdded = 1;

    while (noDatesAdded < noDatesTotal) {
      let newDate = new Date(lastDateAdded);
      newDate.setFullYear(newDate.getFullYear() + dateFrequency);
      let newDateFormatted = this.formatDate(newDate);

      if (noDatesAdded % markerFrequencyModulo === 0) {
        markerDates[newDate] = newDateFormatted;
      }

      dates.push({
        date: newDate.toString(),
        label: newDateFormatted
      })
      lastDateAdded = newDate;
      noDatesAdded += 1;
    }

    let lastDate = dateRange[1];
    let lastDateFormatted = this.formatDate(dateRange[1]);

    dates.push({
      date: lastDate,
      label: lastDateFormatted
    })

    return [dates, markerDates]
  },
  getTimelineData: function (dateRange) {
    let rangeLengthYears = this.getRangeLengthYears(dateRange);

    if (rangeLengthYears > 100) {
      return this.getTimelineYearlyData(dateRange, rangeLengthYears, 5, 4);
    }
    if (rangeLengthYears > 15 && rangeLengthYears <= 25) {
      return this.getTimelineYearlyData(dateRange, rangeLengthYears, 1, 4);
    }

  }
}

export default TimelineMethods