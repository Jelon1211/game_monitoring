"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  TooltipProps,
  Cell,
} from "recharts";

type GameBarChartProps = {
  data: { name: string; value: number }[] | null;
};

export default function GameBarChart({ data }: GameBarChartProps) {
  if (!data) {
    return;
  }

  const CustomBarChartTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-2 rounded-md shadow-md">
          <p className="font-bold">{payload[0].payload.name}</p>
          <p>
            Score:{" "}
            {payload[0].value ? payload[0].value.toLocaleString() : "error"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-20} textAnchor="end" interval={5} />
        <YAxis />
        <Tooltip content={<CustomBarChartTooltip />} />
        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
        <ReferenceLine y={0} stroke="#fff" />
        <Bar dataKey="value" fill="#82ca9d">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index % 2 === 0 ? "#4CAF50" : "#81C784"}
            />
          ))}
        </Bar>{" "}
      </BarChart>
    </ResponsiveContainer>
  );
}
