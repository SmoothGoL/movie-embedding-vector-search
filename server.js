import movies from './content/content_movies.js';
import store from './utils/storeMovieEmbeddings.js';
import query from './utils/queryMovieEmbeddings.js';
import express from 'express';
import { apiRouter } from './utils/apiRoutes.js';
import path from "node:path";
import { fileURLToPath } from "node:url";

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const prompt = "I feel lonely and just want to see something light-hearted."
// const prompt = "The movie with that actor from Castaway";

// getConversational(prompt);

const PORT = process.env.PORT || 8001;

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

