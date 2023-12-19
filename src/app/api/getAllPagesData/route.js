import services from "@/services/connect";

export const GET = async (request) => {
  console.log("Customers");
  try {
    // const Products = await services.GetAllProducts();
    // const Sales = await services.GetAllSeles();
    // const Customers = await services.GetAllCustomers();
    // const Inventory = await services.GetAllInventorys();
    // const Catagorys = await services.GetAllCatagorys();
    // const Users = await services.GetAllUsers();

    const promises = [
      services.GetAllProducts(),
      services.GetAllCustomers(),
      services.GetAllCatagorys(),
      services.GetAllInventorys(),
      services.GetAllSeles(),
      services.GetAllUsers(),
    ];

    const AllResults = await Promise.allSettled(promises);

    console.log(AllResults);

    // console.log(Customers);

    // if (
    //   !Products ||
    //   !Sales ||
    //   !Customers ||
    //   !Inventory ||
    //   !Catagorys ||
    //   !Users
    // ) {
    //   throw Error;
    // }

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
