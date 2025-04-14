"use client";

import { motion } from "framer-motion";
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
import { Send } from "lucide-react";
import {
  CalendarDays,
  ExternalLink,
  FileSpreadsheet,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Users,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { doc, onSnapshot } from "firebase/firestore";
import db from "@/utils/db/firebase";

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
  managerId: string;
}

export function TeamCard({ team, managerId }: TeamCardProps) {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const session = useSession();

  const sendMessage = async () => {
    if (!chatMessage) return;
    try {
      await axios.post("/api/chat", {
        managerId: managerId,
        teamId: team.groupId,
        message: chatMessage,
      });

      setChatMessage("");
      setIsInputVisible(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!managerId || !team.groupId) return;

    const groupDocRef = doc(db, "manager", managerId, "teams", team.groupId);

    const unsubscribe = onSnapshot(groupDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const chatArray = data.chat || [];
        setMessages(chatArray);
      } else {
        console.warn("No such document!");
      }
    });

    return () => unsubscribe();
  }, [managerId, team.groupId]);

  // useEffect(() => {
  //   fetchMessages();
  // }, [managerId, team.groupId]);

  console.log(messages);

  return (
    <motion.div
      className="space-y-6 bg-gradient-to-b from-[#121212] to-[#1a1a1a] p-6 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2c2c2c] text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{team.topic}</h1>
            <p className="text-muted-foreground text-sm">
              Managed by {team.managerName}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-[#222] border-none text-sm"
          >
            <DropdownMenuItem>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule Meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#1e1e1e] p-1 rounded-lg border-none">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        {/* --- Overview --- */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Info Card */}
            <Card className="bg-[#1a1a1a] text-white border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  Team Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Basic details about your team
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Group ID</p>
                    <Badge
                      variant="outline"
                      className="bg-[#2c2c2c] border-none text-white"
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

                <Separator className="my-2 bg-[#333]" />

                <div className="space-y-3">
                  {team.spreadsheetUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 bg-[#222] border-none hover:bg-[#2c2c2c]"
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
                  <Button className="w-full gap-2 bg-primary text-white">
                    <RefreshCw className="h-4 w-4" />
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Members Card */}
            <Card className="bg-[#1a1a1a] text-white border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Team Members
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  People in your team
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ScrollArea className="h-[240px] pr-4">
                  <div className="space-y-4">
                    {team.allMembers.map((member, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-0 bg-[#333]">
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
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- Chat --- */}
        <TabsContent value="chat" className="mt-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-[#1a1a1a] text-white border-none relative shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Team Chat
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Connect with your team members
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-20">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {messages.map((chat, i) => {
                      // @ts-ignore
                      const isMe = chat.email === session.data?.user?.email;
                      return (
                        <div
                          key={i}
                          className={`flex items-end gap-2 ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className="max-w-[70%]">
                            <div
                              className={`rounded-xl px-4 py-2 text-sm break-words shadow-sm ${
                                isMe
                                  ? "bg-primary text-white rounded-br-none ml-auto"
                                  : "bg-muted text-black dark:text-white rounded-bl-none"
                              }`}
                            >
                              {chat.msg}
                            </div>

                            <div className="flex flex-col">
                              {!isMe && (
                                <p className="text-xs text-muted-foreground">
                                  {chat.email}
                                </p>
                              )}
                              <span
                                className={`text-[10px] block ${
                                  isMe ? "text-right w-full" : "text-left"
                                } text-muted-foreground`}
                              >
                                {new Date(
                                  chat.sendAt.seconds * 1000
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Floating Chat Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-4 right-4"
                >
                  <Button
                    size="icon"
                    className="rounded-full bg-primary hover:bg-primary/90 text-background shadow-xl"
                    onClick={() => setIsInputVisible(true)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>

                  {isInputVisible && (
                    <div className="absolute bottom-16 right-4 flex items-center gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white text-black"
                        placeholder="Type your message..."
                      />
                      <Button
                        size="sm"
                        onClick={sendMessage}
                        className="bg-primary text-white"
                      >
                        Send <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
}
