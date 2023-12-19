import services from "@/services/connect";

export const POST = async (request) => {
  const { inventoryId, history } = await request.json();
  console.log(inventoryId, history);
  try {
    const data = await services.GetInventoryById(inventoryId);

    let sum = 0;
    data.history.forEach((element) => {
      sum += element.addedAmount;
    });

    let sold = sum - data.currentAmount;

    let currentSum = 0;
    history.forEach((element) => {
      currentSum += element.addedAmount;
    });

    let currentAmount = currentSum - sold;

    const added = await services.EditToInventory(
      inventoryId,
      history,
      currentAmount
    );

    return new Response(JSON.stringify({ result: added }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
