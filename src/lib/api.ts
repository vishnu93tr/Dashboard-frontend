import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export const fetchDashboardSummary = async (from: string, to: string) => {
  const res = await axios.get(`${API_BASE}/dashboard/summary`, {
    params: { from_date: from, to_date: to }
  });
  return res.data;
};
