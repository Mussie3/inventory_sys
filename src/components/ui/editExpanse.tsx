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

type Expanse = {
  docId: string;
  title: string;
  discription: string;
  amount: string;
  datetime: string;
};

type Props = {
  oldexpanse: Expanse;
};

export function EditExpanse({ oldexpanse }: Props) {
  const { expanse, setExpanse, setExpanseLoading } = useTodo();
  const [sending, setSending] = useState(false);
  console.log(oldexpanse);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: oldexpanse.title,
      discription: oldexpanse.discription,
      amount: oldexpanse.amount,
    },
  });

  function fetchExpansedata(id: string, newdata: any) {
    const newExpanse = expanse.map((Pro: Expanse) => {
      if (Pro.docId == id) {
        const updatedUser = {
          docId: id,
          ...newdata,
        };
        return {
          ...Pro,
          ...updatedUser,
        };
      }
      return Pro;
    });

    setExpanse(newExpanse);
  }

  async function EditExpanse(data: z.infer<typeof FormSchema>) {
    const newdata = {
      docId: oldexpanse.docId,
      ...data,
    };

    const res = await fetch("/api/editExpanse", {
      method: "POST",
      body: JSON.stringify(newdata),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response);
      if (!response.updated) {
        throw Error("Expanse not updated");
      }
      if (response.updated) {
        fetchExpansedata(oldexpanse.docId, newdata);
        router.push(`/expanse/`);
        return response.updated;
      }
    }

    throw Error("error");
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSending(true);
    toast.promise(EditExpanse(data), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `Expanse "${data.title}" has been Edited`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  return (
    <div className="w-full max-w-xl m-4 flex flex-col gap-4 p-8 border rounded-md">
      <div className="text-xl mb-8">Edit Expanse</div>
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
                <FormLabel>Expanse Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Expanse Amount" {...field} />
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
