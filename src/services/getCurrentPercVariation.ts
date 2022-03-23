interface CurrentVariationProps {
  currencyValue: number;
  purchasedValue: number;
}
export async function getCurrentPercVariation(currency: CurrentVariationProps) {
  let currentPerc =
    ((currency.currencyValue - currency.purchasedValue) * 100) /
    currency.purchasedValue;

  console.log("quantosssss porcentos de valorização? ", currentPerc.toFixed(2));

  return currentPerc.toFixed(2);
}
