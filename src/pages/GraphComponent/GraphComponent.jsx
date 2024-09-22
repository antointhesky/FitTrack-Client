import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function GraphComponent({ data, timeframe }) {
  // Prepare the labels and dataset for the graph
  const labels = data.map((item) => item.date); // Assuming each item has a 'date' field
  const values = data.map((item) => item.total_calories); // Assuming each item has 'total_calories'

  // Graph configuration
  const chartData = {
    labels,
    datasets: [
      {
        label: `Calories Burned (${timeframe})`,
        data: values,
        fill: false,
        borderColor: "#4caf50",
        backgroundColor: "#4caf50",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Calories Burned Over Time",
      },
    },
  };

  return (
    <div className="graph-container">
      <Line data={chartData} options={options} />
    </div>
  );
}
