import NextAuth, { AuthOptions } from "next-auth";
import options from "../config";

const handler = NextAuth(options as AuthOptions);

export { handler as GET, handler as POST };
