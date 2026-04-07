export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  region: string;
}

export interface MarketData {
  indices: MarketIndex[];
  lastUpdated: string;
}
