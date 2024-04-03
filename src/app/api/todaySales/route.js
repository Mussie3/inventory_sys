import services from "@/services/connect";

export const POST = async (request) => {
  const {} = await request.json();

  try {
    const salesData = await services.GetAllSeles();
    const cashData = await services.GetAllCash();

    let today = new Date();

    const filteredSales = salesData.filter((sale) => {
      const dateToCheck = new Date(sale.datetime);
      if (
        dateToCheck.getFullYear() === today.getFullYear() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getDate() === today.getDate()
      ) {
        return true;
      } else return false;
    });

    const filteredCash = cashData.filter((ca) => {
      const dateToCheck = new Date(ca.datetime);
      if (
        dateToCheck.getFullYear() === today.getFullYear() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getDate() === today.getDate()
      ) {
        return true;
      } else return false;
    });

    let No = 0;
    let Price = 0;
    let CashPrice = 0;

    filteredSales.forEach((item) => {
      Price = Price + item.totalAmount;
      item.items.forEach((item) => {
        No = No + item.no;
      });
    });

    filteredCash.forEach((item) => {
      if (item.type == "sale") {
        CashPrice = CashPrice + Number(item.amount);
      }
    });

    return new Response(
      JSON.stringify({
        result: {
          Total: {
            Price: Price,
            No: No,
          },
          Cash: {
            Price: CashPrice,
            No: No,
          },
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
