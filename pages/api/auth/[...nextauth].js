import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simulate user fetching; replace with your actual logic
        const user = {
          id: 1,
          name: "User",
          username: "user",
          password: "Tatum1102",
        }; // Adjust as necessary

        if (
          credentials.username === user.username &&
          credentials.password === user.password
        ) {
          return user; // Successful login
        } else {
          throw new Error("Invalid username or password"); // Throw error for failed login
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT for session
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this set in your .env.local
});
