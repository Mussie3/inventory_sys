"use client";
import CreateInventoryForm from "@/components/ui/createInventoryForm";
import { useTodo } from "@/hooks/useContextData";

export default function AddInventory() {
  const { products } = useTodo();
  return (
    <div className="flex items-center justify-center h-full w-full py-24">
      <CreateInventoryForm product={products} />
    </div>
  );
}
