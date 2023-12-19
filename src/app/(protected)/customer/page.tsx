"use client";

import CustomerDataTable from "./data-table";
// import { columns } from "./columns";
import TopCard from "@/components/ui/topCard";
import { useTodo } from "@/hooks/useContextData";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
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
import Link from "next/link";
import { toast } from "sonner";
// import { people } from "@/lib/customers";

type credit = { allowed: boolean; max: number; used: number };

type Customer = {
  docId: string;
  first_name: string;
  last_name: string;
  credit: { allowed: boolean; max: number; used: number };
  email: string;
  gender: string;
  phone_number: string;
  discount: number;
  history: string[];
};

export default function Customer() {
  const { customer, setCustomer, setCustomerLoading } = useTodo();
  console.log(customer);

  function fetchCustomerdata(id: string) {
    // fetch("/api/getCustomers")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setCustomer(data.Customers);
    //   })
    //   .catch((err) => console.log(err));
    const newCustomer = customer.filter((Cu: Customer) => Cu.docId != id);
    setCustomer(newCustomer);
  }

  useEffect(() => {
    console.log("change");
  }, [customer]);

  async function deleteCustomer(id: string) {
    console.log(id);
    const res = await fetch("/api/deleteCustomer", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response.success);
      if (response.success) fetchCustomerdata(id);
      return response.success;
    }
    throw Error;
  }

  const columns: ColumnDef<Customer>[] = [
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
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="pl-0"
          >
            First Name
            <RiArrowUpDownFill size={16} />
          </Button>
        );
      },
      accessorKey: "first_name",
    },
    {
      header: "Last Name",
      accessorKey: "last_name",
    },
    {
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: ({ row }) => {
        const formatedPhoneNumber = `+251${row.getValue("phone_number")}`;
        return <div className="font-medium">{formatedPhoneNumber}</div>;
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
            Discount %
            <RiArrowUpDownFill size={16} />
          </Button>
        );
      },
      accessorKey: "discount",
      cell: ({ row }) => {
        const formatedDiscountPercentail = `${row.getValue("discount")}%`;
        return <div className="font-medium">{formatedDiscountPercentail}</div>;
      },
    },
    {
      header: "Credit Allowed",
      accessorKey: "credit",
      cell: ({ row }) => {
        const credit: credit = row.getValue("credit");
        return credit.allowed ? (
          <div className="flex w-16 items-center justify-center bg-green-400 font-bold rounded rouned text-green-900">
            <div className="">True</div>
          </div>
        ) : (
          <div className="flex w-16 items-center justify-center bg-red-400 font-bold rounded text-red-900">
            <div className="">False</div>
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const credit: any = row.getValue(columnId);
        // value => two date input values
        console.log(filterStatuses);
        console.log(credit);
        //If one filter defined and date is null filter it
        if (filterStatuses.includes(credit.allowed)) return true;
        else return false;
      },
    },
    {
      header: "Credit used",
      // accessorKey: "credit",      //credit used twice
      cell: ({ row }) => {
        const credit: credit = row.getValue("credit");
        return (
          <div className="font-medium">
            {credit.allowed
              ? `${credit.used.toLocaleString("en-US")} ETB`
              : null}
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const credit: any = row.getValue(columnId);
        // value => two date input values
        console.log(filterStatuses);
        console.log(credit);
        //If one filter defined and date is null filter it
        if (filterStatuses.includes(credit.allowed)) return true;
        else return false;
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
                onClick={() =>
                  navigator.clipboard.writeText(rowdata.phone_number)
                }
              >
                Copy Phone Number
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rowdata.email)}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {rowdata.credit.allowed && (
                <DropdownMenuItem className="bg-green-400 text-white mt-2">
                  <Link href={`customer/addCredit/${rowdata.docId}`}>
                    Add Paid Credit
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="bg-blue-400 text-white mt-2">
                <Link href={`customer/editCustomer/${rowdata.docId}`}>
                  Edit Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="bg-red-400 text-white mt-2"
                // onClick={() => deleteCustomer(rowdata.docId)}
                onClick={() =>
                  toast.promise(deleteCustomer(rowdata.docId), {
                    loading: "deleting...",
                    success: (data) => {
                      return `Customer has been deleted`;
                    },
                    error: "Error",
                  })
                }
              >
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <main className="flex flex-col h-full w-full p-12 gap-8">
      <div className="flex gap-8">
        <TopCard no={1} path="topCustomers" timeLabel="This Week" />
        <TopCard no={1} path="topCustomers" timeLabel="This Month" />
        <TopCard no={1} path="topCustomers" timeLabel="This Year" />
      </div>
      <div className="">
        <CustomerDataTable
          columns={columns}
          data={customer}
          // data={people}
        />
      </div>
    </main>
  );
}
