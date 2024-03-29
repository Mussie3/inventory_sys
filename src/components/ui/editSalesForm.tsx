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
import Image from "next/image";
import { Checkbox } from "./checkbox";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";
import { Input } from "./input";
import EditSaleProductModel from "./EditSaleProductModel";
import { MdDeleteForever } from "react-icons/md";

type Sales = {
  customer: string;
  items: ItemsO[];
  totalAmount: number;
  creditedAmount: number;
  docId: string;
  paidIn: string;
  datetime: string;
  discounted: boolean;
};

type ItemsO = {
  productId: string;
  productDocId: string;
  no: number;
  discount_per_unit: number;
};

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
  customers: Customer[];
  product: Product[];
  sale: Sales;
};

type Items = {
  productId: string;
  productDocId: string;
  product: Product;
  no: number;
  discount_per_unit: number;
};

export default function EditSalesForm({ customers, product, sale }: Props) {
  const {
    setCustomer,
    sales,
    setSales,
    setSalesLoading,
    inventory,
    setInventory,
    setInventoryLoading,
  } = useTodo();
  const [sending, setSending] = useState(false);
  let selectedCustomer: any;
  if (sale.customer != "XXXX") {
    selectedCustomer = customers.find(
      (c) => c.docId === sale.customer
    ) as Customer;
  } else {
    selectedCustomer = undefined;
  }
  const oldItem = sale.items.map((item) => {
    return {
      ...item,
      product: product.find((p) => p.docId == item.productDocId),
    };
  }) as Items[];
  // const defaultProducts = sale.items.map((item) =>
  //   product.find((p) => p.docId == item.productId)
  // ) as Product[];
  const [customer, setCustomers] = useState<Customer | undefined>(
    selectedCustomer
  );
  const [items, setItems] = useState<Items[]>(oldItem);
  const [paidIn, setPaidIn] = useState(sale?.paidIn);
  const [discounted, setDiscounted] = useState(sale?.discounted);
  const [creditAmount, setCreditAmount] = useState<number>(
    sale.creditedAmount ? sale.creditedAmount : 0
  );
  const [Incash, setIncash] = useState<number>(0);

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
    customer && discounted ? SubTotal * (customer?.discount / 100) : 0;
  Total = SubTotal - discountAmount;

  useEffect(() => {
    let CIncash;
    if (selectedCustomer && paidIn == "cash") {
      CIncash = Total;
      setCreditAmount(0);
    } else if (selectedCustomer && paidIn == "mixed") {
      CIncash = Total - creditAmount;
    } else if (selectedCustomer && paidIn == "credit") {
      setCreditAmount(Total);
      CIncash = 0;
    } else {
      CIncash = 0;
      setCreditAmount(0);
    }
    setIncash(Number(CIncash.toFixed(2)));
  }, [
    customer,
    items,
    creditAmount,
    discounted,
    paidIn,
    Total,
    selectedCustomer,
  ]);

  function fetchSalesdata(senddata: any) {
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
    const newSales = sales.map((S: Product) => {
      if (S.docId == senddata.salesId) {
        const newSale = {
          customer: senddata.customer,
          discounted: senddata.discounted,
          totalAmount: senddata.totalAmount,
          paidIn: senddata.paidIn,
          items: senddata.items,
          creditedAmount: senddata.creditAmount,
        };
        return {
          ...S,
          ...newSale,
        };
      }
      return S;
    });

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
    let Items = senddata.items;
    sale.items.forEach((oldi) => {
      if (Items.find((item: any) => item.productId == oldi.productId)) {
        const newItem = Items.map((item: any) => {
          if (item.productId == oldi.productId) {
            return {
              ...item,
              no: item.no - oldi.no,
            };
          }
          return item;
        });
        Items = newItem;
      } else {
        Items = [...Items, { ...oldi, no: -oldi.no }];
      }
    });

    const newInventory = inventory.map((Inv: Inventory) => {
      const soldItem = Items.find(
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

  function fetchCustomerdata(senddata: any) {
    const newCustomer = customers.map((Cu: Customer) => {
      if (senddata.customer !== sale.customer) {
        if (senddata.customer !== "XXXX" && senddata.customer == Cu.docId) {
          let cuData;
          if (senddata.paidIn == "credit" || senddata.paidIn == "mixed") {
            const used = Cu.credit.used + creditAmount;
            cuData = {
              history: [...Cu.history, sale.docId],
              credit: { ...Cu.credit, used: used },
            };
          } else {
            cuData = {
              history: [...Cu.history, sale.docId],
            };
          }
          return { ...Cu, ...cuData };
        }
        if (sale.customer !== "XXXX" && Cu.docId == sale.customer) {
          const editedCustomerhistort = Cu.history;

          let cuData;
          if (sale.paidIn == "credit" || senddata.paidIn == "mixed") {
            const used = Cu.credit.used - sale.creditedAmount;
            cuData = {
              history: editedCustomerhistort.filter(
                (his) => his !== sale.docId
              ),
              credit: { ...Cu.credit, used: used },
            };
          } else {
            cuData = {
              history: editedCustomerhistort.filter(
                (his) => his !== sale.docId
              ),
            };
          }
          return { ...Cu, ...cuData };
        }
        return Cu;
      } else if (
        senddata.customer == sale.customer &&
        sale.creditedAmount != creditAmount
      ) {
        if (senddata.customer == Cu.docId) {
          let cuData;
          if (
            (sale.paidIn == "credit" || sale.paidIn == "mixed") &&
            (paidIn == "credit" || paidIn == "mixed")
          ) {
            const used = Cu.credit.used + (creditAmount - sale.creditedAmount);
            cuData = {
              credit: { ...Cu.credit, used: used },
            };
          } else if (
            (sale.paidIn == "credit" || sale.paidIn == "mixed") &&
            paidIn != "credit" &&
            paidIn != "mixed"
          ) {
            const used = Cu.credit.used - sale.creditedAmount;
            cuData = {
              credit: { ...Cu.credit, used: used },
            };
          } else if (
            sale.paidIn != "credit" &&
            sale.paidIn != "mixed" &&
            (paidIn == "credit" || paidIn == "mixed")
          ) {
            const used = Cu.credit.used + creditAmount;
            cuData = {
              credit: { ...Cu.credit, used: used },
            };
          }

          return {
            ...Cu,
            ...cuData,
          };
        }
      }
      return Cu;
    });

    setCustomer(newCustomer);
  }

  async function EditSales() {
    if (items.length == 0) {
      throw Error(`you haven't selected products`);
    }
    if (paidIn == "credit" && creditAmount == 0) {
      throw Error(`credit amount is 0 then change Paid-In in cash`);
    }

    if (paidIn == "credit" && creditAmount > Total) {
      throw Error(` Can not Credit Above the current Total Price`);
    }

    if (customer && paidIn === "credit" && customer.credit.max != 0) {
      let left;
      if (sale.paidIn == "credit") {
        left = customer.credit.max - customer.credit.used + sale.creditedAmount;
      } else {
        left = customer.credit.max - customer.credit.used;
      }

      if (Total > left)
        throw Error(
          `the customer only has ${left} credits. Maybe use mixed and pay the rest ${
            Total - left
          } in cash`
        );
    }

    const senddata = {
      customer: customer?.docId ? customer?.docId : "XXXX",
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
      discounted: discounted,
      salesId: sale.docId,
      creditAmount: creditAmount,
    };

    const res = await fetch("/api/editSales", {
      method: "POST",
      body: JSON.stringify(senddata),
    });

    if (res.ok) {
      const response = await res.json();
      if (response.result.edited) {
        fetchSalesdata(senddata);
        fetchInventorydata(senddata);
        fetchCustomerdata(senddata);
        router.push(`/sales/`);
        return response.result.edited;
      }
    }
    const response = await res.json();
    throw Error(response.ErrorMessage || "somthing went wrong");
  }

  async function onSubmit() {
    setSending(true);
    toast.promise(EditSales(), {
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
        <div className="mb-2 ">Customer:</div>
        <Combobox
          list={customers}
          setCustomer={setCustomers}
          defultValue={sale.customer}
        />
      </div>
      <div className="">
        <div className="mb-2 ">Product:</div>
        <ComboboxProduct list={product} setItems={setItems} />
      </div>

      <div className="mt-8">
        <div className="mb-4 "> Selected Customer:</div>
        {customer ? (
          <div className="flex flex-col gap-4">
            <Card className="w-full max-w-xl">
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">FirstName:</span>
                  {` ${customer.first_name}`}
                </div>
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">LastName:</span>
                  {` ${customer.last_name}`}
                </div>
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">PhoneNumber:</span>
                  {` ${customer.phone_number}`}
                </div>
                <div className="">
                  <span className="bg-gray-400 p-1 rounded">Email:</span>
                  {` ${customer.email}`}
                </div>
                {customer.credit.allowed && (
                  <div className="">
                    <span className="bg-gray-400 p-1 rounded">Credit:</span>
                    {` ${
                      customer.credit.max == 0
                        ? "No Limit"
                        : customer.credit.max.toLocaleString("en-US")
                    } - ${customer.credit.used.toLocaleString("en-US")} ETB`}
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex">
              <Button
                variant="secondary"
                onClick={() => setCustomers(undefined)}
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

      {customer?.credit.allowed ? (
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
            defaultValue={paidIn}
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
      {paidIn == "mixed" && (
        <Input
          id="creditAmount"
          type="number"
          placeholder="Credit Amount"
          required
          max={Total}
          value={creditAmount}
          onChange={(e) => setCreditAmount(Number(e.target.value))}
        />
      )}

      {Total != 0 && <div>Total: {Total.toLocaleString("en-US")} ETB</div>}
      {/* {customer &&
        (Incash > 0 ? (
          <div className="">
            <div className="">
              InCredit: {creditAmount.toLocaleString("en-US")} ETB
            </div>
            <div className="">InCash: {Incash.toLocaleString("en-US")} ETB</div>
          </div>
        ) : (
          <div className="text-red-400">
            Can not Credit Above the current Total Price
          </div>
        ))} */}

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
