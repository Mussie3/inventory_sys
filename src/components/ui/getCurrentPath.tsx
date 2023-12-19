"use client";

import { usePathname } from "next/navigation";

export default function GetCurrentPath() {
  const path = usePathname();
  const arraypath = path.split("/");
  const pathName = arraypath[arraypath.length - 1];
  const formatedPathName = pathName.charAt(0).toUpperCase() + pathName.slice(1);
  console.log(formatedPathName);
  return <div>{formatedPathName ? formatedPathName : "Home"}</div>;
}
