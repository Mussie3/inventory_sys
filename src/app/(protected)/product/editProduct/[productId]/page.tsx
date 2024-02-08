"use client";
import AddProductForm from "@/components/ui/addProductForm";
import { useTodo } from "@/hooks/useContextData";

type Product = {
  image: string;
  id: string;
  invId: string;
  catagory: string;
  datetime: string;
  docId: string;
  details: string;
  unit_price: number;
  product_name: string;
};

type Props = {
  params: {
    productId: string;
  };
};
export default function EditProduct({ params }: Props) {
  const { products } = useTodo();

  const productData = products.find(
    (p: Product) => p.docId == params.productId
  );

  if (!productData) return null;
  return (
    <div className="flex items-center justify-center h-full w-full py-24">
      <AddProductForm
        editMode={true}
        defaultValue={productData}
        docId={params.productId}
      />
    </div>
  );
}
