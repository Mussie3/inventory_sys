import services from "@/services/connect";

export const POST = async (request) => {
  const { paidIn, discounted, customer, totalAmount, items, creditAmount } =
    await request.json();

  console.log(paidIn, discounted, customer, totalAmount, items, creditAmount);

  try {
    const Allinventory = await services.GetAllInventorys();

    console.log(Allinventory);
    items.forEach((item) => {
      const inv = Allinventory.filter(
        (p) => p.productId === item.productDocId
      )[0];
      if (inv.currentAmount < item.no) {
        throw new Error();
      }
    });

    let err = [];
    console.log(err);

    for (let i = 0; i < items.length; i++) {
      console.log(items[i]);
      const inv = Allinventory.filter(
        (p) => p.productId === items[i].productDocId
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
      console.log(cuData);
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
    console.log(error);
    return new Response("Somthing went wrong", { status: 500 });
  }
};
