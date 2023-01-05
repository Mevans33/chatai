import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

// to use env variables
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create new instance
const openai = new OpenAIApi(configuration);

// initialize express app
const app = express();

//middlewares allow requests
app.use(cors());
// pass json from front end to backend
app.use(express.json());

// dummy root route
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Codex",
  });
});

// allow payload get data from body frontend request
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    //get response from open api (function that accepts object)
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // res send back to frontend
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

// always listening to new requests
app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
