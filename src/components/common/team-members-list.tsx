import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TeamMembersListProps {
  members: Array<{
    name: string;
    usn: string;
  }>;
}

export function TeamMembersList({ members }: TeamMembersListProps) {
  return (
    <ScrollArea className="h-[120px] pr-4">
      <ul className="space-y-2">
        {members.map((member, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <Avatar className="h-7 w-7 border border-border">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.usn}</p>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

function getInitials(email: string): string {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);

  if (parts?.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return name?.substring(0, 2).toUpperCase();
}
