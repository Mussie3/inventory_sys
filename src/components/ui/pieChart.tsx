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
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useTodo } from "@/hooks/useContextData";
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

type Props = {
  Labal: "Catagory" | "Customer";
};

export default function PieChartData({ Labal }: Props) {
  const [data, setData] = useState<any | null>();
  const { catagory } = useTodo();
  const [filterDate, setFilterDate] = useState("thisWeek");
  const [loading, setLoading] = useState<boolean | undefined>(true);

  console.log("g");

  const path = Labal == "Catagory" ? "topCatagorys" : "selesCustomerVs";

  const now = new Date();
  now.setDate(now.getDate() + 1);
  const nowPlusone = now.toISOString().slice(0, 10);
  console.log(nowPlusone, now);

  useEffect(() => {
    console.log("g");
    const Data =
      filterDate == "thisWeek"
        ? {
            min: getMonday(new Date()),
            max: nowPlusone,
            No: catagory.length ? catagory.length : 2,
          }
        : filterDate == "thisMonth"
        ? {
            min: getFirstDayOfTheMonth(new Date()),
            max: nowPlusone,
            No: catagory.length ? catagory.length : 2,
          }
        : {
            min: getFirstDayOfTheYear(new Date()),
            max: nowPlusone,
            No: catagory.length ? catagory.length : 2,
          };
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

  let dd;

  if (Labal == "Catagory") {
    const catagoryResults = data?.result?.topByNo?.map((cat: any) => {
      return {
        ...cat,
        catagoryName: catagory.find((c: any) => c.docId == cat.catagory)
          .catagoryName,
      };
    });
    dd = catagoryResults;
  } else {
    dd = data?.result?.Customer;
  }

  // const ddd = data.result.topByPrice;
  const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center border rounded-lg p-4">
      <h1 className={`text-xl rounded-md py-1 px-2 mb-2 w-full`}>
        {Labal == "Catagory" ? "CatagoryVs" : "CustomerVs"}
      </h1>
      <Tabs defaultValue="byNo" className="w-full h-full">
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
        ) : data?.result?.Customer?.length == 0 ||
          data?.result?.topByNo?.length == 0 ? (
          <div className="flex items-center justify-center p-12">
            <span>no sales found</span>
          </div>
        ) : (
          <>
            <TabsContent value="byNo">
              <div className="w-full aspect-video">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={730} height={250}>
                    <Legend
                      layout="horizontal"
                      verticalAlign="top"
                      align="center"
                    />
                    <Pie
                      data={dd}
                      dataKey="no"
                      nameKey={
                        Labal == "Catagory" ? "catagoryName" : "customerType"
                      }
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {dd.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        ></Cell>
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="byPrice">
              <div className="w-full aspect-video">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={730} height={50}>
                    <Legend
                      layout="horizontal"
                      verticalAlign="top"
                      align="center"
                    />
                    <Pie
                      data={dd}
                      dataKey="price"
                      nameKey={
                        Labal == "Catagory" ? "catagoryName" : "customerType"
                      }
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {dd.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>{" "}
          </>
        )}
      </Tabs>
    </div>
  );
}
