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

// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ];

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

type Props = {
  list: Customer[];
  setCustomer: any;
  defultValue?: string;
};
export function Combobox({ list, setCustomer, defultValue }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defultValue ? defultValue : "");
  console.log(value);
  const FW = list.map((c) => {
    return {
      value: c.docId,
      firstName: c.first_name,
      lastName: c.last_name,
      email: c.email,
    };
  });
  console.log(FW);

  function selectCustomer() {
    const selectedCustomer = list.filter((c) => c.docId === value)[0];
    setCustomer(selectedCustomer);
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
            {value ? (
              <span>{`${selected?.firstName} ${selected?.lastName}`}</span>
            ) : (
              "Select Customer..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-96 p-0">
          <ScrollArea className="h-96 w-96 rounded-md border">
            <Command>
              <CommandInput placeholder="Search Customer..." />
              <CommandEmpty>No Customer found.</CommandEmpty>
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
                        "mr-2 h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="border rounded p-2 w-full mr-4">
                      <div className=" text-lg">{`${framework.firstName} ${framework.lastName}`}</div>
                      <div className="">{framework.email}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Button onClick={selectCustomer}>Select Customer</Button>
    </div>
  );
}
