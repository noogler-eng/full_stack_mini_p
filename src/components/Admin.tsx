"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Plus, Copy, ExternalLink } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Environment {
  name: string;
  description: string;
  spreadsheetUrl: string;
  adminEmail: string;
  createdAt: string;
}

export default function Admin() {
  const { data: session } = useSession();
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserEnvironments = async () => {
    if (!session?.user?.email) return;
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/manager`);
      setEnvironments(res.data || []);
    } catch (error) {
      console.error("Error fetching environments:", error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to load your environments. Please try again.",
      //     variant: "destructive",
      //   });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEnvironment = async () => {
    if (!title || !description) {
      //   toast({
      //     title: "Missing information",
      //     description: "Please provide both a title and description.",
      //     variant: "destructive",
      //   });
      return;
    }

    const environment = {
      name: title,
      description,
      spreadsheetUrl: "",
      adminEmail: session?.user?.email || "unknown",
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const res = await axios.post("/api/manager", environment);
      if (res.status === 200) {
        setTitle("");
        setDescription("");
        fetchUserEnvironments();
        // toast({
        //   title: "Success",
        //   description: "Environment created successfully.",
        // });
      }
    } catch (err) {
      console.error("Error creating environment:", err);
      //   toast({
      //     title: "Error",
      //     description: "Failed to create environment. Please try again.",
      //     variant: "destructive",
      //   });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // toast({
        //   title: "Link copied",
        //   description: "The link has been copied to your clipboard.",
        // });
      })
      .catch((err) => {
        console.error("Error copying link: ", err);
        // toast({
        //   title: "Error",
        //   description: "Failed to copy link to clipboard.",
        //   variant: "destructive",
        // });
      });
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserEnvironments();
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-6xl mx-auto p-6">
        <header className="py-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Managed Environments
          </h1>
          <p className="text-zinc-400 mt-2">
            Create and manage your environment groups
          </p>
          <Separator className="my-6 bg-zinc-800" />
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-lg bg-zinc-900/50"></div>
            ))}
          </div>
        ) : environments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg border border-dashed border-zinc-800 bg-zinc-950">
            <h3 className="text-xl font-medium text-zinc-300 mb-2">
              No environments found
            </h3>
            <p className="text-zinc-500 text-center mb-6">
              Create your first environment group to get started
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Create Environment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Create New Environment
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Fill in the details to create a new managed environment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium text-zinc-300"
                    >
                      Environment Title
                    </label>
                    <Input
                      id="title"
                      placeholder="Enter a title"
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-700 focus:ring-zinc-700"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-zinc-300"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Describe this environment"
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-700 focus:ring-zinc-700 min-h-[100px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateEnvironment}
                    disabled={loading}
                    className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                  >
                    {loading ? "Creating..." : "Create Environment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {environments.map((env, idx) => (
              <Card
                key={idx}
                className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-zinc-100">
                      {env.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-zinc-900 text-zinc-400 border-zinc-800 text-xs"
                    >
                      {new Date(env.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {env.description && (
                    <CardDescription className="text-zinc-400 mb-4 line-clamp-2">
                      {env.description}
                    </CardDescription>
                  )}
                  {env.spreadsheetUrl && (
                    <div className="mt-2 p-2 bg-zinc-900 rounded-md border border-zinc-800">
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                        <ExternalLink className="h-3 w-3" />
                        <span>Spreadsheet URL</span>
                      </div>
                      <p className="text-xs text-zinc-300 truncate mb-2">
                        {env.spreadsheetUrl}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  {env.spreadsheetUrl ? (
                    <div className="flex gap-2 w-full flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
                        onClick={() => handleCopyLink(env.spreadsheetUrl)}
                      >
                        <Copy className="mr-2 h-3.5 w-3.5" /> Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
                        asChild
                      >
                        <a
                          href={env.spreadsheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">
                      No spreadsheet URL available
                    </p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating action button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-zinc-100 text-zinc-900 shadow-lg hover:bg-zinc-200 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Create New Environment
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Fill in the details to create a new managed environment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="title-modal"
                className="text-sm font-medium text-zinc-300"
              >
                Environment Title
              </label>
              <Input
                id="title-modal"
                placeholder="Enter a title"
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-700 focus:ring-zinc-700"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description-modal"
                className="text-sm font-medium text-zinc-300"
              >
                Description
              </label>
              <Textarea
                id="description-modal"
                placeholder="Describe this environment"
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-700 focus:ring-zinc-700 min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateEnvironment}
              disabled={loading}
              className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            >
              {loading ? "Creating..." : "Create Environment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
