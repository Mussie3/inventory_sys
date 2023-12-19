"use client";

// import { products } from "@/lib/products";
// import { columns } from "./columns";
import { ProductDataTable } from "./data-table";
import services from "@/services/connect";
import TopCard from "@/components/ui/topCard";
import { useTodo } from "@/hooks/useContextData";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
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
import Link from "next/link";
import { toast } from "sonner";
type Cat = {
  datetime: string;
  catagoryName: string;
  docId: string;
};

type Product = {
  image: string;
  id: string;
  invId: string;
  catagory: string;
  datetime: string;
  docId: string;
  details: string;
  unit_price: number;
  product_name: string;
};

export default function Products() {
  const { products, setProducts, catagory } = useTodo();
  console.log(products);
  console.log(catagory);

  const productsData = products.map((P: Product) => {
    return {
      ...P,
      catagory: catagory.find((c: Cat) => c.docId == P.catagory)?.catagoryName,
    };
  });

  function fetchProductdata(id: string) {
    // fetch("/api/getProducts")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setProducts(data.Products);
    //   })
    //   .catch((err) => console.log(err));

    const newProduct = products.filter((Pro: Product) => Pro.docId != id);
    setProducts(newProduct);
  }

  async function deleteProduct(id: string) {
    console.log(id);
    const res = await fetch("/api/deleteProduct", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response.success);
      if (response.success) fetchProductdata(id);
      return response.success;
    }
    throw Error;
  }

  const columns: ColumnDef<Product>[] = [
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

        return (
          <Avatar>
            <AvatarImage src={imgUrl as string} />
            <AvatarFallback>PI</AvatarFallback>
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
            Product Name
            <RiArrowUpDownFill size={16} />
          </Button>
        );
      },
      accessorKey: "product_name",
    },
    {
      header: "Catagory",
      accessorKey: "catagory",
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const catagory: any = row.getValue(columnId);
        // value => two date input values
        console.log(filterStatuses);
        console.log(catagory);
        //If one filter defined and date is null filter it
        if (filterStatuses.includes(catagory)) return true;
        else return false;
      },
    },
    {
      header: "Unit Price",
      accessorKey: "unit_price",
      cell: ({ row }) => {
        const unit_price: number = row.getValue("unit_price");

        return <div className="">{unit_price.toLocaleString("en-US")} ETB</div>;
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
            Product ID
            <RiArrowUpDownFill size={16} />
          </Button>
        );
      },
      accessorKey: "id",
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
                onClick={() =>
                  navigator.clipboard.writeText(rowdata.product_name)
                }
              >
                Copy Product Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(rowdata.unit_price.toString())
                }
              >
                Copy Product Price
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="bg-blue-400 text-white mt-2">
                <Link href={`product/editProduct/${rowdata.docId}`}>
                  Edit Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="bg-red-400 text-white mt-2"
                onClick={() =>
                  toast.promise(deleteProduct(rowdata.docId), {
                    loading: "deleting...",
                    success: (data) => {
                      return `Product has been deleted`;
                    },
                    error: "Error",
                  })
                }
              >
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    console.log("change");
  }, [products, catagory]);

  return (
    <main className="flex flex-col h-full w-full justify-between p-12 gap-8">
      <div className="flex gap-8">
        <TopCard no={1} path="topProducts" timeLabel="This Week" />
        <TopCard no={1} path="topProducts" timeLabel="This Month" />
        <TopCard no={1} path="topProducts" timeLabel="This Year" />
      </div>
      <div className="">
        <ProductDataTable
          columns={columns}
          data={productsData}
          catagory={catagory}
        />
      </div>
    </main>
  );
}
