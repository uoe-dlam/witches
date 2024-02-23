export default {
  getJulianDate: function (date, precision) {
    let [day, month, year] = date.split("/");
    day = Number(day);
    month = Number(month);
    year = Number(year);
    let currentGregorianDate = new Date(year, month - 1, day);

    const PRECISION_DAY_MONTH_YEAR = "11";
    const PRECISION_MONTH_YEAR = "10";
    const PRECISION_YEAR = "9";

    // If we don't know the day, month, and year, then wikidata precision will be less than 11 and the dates don't need Julian conversion
    if (precision === PRECISION_MONTH_YEAR) {
      // Then return the date with month and year only
      return (
        `${(currentGregorianDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/` + `${currentGregorianDate.getFullYear()}`
      );
    }
    // If only year is known
    if (precision === PRECISION_YEAR) {
      // Then return the date with year only
      return `${currentGregorianDate.getFullYear()}`;
    }

    //if we have the full date (day,month,year) them the date needs to be converted into Julian
    const CUT_OFF_GREGORIAN_DATE = new Date(1700, 3, 1); // the gregorian date where the difference between julian and gregorian changes from 10 to 11
    let julianDate = new Date(currentGregorianDate);

    // JULIAN CONVERSION - https://en.wikipedia.org/wiki/Conversion_between_Julian_and_Gregorian_calendars
    if (currentGregorianDate < CUT_OFF_GREGORIAN_DATE) {
      julianDate.setDate(currentGregorianDate.getDate() - 10);
    } else {
      julianDate.setDate(currentGregorianDate.getDate() - 11);
    }

    return julianDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },
};
