import services from "@/services/connect";

export const POST = async (request) => {
  const { min, max } = await request.json();

  try {
    console.log(min, max);

    const salesData = await services.GetAllSeles();

    console.log(salesData);

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

    console.log(filteredSales);

    // make the sale by unregistered customer customer:"XXX" first

    const customersObject = {};

    filteredSales.forEach((sale) => {
      const cu =
        sale.customer == "XXXX"
          ? "Unregistered Customers"
          : "Registered Customers";
      const items = sale.items;
      items.forEach((item) => {
        const no = customersObject[cu]
          ? customersObject[cu].no + item.no
          : item.no;
        customersObject[cu] = {
          ...customersObject[cu],
          customerType: cu,
          no: no,
        };
      });
      customersObject[cu] = {
        ...customersObject[cu],
        price: customersObject[cu].price
          ? customersObject[cu].price + sale.totalAmount
          : sale.totalAmount,
      };
    });

    console.log(customersObject);

    const Customer = Object.values(customersObject);

    console.log(Customer);

    return new Response(
      JSON.stringify({
        result: {
          Customer: Customer,
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
