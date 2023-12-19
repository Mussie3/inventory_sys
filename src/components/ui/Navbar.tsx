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
import { useTodo } from "@/hooks/useContextData";

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
};

const initialUser = {
  password: '',
  email: '',
  image: '',
  datetime: '',
  username: '',
  docId: '',
  role: '',
}


export default function Navbar({ session }: Props) {
  // const session: any = await getServerSession(options);


  const { users } = useTodo();
  const [currentUser, setCurrentUser] = useState<user>(initialUser);
  console.log(users);

  useEffect(() => {
    if (users) {
      const cuser = users.find((u: user) => u.email == session.user.email);
      console.log(cuser);
      setCurrentUser(cuser);
    }
  }, [session, users]);
  console.log(currentUser);

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
