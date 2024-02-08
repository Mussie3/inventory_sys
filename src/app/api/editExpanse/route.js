import services from "@/services/connect";

export const POST = async (request) => {
  const { title, discription, amount, docId } = await request.json();

  try {
    const newExpanse = {
      title,
      discription,
      amount,
    };

    const updated = await services.EditExpanse(newExpanse, docId);

    return new Response(JSON.stringify({ updated: updated }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to upadte a expanse", { status: 500 });
  }
};
