import express from 'express';
import query from './queryMovieEmbeddings.js'
import { improveUserPrompts } from './improveUserPrompts.js';
import { getConversationalResponse } from './getConversationalResponse.js';
import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom';

const replyFunction = 'improve';
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const apiRouter = express.Router();

apiRouter.post('/', async (req, res) => {
    try {
        const { userPrompts } = req.body;

        // if (!userPrompts) {
        //     return res.status(400).json({ message: "userPrompt is required" });
        // }
        let data;
        switch (replyFunction.toLowerCase()) {
            case 'improve':
            case 'prompt':
            case 'user prompt':
                res.json(await improveUserPrompts(userPrompts));
                break;
            case 'conversational':
            case 'ai':
                data = await getConversationalResponse(userPrompts);
                data.aiResponse = purify.sanitize(marked.parse(data.aiResponse));
                res.json(data);
                break;
            case 'query':
                data = await query(userPrompts);
                data.queryResults = purify.sanitize(marked.parse(data.queryResults))
                res.json(data);
                break;
            default: 
                res.json({ error: `Function '${replyFunction}' does not exist.` });
        }
        
    } catch (error) {
        console.error(`Error in function call '${replyFunction}': ${error.message || error}`);
        res.status(500).json({ message: "Failed to generate movie recommendations." });
    }
});
