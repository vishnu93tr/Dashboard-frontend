"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PassFailData {
  date: string;
  passed: number;
  failed: number;
}

export default function PassFailTrendChart({ data }: { data: PassFailData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="passed" fill="#22c55e" name="Passed" />
        <Bar dataKey="failed" fill="#ef4444" name="Failed" />
      </BarChart>
    </ResponsiveContainer>
  );
}
