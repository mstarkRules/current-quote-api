export async function getCurrentPercVariation(
  currencyValue: number,
  purchasedValue: number
) {
  let currentPerc = ((currencyValue - purchasedValue) * 100) / purchasedValue;
  console.log("quantosssss porcentos de valorização? ", currentPerc.toFixed(2));
}
