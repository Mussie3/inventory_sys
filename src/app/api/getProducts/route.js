import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Products = await services.GetAllProducts();

    if (!Products) {
      throw Error;
    }

    return new Response(
      JSON.stringify({
        Products: Products,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
