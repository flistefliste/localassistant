import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { spawn } from "child_process";

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const llm = new ChatOllama({
  model: "llama3.1",
  temperature: 0,
  maxRetries: 2,
});

const summarizationPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant that summarize {input} in about 5-10 lines. DO NOT answer the question, just summarize.",
  ],
  ["human", "{input}"],
]);

const anonymizationPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Identify and replace all entities in the following text that are either 
persons, institutions, or places with a unique identifier throughout the 
entire text. This includes replacing both the full entity name and any 
partial occurrences of the name (e.g., replacing "Micky Mouse" and "Micky" 
with the same identifier).

Steps:

    * Identify all entities in the text that are classified as persons, or personal information like phone numbers, emails or Identification number.
    * Assign a unique identifier to each entity.
    * Replace every occurrence of the full name and any partial name with the corresponding identifier in the text.
    * Print the processed text with all entities replaced by their respective identifiers. Do NOT print the original text but only the processed version.
    * Provide a JSON-formatted list of all replaced entities as pairs, where each pair consists of the entity name and its corresponding identifier.

Example:

    Original text: "Micky Mouse is a character created by Walt Disney. His phone number is +1 312 3452 23"
    Processed text: "ENTITY_1 is a character created by ENTITY_2. His phone number is ENTITY_3"
    JSON output:

[
  {{"entity": "Micky Mouse", "identifier": "ENTITY_1"}},
  {{"entity": "Micky", "identifier": "ENTITY_1"}},
  {{"entity": "Walt Disney", "identifier": "ENTITY_2"}},
  {{"entity": "Walt", "identifier": "ENTITY_2"}}
  {{"entity": "+1 312 3452 23", "identifier": "ENTITY_3"}}
]`,
  ],
  ["human", "{input}"],
]);

app.post('/generate', (req, res) => {

    const prompt = req.body.prompt;
    const ollama = spawn('ollama', ['run', 'mistral']);
    let response = '';
    ollama.stdout.on('data', (data) => {
        response += data.toString();
    });
    ollama.stdin.write(prompt + '\n');
    ollama.on('close', () => {
        res.json({ response });
    });
    
});


app.post('/summarize', async (req, res) => {

    const prompt = req.body.prompt;
    const chain = summarizationPrompt.pipe(llm);
    const response = await chain.invoke({
        input: prompt,
    });
    console.log(response);
     res.json( {response: response.content } );
    
});

app.post('/anonymize', async (req, res) => {

    const prompt = req.body.prompt;
    const chain = anonymizationPrompt.pipe(llm);
    const response = await chain.invoke({
        input: prompt,
    });
    console.log(response);
     res.json( {response: response.content } );
    
});

app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
});