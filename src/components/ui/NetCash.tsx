"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export default function NetCash() {
  const [cashIncome, setCashIncome] = useState<any | null>();
  const [totalExpanse, setTotalExpanse] = useState<any | null>();
  const [data, setData] = useState<any | null>();

  useEffect(() => {
    const res1 = fetch(`/api/cashIncome`, {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data: any) => {
        setCashIncome(data);
      })
      .catch((err) => {});

    const res2 = fetch(`/api/totalExpanse`, {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data: any) => {
        setTotalExpanse(data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (cashIncome?.result && totalExpanse?.result) {
      setData({
        TodayNet: cashIncome.result.TodayCash - totalExpanse.result.TodayEx,
        WeekNet: cashIncome.result.WeekCash - totalExpanse.result.WeekEx,
        MonthNet: cashIncome.result.MonthCash - totalExpanse.result.MonthEx,
      });
    }
  }, [cashIncome, totalExpanse]);

  if (!data) return null;

  return (
    <div className="border rounded-md p-6 min-w-[350px]">
      <Tabs defaultValue="today" className="">
        <div className="flex items-center justify-between gap-8">
          <span
            className={`border-2 text-sm rounded-md py-1 px-2 bg-gray-400/20`}
          >
            Net Cash Income
          </span>
          <TabsList className="grid grid-cols-3 w-40">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="today">
          <div className="flex flex-col gap-2">
            <div className="mt-4">
              <div className="flex justify-between items-center gap-2">
                <h1 className="font-bold text-xl">{`Today's Total Cash Income`}</h1>
              </div>
            </div>
            <h2 className="text-2xl">
              Net Cash Income : {data.TodayNet.toLocaleString("en-US")} Birr
            </h2>
          </div>
        </TabsContent>
        <TabsContent value="week">
          <div className="flex flex-col gap-2">
            <div className="mt-4">
              <div className="flex justify-between items-center gap-2">
                <h1 className="font-bold text-xl">
                  {`This Week's Total Cash Income`}
                </h1>
              </div>
            </div>
            <h2 className="text-2xl">
              Net Cash Income : {data.WeekNet.toLocaleString("en-US")} Birr
            </h2>
          </div>
        </TabsContent>
        <TabsContent value="month">
          <div className="flex flex-col gap-2">
            <div className="mt-4">
              <div className="flex justify-between items-center gap-2">
                <h1 className="font-bold text-xl">
                  {`This Month's Total Cash Income`}
                </h1>
              </div>
            </div>
            <h2 className="text-2xl">
              Net Cash Income : {data.MonthNet.toLocaleString("en-US")} Birr
            </h2>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
