import express from "express";
import { json } from "stream/consumers";
const cors = require("cors");

import current from "./api/awesome-current";

const app = express();
app.use(cors());

async function getCurrent(sourceCurrency: string, targetCurrency: string) {
  let conc = sourceCurrency + targetCurrency;

  try {
    const { data } = await current.get(
      `last/${sourceCurrency}-${targetCurrency}`
    );

    let formatedData = {
      sourceCurrency: data[conc].code,
      targetCurrency: data[conc].codein,
      name: data[conc].name,
      bid: data[conc].bid,
      ask: data[conc].ask,
      timestamp: data[conc].timestamp,
    };

    return formatedData;
  } catch (error) {
    console.log("erro ao buscar cotações: ", error);
  }
}

app.get(`/current/:source-:target`, async (req, res) => {
  const requestCurrent = await getCurrent(
    `${req.params.source}`,
    `${req.params.target}`
  );

  res.json({
    ...requestCurrent,
  });
});

app.get("/", (req, res) => {
  res.json({ msg: "all right" });
});

app.get("/contact", (req, res) => {
  res.json({
    name: "mstark",
    website: "https://mpamorim.dev.br/",
    contact: [
      {
        type: "github",
        link: "https://github.com/mstarkRules",
      },
      {
        type: "linkedin",
        link: "https://www.linkedin.com/in/marcos-paulo-amorim-b08228160/",
      },
    ],
  });
});

// getCurrent("usd", "BRL");

const PORT = process.env.PORT || 8877;

app.listen(PORT, () => {
  console.log("listening port: " + PORT);
});
