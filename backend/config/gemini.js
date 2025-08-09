// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openaiConfig = {
//   model: "gpt-4o-mini",
//   maxTokens: 4000,
//   temperature: 0.7
// };

// module.exports = { openai, openaiConfig };
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);


const geminiConfig = {
  apiKey: process.env.API_KEY,   
  model: "gemini-2.0-flash", 
  maxTokens: 4000,
  temperature: 0.7
};
module.exports = { genAI, geminiConfig };
