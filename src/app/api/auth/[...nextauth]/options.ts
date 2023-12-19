import services from "@/services/connect";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials

        const allUser = await services.GetAllUsers();
        if (!allUser) return null;
        const filterdUsers = allUser.filter(
          (Users) => Users.role == "admin" || Users.role == "manager"
        );
        console.log(credentials);

        console.log(filterdUsers);

        const user = filterdUsers?.find(
          (user) => user.username == credentials?.username
        );
        if (!user) return null;
        console.log(user);
        const passwordMatch = await bcrypt.compare(
          credentials?.password ? credentials?.password : "",
          user?.password
        );
        if (!passwordMatch) return null;
        return {
          id: user.docId,
          name: user.username,
          email: user.email,
          image: user.image,
          password: user.password,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
    async jwt({ token, user }) {
      console.log(token);
      console.log(user);
      if (user) {
        token.role = user.role;
        token.picture = user.image;
      }
      console.log(token);
      console.log(user);
      return token;
    },
    // If you want to use the role in client components
    async session({ session, token, user }) {
      if (session?.user) session.user.role = token.role;
      console.log(session);
      console.log(user);

      if (session.user.user !== undefined)
        session.user.user.image = token.picture;

      return session;
    },
  },
};
