import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Catagorys = await services.GetAllCatagorys();
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
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
