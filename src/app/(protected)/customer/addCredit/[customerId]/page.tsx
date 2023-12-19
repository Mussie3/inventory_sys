"use client";
import AddCreditForm from "@/components/ui/addCreditForm";
import { useTodo } from "@/hooks/useContextData";

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
  params: {
    customerId: string;
  };
};
export default function AddCredit({ params }: Props) {
  console.log(params.customerId);
  const { customer } = useTodo();

  const customerData = customer.find(
    (i: Customer) => i.docId == params.customerId
  );

  if (!customerData) return <div className="">No customer by that ID</div>;

  if (!customerData.credit.allowed)
    return <div className="">{`this customer doesn't use credit`}</div>;

  return (
    <div className="flex items-center justify-center h-full w-full py-24">
      <AddCreditForm customerData={customerData} />
    </div>
  );
}
