"use client";
import { Button } from "@/components/ui/button";
import services from "@/services/connect";
import Link from "next/link";
import React from "react";
import { ExpanseDataTable } from "./data-table";
import { useTodo } from "@/hooks/useContextData";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { RiArrowUpDownFill } from "react-icons/ri";
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
import ExCard from "@/components/ui/exCard";
import CashIncomeCard from "@/components/ui/CashIncomeCard";

type Expanse = {
  docId: string;
  title: string;
  discription: string;
  amount: string;
  datetime: string;
};
export default function Users() {
  const { expanse, setExpanse } = useTodo();

  console.log(expanse);

  function fetchExpansedata(id: string) {
    const newExpanse = expanse.filter((ex: Expanse) => ex.docId != id);
    setExpanse(newExpanse);
  }

  if (!expanse) return null;

  const expansedata = expanse?.map((ex: Expanse) => {
    return {
      ...ex,
    };
  });

  async function deleteExpanse(id: string) {
    console.log(id);
    const res = await fetch("/api/deleteExpanse", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response.success);
      if (response.success) fetchExpansedata(id);
      return response.success;
    }
    throw Error;
  }

  const columns: ColumnDef<Expanse>[] = [
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
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Discription",
      accessorKey: "discription",
    },
    {
      header: "Amount",
      accessorKey: "amount",
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
                onClick={() => navigator.clipboard.writeText(rowdata.title)}
              >
                Copy Title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(rowdata.discription)
                }
              >
                Copy Discription
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowdata.amount)}
              >
                Copy Amount
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="bg-blue-400 text-white mt-2">
                <Link href={`expanse/editExpanse/${rowdata.docId}`}>
                  Edit Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="bg-red-400 text-white mt-2"
                // onClick={() => deleteUser(rowdata.docId)}
                onClick={() =>
                  toast.promise(deleteExpanse(rowdata.docId), {
                    loading: "deleting...",
                    success: (data) => {
                      return `Expanse has been deleted`;
                    },
                    error: "Error",
                  })
                }
              >
                Delete Expanse
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full w-full justify-between p-12">
      <div className="flex gap-8">
        <ExCard />
        <CashIncomeCard />
      </div>

      <div className="w-full">
        <ExpanseDataTable columns={columns} data={expansedata} />
      </div>
    </div>
  );
}
