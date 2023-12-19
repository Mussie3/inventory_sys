"use client";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { FiFilter } from "react-icons/fi";
import { BsFilterRight } from "react-icons/bs";
import { useTodo } from "@/hooks/useContextData";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { DatePicker } from "@/components/ui/datePicker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  catagory: any;
}
type ctype = {
  datetime: string;
  docId: string;
  catagoryName: string;
};

export function ProductDataTable<TData, TValue>({
  columns,
  data,
  catagory,
}: DataTableProps<TData, TValue>) {
  const { productsLoading, catagoryLoading } = useTodo();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "datetime", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();

  const [catagoryFilter, setCatagoryFilter] = useState<string[]>([]);

  console.log(columnFilters);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  function minDateFun(e: any) {
    setMinDate(e.target.value);
  }

  function maxDateFun(e: any) {
    setMaxDate(e.target.value);
  }

  useEffect(() => {
    setColumnFilters((pre) => {
      if (pre.find((f) => f.id == "datetime")) {
        return pre.map((f) => {
          if (f.id == "datetime") {
            return {
              id: "datetime",
              value: `${minDate ? minDate : ""},${maxDate ? maxDate : ""}`,
            };
          }
          return f;
        });
      }
      return [
        ...pre,
        {
          id: "datetime",
          value: `${minDate ? minDate : ""},${maxDate ? maxDate : ""}`,
        },
      ];
    });
  }, [minDate, maxDate]);

  useEffect(() => {
    setColumnFilters((pre) => {
      if (pre.find((f) => f.id == "catagory")) {
        return pre.map((f) => {
          if (f.id == "catagory") {
            return {
              id: "catagory",
              value: catagoryFilter,
            };
          }
          return f;
        });
      }

      return [
        ...pre,
        {
          id: "catagory",
          value: catagoryFilter,
        },
      ];
    });
  }, [catagoryFilter]);

  function clearFilterDate() {
    setMaxDate(undefined);
    setMinDate(undefined);
  }

  console.log(catagory);

  console.log(productsLoading);
  if (productsLoading == undefined)
    return (
      <div className="w-full flex justify-center p-24">
        <span>Error occured while fetching Data</span>
      </div>
    );

  return (
    <div className="">
      {/* input */}
      <div className="flex items-center gap-8">
        <div className="">
          <Button variant="secondary" asChild>
            <Link href="/product/addCatagory">add Catagory</Link>
          </Button>
        </div>
        <div className="">
          <Button variant="secondary" asChild>
            <Link href="/product/editCatagory">Edit Catagory</Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-8">
          <Input
            placeholder="Filter Product Name"
            value={
              (table.getColumn("product_name")?.getFilterValue() as string) ||
              ""
            }
            onChange={(e) => {
              table.getColumn("product_name")?.setFilterValue(e.target.value);
            }}
            className="w-full md:min-w-[400px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <FiFilter size={16} />
                <div className="pl-2">Catagory</div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {catagoryLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {/* Loading Data... */}
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : (
                catagory.map((cat: ctype) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={cat.docId}
                      className="capitalize"
                      checked={catagoryFilter.includes(cat.catagoryName)}
                      onCheckedChange={(value) => {
                        const arr = catagoryFilter;
                        if (value) {
                          //checking weather array contain the id
                          arr.push(cat.catagoryName); //adding to array because value doesnt exists
                        } else {
                          arr.splice(arr.indexOf(cat.catagoryName), 1); //deleting
                        }
                        console.log(arr);
                        setCatagoryFilter([...arr]);
                        console.log(catagoryFilter);
                      }}
                    >
                      {cat.catagoryName}
                    </DropdownMenuCheckboxItem>
                  );
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex min-w-fit gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <FiFilter size={16} />
                  <div className="pl-2">Date Filter</div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-lg">Date</DropdownMenuLabel>
                <div className="flex flex-col items-end gap-4 p-4">
                  <div className="flex items-center gap-2">
                    <span> From:</span>
                    <Input
                      type={"date"}
                      value={minDate}
                      onChange={(e) => minDateFun(e)}
                      className="w-full md:min-w-[200px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>To:</span>
                    <Input
                      type={"date"}
                      value={maxDate}
                      onChange={(e) => maxDateFun(e)}
                      className="w-full md:min-w-[200px]"
                    />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {(minDate || maxDate) && (
              <div className="flex gap-4 items-center">
                <span>
                  {minDate ? `${minDate} to ` : "Before to "}
                  {maxDate ? maxDate : "Current"}
                </span>
                <Button variant="secondary" onClick={clearFilterDate}>
                  Clear Date Filter
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="">
            <Button asChild>
              <Link href="/product/addProduct">Add Product</Link>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <BsFilterRight size={16} />
                <div className="pl-2">View</div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {productsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {/* Loading Data... */}
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"} //not nessesary
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={cell.id}
                      // className={`${
                      //   i == 0 || i == 1 || i == 7 ? "w-[100px]" : ""
                      // }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      <div className="flex items-center justify-between gap-2 py-2">
        <div className="f1ex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>

        <div className="flex gap-4 items-center">
          <div className="f1ex-1 text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Pre
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDataTable;
