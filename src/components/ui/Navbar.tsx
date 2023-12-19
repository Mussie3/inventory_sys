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

type user = {
  password: string;
  email: string;
  image: string;
  datetime: string;
  username: string;
  docId: string;
  role: string;
};

type Props = {
  session: any;
  users:user[];
};


export default function Navbar({ session ,users}: Props) {
  // const session: any = await getServerSession(options);


  const [currentUser, setCurrentUser] = useState<user | undefined>();

  useEffect(() => {
    
      const cuser = users.find((u: user) => u.email == session.user.email);
    setCurrentUser(cuser);

  }, [session, users]);

  if(!currentUser) return null

  return (
    <div className="flex items-center justify-between px-8 min-h-[8vh] border-b shadow-sm bg-white dark:bg-black z-100">
      <div className="">
        <GetCurrentPath />
      </div>
      <div className="flex gap-6 items-center">
        <div className="">
          <ModeToggle />
        </div>
        <Link href={`/users/editUsers/${currentUser?.docId}`}>
          <Avatar>
            <AvatarImage
              src={currentUser?.image as string}
              alt={currentUser?.username}
            />
            <AvatarFallback>
              {currentUser?.username.slice(0, 2).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Signout />
      </div>
    </div>
  );
}
