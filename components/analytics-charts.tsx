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
  const osData = getPieData("os");
  const deviceData = getPieData("device");
  const countryData = getPieData("country");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="font-bold text-lg">Clicks Over Time</CardHeader>
        <CardBody className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
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
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
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
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
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
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}
