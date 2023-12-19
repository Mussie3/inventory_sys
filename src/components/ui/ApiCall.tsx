"use client";
import React from "react";
import { Button } from "./button";

export default function ApiCall() {
  async function callApi() {
    // const Data = {
    //   min: "2023-10-10",
    //   max: "2023-10-17",
    //   No: 5,
    // };
    const res = await fetch("/api/allTotalSales");
    // {
    //   method: "POST",
    //   body: JSON.stringify(Data),
    // });
    if (res.ok) {
      const response = await res.json();
      console.log(response.result);
    }
  }
  return (
    <div>
      <Button onClick={callApi}>GET TOP TEN</Button>
    </div>
  );
}
