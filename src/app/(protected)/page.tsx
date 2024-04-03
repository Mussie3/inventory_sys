"use client";

import RenderLineChart from "@/components/ui/lineChart";
import BarChartData from "@/components/ui/barChart";
import PieChartData from "@/components/ui/pieChart";
import TotalCard from "@/components/ui/totalCard";

export default function Home() {
  return (
    <main className="flex flex-col h-full w-full justify-between p-12 gap-8">
      <div className="flex flex-col w-full h-full justify-center gap-8">
        <div className="flex gap-8">
          <TotalCard timeLabel="This Week" />
          <TotalCard timeLabel="This Month" />
          <TotalCard timeLabel="This Year" />
        </div>
        <div className="flex flex-wrap gap-8 box-border">
          <div className="w-[70%] box-border">
            <RenderLineChart />
          </div>
          <div className="w-[45%] box-border">
            <BarChartData Labal="Top Product" />
          </div>
          <div className="w-[45%] box-border">
            <PieChartData Labal="Catagory" />
          </div>
        </div>
      </div>
    </main>
  );
}
