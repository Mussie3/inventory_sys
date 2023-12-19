import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Catagorys = await services.GetAllCatagorys();
    console.log(Catagorys);
    if (!Catagorys) {
      throw Error;
    }

    return new Response(
      JSON.stringify({
        result: Catagorys,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
