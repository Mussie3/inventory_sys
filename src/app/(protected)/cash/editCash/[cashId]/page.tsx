"use client";
import { EditCash } from "@/components/ui/editCash";
import { useTodo } from "@/hooks/useContextData";

type Cash = {
  docId: string;
  title: string;
  discription: string;
  amount: string;
  type: string;
  datetime: string;
};

type Props = {
  params: {
    cashId: string;
  };
};

export default function EditCashPage({ params }: Props) {
  const { cash } = useTodo();

  const cashData = cash.find((u: Cash) => u.docId == params.cashId);

  if (!cashData || cashData.type != "Other") return null;

  const oldcash = {
    ...cashData,
  };
  return (
    <div className="flex items-center justify-center p-24">
      <EditCash oldcash={oldcash} />
    </div>
  );
}
