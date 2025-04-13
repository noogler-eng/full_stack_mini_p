// File: /app/api/user-groups/route.ts
import db from "@/utils/db/firebase";
import options from "../auth/config";

import { getDocs, collectionGroup, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(options);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;
  const matchedGroups: any[] = [];

  const groupSnap = await getDocs(collectionGroup(db, "teams"));

  for (const groupDoc of groupSnap.docs) {
    const groupData = groupDoc.data();
    const members = groupData.members || [];

    const isUserInGroup = members.some(
      (member: any) => member.name === userEmail
    );
    if (!isUserInGroup) continue;

    const groupRef = groupDoc.ref;
    const envRef = groupRef?.parent?.parent;

    // @ts-ignore
    const envSnap = await getDoc(envRef);
    const envData = envSnap.data();

    matchedGroups.push({
      //@ts-ignore
      managerId: envRef.id,
      managerName: envData?.name || "Unknown Env",
      spreadsheetUrl: envData?.spreadsheetUrl || null,
      groupId: groupDoc.id,
      topic: groupData.topic || "Untitled",
      userUSN: members.find((m: any) => m.name === userEmail)?.usn || "Unknown",
      allMembers: members,
    });
  }

  return NextResponse.json({ groups: matchedGroups });
}
