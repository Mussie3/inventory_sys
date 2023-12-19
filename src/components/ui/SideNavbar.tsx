"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineClipboardList } from "react-icons/hi";
import { LiaProductHunt, LiaUserSolid } from "react-icons/lia";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./button";
import { FiMoreVertical, FiUsers } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
// import { useTodo } from "@/hooks/useContextData";
import Image from "next/image";

const NavMenu = [
  {
    href: "/",
    text: "Home",
    icon: <AiOutlineHome className="w-6 h-6 " />,
  },
  {
    href: "/product",
    text: "Product",
    icon: <LiaProductHunt className="w-6 h-6" />,
  },
  {
    href: "/customer",
    text: "Customer",
    icon: <FiUsers className="w-6 h-6" />,
  },
  // {
  //   href: "/catagory",
  //   text: "Catagory",
  //   icon: <FaLayerGroup className="w-6 h-6" />,
  // },
  {
    href: "/inventory",
    text: "Inventory",
    icon: <MdOutlineInventory2 className="w-6 h-6" />,
  },
  {
    href: "/sales",
    text: "Sales",
    icon: <HiOutlineClipboardList className="w-6 h-6" />,
  },
  {
    href: "/users",
    text: "Users",
    icon: <LiaUserSolid className="w-6 h-6" />,
  },
];

type Props = {
  Admin: boolean;
  session: any;
  users: user[];
};

type user = {
  password: string;
  email: string;
  image: string;
  datetime: string;
  username: string;
  docId: string;
  role: string;
};

export default function SideNavbar({ Admin, session ,users}: Props) {
  const [expanded, setExpanded] = useState(true);
  const path = usePathname();

  const [currentUser, setCurrentUser] = useState<user | undefined>();

  useEffect(() => {
    
    const cuser = users.find((u: user) => u.email == session.user.email);
    setCurrentUser(cuser);
  
  }, [session, users]);
  

  if(!currentUser) return null

  return (
    <aside className="sticky max-h-screen top-0 flex flex-col border-r shadow-sm">
      <div className="flex items-center justify-between mb-32 p-4">
        <Link href={"/"}>
          <div
            className={`overflow-hidden text-2xl transition-all ${
              expanded ? "w-fit" : "w-0"
            }`}
          >
            <Image 
            src="https://firebasestorage.googleapis.com/v0/b/inventory-system-c1ed7.appspot.com/o/logo%2Frungo-logo.png?alt=media&token=2b004317-2da4-414c-85d0-6a44134c9d7e"
            alt="logo"
            width={200}
            height={30}
            />
          </div>
        </Link>

        <Button
          variant={"ghost"}
          className="py-2 px-3"
          onClick={() => setExpanded((pre) => !pre)}
        >
          {expanded ? (
            <BsChevronBarLeft size={24} />
          ) : (
            <BsChevronBarRight size={24} />
          )}
        </Button>
      </div>
      <ul className="flex-1 flex-col gap-2 p-4">
        {NavMenu.map((menu, i) => {
          if (menu.href == "/users" && !Admin) return null;
          return (
            <SidebarItem
              key={i}
              text={menu.text}
              icon={menu.icon}
              href={menu.href}
              active={
                (menu.href != "/" && path.startsWith(menu.href)) ||
                (menu.href == "/" && menu.href == path)
              }
              expanded={expanded}
            />
          );
        })}
      </ul>
      <div className="flex items-center gap-2 border-t p-3">
        <Link href={`/users/editUsers/${currentUser?.docId}`}>
          <div className="w-12 h-12 rounded-full">
            <Avatar>
              <AvatarImage
                src={currentUser?.image as string}
                alt={currentUser?.username}
              />
              <AvatarFallback>
                {currentUser?.username.slice(0, 2).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </Link>
        <div
          className={`overflow-hidden flex justify-between items-center transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          <div className="leading-4">
            <h4 className="font-semibold">
              {session?.user.name.toLocaleUpperCase()}
            </h4>
            <span className="text-xs text-gray-400">{currentUser?.email}</span>
          </div>
          <Button variant={"ghost"} className="px-1">
            <FiMoreVertical size={24} />
          </Button>
        </div>
      </div>
    </aside>
  );
}

type SProps = {
  icon: any;
  text: string;
  active: boolean;
  href: string;
  expanded: boolean;
};

export function SidebarItem({ icon, text, active, href, expanded }: SProps) {
  return (
    <li className="relative w-full group my-1">
      <Link
        href={href}
        className={`flex items-center font-medium py-2 px-3 rounded-md cursor-pointer transition-colors${
          active
            ? " bg-gradient-to-tr from-green-400 to-green-300 text-green-900"
            : ""
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </Link>
      {!expanded && (
        <div className="absolute top-1/2 -translate-y-1/2 left-full rounded-md px-2 py-1 ml-6 bg-green-300 text-black invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {text}
        </div>
      )}
    </li>
  );
}
