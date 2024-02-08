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

    // const salesData = await services.GetAllSeles();
    const expanseData = await services.GetAllExapase();

    const filteredTodayExpanse = expanseData.filter((ex) => {
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
    const filteredWeekExpanse = expanseData.filter((ex) => {
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
    const filteredMonthExpanse = expanseData.filter((ex) => {
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

    let TodayEx = 0;
    let WeekEx = 0;
    let MonthEx = 0;

    filteredTodayExpanse.forEach((item) => {
      TodayEx = TodayEx + Number(item.amount);
    });

    filteredWeekExpanse.forEach((item) => {
      WeekEx = WeekEx + Number(item.amount);
    });
    filteredMonthExpanse.forEach((item) => {
      MonthEx = MonthEx + Number(item.amount);
    });

    return new Response(
      JSON.stringify({
        result: {
          TodayEx: TodayEx,
          WeekEx: WeekEx,
          MonthEx: MonthEx,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to Get Total expanse", { status: 500 });
  }
};
