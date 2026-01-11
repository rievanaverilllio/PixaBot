"use client";

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { day: "Mon", usage: 12 },
  { day: "Tue", usage: 20 },
  { day: "Wed", usage: 8 },
  { day: "Thu", usage: 18 },
  { day: "Fri", usage: 14 },
  { day: "Sat", usage: 6 },
  { day: "Sun", usage: 10 },
];

export function TokenUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Penggunaan Token (7 hari)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <BarChart width={600} height={200} data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}
