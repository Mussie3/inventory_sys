"use client";
import AddCustomerForm from "@/components/ui/addCustomerForm";
import { useTodo } from "@/hooks/useContextData";

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
  params: {
    customerId: string;
  };
};
export default function EditCustomer({ params }: Props) {
  const { customer } = useTodo();

  const userData = customer.find((c: Customer) => c.docId == params.customerId);

  if (!userData) return null;

  return (
    <div className="flex items-center justify-center h-full w-full py-24">
      <AddCustomerForm
        defaultValue={userData}
        editMode={true}
        docId={params.customerId}
      />
    </div>
  );
}
