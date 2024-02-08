import services from "@/services/connect";

export const POST = async (request) => {
  const { id } = await request.json();
  try {
    const deleted = await services.DeleteExpanse(id);
    return new Response(JSON.stringify({ success: deleted }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Failed to delete expanse", { status: 500 });
  }
};
