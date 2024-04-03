import services from "@/services/connect";

export const POST = async (request) => {
  const {
    paidIn,
    customer,
    totalAmount,
    items,
    salesId,
    customerName,
    paidInPrices,
  } = await request.json();

  try {
    const Allinventory = await services.GetAllInventorys();
    const oldSales = await services.GetSalesById(salesId);

    // undo the sale if the product is not there and do deffeence if it does

    const deletedProduct = oldSales.items
      .filter(
        (sale) =>
          items.filter((item) => sale.productId === item.productId).length == 0
      )
      .map((s) => {
        return { ...s, no: s.no * -1 };
      });

    const addedProduct = items.filter(
      (sale) =>
        oldSales.items.filter((item) => sale.productId === item.productId)
          .length == 0
    );

    const updatedProduct = oldSales.items
      .filter(
        (sale) =>
          items.filter((item) => sale.productId === item.productId).length != 0
      )
      .map((s) => {
        return {
          ...s,
          no: items.find((i) => i.productId == s.productId).no - s.no,
        };
      });

    const arr = [].concat(addedProduct, deletedProduct, updatedProduct);

    arr.forEach((item) => {
      const inv = Allinventory.filter(
        (p) => p.productId === item.productDocId
      )[0];
      if (inv.currentAmount < item.no) {
        throw new Error("not enough product in the inventory");
      }
    });

    let removeFromCustomer;
    let addedToCustomer;

    if (oldSales.customer !== customer) {
      if (customer !== "XXXX") {
        const newcustomer = await services.GetCustomerById(customer);
        let cuData;
        if (
          paidIn == "credit" ||
          (paidIn == "mixed" && paidInPrices.credit > 0)
        ) {
          const used = newcustomer.credit.used + paidInPrices.credit;
          cuData = {
            history: [...newcustomer.history, salesId],
            credit: { ...newcustomer.credit, used: used },
          };
        } else {
          cuData = {
            history: [...newcustomer.history, salesId],
          };
        }
        addedToCustomer = services.AddSalesToCustomer(customer, cuData);
      }
      if (oldSales.customer !== "XXXX") {
        const oldcustomer = await services.GetCustomerById(oldSales.customer);
        const oldcustomerHistory = oldcustomer.history.filter(
          (h) => h !== salesId
        );

        let cuData;
        if (
          oldSales.paidIn == "credit" ||
          (oldSales.paidIn == "mixed" && oldSales.paidInPrices.credit > 0)
        ) {
          const used = oldcustomer.credit.used - oldSales.paidInPrices.credit;
          cuData = {
            history: oldcustomerHistory,
            credit: { ...oldcustomer.credit, used: used },
          };
        } else {
          cuData = {
            history: oldcustomerHistory,
          };
        }

        removeFromCustomer = services.EditSalesOfCustomer(
          oldSales.customer,
          cuData
        );
      }
    } else {
      if (oldSales.paidInPrices.credit != paidInPrices.credit) {
        const thecustomer = await services.GetCustomerById(customer);
        let cuData;
        if (oldSales.paidInPrices.credit > 0 && paidInPrices.credit > 0) {
          const used =
            thecustomer.credit.used +
            (paidInPrices.credit - oldSales.paidInPrices.credit);
          cuData = {
            credit: { ...thecustomer.credit, used: used },
          };
        } else if (
          oldSales.paidInPrices.credit > 0 &&
          paidInPrices.credit == 0
        ) {
          const used = thecustomer.credit.used - oldSales.paidInPrices.credit;
          cuData = {
            credit: { ...thecustomer.credit, used: used },
          };
        } else if (
          oldSales.paidInPrices.credit == 0 &&
          paidInPrices.credit > 0
        ) {
          const used = thecustomer.credit.used + paidInPrices.credit;
          cuData = {
            credit: { ...thecustomer.credit, used: used },
          };
        }

        removeFromCustomer = services.EditSalesOfCustomer(
          oldSales.customer,
          cuData
        );
      }
    }

    let err = [];

    for (let i = 0; i < arr.length; i++) {
      const inv = Allinventory.filter(
        (p) => p.productId === arr[i].productDocId
      )[0];
      const currentAmount = inv.currentAmount - arr[i].no;
      const good = await services.SubInventory(inv.docId, currentAmount);
      if (!good) err.push(arr[i].productDocId);
    }

    let cashDocId;
    if (paidInPrices.cash != sale.paidInPrices.cash) {
      if (oldSales.cashId) {
        //edit cash
        const newCash = {
          discription: `Sale paid by ${customerName}`,
          amount: paidInPrices.cash,
        };
        const Cashupdated = await services.EditCash(newCash, oldSales.cashId);
        cashDocId = oldSales.cashId;
      } else {
        const newCash = {
          title: `Paid in Cash Sale`,
          discription: `Sale paid by ${customerName}`,
          amount: paidInPrices.cash,
          type: `sale`,
          datetime: new Date().toISOString(),
        };

        cashDocId = await services.AddCash(newCash);
      }
    }

    const newSales = {
      customer: customer,
      totalAmount: totalAmount,
      paidIn: paidIn,
      cashId: cashDocId ? cashDocId : ``,
      items: items,
      paidInPrices: paidInPrices,
    };

    const edited = services.EditSales(salesId, newSales);

    return new Response(
      JSON.stringify({
        result: {
          faildInv: err.length !== 0 ? false : err,
          edited: edited ? true : false,
          addedToCustomer: addedToCustomer ? true : false,
          removeFromCustomer: removeFromCustomer ? true : false,
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
