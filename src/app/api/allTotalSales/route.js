import services from "@/services/connect";

function getDatesForCurrentMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dates = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const startDate = new Date(currentYear, currentMonth, day);
    const endDate = new Date(currentYear, currentMonth, day + 1);
    const name = startDate.toString().slice(0, 10);

    dates.push({
      startDate,
      endDate,
      name,
    });
  }

  return dates;
}

function getMonthStartAndEndDates() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const result = [];

  for (let month = 0; month < 12; month++) {
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0);
    const name = startDate.toLocaleString("default", { month: "long" });
    console.log(name);
    result.push({ start: startDate, end: endDate, month: name });
  }

  return result;
}

function getWeekDates() {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDates = [];
  for (let i = 1; i < 8; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    const startDate = new Date(currentDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(currentDate);
    endDate.setHours(23, 59, 59, 999);
    const name = startDate.toString().slice(0, 10);
    weekDates.push({ startDate, endDate, name });
  }

  return weekDates;
}

function filterWithDate(min, max, salesData) {
  const filteredSales = salesData.filter((sale) => {
    const date = sale.datetime;
    if (min && !max) {
      return Date.parse(date) >= Date.parse(min);
    } else if (!min && max) {
      return Date.parse(date) <= Date.parse(end);
    } else if (min && max) {
      return (
        Date.parse(date) >= Date.parse(min) &&
        Date.parse(date) <= Date.parse(max)
      );
    } else return true;
  });
  return filteredSales;
}

export const GET = async (request) => {
  try {
    const monthDates = getMonthStartAndEndDates();
    console.log(monthDates);

    const datesForCurrentMonth = getDatesForCurrentMonth();
    console.log(datesForCurrentMonth);

    const weekDates = getWeekDates();
    console.log(weekDates);

    const salesData = await services.GetAllSeles();

    console.log(salesData);

    const currentYearSales = monthDates.map((mon) => {
      const filtered = filterWithDate(mon.start, mon.end, salesData);
      console.log(filtered);
      let sum = 0;

      filtered.forEach((item) => {
        sum = sum + item.totalAmount;
      });

      return {
        name: mon.month,
        sum: sum,
      };
    });
    console.log(currentYearSales);

    const currentMonthSales = datesForCurrentMonth.map((day) => {
      const filtered = filterWithDate(day.startDate, day.endDate, salesData);
      console.log(filtered);
      let sum = 0;

      filtered.forEach((item) => {
        sum = sum + item.totalAmount;
      });

      return {
        name: day.name,
        sum: sum,
      };
    });
    console.log(currentMonthSales);

    const currentWeekSales = weekDates.map((day) => {
      const filtered = filterWithDate(day.startDate, day.endDate, salesData);
      console.log(filtered);
      let sum = 0;

      filtered.forEach((item) => {
        sum = sum + item.totalAmount;
      });

      return {
        name: day.name,
        sum: sum,
      };
    });
    console.log(currentWeekSales);

    return new Response(
      JSON.stringify({
        result: {
          thisYear: currentYearSales,
          thisMonth: currentMonthSales,
          thisWeek: currentWeekSales,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
