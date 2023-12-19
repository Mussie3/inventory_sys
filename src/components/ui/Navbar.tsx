"use client";
import Link from "next/link";
import Signout from "./Signout";
import { ModeToggle } from "./toggle-mode";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import GetCurrentPath from "./getCurrentPath";
import { useTodo } from "@/hooks/useContextData";
import { useEffect, useState } from "react";


type Props = {
  session: any;
};





export default function Navbar({ session }: Props) {

  // const session: any = await getServerSession(options);



  return (
    <div className="flex items-center justify-between px-8 min-h-[8vh] border-b shadow-sm bg-white dark:bg-black z-100">
      <div className="">
        <GetCurrentPath />
      </div>
      <div className="flex gap-6 items-center">
        <div className="">
          <ModeToggle />
        </div>
        {/* <Link href={`/users/editUsers/${currentUser?.docId}`}> */}
          <Avatar>
            <AvatarImage
              src={session?.user?.image as string}
              alt={session?.user?.name}
            />
            <AvatarFallback>
              {session?.user?.name.slice(0, 2).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        {/* </Link> */}
        <Signout />
      </div>
    </div>
  );
}
