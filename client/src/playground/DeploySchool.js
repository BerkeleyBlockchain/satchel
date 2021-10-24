const axios = require("axios");

async function getData() {
  const prices = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    {
      params: {
        start: "1",
        limit: "5000",
        convert: "USD",
      },
      headers: {
        "X-CMC_PRO_API_KEY": "269afcb3-0eae-4f2c-ba61-56e04d617ff8",
      },
    }
  );

  console.log(prices.data);
}

getData();
