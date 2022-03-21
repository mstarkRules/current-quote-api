import axios from "axios";

const fetch = axios.create({
  baseURL: "http://current-quote-api.herokuapp.com/current/BTC-BRL",
});

export async function callSelf() {
  setInterval(async () => {
    const { data } = await fetch(
      "http://current-quote-api.herokuapp.com/current/BTC-BRL"
    );

    console.log("dados do self: ", data);
  }, 1000 * 60 * 14);
}
