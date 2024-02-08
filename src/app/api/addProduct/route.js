import services from "@/services/connect";

export const POST = async (request) => {
  const { id, image, details, catagory, unit_price, product_name } =
    await request.json();

  // const file = data.get("file");

  const newProduct = {
    id,
    image,
    details,
    catagory,
    unit_price,
    product_name,
    datetime: new Date().toISOString(),
  };

  try {
    const Allproducts = await services.GetAllProducts();

    const alreadyExist = Allproducts.filter((p) => p.id === newProduct.id)[0];

    let productDocId;
    if (!alreadyExist) {
      productDocId = await services.AddProduct(newProduct);
    } else {
      productDocId = alreadyExist.docId;
    }

    return new Response(
      JSON.stringify({
        alreadyExist: alreadyExist ? true : false,
        result: productDocId,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
