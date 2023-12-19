import services from "@/services/connect";

export const POST = async (request) => {
  const { id } = await request.json();

  try {
    const deleted = await services.DeleteCustomer(id);

    return new Response(JSON.stringify({ success: deleted }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
