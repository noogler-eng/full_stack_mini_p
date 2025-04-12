"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, User } from "lucide-react";
import Admin from "@/components/Admin";

export default function Dashboard() {
  const [active, setActive] = useState("admin");

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-8 text-white">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Button
            variant={active === "admin" ? "default" : "ghost"}
            className="justify-start gap-2"
            onClick={() => setActive("admin")}
          >
            <Shield className="w-5 h-5" />
            Admin
          </Button>

          <Button
            variant={active === "user" ? "default" : "ghost"}
            className="justify-start gap-2"
            onClick={() => setActive("user")}
          >
            <User className="w-5 h-5" />
            User
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {active === "admin" && <Admin />}
        {active === "user" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">User Panel</h1>
            <p className="text-gray-400">
              Collaborate on projects shared with you here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
