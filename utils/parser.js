const https = require('https');

exports.parser = async (req, res) => {
  console.log('data', data);
  const coin_gecko_uri = 'https://www.coingecko.com/en/overall_stats';
  const response = await fetch(coin_gecko_uri);
console.log(response)
  return response;
}