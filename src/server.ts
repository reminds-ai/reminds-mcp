import { FastMCP } from "fastmcp";
import isHtml from "is-html";
import { z } from "zod";

import { createFleeting, getFleeting } from "./fleeting.js";
import { getNotes, searchNotes } from "./memo.js";

const server = new FastMCP({
  name: "reminds-mcp",
  version: "1.2.0",
});

server.addTool({
  description: "Create a fleeting note in html format in reminds",
  execute: async (params) => {
    const { content } = params;
    const response = await createFleeting(content);
    return response;
  },
  name: "create_fleeting",
  parameters: z.object({
    content: z
      .string()
      .describe("The content of the fleeting note, in HTML format")
      .refine((content) => isHtml(content), {
        message: "content must be in HTML format",
      }),
  }),
});

server.addTool({
  description: "Get the content of a fleeting note in reminds",
  execute: async (params) => {
    const { id } = params;
    const response = await getFleeting(id);
    return `\`\`\`html\n${response}\n\`\`\``;
  },
  name: "get_fleeting",
  parameters: z.object({
    id: z.number().describe("The id of the fleeting note to get"),
  }),
});

server.addTool({
  description:
    "Search notes in reminds by semantic query. Returns an array of note gids.",
  execute: async (params) => {
    const gids = await searchNotes(params.query, params.mode, params.limit);
    return JSON.stringify(gids);
  },
  name: "search_notes",
  parameters: z.object({
    limit: z
      .number()
      .min(1)
      .max(50)
      .optional()
      .describe("Maximum number of results to return"),
    mode: z
      .enum(["qa", "retrieval"])
      .optional()
      .describe(
        "Search mode: qa for precise answers, retrieval for broad topic match",
      ),
    query: z.string().describe("The search query"),
  }),
});

server.addTool({
  description:
    "Get note contents in reminds by gids. Returns title and markdown content.",
  execute: async (params) => {
    const notes = await getNotes(params.gids);
    return JSON.stringify(notes);
  },
  name: "get_notes",
  parameters: z.object({
    gids: z
      .array(z.number())
      .min(1)
      .max(25)
      .describe("Array of note gids to retrieve"),
  }),
});

server.start({
  transportType: "stdio",
});
