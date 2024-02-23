"use client";

import Link from "next/link";
import Signout from "./Signout";
import { ModeToggle } from "./toggle-mode";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import GetCurrentPath from "./getCurrentPath";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between px-8 min-h-[8vh] border-b shadow-sm bg-white dark:bg-black z-100">
      <div className="">
        <GetCurrentPath />
      </div>
      <div className="flex gap-6 items-center">
        <div className="">
          <ModeToggle />
        </div>
        <Link href={`users/editUsers/${session?.user.sub}}`}>
          <Avatar>
            <AvatarImage
              src={session?.user.picture as string}
              alt={session?.user.name}
            />
            <AvatarFallback>
              {session?.user.name.slice(0, 2).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Signout />
      </div>
    </div>
  );
}
