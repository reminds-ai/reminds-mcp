import axios from "axios";

const API_ROOT = process.env.API_ROOT || "https://api.reminds-app.com/v1";
const API_KEY = process.env.API_KEY;

export interface MemoNote {
  gid: number;
  md_content: string;
  title: string;
}

export const searchNotes = async (
  query: string,
  mode: "qa" | "retrieval" = "retrieval",
  limit?: number,
): Promise<number[]> => {
  const response = await axios.post(
    `${API_ROOT}/memo/search/hybrid`,
    { limit, mode, query },
    {
      headers: { "Content-Type": "application/json" },
      params: { api_key: API_KEY },
    },
  );

  if (response.status !== 200) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.data.data as number[];
};

export const getNotes = async (gids: number[]): Promise<MemoNote[]> => {
  const response = await axios.get(`${API_ROOT}/memo/batch`, {
    headers: { "Content-Type": "application/json" },
    params: {
      api_key: API_KEY,
      gids: JSON.stringify(gids),
    },
  });

  if (response.status !== 200) {
    throw new Error(`Get notes failed: ${response.statusText}`);
  }

  const memos = response.data.data as Array<Record<string, unknown>>;
  return memos.map((m) => ({
    gid: m.gid as number,
    md_content: m.md_content as string,
    title: m.title as string,
  }));
};
