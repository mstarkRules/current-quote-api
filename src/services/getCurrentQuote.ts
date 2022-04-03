import current from "../api/awesome-current";

interface CurrencyProps {
  sourceCurrency: string;
  targetCurrency: string;
}

export async function getCurrent(currency: CurrencyProps) {
  let conc = currency.sourceCurrency;

  try {
    const { data } = await current.get(
      `last/${currency.sourceCurrency}-${currency.targetCurrency}`
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
