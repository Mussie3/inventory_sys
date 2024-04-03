"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "./card";
import { useTodo } from "@/hooks/useContextData";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Customer = {
  docId: string;
  first_name: string;
  last_name: string;
  credit: { allowed: boolean; max: number; used: number };
  email: string;
  gender: string;
  phone_number: string;
  history: string[];
};

type Props = {
  customerData: Customer;
};

const FormSchema = z.object({
  paidAmount: z.string(),
});
export default function AddCreditForm({ customerData }: Props) {
  const { customer, setCustomer, cash, setCash, setCustomerLoading } =
    useTodo();
  const [paidIn, setPaidIn] = useState("cash");
  const [paidInCash, setPaidInCash] = useState(0);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function fetchCustomerdata(postdata: any) {
    // setCustomerLoading(true);
    // fetch("/api/getCustomers")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setCustomer(data.Customers);
    //     setCustomerLoading(false);
    //   })
    //   .catch((err) => {
    //     setCustomerLoading(undefined);
    //     console.log(err);
    //   });
    const newCustomer = customer.map((Cu: Customer) => {
      if (Cu.docId == postdata.customerId) {
        const editedCustomer = {
          ...Cu,
          credit: postdata.newCredit,
        };

        return editedCustomer;
      }
      return Cu;
    });

    setCustomer(newCustomer);
  }

  function fetchCashdata(postdata: any, cashId: string) {
    const newCash = [
      ...cash,
      {
        docId: cashId,
        title: `Paid debt`,
        discription: `debt paid by ${postdata.customer}`,
        amount: postdata.paidIncash,
        type: `debt`,
        datetime: new Date().toISOString(),
      },
    ];
    setCash(newCash);
  }

  async function AddCreditToCustomer(data: z.infer<typeof FormSchema>) {
    const postdata = {
      newCredit: {
        allowed: true,
        max: customerData.credit.max,
        used: customerData.credit.used - Number(data.paidAmount),
      },
      customerId: customerData.docId,
      customer: customerData.first_name,
      paidIncash:
        paidIn == "cash" ? data.paidAmount : paidIn == "mixed" ? paidInCash : 0,
      paidIn: paidIn,
    };
    const res = await fetch("/api/addCredit", {
      method: "POST",
      body: JSON.stringify(postdata),
    });

    if (res.ok) {
      const response = await res.json();
      fetchCustomerdata(postdata);
      if (response.cashId) {
        fetchCashdata(postdata, response.cashId);
      }
      router.push(`/customer/`);
      return response.result;
    }
    throw Error("error");
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSending(true);
    toast.promise(AddCreditToCustomer(data), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `$${data.paidAmount} credit has been added to "${customerData.first_name}"`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl p-8 border rounded-md m-4 ">
      <div className="text-xl">Add Credit To Custhemer</div>

      <div className="flex flex-col gap-4">
        <Card className="w-full max-w-xl">
          <CardContent className="flex flex-col gap-2 p-4">
            <div className="">
              <span className="bg-gray-400 p-1 rounded">FirstName:</span>
              {` ${customerData.first_name}`}
            </div>
            <div className="">
              <span className="bg-gray-400 p-1 rounded">LastName:</span>
              {` ${customerData.last_name}`}
            </div>
            <div className="">
              <span className="bg-gray-400 p-1 rounded">PhoneNumber:</span>
              {` ${customerData.phone_number}`}
            </div>
            <div className="">
              <span className="bg-gray-400 p-1 rounded">Email:</span>
              {` ${customerData.email}`}
            </div>

            <div className="">
              <span className="bg-gray-400 p-1 rounded">Credit:</span>
              {` ${
                customerData.credit.max == 0
                  ? "No Limit"
                  : customerData.credit.max
              }-${customerData.credit.used}`}
            </div>
          </CardContent>
        </Card>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {customerData?.credit.allowed ? (
            <div className="flex items-center gap-4">
              <span>PaidIn:</span>
              <Select
                onValueChange={(value) => setPaidIn(value)}
                defaultValue={paidIn}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="PaidIn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span>Paid-In:</span>
              <Select
                onValueChange={(value) => setPaidIn(value)}
                defaultValue={"cash"}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="PaidIn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <FormField
            control={form.control}
            name="paidAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount of the Customer paid back</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`${customerData.credit.used.toLocaleString(
                      "en-US"
                    )} ETB`}
                    max={customerData.credit.used.toString()}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {`The customer's unpaid credit is ${customerData.credit.used.toLocaleString(
                    "en-US"
                  )} ETB`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {paidIn == "mixed" && (
            <div className="flex flex-col gap-2">
              <div className="">Paid In Cash</div>
              <Input
                type="number"
                onChange={(e) => {
                  if (
                    Number(e.target.value) < Number(form.watch("paidAmount"))
                  ) {
                    setPaidInCash(Number(e.target.value));
                  }
                }}
                value={paidInCash}
                placeholder={`0 ETB`}
                max={form.watch("paidAmount")}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button disabled={sending} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
