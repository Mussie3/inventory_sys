import services from "@/services/connect";

export const GET = async (request) => {
  console.log("Customers");
  try {
    const Sales = await services.GetAllSeles();

    console.log(Sales);

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
    console.log(error);
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
