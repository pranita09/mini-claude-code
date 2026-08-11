/**
 * Step 1: talk to a LLM
 */

import OpenAI from "openai";
import readline from "readline/promises";
import fs from "fs";

process.loadEnvFile('.env');

const BASE_URL = "https://openrouter.ai/api/v1";
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'poolside/laguna-xs-2.1:free'

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: BASE_URL,
});

/**
 * function read({ file_path }) {
 *   it will read and return the contents of the file at the given path
 * }
 */
const READ_TOOL = {
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

const TOOLS = [READ_TOOL];

async function getModelResponse(messages) {
    return client.chat.completions.create({
        model: MODEL,
        messages: messages,
        tools: TOOLS,
    });
}

async function executeTool(toolCall) {
    if(toolCall?.function?.name === READ_TOOL.function.name) {
        const { file_path } = JSON.parse(toolCall.function.arguments);
        const content = await fs.promises.readFile(file_path, 'utf8');
        return content;
    }

    return "";
}

async function init() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\x1b[36m🤖 AI Agent \x1b[0m (Type 'exit', 'quit', or 'q' to exit.)\n");

  const messages = [];

  while(true) {
    // >
    const prompt = await rl.question("\x1b[32m> \x1b[0m");

    if(!prompt.trim().length) {
      continue;
    } else if (['exit', 'quit', 'q'].includes(prompt.trim().toLowerCase())) {
        console.log("\x1b[31mExiting...\x1b[0m");
        rl.close();
        break;
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    await getResponse();
  }

  async function getResponse() {
    const response = await getModelResponse(messages);
    const { choices } = response;

    if(!choices || choices.length === 0) {
      console.log("No response from model");
      return;
    }

    const { message } = choices[0];
    const { content, tool_calls } = message;

    // assistant's response
    messages.push(message);

    if(tool_calls?.length) {
      // [{ read_tool }, { ... }]

      /**
      * user prompt
      * assistant's response (with tool calls)
      * tool result
      * assistant's response (final)
      * user response
      */

      for(const toolCall of tool_calls) {
        const toolResponse = await executeTool(toolCall);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResponse,
        });
      }
  
      await getResponse();
    } else {
        console.log(content);
    }
  }
}

init();