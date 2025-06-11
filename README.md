# reminds MCP server

A MCP server for [reminds](https://reminds-app.com)

## Supported Tools

- create_html_fleeting_note: Create a fleeting note in HTML format

## How to Use in Cursor

- Get you API Key in reminds: Settings -> Security -> Developer -> API Key

- Configure in Cursor: Settings -> MCP Tools

```json
{
  "mcpServers": {
    "reminds-mcp": {
      "command": "npx",
      "args": ["-y", "reminds-mcp"],
      "env": {
        "API_KEY": "$YOUR_API_KEY"
      }
    }
  }
}
```
