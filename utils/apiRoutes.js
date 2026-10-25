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
        const { userPrompt } = req.body;

        if (!userPrompt) {
            return res.status(400).json({ message: "userPrompt is required" });
        }

        switch (replyFunction.toLowerCase()) {
            case 'prompt':
            case 'user prompt':
                data = await improveUserPrompts(userPrompt);
                break;
            case 'conversational':
            case 'ai':
                data = await getConversationalResponse(userPrompt);
                break;
            case 'query':
                data = await query(userPrompt);
                break;
            default: 
                data = `Function '${replyFunction}' does not exist.`;
        }
        res.json({ content: purify.sanitize(marked.parse(data)) });
    } catch (error) {
        console.error(`Error in function call '${replyFunction}': ${error.message || error}`);
        res.status(500).json({ message: "Failed to generate movie recommendations." });
    }
});
