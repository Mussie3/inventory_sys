import services from "@/services/connect";

export const POST = async (request) => {
  const {
    paidIn,
    discounted,
    customer,
    totalAmount,
    items,
    salesId,
    creditAmount,
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
        if (paidIn == "credit" || paidIn == "mixed") {
          const used = newcustomer.credit.used + creditAmount;
          cuData = {
            history: [...newcustomer.history, created],
            credit: { ...newcustomer.credit, used: used },
          };
        } else {
          cuData = {
            history: [...history, created],
          };
        }
        addedToCustomer = services.AddSalesToCustomer(customer, salesId);
      }
      if (oldSales.customer !== "XXXX") {
        const oldcustomer = await services.GetCustomerById(oldSales.customer);
        const oldcustomerHistory = oldcustomer.history.filter(
          (h) => h !== salesId
        );

        let cuData;
        if (oldSales.paidIn == "credit" || oldSales.paidIn == "mixed") {
          const used = oldcustomer.credit.used - oldSales.creditedAmount;
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
      if (oldSales.creditedAmount != creditAmount) {
        const thecustomer = await services.GetCustomerById(customer);
        let cuData;
        if (
          (oldSales.paidIn == "credit" || oldSales.paidIn == "mixed") &&
          (paidIn == "credit" || paidIn == "mixed")
        ) {
          const used =
            thecustomer.credit.used + (creditAmount - oldSales.creditedAmount);
          cuData = {
            credit: { ...thecustomer.credit, used: used },
          };
        } else if (
          (oldSales.paidIn == "credit" || oldSales.paidIn == "mixed") &&
          paidIn != "credit" &&
          paidIn != "mixed"
        ) {
          const used = thecustomer.credit.used - oldSales.creditedAmount;
          cuData = {
            credit: { ...thecustomer.credit, used: used },
          };
        } else if (
          oldSales.paidIn != "credit" &&
          oldSales.paidIn != "mixed" &&
          (paidIn == "credit" || paidIn == "mixed")
        ) {
          const used = thecustomer.credit.used + creditAmount;
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

    const newSales = {
      customer: customer,
      discounted: discounted,
      totalAmount: totalAmount,
      paidIn: paidIn,
      items: items,
      creditedAmount: creditAmount,
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
