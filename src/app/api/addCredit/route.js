import services from "@/services/connect";

export const POST = async (request) => {
  const { customerId, newCredit } = await request.json();

  try {
    const added = await services.addCredit(newCredit, customerId);

    return new Response(JSON.stringify({ result: added }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
