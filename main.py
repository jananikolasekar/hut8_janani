from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import requests

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

SECONDS_A_DAY = 86400

class MiningInput(BaseModel):
    hash_rate: float
    power_consumption: float
    electricity_cost: float
    initial_investment: float

def calculate_profitability(
    hash_rate, power_consumption, electricity_cost, initial_investment
):
    # Get current Bitcoin price and network difficulty
    block_reward = 3.125
    btc_price = requests.get(
        "https://api.coindesk.com/v1/bpi/currentprice/BTC.json"
    ).json()["bpi"]["USD"]["rate_float"]
    network_difficulty = requests.get("https://blockchain.info/q/getdifficulty").json()

    #  Calculation logic (simplified)
    hashes_per_secons = hash_rate * (10**12)
    btc_mined_per_day = (block_reward * SECONDS_A_DAY * hashes_per_secons) / (
        network_difficulty * (2**32)
    )
    btc_mined_per_month = btc_mined_per_day * 30
    monthly_income = btc_mined_per_month * btc_price
    monthly_cost = (power_consumption * 24 * 30 / 1000) * electricity_cost
    monthly_pl = monthly_income - monthly_cost
    breakeven_timeline = initial_investment / monthly_pl

    return {
        "dailyCost": round(monthly_cost/30, 2),
        "monthlyCost": round(monthly_cost, 2),
        "yearlyCost": round(monthly_cost * 12, 2),
        "dailyRevenueUSD": round(btc_mined_per_day * btc_price, 8),
        "monthlyRevenueUSD": round(btc_mined_per_month * btc_price, 8),
        "yearlyRevenueUSD": round(btc_mined_per_day * 365 * btc_price, 8),
        "dailyRevenueBTC": round(btc_mined_per_day, 8),
        "monthlyRevenueBTC": round(btc_mined_per_month, 8),
        "yearlyRevenueBTC": round(btc_mined_per_day * 365, 8),
        "dailyProfitUSD": round((btc_mined_per_day * btc_price) - (monthly_cost/30), 8),
        "monthlyProfitUSD": round((btc_mined_per_month * btc_price) - (monthly_cost), 8),
        "yearlyProfitUSD": round((btc_mined_per_day * 365 * btc_price) - (monthly_cost * 12), 8),
        "breakevenTimeline": round(breakeven_timeline, 2), 
        "costToMine": round((1 / btc_mined_per_day) * (monthly_cost/30), 2)
    }

@app.post("/calculate")
def calculate(mining_input: MiningInput):
    print(mining_input)
    try:
        profitability = calculate_profitability(
            mining_input.hash_rate,
            mining_input.power_consumption,
            mining_input.electricity_cost,
            mining_input.initial_investment,
        )
        return profitability
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
