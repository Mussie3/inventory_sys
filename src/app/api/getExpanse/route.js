import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Expanse = await services.GetAllExapase();

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
    return new Response("Failed to get Expanse", { status: 500 });
  }
};
