"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./scroll-area";
import Image from "next/image";

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

type Props = {
  list: Product[];
  setProduct: any;
};
export function ComboboxInventory({ list, setProduct }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  console.log(value);
  const FW = list.map((c) => {
    return {
      value: c.docId,
      label: c.product_name,
      productId: c.id,
      image: c.image,
    };
  });
  console.log(FW);

  function selectCustomer() {
    const selectedCustomer = list.filter((c) => c.docId === value)[0];
    setProduct(selectedCustomer);
    console.log(selectedCustomer);
  }
  const selected = FW.find((framework) => framework.value === value);

  return (
    <div className="flex gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-96 justify-between"
          >
            {value
              ? list.find((p: Product) => p.docId == value)?.product_name
              : "Select Products..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-96 p-0">
          <ScrollArea className="h-96 w-96 rounded-md border">
            <Command>
              <CommandInput placeholder="Search Product..." />
              <CommandEmpty>No Product found.</CommandEmpty>
              <CommandGroup>
                {FW.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    // value={`${framework.firstName} ${framework.lastName}`}
                    onSelect={() => {
                      setValue(framework.value);
                      setOpen(false);
                    }}
                  >
                    {" "}
                    <Check
                      className={cn(
                        "mr-2 h-8 w-8",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />{" "}
                    <div className="flex gap-2 border rounded p-2 w-full mr-4">
                      <div className="min-w-[50px] w-fit">
                        <Image
                          src={framework.image}
                          alt={framework.label}
                          width={50}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="">
                        <div className="line-clamp-1 text-lg">
                          {framework.label}
                        </div>
                        <div className="line-clamp-2">
                          {framework.productId}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Button onClick={selectCustomer}>Select Product</Button>
    </div>
  );
}
