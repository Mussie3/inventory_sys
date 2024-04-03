import services from "@/services/connect";

export const POST = async (request) => {
  const { title, discription, amount, docId } = await request.json();

  try {
    const newCash = {
      title,
      discription,
      amount,
    };

    const updated = await services.EditCash(newCash, docId);

    return new Response(JSON.stringify({ updated: updated }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to upadte a cash", { status: 500 });
  }
};
