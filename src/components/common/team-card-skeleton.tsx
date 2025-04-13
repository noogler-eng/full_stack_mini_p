import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function TeamCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="space-y-6 rounded-xl bg-gradient-to-br from-[#1e1f22] via-[#23262b] to-[#1e1f22] p-6 shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-zinc-700" />
          <Skeleton className="h-4 w-48 bg-zinc-700" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 bg-zinc-700" />
          <Skeleton className="h-8 w-8 rounded-md bg-zinc-700" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800 rounded-lg">
          <TabsTrigger value="overview" disabled className="text-zinc-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="members" disabled className="text-zinc-400">
            Members
          </TabsTrigger>
          <TabsTrigger value="activity" disabled className="text-zinc-400">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-zinc-800 shadow-none border-none">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 bg-zinc-700" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24 bg-zinc-700" />
                      <Skeleton className="h-4 w-20 bg-zinc-700" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 shadow-none border-none">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 bg-zinc-700" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-10 w-full bg-zinc-700" />
                <Skeleton className="h-10 w-full bg-zinc-700" />
                <Skeleton className="h-10 w-full bg-zinc-700" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
