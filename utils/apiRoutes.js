import express from 'express';
import { getConversationalResponse, deleteChatHistory } from './getConversationalResponse.js';
import { improveUserPrompts, deleteUserPrompts } from './improveUserPrompts.js';
import query from './queryMovieEmbeddings.js'
import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom';

const replyFunction = 'improveUserPrompts';
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const apiRouter = express.Router();

apiRouter.get('/new', (req, res) => {
    deleteChatHistory();
    deleteUserPrompts();
})

apiRouter.post('/', async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ message: "userPrompt is required" });
    }

    let data;
    switch (replyFunction) {
        case 'improveUserPrompts':
            data = await improveUserPrompts(userPrompt);
            break;
        case 'getConversationalResponse':
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
