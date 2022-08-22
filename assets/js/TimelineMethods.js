
const TimelineMethods = {
  checkDateInRange: function (date, dateRange) {
    return date >= dateRange[0] && date <= dateRange[1]
  },
  getRangeLengthYears: function (dateRange) {
    return Math.abs(dateRange[0].getUTCFullYear() - dateRange[1].getUTCFullYear())
  },
  getRangeLengthMonths: function (dateRange) {
    var months;
    let d1, d2 = dateRange;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  },
  getRangeLengthDays: function (dateRange) {
    let difference = dateRange[0].getTime() - dateRange[1].getTime();
    return Math.ceil(difference / (1000 * 3600 * 24))
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
  addDays: function (date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  removeDays: function (date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  },
  addDateToData: function (dates, markers, date, dateFormatted, marker) {
    dates.push({
      date: date.toString(),
      label: dateFormatted
    })
    markers[date] = marker;
  },
  getStartDatesAndMarkers: function (startDate) {
    let dates = [];
    let markerDates = {};
    let firstDateFormatted = this.formatDate(startDate);
    this.addDateToData(
      dates, markerDates, startDate, 
      firstDateFormatted, firstDateFormatted
    );
    return [dates, markerDates]
  },
  getTimelineLongRangeData: function (
    dateRange, rangeLengthYears,
    dateFrequency, markerFrequencyModulo
  ) {
    let startDate = dateRange[0];
    let startYear = startDate.getFullYear();
    let [dates, markerDates] = this.getStartDatesAndMarkers(startDate);
    let noDatesTotal = Math.round(rangeLengthYears / dateFrequency);
    
    for (let i = 1; i < noDatesTotal; i++) {
      let newDate = new Date(startDate);
      newDate.setFullYear(startYear + i);
      let newDateFormatted = this.formatDate(newDate);

      if (i % markerFrequencyModulo === 0) {
        this.addDateToData(
          dates, markerDates, newDate,
          newDateFormatted, newDateFormatted
        );
      } else {
        this.addDateToData(
          dates, markerDates, newDate,
          newDateFormatted, ""
        );
      }
    }

    let lastDateFormatted = this.formatDate(dateRange[1]);
    this.addDateToData(
      dates, markerDates, dateRange[1],
      lastDateFormatted, lastDateFormatted
    )

    return [dates, markerDates]
  },
  getTimelineMidRangeData: function (
    dateRange, rangeLengthMonths,
    dateFrequency, markerFrequencyModulo
  ) {
    let startDate = dateRange[0];
    let startMonth = startDate.getMonth();
    let dates, markerDates = this.getStartDatesAndMarkers(startDate);
    let noDatesTotal = Math.round(rangeLengthMonths / dateFrequency);

    for (let i = 1; i < noDatesTotal; i++) {
      let newDate = new Date(startDate);
      newDate.setMonth(startMonth + i);
      let newDateFormatted = this.formatDate(newDate);

      if (i % markerFrequencyModulo === 0) {
        this.addDateToData(
          dates, markerDates, newDate,
          newDateFormatted, newDateFormatted
        );
      } else {
        this.addDateToData(
          dates, markerDates, newDate,
          newDateFormatted, ""
        );
      }
    }

    let lastDateFormatted = this.formatDate(dateRange[1]);
    this.addDateToData(
      dates, markerDates, dateRange[1],
      lastDateFormatted, lastDateFormatted
    )

    return [dates, markerDates]
  },
  getTimelineShortRangeData: function (
    dateRange, rangeLengthDays, 
    dateFrequency, markerFrequencyModulo
  ) {
    let startDate = dateRange[0];
    let dates, markerDates = this.getStartDatesAndMarkers(startDate);
    let noDaysTotal = Math.round(rangeLengthDays / dateFrequency);

    for (let i = 1; i < noDaysTotal; i++) {
      let newDate = this.addDays(new Date(startDate), i);
      let newDateFormatted = this.formatDate(newDate);

      if (i % markerFrequencyModulo === 0) {
        this.addDateToData(
          dates, markerDates, newDate,
          newDateFormatted, newDateFormatted
        );
      } else {
        this.addDateToData(
          dates, markerDates, newDate,
          newDateFormatted, ""
        );
      }
    }
    let lastDateFormatted = this.formatDate(dateRange[1]);
    this.addDateToData(
      dates, markerDates, dateRange[1],
      lastDateFormatted, lastDateFormatted
    )

    return [dates, markerDates]
  },
  getTimelineData: function (dateRange) {
    let rangeLengthYears = this.getRangeLengthYears(dateRange);

    if (rangeLengthYears > 100) {
      return this.getTimelineLongRangeData(dateRange, rangeLengthYears, 6, 4);
    }
    if (rangeLengthYears > 15 && rangeLengthYears <= 25) {
      return this.getTimelineLongRangeData(dateRange, rangeLengthYears, 1, 4);
    }

    let rangeLengthMonths = this.getRangeLengthMonths(dateRange);

    if (rangeLengthYears > 10 <= 15) {
      return this.getTimelineShortRangeData(dateRange, rangeLengthMonths, 6, 4)
    }
  }
}

export default TimelineMethods