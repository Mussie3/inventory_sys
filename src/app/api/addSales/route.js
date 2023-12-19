import services from "@/services/connect";

export const POST = async (request) => {
  const { paidIn, discounted, customer, totalAmount, items, creditAmount } =
    await request.json();

  console.log(items);

  try {
    const Allinventory = await services.GetAllInventorys();

    items.forEach((item) => {
      const inv = Allinventory.filter((p) => p.productId === item.productId)[0];
      if (inv.currentAmount < item.no) {
        throw new Error();
      }
    });

    let err = [];

    for (let i = 0; i < items.length; i++) {
      console.log(items[i]);
      const inv = Allinventory.filter(
        (p) => p.productId === items[i].productId
      )[0];
      const currentAmount = inv.currentAmount - items[i].no;
      console.log(inv.docId);
      console.log(currentAmount);
      const good = await services.SubInventory(inv.docId, currentAmount);
      if (!good) err.push(items[i].productId);
    }
    console.log(totalAmount);

    const newSales = {
      customer: customer,
      discounted: discounted,
      totalAmount: totalAmount,
      creditedAmount: creditAmount,
      paidIn: paidIn,
      items: items,
      datetime: new Date().toISOString(),
    };

    const created = await services.AddSales(newSales);
    console.log(created);
    let addedToCustomer;
    if (created && customer != "XXXX") {
      const cu = await services.GetCustomerById(customer);
      let cuData;
      const history = cu.history;
      console.log(history);
      if (paidIn == "credit") {
        const used = cu.credit.used + creditAmount;
        cuData = {
          history: [...history, created],
          credit: { ...cu.credit, used: used },
        };
      } else {
        cuData = {
          history: [...history, created],
        };
      }
      addedToCustomer = await services.AddSalesToCustomer(customer, cuData);
      console.log(cuData);
    }

    return new Response(
      JSON.stringify({
        result: {
          faildInv: err.length !== 0 ? false : err,
          created: created ? true : false,
          addedToCustomer: addedToCustomer ? true : false,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
