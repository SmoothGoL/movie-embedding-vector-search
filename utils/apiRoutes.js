import express from 'express';
import query from './queryMovieEmbeddings.js'
import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom';

const replyFunction = 'ai';
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const apiRouter = express.Router();

apiRouter.post('/', async (req, res) => {
    try {
        const { userPrompts } = req.body;

        // if (!userPrompts) {
        //     return res.status(400).json({ message: "userPrompt is required" });
        // }

        switch (replyFunction.toLowerCase()) {
            case 'prompt':
            case 'user prompt':
                res.json(await improveUserPrompts(userPrompts));
                break;
            case 'conversational':
            case 'ai':
                res.json(await getConversationalResponse(userPrompts));
                break;
            case 'query':
                const data = await query(userPrompts[userPrompts.length - 1]);
                res.json({ queryResults: purify.sanitize(marked.parse(data)) });
                
                break;
            default: 
                data = `Function '${replyFunction}' does not exist.`;
        }
        
    } catch (error) {
        console.error(`Error in function call '${replyFunction}': ${error.message || error}`);
        res.status(500).json({ message: "Failed to generate movie recommendations." });
    }
});
