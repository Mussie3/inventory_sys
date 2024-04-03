import services from "@/services/connect";

export const POST = async (request) => {
  const { title, discription, amount } = await request.json();

  const newCash = {
    title,
    discription,
    amount,
    type: `other`,
    datetime: new Date().toISOString(),
  };

  try {
    const cashDocId = await services.AddCash(newCash);

    return new Response(
      JSON.stringify({
        added: cashDocId ? true : false,
        docId: cashDocId,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to create a new Cash", { status: 500 });
  }
};
