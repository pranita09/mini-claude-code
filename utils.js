import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import { highlight } from "cli-highlight";
import chalk from "chalk";

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const THINKING_WORDS = [
  "Thinking",
  "Reasoning",
  "Pondering",
  "Analyzing",
  "Processing",
  "Contemplating",
  "Evaluating",
  "Computing",
  "Reflecting",
  "Considering",
];

export function createSpinner(label) {
  let frameIndex = 0;
  let wordIndex = Math.floor(Math.random() * THINKING_WORDS.length);
  let ticks = 0;

  const interval = setInterval(() => {
    const frame = SPINNER_FRAMES[frameIndex % SPINNER_FRAMES.length];
    const word = label || THINKING_WORDS[wordIndex % THINKING_WORDS.length];
    process.stderr.write(`\r\x1b[36m${frame}\x1b[0m ${word}...`);
    frameIndex++;
    ticks++;
    // rotate the word every ~8 frames (~640ms)
    if (ticks % 8 === 0) {
      wordIndex++;
    }
  }, 80);

  return {
    stop(finalMessage) {
      clearInterval(interval);
      process.stderr.write("\r\x1b[K"); // clear the line
      if (finalMessage) {
        process.stderr.write(`\x1b[32m✔\x1b[0m ${finalMessage}\n`);
      }
    },
  };
}

export async function withSpinner(label, fn) {
    const spinner = createSpinner(label);
    try {
        const result = await fn();
        return result;
    } finally {
        spinner.stop();
    }
}

export function formatToolDescription(toolFunction) {
    const args = JSON.parse(toolFunction.arguments);
    const argsStr = Object.entries(args)
      .map(
        ([key, value]) =>
          `  ${key}: ${typeof value === "string" && value.length > 200 ? value.slice(0, 200) + "..." : value}`,
      )
      .join("\n");
  
    return `${toolFunction.name}\n${argsStr}`;
}

marked.setOptions({
    renderer: new TerminalRenderer({
      // Code blocks with syntax highlighting
      code: (code, lang) => {
        try {
          return (
            "\n" +
            chalk.gray("  ┌─") +
            (lang ? chalk.gray(` ${lang} `) : "") +
            chalk.gray("─".repeat(40)) +
            "\n" +
            highlight(code, { language: lang || "text" })
              .split("\n")
              .map((line) => chalk.gray("  │ ") + line)
              .join("\n") +
            "\n" +
            chalk.gray("  └" + "─".repeat(44)) +
            "\n"
          );
        } catch {
          return "\n" + code + "\n";
        }
      },
      // Inline code
      codespan: (text) => chalk.bgGray.white(` ${text} `),
      // Headings
      firstHeading: (text) =>
        "\n" + chalk.bold.hex("#a78bfa")("  ✦ " + text) + "\n",
      heading: (text) => "\n" + chalk.bold.hex("#60a5fa")("  ◆ " + text) + "\n",
      // Lists
      listitem: (text) => "  " + chalk.hex("#38bdf8")("→") + " " + text,
      // Horizontal rule
      hr: () => "\n" + chalk.gray("  " + "─".repeat(50)) + "\n",
      // Links
      link: (href, title, text) =>
        chalk.cyan.underline(text) + chalk.gray(` (${href})`),
      // Bold and emphasis
      strong: (text) => chalk.bold.white(text),
      em: (text) => chalk.italic.hex("#c084fc")(text),
      // Tables
      tableOptions: {
        chars: {
          top: "─",
          "top-mid": "┬",
          "top-left": "┌",
          "top-right": "┐",
          bottom: "─",
          "bottom-mid": "┴",
          "bottom-left": "└",
          "bottom-right": "┘",
          left: "│",
          "left-mid": "├",
          mid: "─",
          "mid-mid": "┼",
          right: "│",
          "right-mid": "┤",
          middle: "│",
        },
      },
      // Paragraphs
      reflowText: true,
      width: 80,
      // Blockquote
      blockquote: (text) =>
        text
          .split("\n")
          .map((line) => chalk.gray("  ▌ ") + chalk.italic(line))
          .join("\n"),
    }),
});
  
export function print(text) {
    process.stdout.write(marked(text));
}

