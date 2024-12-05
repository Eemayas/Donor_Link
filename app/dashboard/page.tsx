/** @format */
"use client";
import { FormEvent, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as GoogleChart } from "react-google-charts";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  Tooltip,
  LineElement,
  PointElement,
  PieController,
  ArcElement,
  BarController,
  LineController,
} from "chart.js";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as Tp,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { loactionData } from "./constant";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

// Register all necessary chart components
Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  Tooltip,
  LineElement,
  PointElement,
  PieController,
  ArcElement,
  BarController,
  LineController,
);

interface BloodTypeDistribution {
  "A+": number;
  "A-": number;
  "B+": number;
  "B-": number;
  "AB+": number;
  "AB-": number;
  "O+": number;
  "O-": number;
}

interface City {
  city_name: string;
  population: BloodTypeDistribution;
  accident: Record<string, number>;
  blood_needed: Record<string, BloodTypeDistribution>;
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] =
    useState<keyof (typeof loactionData)[0]["blood_needed"]>("January");
  const [selectedCity, setSelectedCity] = useState(loactionData[0].city_name); // Default to first city
  const [accidentData, setAccidentData] = useState<any[]>([]);
  const [populationData, setpopulationData] = useState<any[]>([]);

  useEffect(() => {
    // Find selected city data
    const displayCityName = loactionData.find(
      (city) => city.city_name === selectedCity
    );

    if (displayCityName) {
      // Helper function to render charts
      const renderChart = (ctx: CanvasRenderingContext2D, config: any) => {
        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
          existingChart.destroy();
        }

        return new Chart(ctx, config);
      };

      // Convert the accident data into an array for recharts
      const formattedAccidentData = Object.keys(displayCityName.accident).map(
        (month) => ({
          month: month,
          accidents:
            displayCityName.accident[
              month as keyof typeof displayCityName.accident
            ],
        })
      );
      setAccidentData(formattedAccidentData);

      const formattedPopulationData = Object.keys(
        displayCityName.population
      ).map((populationData) => ({
        populationData: Object.keys(populationData),
        accidents:
          displayCityName.population[
            populationData as keyof typeof displayCityName.population
          ],
      }));
      setpopulationData(formattedPopulationData);

      const pieChartData = {
        labels: Object.keys(
          displayCityName.blood_needed[
            selectedMonth as keyof typeof displayCityName.blood_needed
          ]
        ),
        datasets: [
          {
            data: Object.values(displayCityName.blood_needed[selectedMonth]),
            backgroundColor: [
              "#FF9999",
              "#FF6666",
              "#FF3333",
              "#FF0000",
              "#990000",
              "#CC3333",
              "#FF3300",
              "#FF6600",
            ],
          },
        ],
      };
      setData(pieChartData);

      // Population Chart
      const populationCtx = document.getElementById(
        "populationChart"
      ) as HTMLCanvasElement | null;

      if (populationCtx) {
        // Set width and height to 100% to fill the parent container
        populationCtx.style.width = "100%";
        populationCtx.style.height = "100%";

        const populationData = displayCityName.population;

        renderChart(populationCtx.getContext("2d")!, {
          type: "bar",
          data: {
            labels: Object.keys(populationData),
            datasets: [
              {
                label: "Blood Type Distribution (Population)",
                data: Object.values(populationData),
                backgroundColor: [
                  "#FF9999",
                  "#FF6666",
                  "#FF3333",
                  "#FF0000",
                  "#990000",
                  "#CC3333",
                  "#FF3300",
                  "#FF6600",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { position: "top" } },
          },
        });
      }
    }
  }, [selectedMonth, selectedCity]);

  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true, // Show tooltip on hover
      },
      legend: {
        position: "top" as const,
      },
      datalabels: {
        display: false, // Disable data labels in the middle
      },
    },
    cutout: "50%", // Controls the size of the hole in the middle (set higher to show only the boundary)
  };

  return (
    <div className="p-8 pt-28 ">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto flex flex-col items-center"
      >
        Blood Donation Dashboard{" "}
        <>
          <Highlight className="text-black dark:text-white w-fit ">
            {selectedCity}
          </Highlight>
        </>
      </motion.h1>

      <div className="flex mt-4 w-full mx-auto justify-center gap-6">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="mb-4 p-2 border rounded w-56"
        >
          {loactionData.map((city) => (
            <option key={city.city_name} value={city.city_name}>
              {city.city_name}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              e.target.value as keyof (typeof loactionData)[0]["blood_needed"]
            )
          }
          className="mb-4 p-2 border rounded w-56"
        >
          {Object.keys(loactionData[0].blood_needed).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-11">
        <div className="bg-white p-4 shadow-md rounded-md max-h-[500px] w-96 flex flex-col gap-6">
          <Highlight className="text-black dark:text-white w-full mx-auto text-center ">
            Blood Type Distribution (Population)
          </Highlight>
          <canvas id="populationChart" className="max-h-full"></canvas>
        </div>

        <div className="bg-white p-4 shadow-md rounded-md max-h-[500px] min-w-[500px] flex flex-col gap-6">
          <Highlight className="text-black dark:text-white w-full mx-auto text-center ">
            Accident Distribution
          </Highlight>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={accidentData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tp />
              <Area
                type="monotone"
                dataKey="accidents"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow-md rounded-md max-h-[500px] min-w-[500px] flex flex-col gap-6">
          <Highlight className="text-black dark:text-white w-full mx-auto text-center ">
            Blood Type Distribution (Month)
          </Highlight>
          {data && <Pie data={data} options={pieChartOptions} />}
        </div>

        <div className="bg-white p-4 shadow-md rounded-md max-h-[500px] min-w-[500px] flex flex-col gap-6">
          <Highlight className="text-black dark:text-white w-full mx-auto text-center ">
            Blood Demand Prediction
          </Highlight>
          <DemandPredictionForm />
        </div>

        <div className="bg-white p-4 shadow-md rounded-md max-h-[500px] min-w-[500px] flex flex-col gap-6">
          <Highlight className="text-black dark:text-white w-full mx-auto text-center ">
            Blood Supply Prediction
          </Highlight>
          <SupplyPredictionForm />
        </div>
      </div>
    </div>
  );
}

const DemandPredictionForm = () => {
  const [prediction, setPrediction] = useState<number | null>(); // Change to string
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [years, setYears] = useState<string>(""); // Change to string
  const [months, setMonths] = useState<string>(""); // Change to string
  const [yearsError, setYearsError] = useState<string>("");
  const [monthsError, setMonthsError] = useState<string>("");


  const options = {
    title: "Line Chart Example",
    hAxis: { title: "Time" },
    vAxis: { title: "Popularity" },
    legend: "none",
  };
  // Validate years input
  const validateYears = (value: string) => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue) || numericValue < 0) {
      setYearsError("Years cannot be negative.");
    } else {
      setYearsError("");
    }
  };

  // Handle years input change
  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYears(value);
    validateYears(value);
  };

  // Handle months input change
  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonths(value);
  };

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    setIsSubmitting(true);
    event.preventDefault();
    console.log("Years:", years.split(","));
    console.log("Months:", months.split(","));

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict_demand_values",
        {
          method: "POST", // Changed to 'POST' to include the body
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            yearly_demands: years.split(",").map(Number),
            monthly_demands: months.split(",").map(Number),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result["prediction"][0]);
      console.log({ result, flat: result["prediction"][0] });
      console.log("Prediction result:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    console.log({ prediction });
  }, [prediction]);

    // Process the data
    const chartData =[["number","pred"] ,...months
    .split(",")
    .map(Number)
    .map((data, index) => ([
      index + 1,
      data,
    ]))];

  console.log(chartData);
  return (
    <>
      {" "}
      <form
        className="space-y-4 max-w-sm mx-auto p-4 border rounded"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-2">
          <label
            htmlFor="years"
            className="block text-sm font-medium text-gray-700"
          >
            Years
          </label>
          <input
            id="years"
            type="text"
            name="years"
            value={years}
            onChange={handleYearsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Enter years (e.g., 4)"
          />
          {yearsError && (
            <span className="text-red-500 text-sm">{yearsError}</span>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="months"
            className="block text-sm font-medium text-gray-700"
          >
            Months
          </label>
          <input
            id="months"
            type="text" // Change type to text to maintain string value
            name="months"
            value={months}
            onChange={handleMonthsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Enter months (e.g., 6)"
          />
          {monthsError && (
            <span className="text-red-500 text-sm">{monthsError}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      {isSubmitting && !prediction ? <p>Loading........</p> : ""}
      { months && (
  < GoogleChart
  chartType="LineChart"
  width="100%"
  height="400px"
  data={chartData}
  options={options}
/>
)}

    </>
  );
};
const SupplyPredictionForm = () => {
  const [prediction, setPrediction] = useState<number>(0); // Change to string
  const [years, setYears] = useState<string>(""); // Change to string
  const [months, setMonths] = useState<string>(""); // Change to string
  const [yearsError, setYearsError] = useState<string>("");
  const [monthsError, setMonthsError] = useState<string>("");

  // Validate years input
  const validateYears = (value: string) => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue) || numericValue < 0) {
      setYearsError("Years cannot be negative.");
    } else {
      setYearsError("");
    }
  };

  // Handle years input change
  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYears(value);
    validateYears(value);
  };

  // Handle months input change
  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonths(value);
  };

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    console.log("Years:", years.split(","));
    console.log("Months:", months.split(","));

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict_supply_values",
        {
          method: "POST", // Changed to 'POST' to include the body
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            yearly_supplies: years.split(",").map(Number),
            monthly_supplies: months.split(",").map(Number),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result["prediction"][0]);
      console.log({ result, flat: result["prediction"][0] });
      console.log("Prediction result:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    console.log({ prediction });
  }, [prediction]);

  return (
    <>
      {" "}
      <form
        className="space-y-4 max-w-sm mx-auto p-4 border rounded"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-2">
          <label
            htmlFor="years"
            className="block text-sm font-medium text-gray-700"
          >
            Years
          </label>
          <input
            id="years"
            type="text"
            name="years"
            value={years}
            onChange={handleYearsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Enter years (e.g., 4)"
          />
          {yearsError && (
            <span className="text-red-500 text-sm">{yearsError}</span>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="months"
            className="block text-sm font-medium text-gray-700"
          >
            Months
          </label>
          <input
            id="months"
            type="text" // Change type to text to maintain string value
            name="months"
            value={months}
            onChange={handleMonthsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Enter months (e.g., 6)"
          />
          {monthsError && (
            <span className="text-red-500 text-sm">{monthsError}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      {prediction}
    </>
  );
};
