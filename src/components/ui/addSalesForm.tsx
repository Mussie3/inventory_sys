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

import { useEffect, useState } from "react";
import { Combobox } from "./Combobox";
import { ComboboxProduct } from "./ComboboxProduct";
import { Card, CardContent } from "./card";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";
import { Input } from "./input";
import EditSaleProductModel from "./EditSaleProductModel";
import { MdDeleteForever } from "react-icons/md";
import InputWithCheck from "./InputWithCheck";

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

type PaidInPrice = {
  cash: number;
  credit: number;
  POS: number;
  transfer: number;
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
    cash,
    setCash,
  } = useTodo();
  const [sending, setSending] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();
  const [items, setItems] = useState<Items[]>([]);
  const [paidIn, setPaidIn] = useState<
    "cash" | "credit" | "mixed" | "POS" | "transfer"
  >("cash");
  const [paidInPrices, setPaidInPrices] = useState<PaidInPrice>({
    cash: 0,
    credit: 0,
    POS: 0,
    transfer: 0,
  });

  const [difference, setDifference] = useState<number>(0);

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
  const discountAmount = 0;
  Total = SubTotal - discountAmount;

  useEffect(() => {
    if (paidIn != "mixed") {
      const priceslist = {
        cash: 0,
        credit: 0,
        POS: 0,
        transfer: 0,
      };

      if (
        paidIn == "credit" &&
        selectedCustomer &&
        selectedCustomer.credit.max != 0 &&
        Total > selectedCustomer.credit.max - selectedCustomer.credit.used
      ) {
        priceslist[paidIn] =
          selectedCustomer.credit.max - selectedCustomer.credit.used;
      } else {
        priceslist[paidIn] = Total;
      }
      setPaidInPrices(priceslist);
    }
  }, [paidIn, Total]);

  useEffect(() => {
    const sum =
      paidInPrices.cash +
      paidInPrices.POS +
      paidInPrices.credit +
      paidInPrices.transfer;
    const dif = sum - Total;
    setDifference(dif);
  }, [paidInPrices]);

  function fetchSalesdata(id: string, cashId: string, senddata: any) {
    const newSales = [
      ...sales,
      {
        docId: id,
        customer: senddata.customer,
        items: senddata.items,
        totalAmount: senddata.totalAmount,
        paidIn: senddata.paidIn,
        paidInPrices: senddata.paidInPrices,
        cashId: cashId ? cashId : "",
        datetime: new Date().toISOString(),
      },
    ];
    setSales(newSales);
  }

  function fetchInventorydata(senddata: any) {
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
          if (
            senddata.paidIn == "credit" ||
            (senddata.paidIn == "mixed" && senddata.paidInPrices.credit > 0)
          ) {
            const used = Cu.credit.used + senddata.paidInPrices.credit;
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

  function fetchCashdata(id: string, senddata: any) {
    const newCash = [
      ...cash,
      {
        docId: id,
        title: `Paid in Cash Sale`,
        discription: `Sale paid by ${senddata.customerName}`,
        amount: senddata.paidInPrices.cash,
        type: `sale`,
        datetime: new Date().toISOString(),
      },
    ];
    setCash(newCash);
  }

  async function AddSales() {
    if (items.length == 0) {
      throw Error(`you haven't selected products`);
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
      paidIn: paidIn,
      paidInPrices: paidInPrices,
      customerName: selectedCustomer?.first_name
        ? selectedCustomer?.first_name
        : "XXXX",
    };

    const res = await fetch("/api/addSales", {
      method: "POST",
      body: JSON.stringify(senddata),
    });
    if (res.ok) {
      const response = await res.json();
      if (response.result.created) {
        fetchSalesdata(
          response.result.created,
          response.result.cashId,
          senddata
        );
        fetchInventorydata(senddata);
        fetchCustomerdata(response.result.created, senddata);
        if (senddata.paidInPrices.cash > 0) {
          fetchCashdata(response.result.cashId, senddata);
        }
        router.push(`/sales/`);
        return response.result.created;
      }
    }
    const response = await res.json();
    throw Error(response.ErrorMessage || "somthing went wrong");
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

  // console.log(paidInPrices);

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
                <CardContent className="py-4 px-8">
                  <div className="flex gap-4">
                    {/* <div className="w-[120px] h-[140px] border rounded overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.product_name}
                        width={100}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div> */}

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

      {selectedCustomer?.credit.allowed ? (
        <div className="flex items-center gap-4">
          <span>PaidIn:</span>
          <Select
            onValueChange={(value) =>
              setPaidIn(
                value as "cash" | "credit" | "mixed" | "POS" | "transfer"
              )
            }
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
            onValueChange={(value) =>
              setPaidIn(value as "cash" | "mixed" | "POS" | "transfer")
            }
            defaultValue={"cash"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="PaidIn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {paidIn == "mixed" && (
        <div className="flex flex-col gap-4 my-8">
          <InputWithCheck
            type="cash"
            state={paidInPrices}
            setValue={setPaidInPrices}
            diff={difference}
          />
          {selectedCustomer?.credit.allowed && (
            <InputWithCheck
              type="credit"
              state={paidInPrices}
              setValue={setPaidInPrices}
              diff={difference}
            />
          )}
          <InputWithCheck
            type="POS"
            state={paidInPrices}
            setValue={setPaidInPrices}
            diff={difference}
          />
          <InputWithCheck
            type="transfer"
            state={paidInPrices}
            setValue={setPaidInPrices}
            diff={difference}
          />
          {difference !== 0 && (
            <div
              className={`font-bold ${
                difference > 0 ? `text-green-400` : `text-red-400`
              }`}
            >
              {difference > 0
                ? `${difference.toLocaleString("en-US")} ETB extra`
                : `${difference.toLocaleString("en-US")} ETB left`}
            </div>
          )}
        </div>
      )}

      {Total != 0 && <div>Total: {Total.toLocaleString("en-US")} ETB</div>}

      {paidIn == "credit" && difference > 0 && (
        <div className="text-red-400">
          {`Total Price is Above the Allowed credit amount by ${difference.toLocaleString(
            "en-US"
          )} ETB. use mixed payment type.`}
        </div>
      )}

      <div className="flex justify-end">
        <Button disabled={sending || difference !== 0} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
