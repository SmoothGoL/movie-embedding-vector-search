import { openai } from '../config.js';

const systemPrompt = {
    role: 'system',
    content: 
`You are an AI that extracts exact search constraints from a user's conversation history to build a query for a vector database. 

EXTRACTION & EXCLUSION RULES:
1. Extract ONLY explicitly stated subjects, genres, and constraints. NEVER infer categories (e.g., do not add "family-friendly").
2. EXCLUDE the core item being searched for (e.g., "movie," "film").
3. EXCLUDE conversational filler and pronouns ("I," "we," "he," "she"). If a pronoun refers to a subject, replace it with the actual subject before extracting (e.g., treat "he likes" as "child likes").

FORMATTING RULES:
4. TARGET AUDIENCE: Format audiences as plural phrases prefixed with "for " (e.g., "child" becomes "for children", "13 year old" becomes "for 13 year old children").
5. TONES & VIBES: Always preserve words like "something" before adjectives (e.g., use "something light-hearted" instead of just "light-hearted") to ensure the tone is not mistakenly applied to the target audience.
6. OUTPUT FORMAT: Combine the constraints into a single, comma-separated list of short phrases. Output NOTHING ELSE—no introductory text, no bullets.

Examples:
History: "What movie can I take my child to?"
Output: for children

History: "What movie can I take my child to?" -> "My child is 13 years old"
Output: for 13 year old children

History: "What movie can I take my child to?" -> "My child is 13 years old" -> "I forgot to mention that he likes science fiction"
Output: for 13 year old children, science fiction

History: "What movie can I take my child to?" -> "My child is 13 years old" -> "I forgot to mention that he likes science fiction" -> "We want something light-hearted"
Output: for 13 year old children, science fiction, something light-hearted` 
};

// Bring all function calls together
export async function improveUserPrompts(userPrompts) {
    try {
        return await getChatCompletion(userPrompts);
    } catch (error) {
        console.error('Error in main function.', error.message);
        // reply.innerHTML = "Sorry, something went wrong. Please try again.";
    }
}

async function getChatCompletion(userPrompts) {
    try {
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL,
            messages: [
                systemPrompt,
                ...userPrompts,
            ],
        });

        return JSON.stringify({ queryPrompt: response.choices[0].message.content }); 
    } catch (err) {
        console.error(`OpenAI API error: ${err.message || err}`);
        return `OpenAI API error: ${err.message || err}`;
    }
}

