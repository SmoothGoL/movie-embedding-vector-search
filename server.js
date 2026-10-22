import openai from './config.js';
import write from './writeJSON.js'

/** Create embeddings representing the input text */
async function main() {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "Hello, world!",
  });
  write(embedding);
}
main();
