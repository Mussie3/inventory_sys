import services from "@/services/connect";

export const POST = async (request) => {
  try {
    const promises = [
      services.GetAllProducts(),
      services.GetAllCustomers(),
      services.GetAllCatagorys(),
      services.GetAllInventorys(),
      services.GetAllSeles(),
      services.GetAllUsers(),
      services.GetAllExapase(),
      services.GetAllCash(),
    ];

    const AllResults = await Promise.allSettled(promises);

    return new Response(
      JSON.stringify({
        AllResults: AllResults,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to get All the data", { status: 500 });
  }
};
