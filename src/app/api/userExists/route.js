import services from "@/services/connect";

export const POST = async (request) => {
  const { username, docId } = await request.json();

  try {
    console.log(username, docId);

    const alluser = await services.GetAllUsers();
    console.log(alluser);
    let exist;
    if (docId) {
      exist = alluser.find(
        (user) => user.username == username && user.docId != docId
      );
      console.log(exist);
    } else {
      exist = alluser.find((user) => user.username == username);
      console.log(exist);
    }

    return new Response(JSON.stringify({ exist: exist ? true : false }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
