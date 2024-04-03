"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useTodo } from "@/hooks/useContextData";

type Props = {
  type: "Total" | "Cash";
};

export default function TodaySalesCard({ type }: Props) {
  const [data, setData] = useState<any | null>();

  useEffect(() => {
    const res = fetch(`/api/todaySales`, {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data: any) => {
        setData(type == "Total" ? data.result.Total : data.result.Cash);
      })
      .catch((err) => {});
  }, []);

  if (!data) return null;

  return (
    <div className="border rounded-md p-6 min-w-[350px]">
      <Tabs defaultValue="today" className="">
        <div className="flex items-center justify-between gap-8">
          <span
            className={`border-2 text-sm rounded-md py-1 px-2 bg-gray-400/20`}
          >
            {type == `Total` ? `Total Income` : `Cash Income`}
          </span>
          <TabsList className="">
            <TabsTrigger value="today">Today</TabsTrigger>
            {/* <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger> */}
          </TabsList>
        </div>
        <TabsContent value="today">
          <div className="flex flex-col gap-2">
            <div className="mt-4">
              <div className="flex justify-between items-center gap-2">
                <h1 className="font-bold text-xl">
                  {type == `Total`
                    ? `Today's Total Income`
                    : `Today's Total Cash Income`}
                </h1>
              </div>
            </div>
            {type == `Total` ? (
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl">
                  Total Income : {data.Price.toLocaleString("en-US")} Birr
                </h2>
                <h2 className="text-xl">
                  No. Item Soled : {data.No.toLocaleString("en-US")}
                </h2>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl">
                  Cash Income : {data.Price.toLocaleString("en-US")} Birr
                </h2>
                <h2 className="text-xl">
                  No. Item Soled : {data.No.toLocaleString("en-US")}
                </h2>
              </div>
            )}
          </div>
        </TabsContent>
        {/* <TabsContent value="week">
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
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
