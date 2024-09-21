export interface InputData {
  hash_rate: string;
  power_consumption: string;
  electricity_cost: string;
  initial_investment: string;
}

export interface ResultData {
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  dailyRevenueUSD: number;
  monthlyRevenueUSD: number;
  yearlyRevenueUSD: number;
  dailyProfitUSD: number;
  monthlyProfitUSD: number;
  yearlyProfitUSD: number;
  breakevenTimeline: number;
  costToMine: number;
}
