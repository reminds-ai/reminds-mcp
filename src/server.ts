import { FastMCP } from 'fastmcp';
import isHtml from 'is-html';
import { z } from 'zod';
import { createFleeting, getFleeting } from './fleeting.js';

const server = new FastMCP({
  name: 'reminds-mcp',
  version: '1.0.10',
});

server.addTool({
  name: 'create_fleeting_note',
  description: 'Create a fleeting note in html format in reminds',
  parameters: z.object({
    content: z.string()
      .describe('The content of the fleeting note, in HTML format')
      .refine(content => isHtml(content), {
        message: 'content must be in HTML format',
      }),
  }),
  execute: async (params) => {
    const { content } = params;
    const response = await createFleeting(content);
    return response;
  },
});

server.addTool({
  name: 'get_fleeting_note',
  description: 'Get the content of a fleeting note in reminds',
  parameters: z.object({
    id: z.number().describe('The id of the fleeting note to get'),
  }),
  execute: async (params) => {
    const { id } = params;
    const response = await getFleeting(id);
    return `\`\`\`html\n${response}\n\`\`\``;
  },
});

server.start({
  transportType: 'stdio'
});