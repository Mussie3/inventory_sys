"use client";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useEffect, useState } from "react";
import LoadingSpinner from "./loadingSpinner";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function RenderLineChart() {
  const [data, setData] = useState<any | null>();
  const [loading, setLoading] = useState<boolean | undefined>(true);

  useEffect(() => {
    setLoading(true);
    const res = fetch(`/api/allTotalSales`)
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(undefined);
        console.log(err);
      });
  }, []);

  // if (!data) return null;

  const week = data?.result?.thisWeek;
  const month = data?.result?.thisMonth;
  const year = data?.result?.thisYear;

  const tickFormatter = (value: string, index: number) => {
    const limit = 3; // put your maximum character
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}`;
  };

  const tickFormatter2 = (value: string, index: number) => {
    return `${Number(value).toLocaleString("en-US")} ETB`;
  };

  return (
    <div className="border rounded-lg p-4">
      <Tabs defaultValue="Week" className="">
        <div className="flex items-center justify-between gap-8 mb-8">
          {/* <Select
           onValueChange={(value) => setFilterDate(value)}
           defaultValue={filterDate}
         >
           <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Date" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="thisWeek">This Week</SelectItem>
             <SelectItem value="thisMonth">This Month</SelectItem>
             <SelectItem value="thisYear">This year</SelectItem>
           </SelectContent>
         </Select> */}
          <TabsList className="grid grid-cols-3 w-fit">
            <TabsTrigger value="Week">Week</TabsTrigger>
            <TabsTrigger value="Month">Month</TabsTrigger>
            <TabsTrigger value="Year">Year</TabsTrigger>
          </TabsList>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <TabsContent value="Week">
              <h1 className={`text-xl rounded-md py-1 px-2 mb-4`}>
                This Week Sales
              </h1>
              <div className="w-full aspect-video">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={week}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      height={50}
                      label={{
                        value: "Date",
                        angle: 0,
                        position: "insideBottom",
                      }}
                    />
                    <YAxis
                      width={120}
                      tickFormatter={tickFormatter2}
                      label={{
                        value: "Price of Products",
                        angle: -90,
                        position: "left",
                      }}
                    />
                    <Tooltip />
                    {/* <Legend /> */}
                    {/* <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          /> */}
                    <Line type="monotone" dataKey="sum" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="Month">
              <h1 className={`text-xl rounded-md py-1 px-2 mb-4`}>
                This Month Sales
              </h1>
              <div className="w-full aspect-video">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={month}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      height={50}
                      label={{
                        value: `Current Month`,
                        angle: 0,
                        position: "insideBottom",
                      }}
                    />
                    <YAxis
                      width={120}
                      tickFormatter={tickFormatter2}
                      label={{
                        value: "Price of Products",
                        angle: -90,
                        position: "left",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sum"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    {/* <Line type="monotone" dataKey="sum" stroke="#82ca9d" /> */}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="Year">
              <h1 className={`text-xl rounded-md py-1 px-2 mb-4`}>
                This Year Sales
              </h1>
              <div className="w-full aspect-video">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={year}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      height={50}
                      label={{
                        value: `Months`,
                        angle: 0,
                        position: "insideBottom",
                      }}
                    />
                    <YAxis
                      width={120}
                      tickFormatter={tickFormatter2}
                      label={{
                        value: "Price of Products",
                        angle: -90,
                        position: "left",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    {/* <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          /> */}
                    <Line type="monotone" dataKey="sum" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
