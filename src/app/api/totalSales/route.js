import services from "@/services/connect";

export const POST = async (request) => {
  const { min, max } = await request.json();

  try {
    const salesData = await services.GetAllSeles();

    const filteredSales = salesData.filter((sale) => {
      const date = sale.datetime;
      if (min && !max) {
        return Date.parse(date) >= Date.parse(min);
      } else if (!min && max) {
        return Date.parse(date) <= Date.parse(max);
      } else if (min && max) {
        return (
          Date.parse(date) >= Date.parse(min) &&
          Date.parse(date) <= Date.parse(max)
        );
      } else return true;
    });

    let No = 0;
    let Price = 0;

    filteredSales.forEach((item) => {
      Price = Price + item.totalAmount;
      item.items.forEach((item) => {
        No = No + item.no;
      });
    });

    return new Response(
      JSON.stringify({
        result: {
          Price: Price,
          No: No,
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
