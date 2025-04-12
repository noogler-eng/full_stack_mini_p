"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-gray-400 to-white bg-clip-text text-transparent">
          Collaborate Smarter, Build Faster
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl">
          Create your project environments, become the admin, and let others
          contribute effortlessly via live Google Sheets.
        </p>

        {!session && (
          <Button
            className="mt-8 px-6 py-4 text-lg bg-white text-black hover:bg-gray-300 transition"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Get Started with Google"}
          </Button>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-800">
        Made with ❤️ by Sharad • 2025
      </footer>
    </div>
  );
}
