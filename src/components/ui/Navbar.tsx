"use client";

import Link from "next/link";
import Signout from "./Signout";
import { ModeToggle } from "./toggle-mode";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import GetCurrentPath from "./getCurrentPath";
import { useEffect, useState } from "react";

type Props = {
  session: { user: sessionUser };
};

type sessionUser = {
  name: string;
  email: string;
  picture: string;
  sub: string;
  iat: number;
  exp: number;
  jti: string;
};
export default function Navbar({ session }: Props) {
  const [sessionUser, setSessionUser] = useState(session.user);

  useEffect(() => {
    if (session.user) {
      setSessionUser(session.user);
    }
  }, [session]);

  if (!sessionUser) return;

  return (
    <div className="flex items-center justify-between px-8 min-h-[8vh] border-b shadow-sm bg-white dark:bg-black z-100">
      <div className="">
        <GetCurrentPath />
      </div>
      <div className="flex gap-6 items-center">
        <div className="">
          <ModeToggle />
        </div>
        <Link href={`users/editUsers/${sessionUser.sub}}`}>
          <Avatar>
            <AvatarImage
              src={sessionUser.picture as string}
              alt={sessionUser.name}
            />
            <AvatarFallback>
              {sessionUser.name.slice(0, 2).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Signout />
      </div>
    </div>
  );
}
