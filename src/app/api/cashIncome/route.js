import services from "@/services/connect";

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff)).toISOString();
  // .slice(0, 10);
}

function getFirstDayOfTheMonth(d) {
  let date_today = new Date(d);
  let firstDay = new Date(
    date_today.getFullYear(),
    date_today.getMonth(),
    1
  ).toISOString();
  return firstDay;
}

export const POST = async (request) => {
  // const { } = await request.json();

  try {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const nowPlusone = now.toISOString().slice(0, 10);

    const today = {
      min: new Date().toISOString().slice(0, 10),
      max: nowPlusone,
    };
    const thisWeek = {
      min: getMonday(new Date()),
      max: nowPlusone,
    };
    const thisMonth = {
      min: getFirstDayOfTheMonth(new Date()),
      max: nowPlusone,
    };

    const salesData = await services.GetAllSeles();

    console.log(salesData);

    const filteredTodaySales = salesData.filter((ex) => {
      const date = ex.datetime;
      if (today.min && !today.max) {
        return Date.parse(date) >= Date.parse(today.min);
      } else if (!today.min && today.max) {
        return Date.parse(date) <= Date.parse(today.max);
      } else if (today.min && today.max) {
        return (
          Date.parse(date) >= Date.parse(today.min) &&
          Date.parse(date) <= Date.parse(today.max)
        );
      } else return true;
    });
    console.log(filteredTodaySales);

    const filteredWeekSales = salesData.filter((ex) => {
      const date = ex.datetime;
      if (thisWeek.min && !thisWeek.max) {
        return Date.parse(date) >= Date.parse(thisWeek.min);
      } else if (!thisWeek.min && thisWeek.max) {
        return Date.parse(date) <= Date.parse(thisWeek.max);
      } else if (thisWeek.min && thisWeek.max) {
        return (
          Date.parse(date) >= Date.parse(thisWeek.min) &&
          Date.parse(date) <= Date.parse(thisWeek.max)
        );
      } else return true;
    });
    console.log(filteredWeekSales);
    const filteredMonthSales = salesData.filter((ex) => {
      const date = ex.datetime;
      if (thisMonth.min && !thisMonth.max) {
        return Date.parse(date) >= Date.parse(thisMonth.min);
      } else if (!thisMonth.min && thisMonth.max) {
        return Date.parse(date) <= Date.parse(thisMonth.max);
      } else if (thisMonth.min && thisMonth.max) {
        return (
          Date.parse(date) >= Date.parse(thisMonth.min) &&
          Date.parse(date) <= Date.parse(thisMonth.max)
        );
      } else return true;
    });

    console.log(filteredMonthSales);

    let TodayCash = 0;
    let WeekCash = 0;
    let MonthCash = 0;

    filteredTodaySales.forEach((item) => {
      if ((item.paidin = "cash")) {
        TodayCash = TodayCash + Number(item.totalAmount);
      } else if ((item.paidin = "mixed")) {
        const incash = Number(item.totalAmount) - Number(item.creditedAmount);
        TodayCash = TodayCash + incash;
      }
    });

    filteredWeekSales.forEach((item) => {
      if ((item.paidin = "cash")) {
        WeekCash = WeekCash + Number(item.totalAmount);
      } else if ((item.paidin = "mixed")) {
        const incash = Number(item.totalAmount) - Number(item.creditedAmount);
        WeekCash = WeekCash + incash;
      }
    });
    filteredMonthSales.forEach((item) => {
      if ((item.paidin = "cash")) {
        MonthCash = MonthCash + Number(item.totalAmount);
      } else if ((item.paidin = "mixed")) {
        const incash = Number(item.totalAmount) - Number(item.creditedAmount);
        MonthCash = MonthCash + incash;
      }
    });

    return new Response(
      JSON.stringify({
        result: {
          TodayCash: TodayCash,
          WeekCash: WeekCash,
          MonthCash: MonthCash,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to Get Total expanse", { status: 500 });
  }
};
