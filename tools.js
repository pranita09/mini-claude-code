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

export const TOOLS = [READ_TOOL, WRITE_TOOL];
