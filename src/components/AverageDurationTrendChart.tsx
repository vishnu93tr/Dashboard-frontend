"use client";

import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AvgDurationTrendData {
  date: string;
  avg_duration_seconds: number;
}

export default function AverageDurationTrendChart({
  data,
}: {
  data: AvgDurationTrendData[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis label={{ value: "Duration (s)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="avg_duration_seconds"
          stroke="#10b981" // Tailwind emerald
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
