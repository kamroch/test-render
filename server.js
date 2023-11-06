import express, { json } from 'express';
import cors from 'cors';
const app = express();
import * as dotenv from "dotenv"
const port = process.env.PORT;

import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
dotenv.config()

app.use(cors());
app.use(json());

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

app.get('/', (req, res) => {
    res.send('Welcome to the text generation server!');
});

app.get('/completions', (req, res) => {
    res.send('Welcome to the text completions server!');
});
app.post('/completions', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model:"gpt-3.5-turbo-16k"  ,
            messages: [
                { role: "system", content: req.body.inputTextt },
                { role: "user", content: req.body.inputText }, // Change to inputText
               
                ],
               
           })
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while making the request." });
    }
});

const API_KAY = process.env.REACT_APP_PALM_API_KEY;

const MODEL_NAME = "models/text-bison-001";


const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KAY),
});
app.get('/generate-text', (req, res) => {
    res.send('Welcome to the generation-text server!');
});
app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await client.generateText({
            model: MODEL_NAME,
            prompt: {
                text: prompt,
            },
        });
        res.setHeader('Content-Type', 'application/json');

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

