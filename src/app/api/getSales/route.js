import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Sales = await services.GetAllSeles();

    if (!Sales) {
      throw Error;
    }

    return new Response(
      JSON.stringify({
        Sales: Sales,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
