import { openai, supabase } from '../config.js';

export default async function storeMovieEmbeddings(input) {
  try {
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
    const { error } = await supabase.from('movies_large').insert(data); 
    if (error) {
      throw new Error('Issue inserting data into the database.');
    }
    console.log('Embedding and storing complete!');
  } catch (e) {
      console.error('ERROR: ' + e.message);
  }
}
