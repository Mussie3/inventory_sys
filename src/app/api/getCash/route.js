import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Cash = await services.GetAllCash();

    if (!Cash) {
      throw Error;
    }

    return new Response(
      JSON.stringify({
        Cash: Cash,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to get Cash", { status: 500 });
  }
};
