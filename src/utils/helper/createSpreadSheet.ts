import axios from "axios";

export async function createSpreadSheet(title: any) {
  const APP_SCRIPT_URL = process.env.NEXT_PUBLIC_APP_SCRIPT_URL!;

  try {
    const response = await axios.post(
      APP_SCRIPT_URL,
      { title },
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
