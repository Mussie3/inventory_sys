import services from "@/services/connect";

export const GET = async (request) => {
  try {
    const Users = await services.GetAllUsers();

    if (!Users) {
      throw Error;
    }

    return new Response(
      JSON.stringify({
        Users: Users,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
