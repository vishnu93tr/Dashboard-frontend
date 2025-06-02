"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PassFailTrendChart from "@/components/PassfailTrendCharts";
import ExecutionTrendChart from "@/components/ExecutionTrendChart";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker";
import { format, subDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AverageDurationTrendChart from "@/components/AverageDurationTrendChart";
import Chatbot from "@/components/Chatbot"; // no need to pass onClose
import { Button } from "@/components/ui/button";

interface ExecutionPoint {
  date: string;
  execution_count: number;
}

interface PassFailData {
  date: string;
  passed: number;
  failed: number;
  pass_rate: number;
}

interface AvgDuration {
  date: string;
  avg_duration_seconds: number;
}

interface TestCaseData {
  name: string;
  status: string;
  duration_seconds: number;
  error_message: string | null;
}

export default function DashboardPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;

  const [execTrend, setExecTrend] = useState<ExecutionPoint[]>([]);
  const [passFail, setPassFail] = useState<PassFailData[]>([]);
  const [avgDurations, setAvgDurations] = useState<AvgDuration[]>([]);
  const [testCases, setTestCases] = useState<TestCaseData[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  useEffect(() => {
    axios.get(`${apiBase}/api/dashboard/projects`).then((res) => {
      setProjects(res.data.projects);
      if (res.data.projects.length > 0) {
        setSelectedProject(res.data.projects[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedProject || !dateRange.from || !dateRange.to) return;

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const from_date = format(dateRange.from ?? new Date(), "yyyy-MM-dd");
        const to_date = format(dateRange.to ?? new Date(), "yyyy-MM-dd");

        const [execsRes, passFailRes, durationsRes, testCasesRes] =
          await Promise.all([
            axios.get(`${apiBase}/api/dashboard/executions-per-project`, {
              params: { project_name: selectedProject, from_date, to_date },
            }),
            axios.get(`${apiBase}/api/dashboard/pass-fail-trend`, {
              params: { project_name: selectedProject, from_date, to_date },
            }),
            axios.get(`${apiBase}/api/dashboard/average-execution-durations-trend`, {
              params: { project_name: selectedProject, from_date, to_date },
            }),
            axios.get(`${apiBase}/api/dashboard/test-cases`, {
              params: { project_name: selectedProject, from_date, to_date },
            }),
          ]);

        setExecTrend(execsRes.data);
        setPassFail(passFailRes.data);
        setAvgDurations(durationsRes.data);
        setTestCases(testCasesRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedProject, dateRange]);

  return (
    <div className="p-6 space-y-6">
      {/* Top filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Select
          value={selectedProject}
          onValueChange={(val) => setSelectedProject(val)}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker
          date={dateRange}
          setDate={(val) => setDateRange(val as DateRange)}
        />
      </div>

      {/* Charts and tables */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Executions Trend</h2>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ExecutionTrendChart data={execTrend} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Pass/Fail Trend</h2>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <PassFailTrendChart data={passFail} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">
              Average Execution Duration Trend
            </h2>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <AverageDurationTrendChart data={avgDurations} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">
              Latest Executed Test Cases
            </h2>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Case</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration (s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((tc, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{tc.name}</TableCell>
                      <TableCell
                        className={
                          tc.status === "PASSED"
                            ? "text-green-600 font-medium"
                            : tc.status === "FAILED"
                            ? "text-red-600 font-medium"
                            : tc.status === "SKIPPED"
                            ? "text-yellow-500 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {tc.status}
                      </TableCell>
                      <TableCell>{tc.duration_seconds.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chatbot handles its own open/close logic */}
      <Chatbot />
    </div>
  );
}
