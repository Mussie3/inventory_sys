"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useRef, useState } from "react";
import { Combobox } from "./Combobox";
import { ComboboxProduct } from "./ComboboxProduct";
import { Card, CardContent } from "./card";
import Image from "next/image";
import { Checkbox } from "./checkbox";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";
import { Input } from "./input";
import EditSaleProductModel from "./EditSaleProductModel";
import { MdDeleteForever } from "react-icons/md";

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

type Inventory = {
  productId: string;
  datetime: string;
  docId: string;
  currentAmount: number;
  history: [{ addedAmount: number; datetime: string }];
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

type Items = {
  productId: string;
  productDocId: string;
  product: Product;
  no: number;
  discount_per_unit: number;
};

export default function AddSalesForm() {
  const {
    products,
    customer,
    setCustomer,
    sales,
    setSales,
    setSalesLoading,
    inventory,
    setInventory,
    setInventoryLoading,
  } = useTodo();
  const [sending, setSending] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();
  const [items, setItems] = useState<Items[]>([]);
  const [paidIn, setPaidIn] = useState("cash");
  const [discounted, setDiscounted] = useState(false);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [Incash, setIncash] = useState<number>(0);

  console.log(selectedCustomer);

  const router = useRouter();
  let SubTotal: number = 0;

  let Total: number = SubTotal;

  items.forEach(
    (item) =>
      (SubTotal =
        SubTotal +
        Math.floor(
          (item.product.unit_price - item.discount_per_unit) * item.no
        ))
  );
  const discountAmount =
    selectedCustomer && discounted
      ? SubTotal * (selectedCustomer?.discount / 100)
      : 0;
  Total = SubTotal - discountAmount;

  useEffect(() => {
    let CIncash;
    if (selectedCustomer && paidIn == "cash") {
      CIncash = Total;
    } else if (selectedCustomer && paidIn == "mixed") {
      CIncash = Total - creditAmount;
    } else if (selectedCustomer && paidIn == "credit") {
      setCreditAmount(Total);
      CIncash = 0;
    } else {
      CIncash = 0;
    }
    setIncash(Number(CIncash.toFixed(2)));
  }, [selectedCustomer, items, discounted, creditAmount, paidIn, Total]);

  function fetchSalesdata(id: string, senddata: any) {
    // setSalesLoading(true);
    // fetch("/api/getSales")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setSales(data.Sales);
    //     setSalesLoading(false);
    //   })
    //   .catch((err) => {
    //     setSalesLoading(undefined);
    //     console.log(err);
    //   });
    const newSales = [
      ...sales,
      {
        docId: id,
        customer: senddata.customer,
        items: senddata.items,
        totalAmount: senddata.totalAmount,
        discounted: senddata.discounted,
        paidIn: senddata.paidIn,
        creditedAmount: senddata.creditAmount,
        datetime: new Date().toISOString(),
      },
    ];
    setSales(newSales);
  }

  function fetchInventorydata(senddata: any) {
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
    const newInventory = inventory.map((Inv: Inventory) => {
      const soldItem = senddata.items.find(
        (item: any) => Inv.productId == item.productDocId
      );
      if (soldItem) {
        return {
          ...Inv,
          currentAmount: Inv.currentAmount - soldItem.no,
        };
      }
      return Inv;
    });

    setInventory(newInventory);
  }

  function fetchCustomerdata(id: string, senddata: any) {
    if (senddata.customer !== "XXXX") {
      const newCustomer = customer.map((Cu: Customer) => {
        if (Cu.docId == senddata.customer) {
          let cuData;
          if (senddata.paidIn == "credit") {
            const used = Cu.credit.used + senddata.creditAmount;
            cuData = {
              history: [...Cu.history, id],
              credit: { ...Cu.credit, used: used },
            };
          } else {
            cuData = {
              history: [...Cu.history, id],
            };
          }
          const editedCustomer = {
            ...Cu,
            ...cuData,
          };

          return editedCustomer;
        }
        return Cu;
      });

      setCustomer(newCustomer);
    }
  }

  async function AddSales() {
    if (items.length == 0) {
      throw Error(`you haven't selected products`);
    }

    if (paidIn == "mixed" && creditAmount == 0) {
      throw Error(`If credit amount is 0 then change Paid-In in cash`);
    }

    if (paidIn == "mixed" && creditAmount > Total) {
      throw Error(`Can not Credit Above the current Total Price`);
    }

    if (
      selectedCustomer &&
      (paidIn === "credit" || paidIn === "mixed") &&
      selectedCustomer.credit.max != 0
    ) {
      const left = selectedCustomer.credit.max - selectedCustomer.credit.used;
      if (creditAmount > left)
        throw Error(
          `the customer only has ${left} credits. Maybe use mixed and pay the rest ${
            creditAmount - left
          } in cash`
        );
    }

    const senddata = {
      customer: selectedCustomer?.docId ? selectedCustomer?.docId : "XXXX",
      items: items.map((item) => {
        return {
          productId: item.productId,
          productDocId: item.productDocId,
          no: item.no,
          discount_per_unit: item.discount_per_unit,
        };
      }),
      totalAmount: Total,
      discounted: discounted,
      paidIn: paidIn,
      creditAmount: creditAmount,
    };
    console.log(senddata);

    const res = await fetch("/api/addSales", {
      method: "POST",
      body: JSON.stringify(senddata),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response);
      if (response.result.created) {
        fetchSalesdata(response.result.created, senddata);
        fetchInventorydata(senddata);
        fetchCustomerdata(response.result.created, senddata);
        router.push(`/sales/`);
        return response.result.created;
      }
    }
    throw Error("error");
  }

  async function onSubmit() {
    setSending(true);
    toast.promise(AddSales(), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `Sales has been added`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  function deleteItems(id: string) {
    const filteredItem = items.filter((item) => item.productId != id);

    setItems(filteredItem);
  }

  return (
    <div className="w-full max-w-3xl m-4 flex flex-col gap-4 p-8 border rounded-md ">
      <div className="text-xl mb-8">Add a Sales</div>
      <div className="">
        <div className="mb-2">Customer:</div>
        <Combobox list={customer} setCustomer={setSelectedCustomer} />
      </div>
      <div className="">
        <div className="mb-2">Product:</div>
        <ComboboxProduct list={products} setItems={setItems} />
      </div>

      <div className="mt-8">
        <div className="mb-4"> Selected Customer:</div>
        {selectedCustomer ? (
          <div className="flex flex-col gap-4">
            <Card className="w-full max-w-xl">
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">FirstName:</span>
                  {` ${selectedCustomer.first_name}`}
                </div>
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">LastName:</span>
                  {` ${selectedCustomer.last_name}`}
                </div>
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">PhoneNumber:</span>
                  {` ${selectedCustomer.phone_number}`}
                </div>
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">Email:</span>
                  {` ${selectedCustomer.email}`}
                </div>
                {selectedCustomer.credit.allowed && (
                  <div className="">
                    <span className="bg-gray-400 p-1 rounded">Credit:</span>
                    {` ${
                      selectedCustomer.credit.max == 0
                        ? "No Limit"
                        : selectedCustomer.credit.max.toLocaleString("en-US")
                    } - ${selectedCustomer.credit.used.toLocaleString(
                      "en-US"
                    )} ETB`}
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex">
              <Button
                variant="secondary"
                onClick={() => setSelectedCustomer(undefined)}
              >
                Clear Customer
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">unregisterd</div>
        )}
      </div>
      <div className="flex flex-col my-8 gap-4">
        <div className="">Added Products:</div>
        {items.length !== 0 ? (
          items.map((item: Items) => {
            return (
              <Card key={item.productId} className="w-full max-w-xl">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-[120px] h-[140px] border rounded overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.product_name}
                        width={100}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1">
                          <h1 className="text-lg font-bold">
                            {item.product.product_name}
                          </h1>
                          <div className="line-clamp-1">
                            {item.product.details}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <EditSaleProductModel
                            product={item}
                            items={items}
                            setItems={setItems}
                          />
                          <button
                            className="border border-transparent hover:border-red-300 rounded p-1"
                            onClick={() => {
                              deleteItems(item.productId);
                            }}
                          >
                            <MdDeleteForever color={`red`} size={24} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-end h-full">
                        <div className="flex flex-col h-full">
                          <div className="text-sm">
                            Discount per Unit: {item.discount_per_unit} birr
                          </div>
                          <div className="text-sm">
                            Total Discount: {item.discount_per_unit * item.no}{" "}
                            birr
                          </div>
                          <div className="text-sm">
                            Number of Products: {item.no}
                          </div>
                        </div>
                        <div className="">
                          {item.product.unit_price.toLocaleString("en-US")} ETB
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-gray-400">No products have been selected</div>
        )}
        {}
        {SubTotal != 0 && (
          <div>SubTotal: {SubTotal.toLocaleString("en-US")} ETB</div>
        )}
      </div>

      {selectedCustomer ? (
        <div className="flex items-center gap-4 mb-2">
          <Checkbox
            id="Discount"
            checked={discounted}
            onCheckedChange={() => setDiscounted((pre) => !pre)}
          />
          <label htmlFor="Discount">
            Apply discount {`(${selectedCustomer.discount}%)`}
          </label>
        </div>
      ) : null}

      {selectedCustomer?.credit.allowed ? (
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
              <SelectItem value="pose">pose</SelectItem>
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
              <SelectItem value="pose">pose</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {paidIn == "mixed" && (
        <div className="flex gap-2 items-center">
          <div>Credit : </div>
          <Input
            id="creditAmount"
            type="number"
            placeholder="Credit Amount"
            className="w-52"
            required
            max={Total}
            value={creditAmount}
            onChange={(e) => setCreditAmount(Number(e.target.value))}
          />
        </div>
      )}

      {Total != 0 && <div>Total: {Total.toLocaleString("en-US")} ETB</div>}
      {Incash > 0 && (
        <div className="">
          <div className="">
            InCredit: {creditAmount.toLocaleString("en-US")} ETB
          </div>
          <div className="">InCash: {Incash.toLocaleString("en-US")} ETB</div>
        </div>
      )}
      {paidIn == "mixed" && creditAmount > Total && (
        <div className="text-red-400">
          Can not Credit Above the current Total Price
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
