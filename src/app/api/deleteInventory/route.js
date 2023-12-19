import services from "@/services/connect";

export const POST = async (request) => {
  const { id, productId } = await request.json();

  try {
    const deleted = await services.DeleteInventory(id, productId);

    return new Response(JSON.stringify({ success: deleted }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
