"use client";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
    setLoading(false);
  };
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0f0f0f]">
      <div className="text-2xl font-bold tracking-tight text-white">
        🚀 Open Project Manager
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Dashboard
              </Button>
            </Link>
            <Image
              src={session.user?.image || "/default-avatar.png"}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full border border-white"
            />
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black transition"
            onClick={handleSignIn}
            disabled={loading}
          >
            Sign in with Google
          </Button>
        )}
      </div>
    </nav>
  );
}
