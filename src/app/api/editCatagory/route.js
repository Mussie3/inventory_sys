import services from "@/services/connect";

export const POST = async (request) => {
  const { catagorys } = await request.json();

  try {
    console.log(catagorys);

    for (let i = 0; i < catagorys.length; i++) {
      const gg = await services.EditCatagory(
        catagorys[i].docId,
        catagorys[i].catagoryName
      );
      if (!gg) throw Error();
    }

    return new Response(JSON.stringify({ result: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
