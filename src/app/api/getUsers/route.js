import services from "@/services/connect";

export const GET = async (request) => {
  console.log("Users");
  try {
    const Users = await services.GetAllUsers();

    console.log(Users);

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
    console.log(error);
    return new Response("Failed to get Catagorys", { status: 500 });
  }
};
