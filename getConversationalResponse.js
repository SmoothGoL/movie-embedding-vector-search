import { openai, supabase } from './config.js';

// Bring all function calls together
export default async function getConversationalResponse(input) {
  const embedding = await createEmbedding(input);
  const match = await findNearestMatch(embedding);
  await getChatCompletion(match, input);
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
    match_threshold: 0.10,
    match_count: 3
  });
  return data.map(movies_large => {
    return `${movies_large.content}`;
  }).join('\n\n');
}

// Use OpenAI to make the response conversational
const chatMessages = [{
    role: 'system',
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a user prompt. Your main job is to formulate a short recommendation for the user prompt using the provided context. Provide the reason why the specific movie was recommended. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.` 
}];

async function getChatCompletion(text, query) {
  chatMessages.push({
    role: 'user',
    content: `Context: ${text}\n\nUser prompt: ${query}`
  });
  
  const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: chatMessages,
  });

  console.log(response.choices[0].message.content);
}