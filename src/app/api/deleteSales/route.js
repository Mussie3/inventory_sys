import services from "@/services/connect";

export const POST = async (request) => {
  const { id } = await request.json();

  try {
    const sale = await services.GetSalesById(id);

    for (let i = 0; i < sale.items.length; i++) {
      const product = await services.GetProductById(sale.items[i].productDocId);
      const inv = await services.GetInventoryById(product.invId);
      const num = inv.currentAmount + sale.items[i].no;
      const good = await services.SubInventory(product.invId, num);
    }

    const deleted = await services.DeleteSales(id);

    if (sale.customer != "XXXX") {
      const cu = await services.GetCustomerById(sale.customer);
      let cuData;

      const history = cu.history.filter((s) => s !== sale.docId);

      if (sale.paidIn == "credit" || sale.paidIn == "mixed") {
        const used = cu.credit.used - sale.totalAmount;
        cuData = {
          history: history,
          credit: { ...cu.credit, used: used },
        };
      } else {
        cuData = {
          history: history,
        };
      }

      addedToCustomer = await services.AddSalesToCustomer(
        sale.customer,
        cuData
      );
    }

    return new Response(JSON.stringify({ success: deleted }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
