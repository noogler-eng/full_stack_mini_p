import axios from "axios";

export async function createSpreadSheet(title: any, teams = 20, size = 4) {
  const APP_SCRIPT_URL = process.env.NEXT_APP_SCRIPT_URL!;

  const groups: any[] = [];
  for (let i = 0; i < teams; i++) {
    groups.push({
      groupNo: i + 1,
      teamSize: size,
    });
  }

  try {
    const response = await axios.post(
      APP_SCRIPT_URL,
      { title: title, groups: groups },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    return {
      spreadsheetUrl: data.url,
      spreadsheetId: data.id,
    };
  } catch (err: any) {
    console.log(err);
    return {
      spreadsheetUrl: "",
      spreadsheetId: "",
    };
  }
}
