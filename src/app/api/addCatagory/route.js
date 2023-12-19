import services from "@/services/connect";

export const POST = async (request) => {
  const { catagoryName } = await request.json();

  console.log(catagoryName);

  try {
    const catagory = {
      datetime: new Date().toISOString(),
      catagoryName: catagoryName,
    };
    const catId = await services.AddCatagory(catagory);
    if (!catId) throw Error();

    return new Response(
      JSON.stringify({
        result: catId,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
