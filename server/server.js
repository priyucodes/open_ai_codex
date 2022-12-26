import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({ message: 'CodeX is alive!' });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // codex model is capable for generate code but GPT-3 is capable to generate code as well as text(higher quality output)
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      // higher means model will tkae more risk to find answers
      temperature: 0,
      max_tokens: 3000, // how long responses
      top_p: 0.5, // doesnt repeat similar sentences often
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

// https://www.npmjs.com/package/colors
const server = app.listen(5000, () => {
  console.log(
    `Server is running on ${
      server.address().address === '::'
        ? 'http://localhost:'
        : 'https://codex-5dg7.onrender.com'
    }${process.env.PORT || 5000} PORT`
  );
});
