"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TeamCard } from "./common/team-card";
import { TeamCardSkeleton } from "./common/team-card-skeleton";
import {
  ChevronDown,
  Folder,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Team {
  topic: string;
  managerName: string;
  groupId: string;
  userUSN: string;
  spreadsheetUrl?: string;
  allMembers: Array<{
    name: string;
    usn: string;
  }>;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserGroups = async () => {
        try {
          const res = await fetch("/api/user");
          const data = await res.json();

          if (res.ok) {
            setUserTeams(data.groups);
          } else {
            console.error("Error:", data.error);
          }
        } catch (err) {
          console.error("Failed to fetch user teams:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserGroups();
    }
  }, [session, status]);

  const filteredTeams = userTeams.filter((team) =>
    team.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-black/70 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-purple-500" />
            <h1 className="text-xl font-semibold text-white">TeamSpace</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar */}
          <aside className="md:w-72 shrink-0 border-r border-gray-800 pr-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your Teams</h2>
              <Badge
                variant="outline"
                className="bg-zinc-800 text-xs text-purple-400 border-purple-500"
              >
                {userTeams.length} Teams
              </Badge>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search teams..."
                  className="pl-9 bg-zinc-900 text-white border border-zinc-700 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 w-full bg-zinc-800 animate-pulse rounded-md"
                  />
                ))}
              </div>
            ) : userTeams.length === 0 ? (
              <EmptyTeamsState />
            ) : (
              <ScrollArea className="h-[calc(100vh-220px)] pr-2">
                <ul className="space-y-2">
                  {filteredTeams.map((team, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setSelectedTeamIndex(index)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-md border transition-all flex items-center gap-3",
                          index === selectedTeamIndex
                            ? "bg-purple-950 border-purple-700 text-purple-300 font-medium"
                            : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-gray-300"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border",
                            index === selectedTeamIndex
                              ? "bg-purple-900 border-purple-700 text-purple-300"
                              : "bg-zinc-800 border-zinc-700 text-gray-400"
                          )}
                        >
                          <Folder className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="line-clamp-1 font-medium">
                            {team.topic}
                          </span>
                          <span className="text-xs text-gray-400 line-clamp-1">
                            {team.managerName}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {loading ? (
              <TeamCardSkeleton />
            ) : userTeams.length === 0 ? (
              <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <EmptyTeamsState />
              </div>
            ) : (
              <TeamCard team={userTeams[selectedTeamIndex]} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function EmptyTeamsState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-zinc-900 border-zinc-700 text-gray-400">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-950 mb-4">
        <Users className="h-10 w-10 text-purple-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">No teams found</h3>
      <p className="text-gray-400 max-w-md mb-4">
        You aren't part of any teams yet. Teams will appear here once you've
        been added to them.
      </p>
    </div>
  );
}
