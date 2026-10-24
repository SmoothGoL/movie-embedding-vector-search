import movies from './content_movies.js';
import store from './storeMovieEmbeddings.js'
import query from './queryMovieEmbeddings.js'
import getConversational from './getConversationalResponse.js'

// const prompt = "I feel lonely and just want to see something light-hearted."
const prompt = "The movie with that actor from Castaway";

/** Create embeddings representing the input text */
async function main() {
  getConversational(prompt)
}
main();
