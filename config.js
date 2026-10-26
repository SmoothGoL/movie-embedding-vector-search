import OpenAI from 'openai';
import { createClient } from "@supabase/supabase-js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable.");
}
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai2 = new OpenAI({
  apiKey: process.env.SECONDARY_AI_KEY,
  baseURL: process.env.SECONDARY_AI_URL,
})

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_API_KEY environment variables.");
}
export const supabase = createClient(supabaseUrl, supabaseKey);
