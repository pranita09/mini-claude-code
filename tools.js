/**
 * function read({ file_path }) {
 *   it will read and return the contents of the file at the given path
 * }
 */
export const READ_TOOL = {
    type: 'function',
    function: {
        name: 'Read',
        description: 'Read a file and return its contents',
        parameters: {
            type: 'object',
            required: ['file_path'],
            properties: {
                file_path: { 
                    type: 'string', 
                    description: 'The file path to read' 
                }
            }
        }
    },
}

export const WRITE_TOOL = {
    type: 'function',
    function: {
        name: 'Write',
        description: 'Write and return the contents of the file',
        parameters: {
            type: 'object',
            required: ['file_path', 'contents'],
            properties: {
                file_path: {
                    type: 'string',
                    description: 'The name of the file to write'
                },
                contents: {
                    type: 'string',
                    description: 'The contents to write to the file'
                }
            }
        }
    }
}

export const EDIT_TOOL = {
    type: "function",
    function: {
      name: "Edit",
      description:
        "Make a targeted edit to an existing file by replacing a specific string with new content. Use this instead of Write when modifying existing files.",
      parameters: {
        type: "object",
        required: ["file_path", "old_string", "new_string"],
        properties: {
          file_path: {
            type: "string",
            description: "The path of the file to edit",
          },
          old_string: {
            type: "string",
            description:
              "The exact string to find and replace. Must match exactly, including whitespace.",
          },
          new_string: {
            type: "string",
            description: "The replacement string",
          },
        },
      },
    },
  };
  
  export const BASH_TOOL = {
    type: "function",
    function: {
      name: "Bash",
      description:
        "Execute a bash command and return its output. Use this to run shell commands like ls, grep, find, cat, npm, git, etc.",
      parameters: {
        type: "object",
        required: ["command"],
        properties: {
          command: {
            type: "string",
            description: "The bash command to execute",
          },
        },
      },
    },
  };
  
  export const TOOLS = [READ_TOOL, WRITE_TOOL, EDIT_TOOL, BASH_TOOL];
