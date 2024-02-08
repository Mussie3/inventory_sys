import services from "@/services/connect";

export const POST = async (request) => {
  const { username, docId } = await request.json();

  try {
    const alluser = await services.GetAllUsers();
    let exist;
    if (docId) {
      exist = alluser.find(
        (user) => user.username == username && user.docId != docId
      );
    } else {
      exist = alluser.find((user) => user.username == username);
    }

    return new Response(JSON.stringify({ exist: exist ? true : false }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
