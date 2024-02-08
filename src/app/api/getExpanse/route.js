import services from "@/services/connect";

export const GET = async (request) => {
  console.log("Customers");
  try {
    const Expanse = await services.GetAllExapase();

    console.log(Expanse);

    if (!Expanse) {
      throw Error;
    }

    return new Response(
      JSON.stringify({
        Expanse: Expanse,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to get Expanse", { status: 500 });
  }
};
