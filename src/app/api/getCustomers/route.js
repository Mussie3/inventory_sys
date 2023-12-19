import services from "@/services/connect";

export const GET = async (request) => {
  console.log("Customers");
  try {
    const Customers = await services.GetAllCustomers();

    console.log(Customers);

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
    console.log(error);
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
