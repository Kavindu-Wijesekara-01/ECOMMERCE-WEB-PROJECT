import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectToDatabase from "./lib/db";
import User from "./models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          await connectToDatabase();

          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Email එකෙන් User ව හොයනවා
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found");
          }

          // Password එක හරිද කියලා බලනවා
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isMatch) {
            throw new Error("Invalid password");
          }

          // ඔක්කොම හරි නම් User ගේ විස්තර return කරනවා
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role, // Admin ද Customer ද කියලා දැනගන්න මේක ඕන
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // මේ කොටසෙන් තමයි Session එකට User ගේ Role එක (Admin/Customer) දාන්නේ
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Login page එක තියෙන තැන
  },
  secret: process.env.AUTH_SECRET, // Security key එක
});