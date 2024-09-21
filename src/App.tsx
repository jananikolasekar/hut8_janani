import React, { useState } from "react";
import InputField from "./components/InputField";
import ResultCard from "./components/ResultCard";
import { InputData, ResultData } from "./types";

const App: React.FC = () => {
  const [inputData, setInputData] = useState<InputData>({
    hash_rate: "",
    power_consumption: "",
    electricity_cost: "",
    initial_investment: "",
  });

  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const {
      hash_rate,
      power_consumption,
      electricity_cost,
      initial_investment,
    } = inputData;

    const numericFields: { [key: string]: string } = {
      hash_rate,
      power_consumption,
      electricity_cost,
      initial_investment,
    };

    for (const [key, value] of Object.entries(numericFields)) {
      if (value.trim() === "" || isNaN(Number(value)) || Number(value) <= 0) {
        setError(
          `Please enter a valid positive number for ${key.replace("_", " ")}`
        );
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`https://gkm8nh-8000.csb.app/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hash_rate: Number(hash_rate),
          power_consumption: Number(power_consumption),
          electricity_cost: Number(electricity_cost),
          initial_investment: Number(initial_investment),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: ResultData = await response.json();

      // Optional: Validate response data structure
      if (
        typeof data.dailyCost !== "number" ||
        typeof data.monthlyCost !== "number" ||
        typeof data.yearlyCost !== "number" ||
        typeof data.dailyRevenueUSD !== "number" ||
        typeof data.monthlyRevenueUSD !== "number" ||
        typeof data.yearlyRevenueUSD !== "number" ||
        typeof data.dailyProfitUSD !== "number" ||
        typeof data.monthlyProfitUSD !== "number" ||
        typeof data.yearlyProfitUSD !== "number" ||
        typeof data.breakevenTimeline !== "number" ||
        typeof data.costToMine !== "number"
      ) {
        throw new Error("Invalid data format received from API");
      }

      setResult(data);
    } catch (err) {
      setError("An error occurred while fetching the data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center p-5">
      <h1 className="text-white text-3xl font-bold mb-6 text-center">
        Crypto Mining Cost Calculator
      </h1>
      <form
        onSubmit={handleSubmit}
        aria-labelledby="form-title"
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl"
      >
        <h2 id="form-title" className="text-xl font-semibold mb-4">
          Enter Your Mining Parameters
        </h2>
        {error && (
          <div className="text-red-500 mb-4" role="alert" tabIndex={-1}>
            {error}
          </div>
        )}
        <InputField
          label="Hash Rate (in TH/s)"
          id="hash_rate"
          name="hash_rate"
          value={inputData.hash_rate}
          onChange={handleChange}
        />
        <InputField
          label="Power Consumption (in W)"
          id="power_consumption"
          name="power_consumption"
          value={inputData.power_consumption}
          onChange={handleChange}
        />
        <InputField
          label="Electricity Cost (per kWh)"
          id="electricity_cost"
          name="electricity_cost"
          value={inputData.electricity_cost}
          onChange={handleChange}
        />
        <InputField
          label="Initial Investment (in USD)"
          id="initial_investment"
          name="initial_investment"
          value={inputData.initial_investment}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </form>

      {result && (
        <div className="mt-10 bg-white p-8 rounded-lg shadow-lg animate-fadeIn w-full max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-indigo-600 text-center">
            Calculation Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResultCard
              title="Daily Cost"
              value={`$${result.dailyCost.toFixed(2)}`}
              icon="💸"
              color="text-indigo-600"
            />
            <ResultCard
              title="Monthly Cost"
              value={`$${result.monthlyCost.toFixed(2)}`}
              icon="💰"
              color="text-indigo-600"
            />
            <ResultCard
              title="Yearly Cost"
              value={`$${result.yearlyCost.toFixed(2)}`}
              icon="📅"
              color="text-indigo-600"
            />
            <ResultCard
              title="Daily Revenue (USD)"
              value={`$${result.dailyRevenueUSD.toFixed(2)}`}
              icon="🔥"
              color="text-green-600"
            />
            <ResultCard
              title="Monthly Revenue (USD)"
              value={`$${result.monthlyRevenueUSD.toFixed(2)}`}
              icon="💵"
              color="text-green-600"
            />
            <ResultCard
              title="Yearly Revenue (USD)"
              value={`$${result.yearlyRevenueUSD.toFixed(2)}`}
              icon="💲"
              color="text-green-600"
            />
            <ResultCard
              title="Daily Profit (USD)"
              value={`$${result.dailyProfitUSD.toFixed(2)}`}
              icon="📈"
              color="text-green-600"
            />
            <ResultCard
              title="Monthly Profit (USD)"
              value={`$${result.monthlyProfitUSD.toFixed(2)}`}
              icon="💹"
              color="text-green-600"
            />
            <ResultCard
              title="Yearly Profit (USD)"
              value={`$${result.yearlyProfitUSD.toFixed(2)}`}
              icon="🤑"
              color="text-green-600"
            />
            <ResultCard
              title="Breakeven Timeline"
              value={`${result.breakevenTimeline.toFixed(2)} months`}
              icon="📆"
              color="text-blue-600"
            />
            <ResultCard
              title="Cost to Mine 1 BTC"
              value={`$${result.costToMine.toFixed(2)}`}
              icon="⛏️"
              color="text-red-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
