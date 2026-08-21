# 🤖 Build Your Own Claude Code

A simplified, from-scratch implementation of an AI coding agent — inspired by [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview). Built with Node.js, the OpenAI SDK, and a tool-use loop that lets an LLM read, write, edit files, and execute shell commands on the machine.

## ✨ Features

- **Interactive REPL** — Chat with an AI agent directly in your terminal
- **Tool Use Loop** — The agent can autonomously chain multiple tool calls to complete tasks
- **4 Built-in Tools:**
  - 📖 **Read** — Read file contents
  - ✏️ **Write** — Create or overwrite files
  - 🔧 **Edit** — Make targeted find-and-replace edits to existing files
  - 💻 **Bash** — Execute shell commands (`ls`, `grep`, `npm`, `git`, etc.)
- **Permission Prompts** — Every tool call requires explicit user approval (`y/n`) before execution
- **Pretty Markdown Output** — Model responses are rendered with syntax-highlighted code blocks, styled headings, colored lists, and more via `marked-terminal`
- **Animated Spinner** — Visual thinking indicator with rotating labels while the model is processing

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   User       │────▶│   Agent      │────▶│   LLM API   │
│   (stdin)    │◀────│   Loop       │◀────│  (OpenRouter)│
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │    Tools     │
                    │              │
                    │  Read        │
                    │  Write       │
                    │  Edit        │
                    │  Bash        │
                    └──────────────┘
```

**How it works:**

1. You type a prompt in the terminal
2. The agent sends it to the LLM (via OpenRouter)
3. If the LLM responds with tool calls, the agent:
   - Asks for your permission
   - Executes the tool
   - Sends the result back to the LLM
   - Repeats until the LLM gives a final text response
4. The response is pretty-printed as markdown in the terminal

## 📁 Project Structure

```
├── index.js        # Main entry point — REPL loop, tool execution, LLM calls
├── tools.js        # Tool definitions (OpenAI function-calling schema)
├── utils.js        # Spinner, markdown renderer, formatting helpers
├── program.js      # Sample file for demo/testing
├── .env            # API key (not committed)
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v22+ (uses `process.loadEnvFile()`)
- An **OpenRouter API key** ([get one here](https://openrouter.ai/keys))

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Devtools-Tech-Team/build-your-own-claude-code.git
cd build-your-own-claude-code

# 2. Install dependencies
npm install

# 3. Create a .env file with your API key
echo "OPENROUTER_API_KEY=your_key_here" > .env

# 4. Run the agent
node index.js
```

## 💬 Usage

Once running, you'll see an interactive prompt:

```
🤖 AI Agent (type 'exit' or 'quit' to leave)

>
```

Type any request and the agent will respond — using tools when needed:

```
> Read program.js and explain what it does

🔧 Tool call: Read
  file_path: program.js

Allow? (y/n): y
```

### Demo Prompts

Try these in sequence for a great walkthrough:

| #   | Prompt                                                          | Tools Used       |
| --- | --------------------------------------------------------------- | ---------------- |
| 1   | `Read program.js and explain what it does`                      | Read             |
| 2   | `There's a bug in program.js. Can you find and fix it?`         | Read → Edit      |
| 3   | `Run program.js using node and show me the output`              | Bash             |
| 4   | `Write a test file that tests the sum function with edge cases` | Write            |
| 5   | `Run the tests`                                                 | Bash             |
| 6   | `List all JS files and give me a summary of each`               | Bash → Read (×N) |

## 🔧 Tools

Each tool is defined as an [OpenAI function-calling schema](https://platform.openai.com/docs/guides/function-calling) in `tools.js`:

| Tool      | Description                               | Parameters                              |
| --------- | ----------------------------------------- | --------------------------------------- |
| **Read**  | Reads and returns file contents           | `file_path`                             |
| **Write** | Creates or overwrites a file              | `file_path`, `contents`                 |
| **Edit**  | Find-and-replace edit on an existing file | `file_path`, `old_string`, `new_string` |
| **Bash**  | Executes a shell command (30s timeout)    | `command`                               |

## 🎨 Terminal Rendering

Model responses are rendered as rich markdown in the terminal using `marked` + `marked-terminal`:

- **Code blocks** — Syntax-highlighted with box-drawing borders
- **Headings** — Purple/blue with unicode markers (✦, ◆)
- **Lists** — Cyan arrow (→) bullets
- **Inline code** — White-on-gray background
- **Bold / Italic** — Bright white / purple
- **Blockquotes** — Gray sidebar (▌) with italic text
- **Tables** — Unicode box-drawing borders

## 📦 Dependencies

| Package                                                          | Purpose                                            |
| ---------------------------------------------------------------- | -------------------------------------------------- |
| [openai](https://www.npmjs.com/package/openai)                   | OpenAI-compatible SDK for LLM calls via OpenRouter |
| [marked](https://www.npmjs.com/package/marked)                   | Markdown parser                                    |
| [marked-terminal](https://www.npmjs.com/package/marked-terminal) | Terminal renderer for marked                       |
| [cli-highlight](https://www.npmjs.com/package/cli-highlight)     | Syntax highlighting for code blocks                |
| [chalk](https://www.npmjs.com/package/chalk)                     | Terminal string styling                            |
