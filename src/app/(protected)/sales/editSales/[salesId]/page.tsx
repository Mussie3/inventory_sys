"use client";
import EditSalesForm from "@/components/ui/editSalesForm";
import { useTodo } from "@/hooks/useContextData";

type Sales = {
  customer: string;
  items: Items[];
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

type Items = {
  productId: string;
  productDocId: string;
  no: number;
  discount_per_unit: number;
};

type Props = {
  params: {
    salesId: string;
  };
};

export default function EditSales({ params }: Props) {
  const { products, customer, sales } = useTodo();

  const salesData = sales.find((s: Sales) => s.docId == params.salesId);

  if (!salesData) return null;

  return (
    <div className="flex items-center justify-center h-full w-full py-24">
      <EditSalesForm customers={customer} product={products} sale={salesData} />
    </div>
  );
}
