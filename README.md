# AI-Powered Movie Search Engine

A natural language search application that allows users to find movies using semantic meaning rather than exact keyword matches.

**Live Demo:** https://movie-embedding-vector-search.onrender.com/
*(Note: Hosted on Render's free tier. Please allow 30-50 seconds for the server to wake up on the initial load).*

## How It Works
1. **Query Processing:** Uses an LLM to extract core search terms and intent from user queries.
2. **Vector Embeddings:** Converts the extracted terms into vector embeddings.
3. **Semantic Search:** Performs a similarity search against a vector database of movie metadata.
4. **Natural Language Output:** Feeds the relevant results back through an LLM to present a conversational, contextual answer.

## My Contributions & Improvements
This project originated as a proof-of-concept from the Scrimba AI course "RAG and Vector Databases." I expanded the original frontend-only tutorial into a more secure and feature-rich prototype, replacing or rewriting ~50-60% of the underlying logic.

Key technical improvements include:
- **Security & Backend Migration:** Moved the OpenAI API integration from the client-side to a dedicated Express.js server, eliminating the `dangerouslyAllowBrowser` vulnerability used in the original tutorial.
- **Custom Prompt Engineering:** Built a custom LLM extraction pipeline from scratch to isolate relevant search terms and intent before vectorization.
- **Persistent Chat History:** Implemented `localStorage` to save user prompts across browser reloads and allow users to delete individual past queries.
- **Optimized Context Window:** Refined how sequential user prompts are stored and fed back into the LLM, ensuring the model generates highly relevant search terms based on the entire conversation history.

## Current Database
To demonstrate the semantic search capabilities as a prototype, the vector database contains a curated micro-dataset of 13 films, including: *Oppenheimer (2023), Elemental (2023), Top Gun: Maverick (2022), Barbie (2023)*, and *Jurassic Park (1993)*.

## Acknowledgements
The base concept, UI design, SQL commands, and the majority of the movie descriptions were provided by the AI curriculum on [Scrimba](https://scrimba.com).
