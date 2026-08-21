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