import services from "@/services/connect";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  const { username, email, password, role } = await request.json();

  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const newCustomer = {
      username,
      email,
      password: hashedpassword,
      role,
      image: "",
      datetime: new Date().toISOString(),
    };

    console.log(newCustomer);

    const newUserId = await services.AddUsers(newCustomer);

    console.log(newUserId);

    return new Response(JSON.stringify({ result: newUserId }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
