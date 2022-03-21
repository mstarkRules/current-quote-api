import express from "express";
import { callSelf } from "./services/callSelfApi";
import { getCurrent } from "./services/getCurrentQuote";
import { monitorQuote } from "./services/monitorQuote";
const cors = require("cors");

const app = express();
app.use(cors());

monitorQuote({ sourceCurrency: "BTC", targetCurrency: "BRL" });

callSelf();

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

const PORT = process.env.PORT || 8877;

app.listen(PORT, () => {
  console.log("listening port: " + PORT);
});
