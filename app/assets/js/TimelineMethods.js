const TimelineMethods = {
  checkDateInRange: function (date, dateRange) {
    // Checks if a date falls within a date range
    return date >= dateRange[0] && date <= dateRange[1];
  },
  getRangeLengthYears: function (dateRange) {
    return Math.abs(
      dateRange[0].getUTCFullYear() - dateRange[1].getUTCFullYear(),
    );
  },
  getRangeLengthMonths: function (dateRange) {
    // Returns the length of a date range in months.
    var months;
    let [d1, d2] = dateRange;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  },
  getRangeLengthDays: function (dateRange) {
    // Returns the length of a date range in days.
    let difference = dateRange[1].getTime() - dateRange[0].getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  },
  padTo2Digits: function (num) {
    // Helper function for formatDate.
    return num.toString().padStart(2, "0");
  },
  formatDate: function (date) {
    // Returns DD/MM/YYYY string from date object.
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  },
  addDays: function (date, days) {
    // Adds <days> days to date. Returns a date object.
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  removeDays: function (date, days) {
    // Subtracts <days> to date. Returns a date object.
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  },
  addDateToData: function (dates, markers, date, dateFormatted, marker) {
    // Given an array of objects, each object a date object with
    // its timeline label (date in string DD/MM/YYYY) , and an object of date
    // markers and their labels (to put a mark where the date is in the
    // timeline, and either its string label or empty for the dates where
    // we don't want label), and a new date, formatted date
    // (date in string DD/MM/YYYY), and  its marker label (will be
    // "" if we don't want the date to show below timeline), adds the new date
    // to dates and its marker to markers. Note that we mutate directly, i.e.
    // not functional.
    dates.push({
      date: date.toString(),
      label: dateFormatted,
    });
    markers[date.toString()] = marker;
  },
  getStartDatesAndMarkers: function (startDate) {
    // Sets up dates array and markerDates object with the
    // first date of the timeline range.
    let dates = [];
    let markerDates = {};
    let firstDateFormatted = this.formatDate(startDate);
    this.addDateToData(
      dates,
      markerDates,
      startDate,
      firstDateFormatted,
      firstDateFormatted,
    );

    return [dates, markerDates];
  },
  checkEndMarkers: function (
    lastDate,
    markersDates,
    index,
    dateFrequency,
    dateFrequencyUnit,
  ) {
    // If a markerDate with label at position index starting from
    // the end in the markersObject, is 2 dateFrequency close to the
    // last date in dates, removes the label from the marker. Note that
    // we mutate <markersDates> directly, i.e. not functional.
    let lastPeriodLength = null;
    let lastMarkerDate =
      Object.keys(markersDates)[Object.keys(markersDates).length - (1 + index)];
    let lastMarkerDateObj = new Date(lastMarkerDate);

    if (dateFrequencyUnit === "years") {
      lastPeriodLength = this.getRangeLengthYears([
        lastMarkerDateObj,
        lastDate,
      ]);
    } else if (dateFrequencyUnit == "months") {
      lastPeriodLength = this.getRangeLengthMonths([
        lastMarkerDateObj,
        lastDate,
      ]);
    } else {
      lastPeriodLength = this.getRangeLengthDays([lastMarkerDateObj, lastDate]);
    }

    if (lastPeriodLength <= dateFrequency * 2) {
      markersDates[lastMarkerDate] = "";
    }
  },
  getTimelineLongRangeData: function (
    dateRange,
    rangeLengthYears,
    dateFrequency,
    markerFrequencyModulo,
  ) {
    // Returns the filled up array of dates and markers to
    // be passed to the timeline. Called whenever we have a range
    // larger than 15 years, although with varying frequencies.
    // Adds dates to the timeline with a frequency of <dateFrequency>
    // years, and marker labels with a frequency of
    // <dateFrequency>*<markerFrequencyModulo> years.

    let startDate = dateRange[0];
    let startYear = startDate.getFullYear();
    let [dates, markerDates] = this.getStartDatesAndMarkers(startDate);
    let noDatesTotal = Math.round(rangeLengthYears / dateFrequency);

    for (let i = 1; i < noDatesTotal; i++) {
      let newDate = new Date(startDate);
      newDate.setFullYear(startYear + i * dateFrequency);
      let newDateFormatted = this.formatDate(newDate);

      if (i % markerFrequencyModulo === 0) {
        this.addDateToData(
          dates,
          markerDates,
          newDate,
          newDateFormatted,
          newDateFormatted,
        );
      } else {
        this.addDateToData(dates, markerDates, newDate, newDateFormatted, "");
      }
    }

    let lastDateFormatted = this.formatDate(dateRange[1]);
    this.addDateToData(
      dates,
      markerDates,
      dateRange[1],
      lastDateFormatted,
      lastDateFormatted,
    );
    this.checkEndMarkers(dateRange[1], markerDates, 1, dateFrequency, "years");

    return [dates, markerDates];
  },
  getTimelineMidRangeData: function (
    dateRange,
    rangeLengthMonths,
    dateFrequency,
    markerFrequencyModulo,
  ) {
    // Returns the filled up array of dates and markers to
    // be passed to the timeline. Called whenever we have a range
    // larger than 2 and smaller than 15 years, although
    // with varying frequencies.
    // Adds dates to the timeline with a frequency of <dateFrequency>
    // months, and marker labels with a frequency of
    // <dateFrequency>*<markerFrequencyModulo> months.

    let startDate = dateRange[0];
    let startMonth = startDate.getMonth();
    let [dates, markerDates] = this.getStartDatesAndMarkers(startDate);
    let noDatesTotal = Math.round(rangeLengthMonths / dateFrequency);

    for (let i = 1; i < noDatesTotal; i++) {
      let newDate = new Date(startDate);
      newDate.setMonth(startMonth + i * dateFrequency);
      let newDateFormatted = this.formatDate(newDate);

      if (i % markerFrequencyModulo === 0) {
        this.addDateToData(
          dates,
          markerDates,
          newDate,
          newDateFormatted,
          newDateFormatted,
        );
      } else {
        this.addDateToData(dates, markerDates, newDate, newDateFormatted, "");
      }
    }

    let lastDateFormatted = this.formatDate(dateRange[1]);
    this.addDateToData(
      dates,
      markerDates,
      dateRange[1],
      lastDateFormatted,
      lastDateFormatted,
    );
    this.checkEndMarkers(dateRange[1], markerDates, 1, dateFrequency, "months");

    return [dates, markerDates];
  },
  getTimelineShortRangeData: function (
    dateRange,
    rangeLengthDays,
    dateFrequency,
    markerFrequencyModulo,
  ) {
    // Returns the filled up array of dates and markers to
    // be passed to the timeline. Called whenever we have a range
    // smaller than 2 years, although with varying frequencies.
    // Adds dates to the timeline with a frequency of <dateFrequency>
    // days, and marker labels with a frequency of
    // <dateFrequency>*<markerFrequencyModulo> days.

    let startDate = dateRange[0];
    let [dates, markerDates] = this.getStartDatesAndMarkers(startDate);
    let noDaysTotal = Math.round(rangeLengthDays / dateFrequency);

    for (let i = 1; i < noDaysTotal; i++) {
      let newDate = this.addDays(new Date(startDate), i * dateFrequency);
      let newDateFormatted = this.formatDate(newDate);

      if (i % markerFrequencyModulo === 0) {
        this.addDateToData(
          dates,
          markerDates,
          newDate,
          newDateFormatted,
          newDateFormatted,
        );
      } else {
        this.addDateToData(dates, markerDates, newDate, newDateFormatted, "");
      }
    }
    let lastDateFormatted = this.formatDate(dateRange[1]);
    this.addDateToData(
      dates,
      markerDates,
      dateRange[1],
      lastDateFormatted,
      lastDateFormatted,
    );
    this.checkEndMarkers(dateRange[1], markerDates, 1, dateFrequency, "days");

    return [dates, markerDates];
  },
  getDatesFrequencies: function (noOfDates, dateRangeLength) {
    // Returns the frequency of dates in the timeline and
    // the frequency of markers - with respect to the total
    // number of dates.
    let frequency = Math.ceil(dateRangeLength / noOfDates);
    let markerFrequencyModulo = 4;

    if (dateRangeLength % 2 !== 0) {
      markerFrequencyModulo = 5;
    }
    if (frequency < 1) {
      return [1, markerFrequencyModulo];
    }

    return [frequency, markerFrequencyModulo];
  },
  getTimelineData: function (dateRange) {
    // Returns the timeline data given a date range. Calls either
    // getTimelineLongRangeData, getTimelineMidRangeData or
    // getTimelineShortRangeData depending on the length of the range,
    // with different date frequencies and marker frequencies. Could be
    // nicer.
    let rangeLengthYears = this.getRangeLengthYears(dateRange);

    if (rangeLengthYears > 50) {
      let [dateFrequency, markerFrequencyModulo] = this.getDatesFrequencies(
        20,
        rangeLengthYears,
      );
      return this.getTimelineLongRangeData(
        dateRange,
        rangeLengthYears,
        dateFrequency,
        markerFrequencyModulo,
      );
    }
    if (rangeLengthYears > 15) {
      let [dateFrequency, markerFrequencyModulo] = this.getDatesFrequencies(
        24,
        rangeLengthYears,
      );
      return this.getTimelineLongRangeData(
        dateRange,
        rangeLengthYears,
        dateFrequency,
        markerFrequencyModulo,
      );
    }

    let rangeLengthMonths = this.getRangeLengthMonths(dateRange);

    if (rangeLengthYears > 1) {
      let [dateFrequency, markerFrequencyModulo] = this.getDatesFrequencies(
        24,
        rangeLengthMonths,
      );
      return this.getTimelineMidRangeData(
        dateRange,
        rangeLengthMonths,
        dateFrequency,
        markerFrequencyModulo,
      );
    }

    let rangeLengthDays = this.getRangeLengthDays(dateRange);
    let [dateFrequency, markerFrequencyModulo] = this.getDatesFrequencies(
      48,
      rangeLengthDays,
    );

    return this.getTimelineShortRangeData(
      dateRange,
      rangeLengthDays,
      dateFrequency,
      7,
    );
  },
};

export default TimelineMethods;
