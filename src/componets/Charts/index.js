import React from "react";
import { Line } from "@ant-design/charts";
import "./style.css";

const ChartComponent = ({ sortedTransaction }) => {
  const data = sortedTransaction.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  const config = {
    data,
    width: "100%",
    height: 400,
    autoFit: true,
    xField: "date",
    yField: "amount",
  };

  return (
    <div className="charts-wrapper">
      <div className="chart-container">
        <h1>Your Analytics</h1>
        <Line {...config} />
      </div>
    </div>
  );
};

export default ChartComponent;
