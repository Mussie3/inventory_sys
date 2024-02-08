import services from "@/services/connect";

export const POST = async (request) => {
  const { min, max, No } = await request.json();

  try {
    const customersData = await services.GetAllCustomers();
    const salesData = await services.GetAllSeles();

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

    const customerName = {};

    const customersObject = {};

    customersData.forEach((item) => {
      customerName[item.docId] = {
        first_name: item.first_name,
        last_name: item.last_name,
      };
    });

    filteredSales.forEach((sale) => {
      const items = sale.items;
      items.forEach((item) => {
        const no = customersObject[sale.customer]
          ? customersObject[sale.customer].no + item.no
          : item.no;
        customersObject[sale.customer] = {
          ...customersObject[sale.customer],
          customerId: sale.customer,
          no: no,
        };
      });
      customersObject[sale.customer] = {
        ...customersObject[sale.customer],
        price: customersObject[sale.customer].price
          ? customersObject[sale.customer].price + sale.totalAmount
          : sale.totalAmount,
      };
    });

    const Customer = Object.values(customersObject).map((pro) => {
      return {
        ...pro,
        ...customerName[pro.customerId],
      };
    });

    const TopByNo = Array.from({ length: No ? No : 5 }, () => {
      return { price: 0, no: 0 };
    });
    const TopByPrice = Array.from({ length: No ? No : 5 }, () => {
      return { price: 0, no: 0 };
    });

    Customer.forEach((pro) => {
      for (let i = 0; i < TopByNo.length; i++) {
        if (pro.no >= TopByNo[i].no) {
          TopByNo.splice(i, 0, pro);
          TopByNo.pop();
          break;
        }
      }
    });

    Customer.forEach((pro) => {
      for (let i = 0; i < TopByPrice.length; i++) {
        if (pro.price >= TopByPrice[i].price) {
          TopByPrice.splice(i, 0, pro);
          TopByPrice.pop();
          break;
        }
      }
    });

    return new Response(
      JSON.stringify({
        result: {
          topByNo: TopByNo.filter((p) => p.customerId),
          topByPrice: TopByPrice.filter((p) => p.customerId),
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
