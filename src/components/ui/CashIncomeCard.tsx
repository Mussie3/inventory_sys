"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useTodo } from "@/hooks/useContextData";

export default function CashIncomeCard() {
  const [data, setData] = useState<any | null>();

  useEffect(() => {
    const res = fetch(`/api/cashIncome`, {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data);
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!data) return null;

  console.log(data);

  return (
    <div className="border rounded-md p-6 min-w-[350px]">
      <Tabs defaultValue="today" className="">
        <div className="flex items-center justify-between gap-8">
          <span
            className={`border-2 text-sm rounded-md py-1 px-2 bg-gray-400/20`}
          >
            Cash Income
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
              Cash Income : {data.result.TodayCash.toLocaleString("en-US")} Birr
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
              Cash Income : {data.result.WeekCash.toLocaleString("en-US")} Birr
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
              Cash Income : {data.result.MonthCash.toLocaleString("en-US")} Birr
            </h2>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}