"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useTodo } from "@/hooks/useContextData";

type Props = {
  type: "Total" | "Expense" | "Available";
};

export default function TodayCashCard({ type }: Props) {
  const [data, setData] = useState<any | null>();

  useEffect(() => {
    const res = fetch(`/api/todayCash`, {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data: any) => {
        setData(data.result);
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
            {type == `Total`
              ? `Total Cash Income`
              : type == `Expense`
              ? `Total Expanse`
              : `Available Cash`}
          </span>
          <TabsList className="">
            <TabsTrigger value="today">Today</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="today">
          <div className="flex flex-col gap-2">
            <div className="mt-4">
              <div className="flex justify-between items-center gap-2">
                <h1 className="font-bold text-xl">
                  {type == `Total`
                    ? `Today's Total Cash Income`
                    : type == `Expense`
                    ? `Today's Total Expanse`
                    : `Today's Total Available Cash`}
                </h1>
              </div>
            </div>
            {type == `Total` ? (
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl">
                  Total Cash Income : {data.TotalCash.toLocaleString("en-US")}{" "}
                  Birr
                </h2>
              </div>
            ) : type == `Expense` ? (
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl">
                  Total Expanse : {data.TotalExpanse.toLocaleString("en-US")}{" "}
                  Birr
                </h2>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl">
                  Total Available : {data.Available.toLocaleString("en-US")}{" "}
                  Birr
                </h2>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
