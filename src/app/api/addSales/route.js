import services from "@/services/connect";

export const POST = async (request) => {
  const { paidIn, discounted, customer, totalAmount, items, creditAmount } =
    await request.json();

  try {
    const Allinventory = await services.GetAllInventorys();

    items.forEach((item) => {
      const inv = Allinventory.filter(
        (p) => p.productId === item.productDocId
      )[0];
      if (inv.currentAmount < item.no) {
        throw new Error("not enough product in the inventory");
      }
    });

    let err = [];

    for (let i = 0; i < items.length; i++) {
      const inv = Allinventory.filter(
        (p) => p.productId === items[i].productDocId
      )[0];
      const currentAmount = inv.currentAmount - items[i].no;

      const good = await services.SubInventory(inv.docId, currentAmount);
      if (!good) err.push(items[i].productId);
    }

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

    let addedToCustomer;
    if (created && customer != "XXXX") {
      const cu = await services.GetCustomerById(customer);
      let cuData;
      const history = cu.history;

      if (paidIn == "credit" || paidIn == "mixed") {
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
    }

    return new Response(
      JSON.stringify({
        result: {
          faildInv: err.length !== 0 ? false : err,
          created: created,
          addedToCustomer: addedToCustomer ? true : false,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ErrorMessage: error.message,
      }),
      { status: 500 }
    );
  }
};
