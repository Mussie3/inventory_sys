import services from "@/services/connect";

export const GET = async (request) => {
  console.log("Catagorys");
  try {
    const Products = await services.GetAllProducts();

    console.log(Products);

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
    console.log(error);
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
