"use client";

import { RECHART } from "@/constants";
import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function RevenueAreaChart() {
  const [data, setData] = useState();

  useEffect(() => {
    setData(RECHART.revenue);
  }, [data]);
  return (
    <div className="w-[500px] overflow-x-scroll ">
      <div className="text-center">Revenue</div>
      <div className="py-2 w-[200px] mx-auto">
        <Divider />
      </div>
      <AreaChart
        width={500}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 10000]} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </div>
  );
}

export default RevenueAreaChart;
