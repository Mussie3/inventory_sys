"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import { ComboboxInventory } from "./ComboboxInventory";
import Image from "next/image";
import Link from "next/link";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";

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

type Inventory = {
  productId: string;
  datetime: string;
  docId: string;
  currentAmount: number;
  history: [{ addedAmount: number; datetime: string }];
};

type Props = {
  product: Product[];
};

export default function CreateInventoryForm({ product }: Props) {
  const {
    customer,
    setCustomer,
    inventory,
    setInventory,
    setInventoryLoading,
  } = useTodo();
  const [items, setItems] = useState<Product>();
  const [sending, setSending] = useState(false);
  console.log(product);

  const router = useRouter();

  function fetchInventorydata(invId: string, productId: string) {
    // setInventoryLoading(true);
    // fetch("/api/getInventory")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setInventory(data.Inventory);
    //     setInventoryLoading(false);
    //     router.push(`/inventory/addInventory/${invId}`);
    //   })
    //   .catch((err) => {
    //     setInventoryLoading(undefined);
    //     console.log(err);
    //   });

    const createdInv = {
      docId: invId,
      productId: productId,
      history: [],
      currentAmount: 0,
      datetime: new Date().toISOString(),
    };
    const newInventory = [
      ...inventory,
      {
        ...createdInv,
      },
    ];
    setInventory(newInventory);

    const newCustomer = customer.map((Cu: any) => {
      if (Cu.docId == productId) {
        return {
          ...Cu,
          invId: invId,
        };
      }
      return Cu;
    });
    setCustomer(newCustomer);
    router.push(`/inventory/addInventory/${invId}`);
  }

  async function creatingInventory(productId: string) {
    const res = await fetch("/api/createInventory", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response);
      if (response.result) {
        fetchInventorydata(response.result, productId);
        return response.result;
      }
      throw Error("error");
    }
  }
  async function onSubmit(productId: string) {
    console.log();

    setSending(true);
    toast.promise(creatingInventory(productId), {
      loading: "Creating Inventory ...",
      success: (res) => {
        setSending(false);
        return `Inventory has been Created `;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  return (
    <div className="w-full max-w-3xl p-8 border rounded-md m-4 flex flex-col gap-4">
      <div className="text-xl mb-8">Create Inventory</div>

      <div className="">
        <div className="mb-2 underline">Selected Product</div>
        <ComboboxInventory list={product} setProduct={setItems} />
        <div className="mt-8">
          {items ? (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 border rounded p-4 w-full mr-4">
                <div className="w-24 rounded border overflow-hidden">
                  <Image
                    src={items.image}
                    alt={items.product_name}
                    width={100}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full">
                  <div className="line-clamp-1 text-lg font-bold">
                    {items.product_name}
                  </div>
                  <div className="line-clamp-2">{items.details}</div>
                  <div className="">{items.id}</div>
                </div>
              </div>

              {items.invId ? (
                <div className="flex flex-wrap gap-4 items-center justify-between w-full">
                  <div className="text-gray-500">
                    Inventory for this product exists{" "}
                  </div>
                  <div className="flex gap-4">
                    <Button variant="link" asChild>
                      <Link href={`/inventory/addInventory/${items.invId}`}>
                        View & Add Inventory
                      </Link>
                    </Button>
                    <Button variant="link" asChild>
                      <Link href={`/inventory/editInventory/${items.invId}`}>
                        View & Edit Inventory
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-end w-full">
                  <Button
                    disabled={sending}
                    onClick={() => onSubmit(items.docId)}
                  >
                    create Inventory
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">No product is selected</div>
          )}
        </div>
      </div>
    </div>
  );
}
