class CoinModel {
  baseUrl;

  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3'
  }
  
  loadCoins = async (page: number) => {
    let data = await fetch(`${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20r&page=${page}&sparkline=false`);
    let _json = await data.json().catch(()=>[]);


    let coins = await Promise.all(_json.map(async (coin : any) => {

      let graph = await fetch(`${this.baseUrl}/coins/${coin.id}/market_chart?vs_currency=usd&days=1`);
      let _gjson = await graph.json().catch(()=>[]);
      let prices = _gjson.prices;
      let mapped = prices.map((price: Array<number>) => {
        return {timestamp: price[0], value: price[1]};
      })

      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        graph_data: mapped
      }
    }))

    return coins
  }
}

module.exports = CoinModel