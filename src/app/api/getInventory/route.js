import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Inventory = await services.GetAllInventorys();

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
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
