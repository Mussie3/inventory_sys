"use client";
import EditCatagoryForm from "@/components/ui/editCatagoryForm";
import { useTodo } from "@/hooks/useContextData";

type Cat = {
  datetime: string;
  catagoryName: string;
  docId: string;
};

export default function EditCatagory() {
  const { catagory } = useTodo();

  if (!catagory) return <div className="">no catagories was found</div>;

  return (
    <div className="flex items-center justify-center h-full w-full py-24">
      <EditCatagoryForm catagory={catagory} />
    </div>
  );
}
