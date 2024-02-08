import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import { Input } from "./input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "./button";

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

type Items = {
  productId: string;
  product: Product;
  no: number;
  discount_per_unit: number;
};

interface Props {
  product: Items;
  items: Items[];
  setItems: any;
}

export default function EditSaleProductModel({
  product,
  items,
  setItems,
}: Props) {
  const [itemsNumber, setItemsNumber] = useState<Items>(product);

  function subtruct() {
    setItemsNumber((pre) => {
      return { ...pre, no: pre.no - 1 };
    });
  }

  function add(id: string) {
    setItemsNumber((pre) => {
      return { ...pre, no: pre.no + 1 };
    });
  }

  function setNumber(Num: number) {
    setItemsNumber((pre) => {
      return { ...pre, no: Num };
    });
  }

  function setDiscount(Num: number) {
    setItemsNumber((pre) => {
      return { ...pre, discount_per_unit: Num };
    });
  }

  function setUpdate() {
    const newItems = items.map((item) => {
      if (item.productId == itemsNumber.productId) {
        return itemsNumber;
      }
      return item;
    });
    const deletezero = newItems.filter((item) => item.no != 0);

    setItems(deletezero);
  }

  return (
    <Dialog>
      <DialogTrigger className="border border-transparent hover:border-green-300 rounded p-1">
        <MdEdit color={`green`} size={24} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product : {product.product.product_name}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-3 items-end">
              <div className="flex gap-4 mt-2 w-full border rounded p-2">
                <div className="w-[140px] h-[160px] border rounded overflow-hidden">
                  <Image
                    src={product.product.image}
                    alt={product.product.product_name}
                    width={150}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">
                      {product.product.product_name}
                    </h1>
                    <div className="line-clamp-1">
                      {product.product.details}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <button
                          className="flex items-center justify-center border cursor-pointer border-green-300 rounded w-8 h-8"
                          disabled={itemsNumber.no == 0}
                          onClick={() => subtruct()}
                        >
                          -
                        </button>
                        <span>
                          <Input
                            id="itemsNumber"
                            type="number"
                            placeholder="Product Number"
                            className="w-[80px] h-8"
                            min={0}
                            required
                            value={itemsNumber.no}
                            onChange={(e) => setNumber(Number(e.target.value))}
                          />
                        </span>
                        <button
                          className="flex items-center justify-center border cursor-pointer border-green-300 rounded w-8 h-8"
                          onClick={() => add(product.productId)}
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="">Discount Per Unit</div>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="DiscountPerUnit"
                            type="number"
                            placeholder="Discount Per Unit"
                            className="w-[80px] h-8"
                            min={0}
                            required
                            value={itemsNumber.discount_per_unit}
                            onChange={(e) =>
                              setDiscount(Number(e.target.value))
                            }
                          />
                          <div className="">Birr</div>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      {product.product.unit_price.toLocaleString("en-US")} ETB
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={setUpdate}>
                  <DialogPrimitive.Close>Update</DialogPrimitive.Close>
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
