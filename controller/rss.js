const { success, fail, validation } = require('../common/response');
const { parse } = require('node-html-parser');
const fetch = require('node-fetch');
const Parser = require('rss-parser');

const CoinGecko = require('coingecko-api');
const medium = require('@giuseppecampanelli/medium-api')

exports.fetchMarket = async (req, res) => {
  const CoinGeckoClient = new CoinGecko();
  let overall = {};

  const get_data = async url => {
    try {
      // const response = await fetch(url, { method: 'GET' });
      let dataCoins = await CoinGeckoClient.coins.list();
      let coinCount = dataCoins.data.length;

      let dataExchange = await CoinGeckoClient.exchanges.list();
      let exchangesCount = dataExchange.data.length;

      // let data = await CoinGeckoClient.global();
      // let data = await CoinGeckoClient.coins.fetchMarketChart('bitcoin', {'vs_currency':'usd', 'days': 'max'} );
      // 0x contract address (as a test)
let zrx = '0xe41d2489571d322189246dafa5ebde1f4699f498';
let data = await CoinGeckoClient.coins.fetchCoinContractMarketChart(zrx);


console.log('exchangesCount', exchangesCount)

console.log(data)
let market_cap_percentage = data.data.data.market_cap_change_percentage_24h_usd;
      let btcDominance = data.data.data.market_cap_percentage.btc;
      let ethDominance = data.data.data.market_cap_percentage.eth;
      console.log(market_cap_percentage, btcDominance, ethDominance)
      // const response = await fetch(url, {
      //   headers: {
      //     'Content-Security-Policy': 'script-src cdnjs.cloudflare.com',
      //     'Cache-Control': 'no-cache, must-revalidate'
      //   }
      // });
      const html = await response.text();
      const root = parse(html);
      const body = root.querySelector('.tw-flex').text;

      let toArr = body.split("\n");
      toArr = toArr.filter(e => e !== '' && e !== ' ');
      toArr = JSON.parse(JSON.stringify(toArr));

      return {
        coins:  toArr[0].split(' ')[1],
        exchanges:  toArr[1].split(' ')[1],
        marketCap: toArr[3],
        marketUpdatePercentage: toArr[4],
        vol24h: toArr[6],
        dominance: {
          btc: toArr[8].split(' ')[1],
          eth: toArr[9].split(' ')[1]
        },
        ethGas: {
          gasAverage: toArr[20],
          gasFee: {
            fast: toArr[11],
            standard: toArr[13],
            safe: toArr[15]
          }
        }
      };
    } catch (error) {
      console.log(error);
      res.status(500).json(fail('Something went wrong', res.statusCode));
    }
  };

  // overall = await get_data('https://www.coingecko.com/en/overall_stats');
  overall = await get_data('https://api.coingecko.com/api/v3/coins/lists');

  let currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  try {
    const [btc, eth, bnb, dapp, ace] = await Promise.all([
      CoinGeckoClient.coins.fetch('bitcoin', {}),
      CoinGeckoClient.coins.fetch('ethereum', {}),
      CoinGeckoClient.coins.fetch('binancecoin', {}),
      CoinGeckoClient.coins.fetch('dappstore', {}),
      CoinGeckoClient.coins.fetch('acent', {})
    ]);

    let coinsObj = {
      btc: {
        name: 'btc',
        current_price: currency.format(btc.data.market_data.current_price.usd),
        price_change_percentage_24h: Math.round(btc.data.market_data.price_change_percentage_24h * 100) / 100,
        images: btc.data.image,
        url: ''
      },
      eth: {
        name: 'eth',
        current_price: currency.format(eth.data.market_data.current_price.usd),
        price_change_percentage_24h: Math.round(eth.data.market_data.price_change_percentage_24h * 100) / 100,
        images: eth.data.image,
        url: ''
      },
      bnb: {
        name: 'bnb',
        current_price: currency.format(bnb.data.market_data.current_price.usd),
        price_change_percentage_24h: Math.round(bnb.data.market_data.price_change_percentage_24h * 100) / 100,
        images: bnb.data.image,
        url: ''
      },
      dapp: {
        name: 'dappx',
        current_price: currency.format(dapp.data.market_data.current_price.usd),
        price_change_percentage_24h: Math.round(dapp.data.market_data.price_change_percentage_24h * 100) / 100,
        images: dapp.data.image,
        url: ''
      },
      ace: {
        name: 'ace',
        current_price: currency.format(ace.data.market_data.current_price.usd),
        price_change_percentage_24h: Math.round(ace.data.market_data.price_change_percentage_24h * 100) / 100,
        images: ace.data.image,
        url: ''
      }
    };

    let coins = Object.keys(coinsObj).map(key => {
      return coinsObj[key];
    });

    res.status(201).json(success('OK', { data: { overall, coins } }, res.statusCode));
  } catch (error) {
    console.log(error)
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};

exports.fetchNews = async (req, res) => {
  const start = parseInt(req.query.start) || 0;
  const end = parseInt(req.query.end) || 3;

  let ctParser = new Parser({
    timeout: 2000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36'
    }
  });

  let mParser = new Parser({
    timeout: 2000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36'
    }
  });

  try {
    let ctFeed = await ctParser.parseURL('https://cointelegraph.com/feed');
    // let mFeed = await mParser.parseURL('https://medium.com/@dappstore333/latest?format=json');
    let mFeed = await medium.profile.getRecentPosts('dappstore333').then(res => {
      return res;
    });

    // regex kr character
    const re = /[\u3131-\uD79D]/ugi;

    // mFeed = mFeed.items;
    const newArr = mFeed.flatMap((item) => {
      // console.log(item.categories)
      // const feed =  !item.title.match(re) ? item : [];
      const feed =  item.categories.includes('announcements-en') ? item : [];
      // if (!item.title.match(re)) {
      //   return item;
      // }
      return feed;
    })

    let cointelegraphFeed = ctFeed.items.slice(start, end);
    let mediumFeed = newArr.slice(start, end);

    res.status(201).json(success('OK', { data: { cointelegraphFeed, mediumFeed } }, res.statusCode));
  } catch (error) {
    console.log(error)
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};