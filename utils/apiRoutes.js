import express from 'express';
import query from './queryMovieEmbeddings.js';
import { improveUserPrompts } from './improveUserPrompts.js';
import { getConversationalResponse } from './getConversationalResponse.js';
import { marked } from "marked";

export const apiRouter = express.Router();

apiRouter.post('/', async (req, res) => {
    try {
        // Extract replyFunction from request body, default to 'conversational'
        const { userPrompts, replyFunction = 'improve' } = req.body;

        if (!userPrompts || !Array.isArray(userPrompts) || userPrompts.length === 0) {
            return res.status(400).json({ error: "userPrompts array is required and cannot be empty." });
        }

        let data;
        switch (replyFunction.toLowerCase()) {
            case 'improve':
            case 'prompt':
            case 'user prompt':
                data = await improveUserPrompts(userPrompts);
                res.json(data);
                break;
            case 'conversational':
            case 'ai':
                data = await getConversationalResponse(userPrompts);
                if (data?.aiResponse) {
                    data.aiResponse = marked.parse(data.aiResponse);
                }
                res.json(data);
                break;
            case 'query':
                data = await query(userPrompts);
                if (data?.queryResults) {
                    data.queryResults = marked.parse(data.queryResults);
                }
                res.json(data);
                break;
            default: 
                res.status(400).json({ error: `Function '${replyFunction}' does not exist.` });
        }
        
    } catch (error) {
        console.error(`Error in API route: ${error.message || error}`);
        res.status(500).json({ error: "Failed to generate movie recommendations." });
    }
});