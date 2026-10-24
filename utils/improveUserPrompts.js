import { openai } from '../config.js';

const messages = [{
    role: 'system',
    content: 
`You are an AI that extracts exact, literal search constraints from a user's conversation history to build a query for a vector database. 

Rules:
1. Extract only the exact subjects and constraints explicitly stated by the user across the conversation history.
2. NEVER infer implied categories (e.g., "family-friendly"), age brackets (e.g., "young teens"), or synonyms. If the user says "child," use "child."
3. Combine the history into a single, cohesive set of parameters. 
4. Output these constraints as a simple, comma-separated list of keywords and short phrases.
5. Output ONLY the comma-separated list. Do not include introductory text, bullet points, or explanations.

Examples:
History: "What movie can I take my child to?"
Output: movie, child

History: "What movie can I take my child to?" -> "My child is 13 years old"
Output: movie, 13 year old child

History: "What movie can I take my child to?" -> "My child is 13 years old" -> "I forgot to mention that he likes science fiction"
Output: movie, 13 year old child, science fiction
` 
}];

// Bring all function calls together
export async function improveUserPrompts(input) {
  try {
    if (input) {
        messages.push({
            role: 'user',
            content: input,
        })
    }
    if (messages.length > 1) {
        return await getChatCompletion(input);
    } else {
        return '';
    }
  } catch (error) {
     console.error('Error in main function.', error.message);
     // reply.innerHTML = "Sorry, something went wrong. Please try again.";
  }
}

async function getChatCompletion(query) {
    try {
        const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL,
        messages,
        });

        return response.choices[0].message.content; 
    } catch (err) {
        console.error(`OpenAI API error: ${err.message || err}`);
        return `OpenAI API error: ${err.message || err}`;
    }
}
