import services from "@/services/connect";

export const POST = async (request) => {
  const { title, discription, amount } = await request.json();

  const newExpanse = {
    title,
    discription,
    amount,
    datetime: new Date().toISOString(),
  };
  console.log(newExpanse);

  try {
    const expanseDocId = await services.AddExpanse(newExpanse);
    console.log(expanseDocId);

    return new Response(
      JSON.stringify({
        added: expanseDocId ? true : false,
        docId: expanseDocId,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new Expanse", { status: 500 });
  }
};
