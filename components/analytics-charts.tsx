"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format } from "date-fns";

type Click = {
  id: string;
  timestamp: Date;
  browser: string | null;
  os: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  referrer: string | null;
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export function AnalyticsCharts({ clicks }: { clicks: Click[] }) {
  // Process data for Line Chart (Clicks over time)
  const clicksByDate = clicks.reduce(
    (acc, click) => {
      const date = format(new Date(click.timestamp), "MMM dd");

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const lineChartData = Object.entries(clicksByDate).map(([date, count]) => ({
    date,
    count,
  }));

  // Process data for Pie Charts
  const getPieData = (key: keyof Click) => {
    const counts = clicks.reduce(
      (acc, click) => {
        const value = (click[key] as string) || "Unknown";

        acc[value] = (acc[value] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const browserData = getPieData("browser");
  const deviceData = getPieData("device");
  const countryData = getPieData("country");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="col-span-1 md:col-span-2 border-none shadow-sm bg-content1">
        <CardHeader className="font-bold text-lg">Clicks Over Time</CardHeader>
        <CardBody className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid stroke="#3f3f46" strokeDasharray="3 3" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="date"
                dy={10}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Line
                activeDot={{ r: 6, strokeWidth: 0 }}
                dataKey="count"
                dot={{ fill: "#006FEE", strokeWidth: 2 }}
                stroke="#006FEE"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card className="border-none shadow-sm bg-content1">
        <CardHeader className="font-bold text-lg">Browsers</CardHeader>
        <CardBody className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={browserData}
                dataKey="value"
                fill="#8884d8"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {browserData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card className="border-none shadow-sm bg-content1">
        <CardHeader className="font-bold text-lg">Devices</CardHeader>
        <CardBody className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={deviceData}
                dataKey="value"
                fill="#82ca9d"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {deviceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card className="border-none shadow-sm bg-content1">
        <CardHeader className="font-bold text-lg">Locations</CardHeader>
        <CardBody className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={countryData}
                dataKey="value"
                fill="#FFBB28"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {countryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}
