import services from "@/services/connect";

export const POST = async (request) => {
  const {
    email,
    first_name,
    last_name,
    gender,
    phone_number,
    discount,
    docId,
    max,
    used,
    allowed,
  } = await request.json();

  try {
    const newCustomer = {
      credit: {
        allowed: allowed,
        max: Number(max),
        used: Number(used),
      },
      email,
      first_name,
      last_name,
      gender,
      phone_number,
      discount: Number(discount),
    };
    console.log(newCustomer);
    const newCustomerId = await services.EditCustomer(newCustomer, docId);

    return new Response(JSON.stringify({ result: newCustomerId }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
