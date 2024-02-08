import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Customers = await services.GetAllCustomers();

    if (!Customers) {
      throw Error;
    }

    return new Response(
      JSON.stringify({
        Customers: Customers,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
