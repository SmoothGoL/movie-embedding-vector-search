import { openai, supabase } from '../config.js';

export const messages = [{
    role: 'system',
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a user prompt. Your main job is to formulate some recommendations for the user prompt using the provided context. Provide the reason why the specific movies were recommended. Name all fitting movie titles. If the answer is not given in the context, find the answer in the conversation history if possible. If you are unsure and cannot find the answer, say, "Sorry, I don't know the answer." Please do not make up the answer.` 
}];

// Bring all function calls together
export async function getConversationalResponse(input) {
  try {
    // reply.innerHTML = "Thinking..."
    const embedding = await createEmbedding(input);
    const match = await findNearestMatch(embedding);
    await getChatCompletion(match, input);
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
    match_threshold: 0.1,
    match_count: 5
  });
  return data.map(movies => movies.content).join('\n\n');
}

async function getChatCompletion(text, query) {
  // console.log(text, '\n\n')
  messages.push({
    role: 'user',
    content: `Context: ${text}\n\nUser prompt: ${query}`
  });
  
  const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: messages,
  });

  messages.push({
    role: 'assistant',
    content: response.choices[0].message.content,
  });
  return response.choices[0].message.content;
}