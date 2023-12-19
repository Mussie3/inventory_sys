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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { FiFilter } from "react-icons/fi";
import { useTodo } from "@/hooks/useContextData";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import ReFetchAllDataButton from "@/components/ui/reFetchAllDataButton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function CustomerDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { customerLoading } = useTodo();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [creditFilter, setCreditFilter] = useState<boolean[]>([]);

  //   console.log(rowSelection);

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

  useEffect(() => {
    setColumnFilters((pre) => [
      ...pre,
      {
        id: "credit",
        value: creditFilter,
      },
    ]);
  }, [creditFilter]);

  if (customerLoading == undefined)
    return (
      <div className="w-full flex flex-col items-center justify-center  gap-2 p-24">
        <span>Error occured while fetching Data</span>
      </div>
    );

  return (
    <div className="">
      {/* input */}
      <div className="flex items-center justify-between my-4">
        <div className="flex gap-6">
          <Input
            placeholder="Filter First name"
            value={
              (table.getColumn("first_name")?.getFilterValue() as string) || ""
            }
            onChange={(e) => {
              table.getColumn("first_name")?.setFilterValue(e.target.value);
            }}
            className="w-full md:min-w-[400px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto min-w-fit">
                <FiFilter size={16} />
                <div className="pl-2">Credit Allowed</div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[true, false].map((p, i) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={i}
                    className="capitalize"
                    checked={creditFilter.includes(p)}
                    onCheckedChange={(value) => {
                      const arr = creditFilter;
                      if (value) {
                        //checking weather array contain the id
                        arr.push(p); //adding to array because value doesnt exists
                      } else {
                        arr.splice(arr.indexOf(p), 1); //deleting
                      }
                      console.log(arr);
                      setCreditFilter([...arr]);
                      console.log(creditFilter);
                    }}
                  >
                    <div
                      className={`flex items-center justify-center font-bold rounded rouned w-full px-2 ${
                        p == true
                          ? "bg-green-400  text-green-900"
                          : "bg-yellow-400  text-yellow-900"
                      }`}
                    >
                      <div className="">{p ? "True" : "False"}</div>
                    </div>
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-8">
          <div className="">
            <Button asChild>
              <Link href="/customer/addCustomer">Add Customer</Link>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column, i) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={i}
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
            {customerLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {/* Loading Data... */}
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : table?.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"} //not nessesary
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

export default CustomerDataTable;
