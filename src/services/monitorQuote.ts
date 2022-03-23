import { getCurrent } from "./getCurrentQuote";
import axios from "axios";
require("dotenv/config");

interface CurrencyProps {
  sourceCurrency: string;
  targetCurrency: string;
  perc: number;
}
const notificationFetch = axios.create();

//function to send discord notification
async function sendNotification(message: string) {
  let url = process.env.DISCORD_WEBHOOK_URL;

  let my_data = {
    content: message,
  };

  try {
    const disc = await notificationFetch({
      url: url,
      method: "POST",
      data: my_data,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("discord error: ", error);
  }
}

//checks if params sent corresponds to the current quote
async function verifyParams(
  currencyValue: number,
  perc: number,
  purchasedValue: number
) {
  //takes the perc sent in the params and sets the correspondig value, in BRL, from the purshased value
  let percAmount = (purchasedValue * perc) / 100;

  //checks the variation of currency perc from the purchased amount
  let currentPerc = ((currencyValue - purchasedValue) * 100) / purchasedValue;
  console.log("valor da porc do valor comprado: ", percAmount);
  console.log("quantos porcentos de valorização? ", currentPerc.toFixed(2));

  let sum = percAmount + purchasedValue;
  console.log("valore comprado: ", purchasedValue);
  console.log("valor da cotação atual: ", currencyValue);
  console.log("valor da porcentagem + valor comprado: ", sum);

  //checks if the purshased amount added to the percentage variation
  //  is greater than desired percentage
  // if (currencyValue >= percAmount + purchasedValue) {
  //   return currentPerc;
  // }

  //return the percentage for each [x percentage - must be greater than 0] of variation
  if (Math.trunc(currentPerc) !== 0 && Math.trunc(currentPerc) % perc == 0) {
    return currentPerc;
  }

  return false;
}
//variable that will store the last value of percentage variation
let last: any;
export var purchasedData: any;

export async function monitorQuote(currency: CurrencyProps) {
  purchasedData = await getCurrent({
    sourceCurrency: currency.sourceCurrency,
    targetCurrency: currency.targetCurrency,
  });

  let purchasedValue = parseFloat(purchasedData?.bid);

  //interval of percentage to check variation
  const perc = currency.perc;

  //get currency quote each interval
  setInterval(async () => {
    let currencyQuote = await getCurrent({
      sourceCurrency: currency.sourceCurrency,
      targetCurrency: currency.targetCurrency,
    });

    //get the current currency quote
    let currencyValue = parseFloat(currencyQuote?.bid);
    let timestampToDate = new Date(currencyQuote?.timestamp * 1000);

    let day = timestampToDate.getDate();
    let month = timestampToDate.getMonth();
    let year = timestampToDate.getFullYear();

    let hours = timestampToDate.getHours();
    let minutes = timestampToDate.getMinutes();
    let seconds = timestampToDate.getSeconds();

    let createdAtFormated =
      hours +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");

    const verify = await verifyParams(currencyValue, perc, purchasedValue);

    let isAppreciating = currencyValue > purchasedValue;

    //checks if desired percentage variation has been reached and sends a single notification
    if (verify) {
      if (Math.trunc(verify) !== Math.trunc(last)) {
        const discordMessage = await sendNotification(
          `Sua moeda (+ % ${currencyQuote?.sourceCurrency}) ${
            isAppreciating ? "valorizou" : "desvalorizou "
          } ` +
            verify.toFixed(2) +
            "%. Valor atual, em " +
            currencyQuote?.targetCurrency +
            ", de: " +
            currencyValue +
            ". Atualizado em: " +
            day +
            "/" +
            month +
            "/" +
            year +
            " às " +
            createdAtFormated.padStart(2, "0")
        );
      }

      //update last value with the new percentage value
      last = verify;

      console.log("porcentagem nova: ", last);
    }

    console.log("valorizou os " + perc + "%? ", verify);
    console.log("atualizado em: " + createdAtFormated);
  }, 1000 * 20);
  return purchasedValue;
}
