import OpenAI from 'openai';
import { createClient } from "@supabase/supabase-js";

/** OpenAI config */

// if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
export let openai;

try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (err) {
  console.log(err.message);
}


/** Supabase config */

const privateKey = process.env.SUPABASE_API_KEY;
// if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = process.env.SUPABASE_URL;
// if (!url) throw new Error(`Expected env var SUPABASE_URL`);
export let supabase;
try {
  supabase = createClient(url, privateKey);
} catch (err) {
  console.log(err.message)
}
