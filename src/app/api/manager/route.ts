import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import options from "../auth/config";
import db from "@/utils/db/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { createSpreadSheet } from "@/utils/helper/createSpreadSheet";

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newEnv = {
      name,
      description: description || "",
      adminEmail: session.user.email,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "manager"), newEnv);
    const spreadsheetResponse = await createSpreadSheet(name);
    const spreadsheetData = spreadsheetResponse;

    if (spreadsheetData.spreadsheetUrl == "") {
      return NextResponse.json(
        { error: "spreadsheet creation error" },
        { status: 500 }
      );
    }

    const environmentDocRef = doc(db, "manager", docRef.id);
    await updateDoc(environmentDocRef, {
      spreadsheetUrl: spreadsheetData.spreadsheetUrl,
      spreadsheetId: spreadsheetData.spreadsheetId,
    });

    return NextResponse.json(
      {
        id: docRef.id,
        name,
        description: description || "",
        adminEmail: session.user.email,
        spreadsheetUrl: spreadsheetData.spreadsheetUrl,
        message: "Environment created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating environment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(options);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const q = query(
      collection(db, "manager"),
      where("adminEmail", "==", session.user.email)
    );
    const querySnapshot = await getDocs(q);

    const environments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(environments, { status: 200 });
  } catch (err) {
    console.error("Error fetching environments:", err);
    return NextResponse.json(
      { error: "Failed to fetch environments" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(options);
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get("id");

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!managerId) {
    return NextResponse.json(
      { error: "Missing managerId parameter" },
      { status: 400 }
    );
  }

  try {
    const managerRef = doc(db, "manager", managerId);
    const manager = await getDoc(managerRef);

    if (!manager.exists()) {
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    }

    const managerData = manager.data();
    if (managerData.adminEmail !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const teamsColRef = collection(db, "manager", managerId, "teams");
    const teamDocs = await getDocs(teamsColRef);

    const deletePromises = teamDocs.docs.map((teamDoc) =>
      deleteDoc(teamDoc.ref)
    );
    await Promise.all(deletePromises);

    await deleteDoc(managerRef);

    return NextResponse.json({ msg: "deleted succesfully" });
  } catch (err) {
    console.error("Error fetching environments:", err);
    return NextResponse.json(
      { error: "Failed to fetch environments" },
      { status: 500 }
    );
  }
}
