"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

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
  timeLabel: "This Week" | "This Month" | "This Year";
};
export default function TotalCard({ timeLabel }: Props) {
  const [data, setData] = useState<any | null>();

  useEffect(() => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const nowPlusone = now.toISOString().slice(0, 10);
    console.log(nowPlusone, now);
    const Data =
      timeLabel == "This Week"
        ? {
            min: getMonday(new Date()),
            max: nowPlusone,
          }
        : timeLabel == "This Month"
        ? { min: getFirstDayOfTheMonth(new Date()), max: nowPlusone }
        : { min: getFirstDayOfTheYear(new Date()), max: nowPlusone };

    const res = fetch(`/api/totalSales`, {
      method: "POST",
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((datas) => {
        console.log(datas);
        setData(datas);
      });
  }, [timeLabel]);

  if (!data) return null;

  return (
    <div className="border rounded-md p-6 min-w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`border-2 text-sm rounded-md py-1 px-2 bg-gray-400/50`}
        >
          {timeLabel}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-2">
            <h1 className="font-semibold text-xl">Total Sales ${timeLabel}</h1>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl">
              Items Sold:{" "}
              {data.result.No && data.result.No.toLocaleString("en-US")}
            </span>
            <span className="text-xl">
              Total Price:{" "}
              {data.result.Price && data.result.Price.toLocaleString("en-US")}{" "}
              ETB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
