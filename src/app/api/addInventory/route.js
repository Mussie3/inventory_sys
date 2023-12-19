import services from "@/services/connect";

export const POST = async (request) => {
  const { inventoryId, addedAmount } = await request.json();
  console.log(inventoryId, addedAmount);
  try {
    const data = await services.GetInventoryById(inventoryId);

    let currentAmount = data.currentAmount;

    currentAmount += Number(addedAmount);

    const added = await services.AddToInventory(
      inventoryId,
      Number(addedAmount),
      currentAmount
    );

    return new Response(JSON.stringify({ result: added }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
