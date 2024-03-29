import services from "@/services/connect";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  const {
    username,
    email,
    currentPassword,
    newPassword,
    image,
    role,
    docId,
    changePassword,
  } = await request.json();

  try {
    let updatedUser;

    const User = await services.GetUserById(docId);

    let passwordMatch = true;

    if (!changePassword) {
      updatedUser = {
        username,
        email,
        role,
        image: image ? image : "",
      };
    } else if (changePassword) {
      passwordMatch = await bcrypt.compare(currentPassword, User?.password);

      if (passwordMatch) {
        const newhashedpassword = await bcrypt.hash(newPassword, 10);

        updatedUser = {
          username,
          email,
          password: newhashedpassword,
          role,
          image: image ? image : "",
        };
      }
    }

    let updated = false;

    if (updatedUser && passwordMatch) {
      updated = await services.EditUserById(docId, updatedUser);
    }

    //

    return new Response(
      JSON.stringify({ updated: updated, passwordMatch: passwordMatch }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
