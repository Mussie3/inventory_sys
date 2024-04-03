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
import EditSaleProductModel from "./EditSaleProductModel";
import { MdDeleteForever } from "react-icons/md";
import InputWithCheck from "./InputWithCheck";

type Sales = {
  customer: string;
  items: ItemsO[];
  totalAmount: number;
  paidInPrices: PaidInPrice;
  docId: string;
  paidIn: string;
  cashId: string;
  datetime: string;
};

type PaidInPrice = {
  cash: number;
  credit: number;
  POS: number;
  transfer: number;
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

type Cash = {
  docId: string;
  title: string;
  discription: string;
  amount: string;
  type: string;
  datetime: string;
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
    cash,
    setCash,
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
  const [paidIn, setPaidIn] = useState<
    "cash" | "credit" | "mixed" | "POS" | "transfer"
  >(sale.paidIn as "cash" | "credit" | "mixed" | "POS" | "transfer");

  const [paidInPrices, setPaidInPrices] = useState<PaidInPrice>(
    sale.paidInPrices
  );
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
  Total = SubTotal;

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

  function fetchSalesdata(senddata: any) {
    const newSales = sales.map((S: Product) => {
      if (S.docId == senddata.salesId) {
        const newSale = {
          customer: senddata.customer,
          paidInPrices: senddata.paidInPrices,
          totalAmount: senddata.totalAmount,
          paidIn: senddata.paidIn,
          items: senddata.items,
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
          if (
            senddata.paidIn == "credit" ||
            (senddata.paidIn == "mixed" && senddata.paidInPrices.credit > 0)
          ) {
            const used = Cu.credit.used + senddata.paidInPrices.credit;
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
          if (
            sale.paidIn == "credit" ||
            (sale.paidIn == "mixed" && sale.paidInPrices.credit > 0)
          ) {
            const used = Cu.credit.used - sale.paidInPrices.credit;
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
        sale.paidInPrices.credit != senddata.paidInPrices.credit
      ) {
        if (senddata.customer == Cu.docId) {
          let cuData;
          if (
            sale.paidInPrices.credit > 0 &&
            senddata.paidInPrices.credit > 0
          ) {
            const used =
              Cu.credit.used +
              (senddata.paidInPrices.credit - sale.paidInPrices.credit);
            cuData = {
              credit: { ...Cu.credit, used: used },
            };
          } else if (
            sale.paidInPrices.credit > 0 &&
            senddata.paidInPrices.credit == 0
          ) {
            const used = Cu.credit.used - sale.paidInPrices.credit;
            cuData = {
              credit: { ...Cu.credit, used: used },
            };
          } else if (
            sale.paidInPrices.credit == 0 &&
            senddata.paidInPrices.credit > 0
          ) {
            const used = Cu.credit.used + senddata.paidInPrices.credit;
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

  function fetchCashdata(id: string, senddata: any) {
    if (cash.find((ca: Cash) => ca.docId == id)) {
      const newCash = cash.map((Ca: Cash) => {
        if (Ca.docId == id) {
          return {
            docId: id,
            title: Ca.title,
            discription: `Sale paid by ${senddata.customerName}`,
            amount: senddata.paidInPrices.cash,
            type: Ca.type,
            datetime: Ca.datetime,
          };
        }
        return Ca;
      });

      setCash(newCash);
    } else {
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
  }

  async function EditSales() {
    if (items.length == 0) {
      throw Error(`you haven't selected products`);
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
      paidInPrices: paidInPrices,
      salesId: sale.docId,
      customerName: customer?.first_name ? customer?.first_name : "XXXX",
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
        if (senddata.paidInPrices.cash > 0 || sale.paidInPrices.cash > 0) {
          fetchCashdata(response.result.cashId, senddata);
        }
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
        {SubTotal != 0 && (
          <div>SubTotal: {SubTotal.toLocaleString("en-US")} ETB</div>
        )}
      </div>

      {customer?.credit.allowed ? (
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
            defaultValue={paidIn}
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
        <Button disabled={sending} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
