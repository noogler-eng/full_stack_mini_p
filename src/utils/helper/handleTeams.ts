import db from "@/utils/db/firebase";
import axios from "axios";
import { doc, getDoc, writeBatch } from "firebase/firestore";

const extractSheetId = (url: string): string | null => {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

const handleTeams = async (spreadsheetUrl: string, id: string) => {
  const sheetId = extractSheetId(spreadsheetUrl);
  if (!sheetId) {
    console.error("Invalid Google Spreadsheet URL.");
    return { success: false, error: "Invalid spreadsheet URL" };
  }

  try {
    const endpoint = `${process.env.NEXT_APP_SCRIPT_URL}?sheetId=${sheetId}`;
    const res = await axios.get(endpoint);
    const json = res.data;

    if (json.error) {
      console.error("Error from Apps Script:", json.error);
      return { success: false, error: json.error };
    }

    const teams = json.data;
    console.log('data: ', teams);

    const managerRef = doc(db, "manager", id);
    const managerSnap = await getDoc(managerRef);

    if (!managerSnap.exists()) {
      console.error(`Manager with ID ${id} does not exist.`);
      return { success: false, error: `Manager with ID ${id} does not exist` };
    }

    const batch = writeBatch(db);

    teams.forEach((team: any) => {
      const { groupNo, topic, members } = team;
      const groupRef = doc(db, "manager", id, "teams", `group${groupNo}`);

      batch.set(groupRef, {
        topic,
        members,
        createdAt: new Date(),
      });
    });

    batch.set(
      managerRef,
      {
        teamsCreated: true,
        lastUpdated: new Date(),
      },
      { merge: true }
    );

    await batch.commit();

    return {
      success: true,
      message: "Teams created successfully",
    };
  } catch (error: any) {
    console.error("Error uploading teams:", error);

    const errorDetails = {
      message: error.message,
      code: error.code,
      stack: error.stack,
    };

    console.error("Error details:", errorDetails);

    return {
      success: false,
      error: errorDetails.message || "Unknown error occurred",
    };
  }
};

export default handleTeams;
