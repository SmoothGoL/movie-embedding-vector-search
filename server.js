import movies from './content_movies.js';
import store from './storeMovieEmbeddings.js';
import query from './queryMovieEmbeddings.js';
import getConversational from './getConversationalResponse.js';
import express from 'express';
import { apiRouter } from './routes/apiRoutes.js';
import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom';
import path from "node:path";
import { fileURLToPath } from "node:url";

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// purify.sanitize(marked.parse(data))

// const prompt = "I feel lonely and just want to see something light-hearted."
// const prompt = "The movie with that actor from Castaway";

/** Create embeddings representing the input text */
async function main() {
  getConversational(prompt);
}

const PORT = 5173;

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/api', apiRouter)

// 404 Handler (place this after all defined routes)
app.use((req, res) => {
  const filePath = path.join(__dirname, "public", "404.html"); // Adjust directory as needed
  res.status(404).sendFile(filePath);
});

app.listen(PORT, () => console.log(`server connected on port ${PORT}`))
