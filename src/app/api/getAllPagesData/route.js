import services from "@/services/connect";

export const GET = async (request) => {
  console.log("getting all data");
  try {
    const promises = [
      services.GetAllProducts(),
      services.GetAllCustomers(),
      services.GetAllCatagorys(),
      services.GetAllInventorys(),
      services.GetAllSeles(),
      services.GetAllUsers(),
      services.GetAllExapase(),
    ];

    const AllResults = await Promise.allSettled(promises);

    console.log(AllResults);

    return new Response(
      JSON.stringify({
        AllResults: AllResults,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to get All the data", { status: 500 });
  }
};
