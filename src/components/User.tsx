"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TeamCard } from "./common/team-card";
import { TeamCardSkeleton } from "./common/team-card-skeleton";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your Groups</h2>
        <p className="text-muted-foreground">
          View and manage your team groups and collaborations
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <TeamCardSkeleton key={i} />
          ))}
        </div>
      ) : userTeams.length === 0 ? (
        <EmptyTeamsState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userTeams.map((team, idx) => (
            <TeamCard key={idx} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyTeamsState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-card/50 border-border">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
        <UsersIcon className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No teams found</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        You aren't part of any teams yet. Teams will appear here once you've
        been added to them.
      </p>
    </div>
  );
}

import { UsersIcon } from "lucide-react";
