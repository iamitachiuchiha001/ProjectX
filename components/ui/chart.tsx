"use client";

import * as React from "react";
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Sector
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
  layout?: "horizontal" | "vertical";
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"],
  valueFormatter = (value: number) => `${value}`,
  className,
  layout = "horizontal"
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          {layout === "horizontal" ? (
            <>
              <XAxis
                dataKey={index}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={valueFormatter}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={valueFormatter}
              />
              <YAxis
                dataKey={index}
                type="category"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
            </>
          )}
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          {index}
                        </span>
                        <span className="font-bold text-foreground">
                          {label}
                        </span>
                      </div>
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex flex-col text-right">
                          <span className="text-xs text-muted-foreground">
                            {entry.name}
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: entry.color }}
                          >
                            {valueFormatter(entry.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey={index}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          {index}
                        </span>
                        <span className="font-bold text-foreground">
                          {label}
                        </span>
                      </div>
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex flex-col text-right">
                          <span className="text-xs text-muted-foreground">
                            {entry.name}
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: entry.color }}
                          >
                            {valueFormatter(entry.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PieChartProps {
  data: any[];
  index: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function PieChart({
  data,
  index,
  valueFormatter = (value: number) => `${value}`,
  className,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="hsl(var(--foreground))">
          {payload[index]}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="hsl(var(--foreground))"
          fontSize={12}
        >{`${payload[index]}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="hsl(var(--muted-foreground))"
          fontSize={12}
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            nameKey={index}
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || `var(--chart-${(index % 5) + 1})`} 
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {payload[0].name}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: payload[0].color }}
                      >
                        {valueFormatter(payload[0].value as number)}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}