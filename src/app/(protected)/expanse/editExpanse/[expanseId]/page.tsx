"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditExpanse } from "@/components/ui/editExpanse";
import { EditUsers } from "@/components/ui/editUsers";
import { useTodo } from "@/hooks/useContextData";
import services from "@/services/connect";

type Expanse = {
  docId: string;
  title: string;
  discription: string;
  amount: string;
  datetime: string;
};

type Props = {
  params: {
    expanseId: string;
  };
};

export default function EditExapnsePage({ params }: Props) {
  const { expanse } = useTodo();

  const expanseData = expanse.find((u: Expanse) => u.docId == params.expanseId);

  if (!expanseData) return null;
  const oldexpanse = {
    ...expanseData,
  };
  return (
    <div className="flex items-center justify-center p-24">
      <EditExpanse oldexpanse={oldexpanse} />
    </div>
  );
}
