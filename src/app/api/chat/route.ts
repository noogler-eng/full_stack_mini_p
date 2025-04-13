import db from "@/utils/db/firebase";
import options from "../auth/config";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export async function POST(req: any) {
  try {
    const { managerId, teamId, message } = await req.json();
    const session = await getServerSession(options);

    // Check if the user is authorized (authenticated)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const groupRef = doc(collection(db, "manager", managerId, "teams"), teamId);

    const newMessage = {
      email: userEmail,
      msg: message,
      sendAt: new Date(),
    };

    await updateDoc(groupRef, {
      chat: arrayUnion(newMessage),
    });

    return new Response("Message added successfully", { status: 200 });
  } catch (error) {
    console.error("Error adding message: ", error);
    return new Response("Error adding message", { status: 500 });
  }
}

export async function GET(req: any) {
  try {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId") || "";
    const groupId = searchParams.get("groupId") || "";

    const session = await getServerSession(options);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupRef = doc(
      collection(db, "manager", managerId, "teams"),
      groupId
    );

    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const groupData = groupSnap.data();
    const chatMessages = groupData?.chat || [];

    return NextResponse.json({ chat: chatMessages });
  } catch (error) {
    console.error("Error fetching chat messages: ", error);
    return NextResponse.json(
      { error: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}
