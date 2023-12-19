import React from "react";

export default function Circleloading() {
  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="flex justify-center w-full">
        <span className="circle animate-loader"></span>
        <span className="circle animate-loader animation-delay-200"></span>
        <span className="circle animate-loader animation-delay-400"></span>
      </div>
    </div>
  );
}
