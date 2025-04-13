"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // use router to redirect

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
    setLoading(false);
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard"); // Redirect to the dashboard
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff, #666666, #111111)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Collaborate Smarter, Build Faster
        </motion.h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          Create your project environments, become the admin, and let others
          contribute effortlessly via live Google Sheets. All in one platform.
        </p>

        {!session ? (
          // If no session, show Google login button
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col items-center mt-12"
          >
            <Button
              className="flex items-center justify-center px-8 py-4 text-lg bg-[#4285F4] text-white hover:bg-[#3367D6] transition-all rounded-xl shadow-lg transform hover:scale-105 w-full max-w-xs"
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <span>Redirecting...</span>
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png"
                    alt="Google logo"
                    className="w-6 h-6 mr-3"
                  />
                  Get Started with Google
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          // If session exists, show "Go to Dashboard" button
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col items-center mt-12"
          >
            <Button
              className="px-8 py-4 text-lg bg-[#34a853] text-white hover:bg-[#2c8f3f] transition-all rounded-xl shadow-lg transform hover:scale-105 w-full max-w-xs"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </Button>
          </motion.div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-[#111111] py-20">
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Powerful Features to Enhance Your Workflow
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
            <motion.div
              className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg text-white transform transition-all hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Real-time Collaboration
              </h3>
              <p>
                Seamlessly work with your team on live Google Sheets. Share
                updates and instantly see changes as they happen.
              </p>
            </motion.div>
            <motion.div
              className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg text-white transform transition-all hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4">Organize with Ease</h3>
              <p>
                Manage projects, assign roles, and track progress in one place.
                Our intuitive platform helps you stay organized.
              </p>
            </motion.div>
            <motion.div
              className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg text-white transform transition-all hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Seamless Integration
              </h3>
              <p>
                Integrate with Google Sheets and other popular tools to create a
                unified workflow that boosts productivity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-center text-sm text-gray-500 py-6 border-t border-[#333333]">
        <div className="container mx-auto">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-white hover:text-[#444444]">
              Home
            </a>
            <a href="#features" className="text-white hover:text-[#444444]">
              Features
            </a>
            <a href="#contact" className="text-white hover:text-[#444444]">
              Contact
            </a>
          </div>
          <p>Made with ❤️ by Sharad • 2025</p>
        </div>
      </footer>
    </div>
  );
}
