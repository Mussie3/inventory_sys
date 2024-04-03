"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  discription: z.string().min(2, {
    message: "discription must be at least 6 characters.",
  }),
  amount: z.string(),
});

type Cash = {
  docId: string;
  title: string;
  discription: string;
  amount: string;
  type: string;
  datetime: string;
};

type Props = {
  oldcash: Cash;
};

export function EditCash({ oldcash }: Props) {
  const { cash, setCash, cashLoading } = useTodo();
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: oldcash.title,
      discription: oldcash.discription,
      amount: oldcash.amount,
    },
  });

  function fetchCashdata(id: string, newdata: any) {
    const newCash = cash.map((Pro: Cash) => {
      if (Pro.docId == id) {
        const updatedCash = {
          docId: id,
          ...newdata,
        };
        return {
          ...Pro,
          ...updatedCash,
        };
      }
      return Pro;
    });

    setCash(newCash);
  }

  async function EditCash(data: z.infer<typeof FormSchema>) {
    const newdata = {
      docId: oldcash.docId,
      ...data,
    };

    const res = await fetch("/api/editCash", {
      method: "POST",
      body: JSON.stringify(newdata),
    });

    if (res.ok) {
      const response = await res.json();
      if (!response.updated) {
        throw Error("Cash not updated");
      }
      if (response.updated) {
        fetchCashdata(oldcash.docId, newdata);
        router.push(`/cash/`);
        return response.updated;
      }
    }

    throw Error("error");
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSending(true);
    toast.promise(EditCash(data), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `Cash "${data.title}" has been Edited`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  return (
    <div className="w-full max-w-xl m-4 flex flex-col gap-4 p-8 border rounded-md">
      <div className="text-xl mb-8">Edit Cash</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discription</FormLabel>
                <FormControl>
                  <Input placeholder="Discription" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cash Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Cash Amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end items-center w-full mt-2">
            <Button disabled={sending} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
