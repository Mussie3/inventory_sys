import services from "@/services/connect";

export const POST = async (request) => {
  const { productId } = await request.json();
  console.log(productId);
  try {
    const createdId = await services.AddInventory(productId);

    return new Response(JSON.stringify({ result: createdId }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
