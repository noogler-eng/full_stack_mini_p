"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  ExternalLink,
  FileSpreadsheet,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{team.topic}</h1>
              <p className="text-muted-foreground">
                Managed by {team.managerName}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-card border-border"
          >
            <DropdownMenuItem>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Refresh Data</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Schedule Meeting</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-background/30 p-1">
          <TabsTrigger
            value="overview"
            className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="bg-card/50 pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  Team Information
                </CardTitle>
                <CardDescription>Basic details about your team</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Group ID</p>
                    <Badge
                      variant="outline"
                      className="bg-primary/5 border-primary/20 text-primary font-normal"
                    >
                      {team.groupId}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Your USN</p>
                    <p className="font-medium">{team.userUSN}</p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Environment</p>
                    <p className="font-medium">{team.managerName}</p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Members</p>
                    <p className="font-medium">{team.allMembers.length}</p>
                  </div>
                </div>

                <Separator className="my-2 bg-border/50" />

                <div className="space-y-3">
                  {team.spreadsheetUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 bg-card border-border hover:bg-card/80"
                      asChild
                    >
                      <a
                        href={team.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 text-primary" />
                        View Spreadsheet
                      </a>
                    </Button>
                  )}

                  <Button
                    className="w-full gap-2"
                    onClick={() => alert("Update Status")}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="bg-card/50 pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Team Members
                </CardTitle>
                <CardDescription>People in your team</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ScrollArea className="h-[240px] pr-4">
                  <div className="space-y-4">
                    {team.allMembers.map((member, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-0 bg-primary/10">
                            <AvatarFallback className="text-primary bg-transparent">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.usn}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            alert(`View profile of ${member.name}`)
                          }
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="bg-card/50 pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                Team Chat
              </CardTitle>
              <CardDescription>Connect with your team members</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {team.allMembers.map((member, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-accent/30 group"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-0 bg-primary/10">
                          <AvatarFallback className="text-primary bg-transparent">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.usn}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          alert(`Message to ${member.name} (${member.usn})`)
                        }
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getInitials(name: string): string {
  if (!name) return "U";

  const parts = name.split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}
