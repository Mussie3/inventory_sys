"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import LoadingSpinner from "./loadingSpinner";

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];
type Props = {
  Labal: "Top Product" | "Top Catagory" | "Top Customer";
};

function getMonday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff)).toISOString();
  // .slice(0, 10);
}

function getFirstDayOfTheMonth(d: Date) {
  let date_today = new Date(d);
  let firstDay = new Date(
    date_today.getFullYear(),
    date_today.getMonth(),
    1
  ).toISOString();
  return firstDay;
}

function getFirstDayOfTheYear(d: Date) {
  let date_today = new Date(d);
  let firstyear = new Date(date_today.getFullYear(), 0, 1).toISOString();
  return firstyear;
}

export default function BarChartData({ Labal }: Props) {
  const [data, setData] = useState<any | null>();
  const [filterDate, setFilterDate] = useState("thisMonth");
  const [loading, setLoading] = useState<boolean | undefined>(true);

  const path =
    Labal == "Top Catagory"
      ? "topCatagorys"
      : Labal == "Top Product"
      ? "topProducts"
      : "topCustomers";

  const now = new Date();
  now.setDate(now.getDate() + 1);
  const nowPlusone = now.toISOString().slice(0, 10);
  console.log(nowPlusone, now);

  useEffect(() => {
    const Data =
      filterDate == "thisWeek"
        ? {
            min: getMonday(new Date()),
            max: nowPlusone,
            No: 5,
          }
        : filterDate == "thisMonth"
        ? { min: getFirstDayOfTheMonth(new Date()), max: nowPlusone, No: 5 }
        : { min: getFirstDayOfTheYear(new Date()), max: nowPlusone, No: 5 };
    console.log(path);

    setLoading(true);
    const res = fetch(`/api/${path}`, {
      method: "POST",
      body: JSON.stringify(Data),
    })
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
  }, [filterDate]);

  // if (!data) return null;

  const dd = data?.result?.topByNo;
  const ddd = data?.result?.topByPrice;
  const keyY =
    Labal == "Top Catagory"
      ? "catagory"
      : Labal == "Top Product"
      ? "product_name"
      : "first_name";
  console.log(keyY);

  const tickFormatter = (value: string, index: number) => {
    const limit = 15; // put your maximum character
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };
  return (
    <div className="border rounded-lg p-4">
      <h1 className={`text-xl rounded-md py-1 px-2 mb-2`}>{Labal}</h1>
      <Tabs defaultValue="byNo" className="">
        <div className="flex items-center justify-between gap-8 mb-8">
          <Select
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
          </Select>
          <TabsList className="grid grid-cols-2 w-40">
            <TabsTrigger value="byNo">By No</TabsTrigger>
            <TabsTrigger value="byPrice">By Price</TabsTrigger>
          </TabsList>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : data?.result?.topByPrice?.length == 0 ||
          data?.result?.topByNo?.length == 0 ? (
          <div className="flex items-center justify-center p-12">
            <span>no sales found</span>
          </div>
        ) : (
          <>
            <TabsContent value="byNo">
              <div className="w-full aspect-video">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    className=""
                    layout="vertical"
                    width={500}
                    height={400}
                    data={dd}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                      height={50}
                      type="number"
                      label={{
                        value: "No of Products",
                        angle: 0,
                        position: "insideBottom",
                      }}
                    />
                    <YAxis
                      width={70}
                      tickFormatter={tickFormatter}
                      dataKey={keyY}
                      type="category"
                      scale="band"
                    />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Bar dataKey="no" barSize={20} fill="#413ea0" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="byPrice">
              <div className="w-full aspect-video">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    className=""
                    layout="vertical"
                    width={500}
                    height={400}
                    data={ddd}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                      height={50}
                      type="number"
                      label={{
                        value: "Price of Products",
                        angle: 0,
                        position: "insideBottom",
                      }}
                    />
                    <YAxis
                      width={70}
                      tickFormatter={tickFormatter}
                      dataKey={keyY}
                      type="category"
                      scale="band"
                    />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Bar dataKey="price" barSize={20} fill="#413ea0" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
