import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

app.get('/completions', (req, res) => {
  res.send('Welcome to the text completions server!');
});

app.post('/completions', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).send({ error: 'OpenAI API key is not configured.' });
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: req.body.systemPrompt || 'You are a helpful assistant.',
        },
        { role: 'user', content: req.body.userPrompt },
      ],
    }),
  };

  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options,
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while making the request.' });
  }
});

const PALM_API_KEY = process.env.REACT_APP_PALM_API_KEY;
const MODEL_NAME = 'models/text-bison-001';

const palmClient =
  typeof PALM_API_KEY === 'string' && PALM_API_KEY.trim() !== ''
    ? new TextServiceClient({
        authClient: new GoogleAuth().fromAPIKey(PALM_API_KEY),
      })
    : null;

app.get('/generate-text', (req, res) => {
  res.send('Welcome to the generation-text server!');
});

app.post('/generate-text', async (req, res) => {
  if (!palmClient) {
    return res.status(500).json({ error: 'PaLM API key is not configured.' });
  }

  const { prompt } = req.body ?? {};

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const result = await palmClient.generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
