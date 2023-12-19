import services from "@/services/connect";

export const GET = async (request) => {
  console.log("Inventory");
  try {
    const Inventory = await services.GetAllInventorys();

    console.log(Inventory);

    if (!Inventory) {
      throw Error;
    }

    return new Response(
      JSON.stringify({
        Inventory: Inventory,
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
