import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function LineChart({ onChange, chartData, options }) {
  return <Line onChange={onChange} data={chartData} options={options} />;
}

export default LineChart;
