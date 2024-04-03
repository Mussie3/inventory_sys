import services from "@/services/connect";

export const POST = async (request) => {
  const { paidIn, customer, totalAmount, items, customerName, paidInPrices } =
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

    let cashDocId;

    if (paidInPrices.cash > 0) {
      const newCash = {
        title: `Paid in Cash Sale`,
        discription: `Sale paid by ${customerName}`,
        amount: paidInPrices.cash,
        type: `sale`,
        datetime: new Date().toISOString(),
      };

      cashDocId = await services.AddCash(newCash);
    }

    const newSales = {
      customer: customer,
      totalAmount: totalAmount,
      paidIn: paidIn,
      paidInPrices: paidInPrices,
      items: items,
      cashId: cashDocId ? cashDocId : ``,
      datetime: new Date().toISOString(),
    };

    const created = await services.AddSales(newSales);

    let addedToCustomer;
    if (created && customer != "XXXX") {
      const cu = await services.GetCustomerById(customer);
      let cuData;
      const history = cu.history;

      if (
        paidIn == "credit" ||
        (paidIn == "mixed" && paidInPrices.credit > 0)
      ) {
        const used = cu.credit.used + paidInPrices.credit;
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
          cashId: cashDocId ? cashDocId : ``,
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
