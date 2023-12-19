"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useTodo } from "@/hooks/useContextData";

type Props = {
  no: number;
  Labal: string;
};
export default function InvCard({ no, Labal }: Props) {
  const { catagory } = useTodo();
  console.log(catagory);
  const [data, setData] = useState<any | null>();

  const type = Labal == "Product" ? "topByNo" : "topByNoC";
  const typeC = Labal == "Product" ? "topByPrice" : "topByPriceC";

  useEffect(() => {
    const Data = {
      No: no,
    };

    const res = fetch(`/api/topInventory`, {
      method: "POST",
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data);
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [no]);

  if (!data) return null;

  console.log(data);

  return (
    <div className="border rounded-md p-6 min-w-[300px]">
      <Tabs defaultValue="byNo" className="">
        <div className="flex items-center justify-between gap-8">
          <span
            className={`border-2 text-sm rounded-md py-1 px-2 bg-gray-400/20`}
          >
            {Labal}
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
                {Labal == "Product" ? (
                  <h1 className="font-bold text-xl">Top Product</h1>
                ) : (
                  <h1 className="font-bold text-xl">Top Catagory</h1>
                )}
              </div>
              <span className="text-xl opacity-50">
                {Labal == "Catagory"
                  ? catagory.find(
                      (c: any) => c.docId === data.result[type][0].catagory
                    )?.catagoryName
                  : data.result[type][0].product_name}
              </span>
            </div>
            <h2 className="text-2xl">
              No of Items : {data.result[type][0].no.toLocaleString("en-US")}
            </h2>
            <div className="">
              <h3 className="flex gap-2">
                <span className="">
                  {data.result[type][0].no.toLocaleString("en-US")}
                </span>
                <span className="">Items In the Inventory</span>{" "}
              </h3>
              <h3 className="flex gap-2">
                <span className="">In Total </span>
                <span className="">
                  {data.result[type][0].price.toLocaleString("en-US")} ETB
                </span>
              </h3>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="byPrice">
          <div className="flex flex-col gap-2">
            <div className="">
              <div className="flex justify-between items-center gap-2">
                {Labal == "Product" ? (
                  <h1 className="font-bold text-xl">Top Product</h1>
                ) : (
                  <h1 className="font-bold text-xl">Top Catagory</h1>
                )}
              </div>
              <span className="text-xl">
                {Labal == "Catagory"
                  ? catagory.find(
                      (c: any) => c.docId === data.result[type][0].catagory
                    )?.catagoryName
                  : data.result[type][0].product_name}
              </span>
            </div>
            <h2 className="text-2xl">
              Price : {data.result[typeC][0].price.toLocaleString("en-US")} ETB
            </h2>
            <div className="">
              <h3 className="flex gap-2">
                <span className="">
                  {data.result[typeC][0].no.toLocaleString("en-US")}
                </span>
                <span className="">Items In the Inventory</span>{" "}
              </h3>
              <h3 className="flex gap-2">
                <span className="">In Total </span>
                <span className="">
                  {data.result[typeC][0].price.toLocaleString("en-US")} ETB
                </span>
              </h3>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
