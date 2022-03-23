import express from "express";
import { callSelf } from "./services/callSelfApi";
import { getCurrentPercVariation } from "./services/getCurrentPercVariation";
import { getCurrent } from "./services/getCurrentQuote";
import { monitorQuote, purchasedData } from "./services/monitorQuote";
const cors = require("cors");

const app = express();
app.use(cors());

async function getMonitorQuote(perc: number) {
  const testing = await monitorQuote({
    sourceCurrency: "BTC",
    targetCurrency: "BRL",
    perc: perc,
  });

  console.log("veio o valor comprado: ", testing);
}

//route to set percentage to monitore
const createQuoteMonitoring = app.get(`/create/:perc`, (req, res) => {
  getMonitorQuote(parseFloat(req.params.perc));
});

const getCurrentVariation = app.get("/variation", async (req, res) => {
  const purchased = purchasedData;
  const requestCurrent = await getCurrent({
    sourceCurrency: purchased.sourceCurrency,
    targetCurrency: purchased.targetCurrency,
  });

  const variation = await getCurrentPercVariation({
    currencyValue: requestCurrent?.bid,
    purchasedValue: purchased.bid,
  });

  res.json({
    purchasedValue: purchased.bid,
    currentValue: requestCurrent?.bid,
    variation: variation,
  });

  console.log("olha a variação: ", variation);
});

const getCurrentQuote = app.get(
  `/current/:source-:target`,
  async (req, res) => {
    const requestCurrent = await getCurrent({
      sourceCurrency: req.params.source,
      targetCurrency: req.params.target,
    });

    res.json({
      ...requestCurrent,
    });
  }
);

app.get("/", (req, res) => {
  res.json({ msg: "all right" });
});

const getContact = app.get("/contact", (req, res) => {
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

getMonitorQuote(1);

callSelf();
const PORT = process.env.PORT || 8877;

app.listen(PORT, () => {
  console.log("listening port: " + PORT);
});
