import GoogleProvider from "next-auth/providers/google";
import { doc, getDoc, setDoc } from "firebase/firestore";
import db from "@/utils/db/firebase";

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_ID!,
      clientSecret: process.env.NEXT_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: any) {
      const userRef = doc(db, "users", user.email!);

      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: new Date().toISOString(),
        });
      }

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token?.uid) {
        session.user.uid = token.uid;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
};

export default options;
