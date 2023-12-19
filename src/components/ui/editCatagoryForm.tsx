"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditCat from "./editCat";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";

type cat = {
  datetime: string;
  catagoryName: string;
  docId: string;
};

type Props = {
  catagory: cat[];
};

export default function EditCatagoryForm({ catagory }: Props) {
  const { setCatagory, setCatagoryLoading } = useTodo();
  const [catagorys, setCatagorys] = useState(catagory);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  function fetchCatagorydata() {
    // setCatagoryLoading(true);
    // fetch("/api/getCatagorys")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setCatagory(data.result);
    //     setCatagoryLoading(false);
    //   })
    //   .catch((err) => {
    //     setCatagoryLoading(undefined);
    //     console.log(err);
    //   });

    setCatagory(catagorys);
  }

  async function EditCatagory() {
    const sentdata = {
      catagorys: catagorys,
    };

    const res = await fetch("/api/editCatagory", {
      method: "POST",
      body: JSON.stringify(sentdata),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response.result);
      fetchCatagorydata();
      router.push(`/product/`);
      return response.result;
    }
    throw Error("error");
  }

  async function onSubmit() {
    console.log(catagorys);

    setSending(true);
    toast.promise(EditCatagory(), {
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
    <div className="w-full max-w-3xl p-8 border rounded-md m-4">
      <div className="text-xl mb-8">Edit Catagorys</div>

      {catagorys && (
        <div className="mb-4">
          <div className="mb-2">Catagory List:</div>
          <div className="flex flex-col gap-2">
            {catagorys.map((h, i) => {
              return (
                <EditCat
                  key={h.docId}
                  cat={h}
                  func={setCatagorys}
                  catId={h.docId}
                />
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
