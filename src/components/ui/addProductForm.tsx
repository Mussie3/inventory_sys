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
import { Textarea } from "./textarea";
import { useEffect, useState } from "react";
import UploadImageToStorage from "./UploadImg";
import Image from "next/image";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";

const FormSchema = z.object({
  id: z.string(),
  product_name: z
    .string()
    .min(2, {
      message: "Product Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Product Name must be at max 30 characters.",
    }),
  catagory: z.string(),
  unit_price: z.string(),
  details: z
    .string()
    .min(10, {
      message: "Details must be at least 10 characters.",
    })
    .max(160, {
      message: "Details must be at max 160 characters.",
    }),
});

type cat = {
  datetime: string;
  catagoryName: string;
  docId: string;
};
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

type Props = {
  defaultValue?: Product;
  editMode?: boolean;
  docId?: string;
};

export default function AddProductForm({
  defaultValue,
  editMode,
  docId,
}: Props) {
  // const [file, setfile] = useState<File>();
  const { catagory, products, setProducts, setProductsLoading } = useTodo();
  const [sending, setSending] = useState(false);
  const [image, setImage] = useState(
    editMode ? { image: defaultValue?.image } : { image: "" }
  );
  console.log(image);

  function fetchProductdata(id: string, newData: any) {
    // setProductsLoading(true);
    // fetch("/api/getProducts")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setProducts(data.Products);
    //     setProductsLoading(false);
    //   })
    //   .catch((err) => {
    //     setProductsLoading(undefined);
    //     console.log(err);
    //   });
    let newProduct;
    if (editMode) {
      newProduct = products.map((Pro: Product) => {
        if (Pro.docId == newData.docId) {
          return {
            ...Pro,
            ...newData,
          };
        }
        return Pro;
      });

      setProducts(newProduct);
    } else {
      newProduct = [
        ...products,
        {
          docId: id,
          ...newData,
          datetime: new Date().toISOString(),
        },
      ];
      setProducts(newProduct);
    }
  }

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: defaultValue?.id,
      product_name: defaultValue?.product_name,
      catagory: defaultValue?.catagory,
      unit_price: defaultValue?.unit_price.toString(),
      details: defaultValue?.details,
    },
  });

  async function AddEditProduct(data: z.infer<typeof FormSchema>) {
    let res;
    let newData;
    if (editMode && docId) {
      newData = {
        ...data,
        image: image.image,
        docId: docId,
      };

      res = await fetch("/api/editProduct", {
        method: "POST",
        body: JSON.stringify(newData),
      });
    } else {
      newData = {
        ...data,
        image: image.image,
      };
      res = await fetch("/api/addProduct", {
        method: "POST",
        body: JSON.stringify(newData),
      });
    }

    if (res.ok) {
      const response = await res.json();
      console.log(response.result);
      if (response.alreadyExist) {
        throw Error(`a product with ${data.id} already exists`);
      } else {
        fetchProductdata(response.result, newData);
        router.push(`/product/`);
        return response.result;
      }
    }
    throw Error("error");
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    setSending(true);
    toast.promise(AddEditProduct(data), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `Product has been ${editMode ? "edited" : "added"}`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  if (!catagory) return null;
  return (
    <div className="w-full max-w-4xl p-8 border rounded-md m-4">
      <div className="text-xl mb-8">Add a Product</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap gap-6">
            {!editMode && (
              <div className="w-full xl:w-96">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Product ID" {...field} />
                      </FormControl>
                      {/* <FormDescription>Input your user name.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="w-full xl:w-96">
              <FormField
                control={form.control}
                name="product_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
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
                name="catagory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catagory</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Catagory" />
                        </SelectTrigger>
                        <SelectContent>
                          {catagory.map((cat: cat) => (
                            <SelectItem key={cat.docId} value={cat.docId}>
                              {cat.catagoryName}
                            </SelectItem>
                          ))}
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
                name="unit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Unit Price"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>Input your user password.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full xl:w-[600px]">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Input Discription of the Product"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>Input your user password.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 w-full xl:w-[600px] ">
              <FormLabel>Image File</FormLabel>

              <UploadImageToStorage setURL={setImage} path="product/" />

              <div className="w-[200px] h-[200px] border-2 rounded-md overflow-hidden">
                {image.image && (
                  <Image
                    src={image.image}
                    alt={image.image}
                    className="object-cover h-full "
                    width={200}
                    height={200}
                  />
                )}
              </div>
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
