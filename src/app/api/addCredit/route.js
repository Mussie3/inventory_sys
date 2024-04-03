import services from "@/services/connect";

export const POST = async (request) => {
  const { customerId, newCredit, paidIn, customer, paidIncash } =
    await request.json();

  try {
    const added = await services.addCredit(newCredit, customerId);
    let cashDocId;

    if (paidIncash > 0 && (paidIn == "cash" || paidIn == "mixed")) {
      const newCash = {
        title: `Paid debt`,
        discription: `debt paid by ${customer}`,
        amount: paidIncash,
        type: `debt`,
        datetime: new Date().toISOString(),
      };

      cashDocId = await services.AddCash(newCash);
    }

    return new Response(JSON.stringify({ result: added, cashId: cashDocId }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
