"use client";
import { ProductDataTable } from "./data-table";
import TotalCard from "@/components/ui/totalCard";
import { useTodo } from "@/hooks/useContextData";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { toast } from "sonner";
import TodaySalesCard from "@/components/ui/TodaySalesCard";

type Items = {
  productId: string;
  productDocId: string;
  no: number;
  discount_per_unit: number;
};

type Sales = {
  customer: string;
  items: Items[];
  totalAmount: number;
  paidInPrices: PaidInPrice;
  docId: string;
  paidIn: string;
  cashId: string;
  datetime: string;
};

type PaidInPrice = {
  cash: number;
  credit: number;
  POS: number;
  transfer: number;
};

type Customer = {
  docId: string;
  first_name: string;
  last_name: string;
  credit: { allowed: boolean; max: number; used: number };
  email: string;
  gender: string;
  phone_number: string;
  history: string[];
};

type Product = {
  image: string;
  id: string;
  invId: string;
  datetime: string;
  catagory: string;
  docId: string;
  details: string;
  unit_price: number;
  product_name: string;
};

type SalesViewData = {
  productsD: Product[];
  customerD: Customer | string;
  customer: string;
  productId: string;
  datetime: string;
  docId: string;
  totalAmount: number;
  paidInPrices: PaidInPrice;
  paidIn: string;
  items: Items[];
};

export default function Sales() {
  const { products, setProducts, customer, setCustomer, sales, setSales } =
    useTodo();
  // products.forEach((C) => {
  //   services.AddProduct(C);
  // });

  function fetchSalesdata(id: string) {
    // fetch("/api/getSales")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setSales(data.Sales);
    //   })
    //   .catch((err) => console.log(err));
    const newSales = sales.filter((sale: Sales) => sale.docId != id);
    setSales(newSales);
  }

  if (!products) {
    return <div className="">can not get any data found</div>;
  }

  const salesViewData = sales.map((s: Sales) => {
    const productD = products.filter(
      (p: Product) => {
        return s.items.find((item) => {
          return p.docId === item.productDocId;
        });
      }
      // p.docId === s.items[0].productId || p.docId === s.items[1].productId
    );
    const customerD = customer.filter(
      (c: Customer) => c.docId === s.customer
    )[0];

    const detailsP = {
      productsD: productD,
      customerD: customerD ? customerD : "XXXX",
    };

    return {
      ...s,
      ...detailsP,
    };
  });

  async function deleteSales(id: string) {
    const res = await fetch("/api/deleteSales", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const response = await res.json();

      if (response.success) fetchSalesdata(id);
      return response.success;
    }
    throw Error("error");
  }

  const columns: ColumnDef<SalesViewData>[] = [
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
      header: "Products",
      accessorKey: "productsD",
      cell: ({ row }) => {
        const Allproducts: Product[] = row.getValue("productsD");

        const Allnames = Allproducts.map((g) => g.product_name);

        return <div className="">{Allnames.join(" , ")}</div>;
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
            Customer Name
            <RiArrowUpDownFill size={16} />
          </Button>
        );
      },
      accessorKey: "customerD",
      cell: ({ row }) => {
        const customer: Customer = row.getValue("customerD");
        return (
          <div className="">
            {customer?.first_name ? customer?.first_name : "XXXX"}
          </div>
        );
      },
      filterFn: (row, columnId, filterStatuses) => {
        if (!filterStatuses) return true;
        const customer: Customer = row.getValue(columnId);
        // value => two date input values
        //If one filter defined and date is null filter it
        let allCharactersExist = true;
        const text = customer.first_name ? customer.first_name : customer;
        let name = text.toString().toLowerCase();
        for (let i = 0; i < filterStatuses.length; i++) {
          const caracter = filterStatuses[i].toLowerCase();
          if (!name.includes(caracter)) {
            allCharactersExist = false;
            break;
          } else {
            name = name.replace(caracter, "");
          }
        }
        return allCharactersExist;
      },
    },
    {
      header: "Paid-In",
      accessorKey: "paidIn",
      cell: ({ row }) => {
        const paidIn = row.getValue("paidIn");
        if (paidIn == "credit") {
          return (
            <div className="flex items-center justify-center bg-red-400 font-bold rounded rouned text-red-50 w-[70px]">
              <div className="">Credit</div>
            </div>
          );
        } else if (paidIn == "cash") {
          return (
            <div className="flex items-center justify-center bg-green-400 font-bold rounded text-green-50 w-[70px]">
              <div className="">Cash</div>
            </div>
          );
        } else if (paidIn == "mixed") {
          return (
            <div className="flex items-center justify-center bg-orange-400 font-bold rounded text-orange-50 w-[70px]">
              <div className="">Mixed</div>
            </div>
          );
        } else if (paidIn == "transfer") {
          return (
            <div className="flex items-center justify-center bg-violet-400 font-bold rounded text-violet-50 w-[70px]">
              <div className="">Transfer</div>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center bg-blue-400 font-bold rounded text-blue-50 w-[70px]">
              <div className="">POS</div>
            </div>
          );
        }
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const paidIn: any = row.getValue(columnId);
        // value => two date input values

        //If one filter defined and date is null filter it
        if (filterStatuses.includes(paidIn)) return true;
        else return false;
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
            Total Amount
            <RiArrowUpDownFill size={16} />
          </Button>
        );
      },
      accessorKey: "totalAmount",
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
        const name =
          typeof rowdata.customerD == "object"
            ? rowdata.customerD.first_name
            : "XXXX";

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
                onClick={() => navigator.clipboard.writeText(name)}
              >
                Copy Customer Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(rowdata.totalAmount.toString())
                }
              >
                Copy Total Price
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="bg-blue-400 text-white mt-2">
                <Link href={`sales/editSales/${rowdata.docId}`}>
                  Edit Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="bg-red-400 text-white mt-2"
                // onClick={() => deleteSales(rowdata.docId)}
                onClick={() =>
                  toast.promise(deleteSales(rowdata.docId), {
                    loading: "deleting sales...",
                    success: (data) => {
                      return `Sales has been deleted`;
                    },
                    error: "Error",
                  })
                }
              >
                Delete Sales
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <main className="flex flex-col h-full w-full justify-between p-12 gap-8">
      <div className="">
        <div className="flex gap-8">
          <TodaySalesCard type="Total" />
          <TodaySalesCard type="Cash" />
        </div>
        <ProductDataTable
          columns={columns}
          data={salesViewData ? salesViewData : []}
        />
      </div>
    </main>
  );
}
