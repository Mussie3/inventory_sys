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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Checkbox } from "./checkbox";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";

const FormSchema = z.object({
  first_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "lastname must be at least 2 characters.",
  }),
  gender: z.string(),
  email: z.string().email(),
  phone_number: z
    .string()
    .min(9, {
      message: "Phone number must be at '251' + 9 characters.",
    })
    .max(9, {
      message: "Phone number must be at '251' + 9 characters.",
    }),
  // creditAmount: z.string(),
  // creditUsed: z.string(),
  discount: z
    .string()
    .min(0, {
      message: "Discount must be at least 0%.",
    })
    .max(20, {
      message: "Discount must be at least 20%.",
    }),
});

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
  defaultValue?: Customer;
  editMode?: boolean;
  docId?: string;
};

export default function AddCustomerForm({
  defaultValue,
  editMode,
  docId,
}: Props) {
  const { customer, setCustomer, setCustomerLoading } = useTodo();
  const [allowed, setAllowed] = useState(
    editMode ? defaultValue?.credit.allowed : false
  );
  const [sending, setSending] = useState(false);
  const [max, setMax] = useState(editMode ? defaultValue?.credit.max : 0);
  const [used, setUsed] = useState(editMode ? defaultValue?.credit.used : 0);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: defaultValue?.first_name,
      last_name: defaultValue?.last_name,
      gender: defaultValue?.gender,
      email: defaultValue?.email,
      phone_number: defaultValue?.phone_number.toString(),
      // creditAmount: defaultValue?.credit.max.toString(),
      // creditUsed: defaultValue?.credit.used.toString(),
      discount: defaultValue?.discount.toString(),
    },
  });

  function fetchCustomerdata(id: string, newData: any) {
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
    let newCustomer;
    if (editMode) {
      newCustomer = customer.map((Cu: Customer) => {
        if (Cu.docId == newData.docId) {
          const editedCustomer = {
            ...Cu,
            email: newData.email,
            first_name: newData.first_name,
            last_name: newData.last_name,
            gender: newData.gender,
            phone_number: newData.phone_number,
            credit: {
              allowed: newData.allowed,
              max: Number(newData.max),
              used: Number(newData.used),
            },
            discount: Number(newData.discount),
          };

          return editedCustomer;
        }
        return Cu;
      });

      setCustomer(newCustomer);
    } else {
      const createdCustomer = {
        docId: id,
        credit: {
          allowed: newData.allowed,
          max: Number(newData.max),
          used: Number(newData.used),
        },
        email: newData.email,
        first_name: newData.first_name,
        last_name: newData.last_name,
        gender: newData.gender,
        phone_number: newData.phone_number,
        discount: Number(newData.discount),
        history: [],
      };
      newCustomer = [...customer, createdCustomer];
      setCustomer(newCustomer);
    }
  }

  async function AddEditCustomer(data: z.infer<typeof FormSchema>) {
    let res;
    let newData;
    if (editMode && docId) {
      newData = {
        ...data,
        allowed: allowed,
        max: max,
        used: used,
        docId: docId,
      };
      res = await fetch("/api/editCustomer", {
        method: "POST",
        body: JSON.stringify(newData),
      });
    } else {
      newData = {
        ...data,
        allowed: allowed,
        max: max,
        used: used,
      };

      res = await fetch("/api/addCustomer", {
        method: "POST",
        body: JSON.stringify(newData),
      });
    }

    if (res.ok) {
      const response = await res.json();
      console.log(response.result);
      fetchCustomerdata(response.result, newData);
      router.push(`/customer/`);
      return response.result;
    }
    throw Error("error");
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    setSending(true);
    toast.promise(AddEditCustomer(data), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `Customer has been ${editMode ? "edited" : "added"}`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  return (
    <div className="w-full max-w-5xl p-8 border rounded-md m-4">
      <div className="text-xl mb-8">Add a Customer</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap gap-4">
            <div className="w-full xl:w-96">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    {/* <FormDescription>Input your user name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full xl:w-96">
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    {/* <FormDescription>Input your user password.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full xl:w-96">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    {/* <FormDescription>Input your user password.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full xl:w-96">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center border rounded-l-md h-10 pl-4 pr-1 bg-gray-500/20">
                          <span>251+</span>
                        </div>
                        <Input
                          type="number"
                          placeholder="Phone Number"
                          {...field}
                          className=" rounded-l-none border-l-0"
                        />
                      </div>
                    </FormControl>
                    {/* <FormDescription>Input your user password.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <Checkbox
              id="allow"
              checked={allowed}
              onCheckedChange={() => setAllowed((pre) => !pre)}
            />
            <label htmlFor="allow">Credit Allowed</label>
          </div>

          {allowed ? (
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2 w-full xl:w-96">
                <label htmlFor="max">Credit Allowed For The Customer</label>
                <Input
                  id="max"
                  type="number"
                  placeholder="5000"
                  min={0}
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                />
                <div className="text-gray-400">
                  If left 0 then the customer will have no credit limit
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full xl:w-96">
                <label htmlFor="max">Credit Used by The Customer</label>
                <Input
                  id="max"
                  type="number"
                  placeholder="5000"
                  min={0}
                  value={used}
                  onChange={(e) => setUsed(Number(e.target.value))}
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4">
            <div className="w-full xl:w-96">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Discount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="15">15%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {/* <FormDescription>Input your user password.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full xl:w-96">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {/* <FormDescription>Input your user password.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
