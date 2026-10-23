import { openai, supabase } from './config.js';


export default async function storeMovieEmbeddings(input) {
  const data = await Promise.all(
    input.map( async (textChunk) => {
        const embeddingResponse = await openai.embeddings.create({
            model: process.env.EMBEDDING_LARGE,
            input: textChunk
        });
        return { 
          content: textChunk, 
          embedding: embeddingResponse.data[0].embedding 
        }
    })
  );
  
  // Insert content and embedding into Supabase
  await supabase.from('movies_large').insert(data); 
  console.log('Embedding and storing complete!');
}