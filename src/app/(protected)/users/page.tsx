"use client";
import { Button } from "@/components/ui/button";
import services from "@/services/connect";
import Link from "next/link";
import React, { useEffect } from "react";
import UserDataTable from "./data-table";
import { useTodo } from "@/hooks/useContextData";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiArrowUpDownFill } from "react-icons/Ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiMoreVertical } from "react-icons/fi";
import { toast } from "sonner";

type User = {
  role: string;
  username: string;
  image: string;
  email: string;
  docId: string;
  datetime: string;
};
export default function Users() {
  const { users, setUsers } = useTodo();

  console.log(users);

  function fetchUsersdata(id: string) {
    // fetch("/api/getUsers")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setUsers(data.Users);
    //   })
    //   .catch((err) => console.log(err));
    const newUsers = users.filter((User: User) => User.docId != id);
    setUsers(newUsers);
  }

  if (!users) return null;

  const userdata = users?.map((user: User) => {
    return {
      role: user.role,
      username: user.username,
      image: user.image,
      email: user.email,
      docId: user.docId,
      datetime: user.datetime,
    };
  });

  async function deleteUser(id: string) {
    console.log(id);
    const res = await fetch("/api/deleteUser", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response.success);
      if (response.success) fetchUsersdata(id);
      return response.success;
    }
    throw Error;
  }

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Image",
      accessorKey: "image",
      cell: ({ row }) => {
        const imgUrl = row.getValue("image");
        const User = row.getValue("username");

        return (
          <Avatar>
            <AvatarImage src={imgUrl as string} />
            <AvatarFallback>
              {`${User}`.slice(0, 1).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="pl-0"
          >
            Username
            <RiArrowUpDownFill size={16} />
          </Button>
        );
      },
      accessorKey: "username",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
    },
    {
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="pl-0"
          >
            Added Date
            <RiArrowUpDownFill size={16} />
          </Button>
        );
      },
      accessorKey: "datetime",
      cell: ({ row }) => {
        const time = row.getValue("datetime");
        const formatted = new Date(time as string).toLocaleDateString();
        return <div className="">{formatted}</div>;
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        const date: any = row.getValue(columnId);
        const [start, end] = filterStatuses.split(","); // value => two date input values
        console.log(start, end);
        //If one filter defined and date is null filter it
        if ((start || end) && !date) return false;
        if (start && !end) {
          return Date.parse(date) >= Date.parse(start);
        } else if (!start && end) {
          return Date.parse(date) <= Date.parse(end);
        } else if (start && end) {
          return (
            Date.parse(date) >= Date.parse(start) &&
            Date.parse(date) <= Date.parse(end)
          );
        } else return true;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowdata = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <FiMoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowdata.username)}
              >
                Copy UserName
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowdata.email)}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="bg-blue-400 text-white mt-2">
                <Link href={`users/editUsers/${rowdata.docId}`}>
                  Edit Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="bg-red-400 text-white mt-2"
                // onClick={() => deleteUser(rowdata.docId)}
                onClick={() =>
                  toast.promise(deleteUser(rowdata.docId), {
                    loading: "deleting...",
                    success: (data) => {
                      return `User has been deleted`;
                    },
                    error: "Error",
                  })
                }
              >
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8 items-center justify-center p-24">
      <div className="w-full">
        <UserDataTable columns={columns} data={userdata} />
      </div>
    </div>
  );
}
