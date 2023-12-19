"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "./card";
import Image from "next/image";
import { useState } from "react";
import EditHistory from "./edithistory";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";

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

type Inventory = {
  productId: string;
  datetime: string;
  docId: string;
  currentAmount: number;
  history: [{ addedAmount: number; datetime: string }];
};

type Props = {
  product: Product;
  inventoryId: string;
  inventoryData: Inventory;
};

export default function EditInventoryForm({
  product,
  inventoryId,
  inventoryData,
}: Props) {
  const { inventory, setInventory, setInventoryLoading } = useTodo();
  const [history, setHistory] = useState(inventoryData?.history);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  console.log(history);

  function fetchInventorydata(postdata: any) {
    // setInventoryLoading(true);
    // fetch("/api/getInventory")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setInventory(data.Inventory);
    //     setInventoryLoading(false);
    //   })
    //   .catch((err) => {
    //     setInventoryLoading(undefined);
    //     console.log(err);
    //   });
    let sum = 0;
    inventoryData.history.forEach((element) => {
      sum += element.addedAmount;
    });

    let sold = sum - inventoryData.currentAmount;

    let currentSum = 0;
    postdata.history.forEach((element: any) => {
      currentSum += element.addedAmount;
    });

    let currentAmountinv = currentSum - sold;

    const newInventory = inventory.map((Inv: Inventory) => {
      if (Inv.docId == postdata.inventoryId) {
        return {
          ...Inv,
          history: postdata.history,
          currentAmount: currentAmountinv,
        };
      }
      return Inv;
    });
    setInventory(newInventory);
  }

  async function EditInventory() {
    const postdata = {
      history,
      inventoryId: inventoryId,
    };
    console.log(postdata);
    const res = await fetch("/api/editInventory", {
      method: "POST",
      body: JSON.stringify(postdata),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response.result);
      fetchInventorydata(postdata);
      router.push(`/inventory/`);
      return response.result;
    }
    throw Error("error");
  }

  async function onSubmit() {
    console.log(history);

    setSending(true);
    toast.promise(EditInventory(), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `Inventory has been edited`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  return (
    <div className="w-full max-w-2xl p-8 border rounded-md m-4">
      <div className="text-xl mb-8">Add To Inventory</div>

      <Card className="mb-4">
        <CardContent className="flex p-4 gap-4">
          <div className="w-44">
            <Image
              src={product.image}
              alt={product.product_name}
              width={250}
              height={300}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="">
            <h1 className="text-2xl">{product.product_name}</h1>
            <div className="text-gray-400 text-sm">{product.details}</div>
            <div className="flex gap-2">
              <span className="bg-gray-400 rounded px-1">ProductId : </span>
              <div className="">{product.id}</div>
            </div>
            <div className="flex gap-2">
              <span className="bg-gray-400 rounded px-1">Catagory :</span>{" "}
              <div className="">{product.catagory}</div>
            </div>
            <div className="flex gap-2">
              <span className="bg-gray-400 rounded px-1">price : </span>
              <div className="">
                {product.unit_price.toLocaleString("en-US")} ETB
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {history && (
        <div className="mb-4">
          <div className="mb-2">Inventory History:</div>
          <div className="flex flex-col gap-2">
            {history.map((h, i) => {
              return (
                <EditHistory key={i} his={h} func={setHistory} index={i} />
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button disabled={sending} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
