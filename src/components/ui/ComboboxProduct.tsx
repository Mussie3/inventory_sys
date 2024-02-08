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
import { toast } from "sonner";
import { Input } from "./input";

type Items = {
  productId: string;
  productDocId: string;
  product: Product;
  no: number;
  discount_per_unit: number;
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

type Props = {
  list: Product[];
  setItems: any;
};
export function ComboboxProduct({ list, setItems }: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product>();
  const [toggleById, setToggleById] = React.useState(false);
  const [pestedProductId, setPestedProductId] = React.useState("");
  const [pestedValue, setPestedValue] = React.useState("");

  const FW = list.map((c) => {
    return {
      value: c.docId,
      label: c.product_name,
      productId: c.id,
      image: c.image,
    };
  });
  console.log(FW);

  function addproduct() {
    if (selectedProduct) {
      setItems((pre: Items[]) => {
        const exist = pre.find(
          (p: any) => p?.productId === selectedProduct?.id
        );
        if (exist) {
          //map
          return pre.map((item) => {
            if (item.productId == selectedProduct?.id) {
              return {
                ...item,
                no: item.no + 1,
              };
            }
            return item;
          });
        } else {
          return [
            ...pre,
            {
              productId: selectedProduct.id,
              productDocId: selectedProduct.docId,
              product: selectedProduct,
              no: 1,
              discount_per_unit: 0,
            },
          ];
        }
      });
    }
    // setItems()
  }

  function AddProductById(event: any) {
    console.log(event.clipboardData.getData("text/plain"));

    const value = event?.clipboardData?.getData("text/plain");

    setTimeout(() => {
      setPestedValue(value);
      setPestedProductId("");
    }, 1000);
    setTimeout(() => {
      setPestedValue("");
    }, 100);
  }

  function AddProductByIdButton() {
    console.log(pestedProductId);

    setPestedValue(pestedProductId);
    setPestedProductId("");
  }

  React.useEffect(() => {
    console.log(pestedValue);
    if (pestedValue != "") {
      let newItems;
      setItems((pre: Items[]) => {
        const exist = pre.find((item) => item.productId == pestedValue);
        if (exist) {
          return pre.map((item: any) => {
            if (item.product.id == exist.productId) {
              return {
                ...item,
                no: item.no + 1,
              };
            }
            return item;
          });
        } else {
          const product = list.find((item) => item.id == pestedValue);
          if (product) {
            return [
              ...pre,
              {
                productId: product.id,
                productDocId: product.docId,
                product: product,
                no: 1,
                discount_per_unit: 0,
              },
            ];
          } else {
            toast.error(`No product with "${pestedValue}" ID`);
            return pre;
          }
        }
      });
    }
  }, [pestedValue, list, setItems]);

  return (
    <div className="flex flex-col gap-4">
      {toggleById ? (
        <div className="flex gap-8">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-96 justify-between"
              >
                {selectedProduct
                  ? selectedProduct.product_name
                  : "Select Products..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className=" w-96 p-0">
              <ScrollArea className="max-h-96 h-96 w-96 rounded-md border">
                <Command>
                  <CommandInput placeholder="Search Product..." />
                  <CommandEmpty>No Product found.</CommandEmpty>
                  <CommandGroup>
                    {list.map((framework) => (
                      <CommandItem
                        key={framework.docId}
                        // value={framework.product_name}
                        onSelect={() => {
                          // const arr: any = value;
                          // const found = arr.find(
                          //   (a: any) => a.docId === framework.docId
                          // );
                          // if (!found) {
                          //   //checking weather array contain the id
                          //   arr.push(framework); //adding to array because value doesnt exists
                          // } else {
                          //   arr.splice(arr.indexOf(framework), 1); //deleting
                          //   // setItems((pre: any) => {
                          //   //   return pre.map((item: any) => {
                          //   //     if (item.product.docId == framework.docId) {
                          //   //       console.log("g");
                          //   //       return {
                          //   //         ...item,
                          //   //         no: item.no + 1,
                          //   //       };
                          //   //     }
                          //   //     return item;
                          //   //   });
                          //   // });
                          // }
                          // console.log(arr);
                          // // setCatagoryFilter([...arr]);
                          // // console.log(catagoryFilter);
                          // setValue(arr);
                          setSelectedProduct(framework);
                          setOpen(false);
                        }}
                      >
                        {" "}
                        <Check
                          className={cn(
                            "mr-2 h-8 w-8",
                            selectedProduct?.id == framework.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex gap-2 border rounded p-2 w-full mr-4">
                          <div className="w-[70px] h-[100px] border rounded overflow-hidden">
                            <Image
                              src={framework.image}
                              alt={framework.product_name}
                              width={70}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="">
                            <div className="line-clamp-1">
                              {framework.product_name}
                            </div>
                            <div className="line-clamp-2 text-sm">
                              {framework.details}
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
          <Button onClick={addproduct}>Add Product</Button>

          <Button
            variant="secondary"
            onClick={() => setToggleById((pre) => !pre)}
          >
            Add By ID
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-8">
            {" "}
            <Input
              // type="number"
              placeholder="Paste Product ID here"
              autoFocus
              value={pestedProductId}
              onChange={(e) => setPestedProductId(e.target.value)}
              className="w-96"
              onPaste={AddProductById}
            />
            <Button onClick={AddProductByIdButton} className="min-w-fit">
              Add Product
            </Button>
            <Button
              variant="secondary"
              onClick={() => setToggleById((pre) => !pre)}
            >
              Add By Name
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
