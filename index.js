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

  const messages = [];

  const prompt = await rl.question("Enter your query: ");

  if(!prompt?.trim()?.length) {
    console.log("Please enter valid query");
    rl.close();
    return;
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  const response = await getModelResponse(messages);
  const { choices } = response;

  if(!choices || choices.length === 0) {
    console.log("No response from model");
    rl.close();
    return;
  }

  const { message } = choices[0];
  const { content, tool_calls } = message;

  if(!tool_calls?.length) {
    console.log("Model Response: ", content);
  }

  messages.push(message);

  for(const toolCall of tool_calls) {
    const toolResponse = await executeTool(toolCall);
    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: toolResponse,
    });
  }

  const finalResponse = await getModelResponse(messages);

  console.log('Messages: ', finalResponse.choices[0].message.content);

  rl.close();
}

init();