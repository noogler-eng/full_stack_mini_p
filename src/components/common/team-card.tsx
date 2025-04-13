"use client";

import { ExternalLink, MessageCircle, Users } from "lucide-react";
import { TeamMembersList } from "./team-members-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TeamCardProps {
  team: {
    topic: string;
    managerName: string;
    groupId: string;
    userUSN: string;
    spreadsheetUrl?: string;
    allMembers: Array<{
      name: string;
      usn: string;
    }>;
  };
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="overflow-hidden border-border bg-card hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {team.topic}
            </CardTitle>
            <CardDescription className="mt-1">
              Environment: {team.managerName}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            ID: {team.groupId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-0 space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-medium mr-2">Your USN:</span> {team.userUSN}
        </div>

        {team.spreadsheetUrl && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a
                href={team.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Spreadsheet</span>
              </a>
            </Button>
          </div>
        )}

        <Separator className="my-2" />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-sm">Team Members</h4>
          </div>
          <TeamMembersList members={team.allMembers} />
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          className="w-full gap-2"
          onClick={() => alert(`Open Chat for Group: ${team.groupId}`)}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Open Team Chat</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
