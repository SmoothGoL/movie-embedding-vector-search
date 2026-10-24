import { openai, supabase } from '../config.js';

const messages = [{
role: 'system',
content:
    `You are an enthusiastic movie expert who loves recommending movies to people. 

**Task:**
Formulate movie recommendations for the user prompt based strictly on the provided context. 

**Rules:**
- You must ONLY recommend movies that are present in the provided context text. Do not use outside knowledge.
- If you are unsure and cannot find fitting movies in the context, reply exactly: "Sorry, I don't know the answer." Do not make up the answer.
- Provide a specific reason why each movie fits the user's request.

**Format:**
- Present your recommendations as a concise bulleted list.
- Bold the movie titles.`
}];

// Bring all function calls together
export async function getConversationalResponse(input) {
try {
    const embedding = await createEmbedding(input);
    const match = await findNearestMatch(embedding);
    return await getChatCompletion(match, input);
} catch (error) {
    console.error('Error in main function.', error.message);
    // reply.innerHTML = "Sorry, something went wrong. Please try again.";
}
}

// Create an embedding vector representing the input text
async function createEmbedding(input) {
const embeddingResponse = await openai.embeddings.create({
    model: process.env.EMBEDDING_LARGE,
    input
});
return embeddingResponse.data[0].embedding;
}

// Query Supabase and return a semantically matching text chunk
async function findNearestMatch(embedding) {
const { data } = await supabase.rpc('match_movies_large', {
    query_embedding: embedding,
    match_threshold: 0.2,
    match_count: 5
});
if (data.length === 0) return '\n\n';
return data.map(movies => movies.content).join('\n\n');
}

async function getChatCompletion(text, query) {

const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: [
    messages[0],
    {
        role: 'user',
        content: `Context: ${text}\n\nUser prompt: ${query}`
    }
    ],
});

return response.choices[0].message.content;
}

export function deleteChatHistory() {

}
