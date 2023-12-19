"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useTodo } from "@/hooks/useContextData";

type Props = {
  no: number;
  path: string;
  timeLabel: "This Week" | "This Month" | "This Year";
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

export default function TopCard({ no, path, timeLabel }: Props) {
  const [data, setData] = useState<any | null>();
  const { sales } = useTodo();

  const now = new Date();
  now.setDate(now.getDate() + 1);
  const nowPlusone = now.toISOString().slice(0, 10);
  console.log(nowPlusone, now);

  useEffect(() => {
    const Data =
      timeLabel == "This Week"
        ? {
            min: getMonday(new Date()),
            max: nowPlusone,
            No: no,
          }
        : timeLabel == "This Month"
        ? { min: getFirstDayOfTheMonth(new Date()), max: nowPlusone, No: no }
        : { min: getFirstDayOfTheYear(new Date()), max: nowPlusone, No: no };
    const res = fetch(`/api/${path}`, {
      method: "POST",
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data);
        setData(data);
      });
  }, [path, timeLabel]);

  if (
    !data ||
    (data?.result.topByNo.length == 0 && data?.result.topByPrice.length == 0)
  )
    return null;

  return (
    <div className="border rounded-md p-6 min-w-[300px]">
      <Tabs defaultValue="byNo" className="">
        <div className="flex items-center justify-between gap-8">
          <span
            className={`border-2 text-sm rounded-md py-1 px-2 bg-gray-400/20`}
          >
            {timeLabel}
          </span>
          <TabsList className="grid grid-cols-2 w-40">
            <TabsTrigger value="byNo">By No</TabsTrigger>
            <TabsTrigger value="byPrice">By Price</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="byNo">
          <div className="flex flex-col gap-2">
            <div className="">
              <div className="flex justify-between items-center gap-2">
                <h1 className="font-bold text-xl">Top Product</h1>
              </div>
              <span className="text-xl opacity-50">
                {data.result.topByNo[0]?.product_name &&
                  data.result.topByNo[0]?.product_name}
                {data.result.topByNo[0]?.first_name &&
                  `${data.result.topByNo[0]?.first_name} ${data.result.topByNo[0]?.last_name}`}
                {data.result.topByNo[0]?.customerId == "XXXX" &&
                  `Unregistered Customer`}
              </span>
            </div>
            <h2 className="text-2xl">
              No of Items : {data.result.topByNo[0]?.no.toLocaleString("en-US")}
            </h2>
            <div className="">
              <h3 className="flex gap-2">
                <span className="">
                  {data.result.topByNo[0]?.no.toLocaleString("en-US")}
                </span>
                <span className="">Items Bought this week</span>{" "}
              </h3>
              <h3 className="flex gap-2">
                <span className="">In Total </span>
                <span className="">
                  {data.result.topByNo[0]?.price.toLocaleString("en-US")}
                </span>
              </h3>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="byPrice">
          <div className="flex flex-col gap-2">
            <div className="">
              <div className="flex justify-between items-center gap-2">
                <h1 className="font-bold text-xl">Top Product</h1>
              </div>
              <span className="text-xl opacity-50">
                {data.result.topByPrice[0]?.product_name &&
                  data.result.topByPrice[0]?.product_name}
                {data.result.topByPrice[0]?.first_name &&
                  `${data.result.topByPrice[0]?.first_name} ${data.result.topByPrice[0]?.last_name}`}
                {data.result.topByNo[0]?.customerId == "XXXX" &&
                  `Unregistered Customer`}
              </span>
            </div>
            <h2 className="text-2xl">
              Price : {data.result.topByPrice[0]?.price.toLocaleString("en-US")}{" "}
              ETB
            </h2>
            <div className="">
              <h3 className="flex gap-2">
                <span className="">
                  {data.result.topByPrice[0]?.no.toLocaleString("en-US")}
                </span>
                <span className="">Items Bought this week</span>{" "}
              </h3>
              <h3 className="flex gap-2">
                <span className="">In Total </span>
                <span className="">
                  {data.result.topByPrice[0]?.price.toLocaleString("en-US")} ETB
                </span>
              </h3>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
