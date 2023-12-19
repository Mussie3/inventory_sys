import services from "@/services/connect";

export const POST = async (request) => {
  const { No } = await request.json();

  try {
    console.log(No);

    const productData = await services.GetAllProducts();
    const InventoryData = await services.GetAllInventorys();

    console.log(productData);
    console.log(InventoryData);

    const productPrice = {};

    const productObject = {};

    const catagoryObject = {};

    productData.forEach((item) => {
      productPrice[item.docId] = {
        price: item.unit_price,
        product_name: item.product_name,
        catagory: item.catagory,
      };
    });

    InventoryData.forEach((inv) => {
      const amount = inv.currentAmount;

      const id = inv.productId;
      const no = productObject[id] ? productObject[id].no + amount : amount;
      productObject[id] = {
        productId: id,
        no: no,
      };

      const cid = productPrice[inv.productId].catagory;
      const cno = catagoryObject[cid]
        ? catagoryObject[cid].no + amount
        : amount;
      const price = catagoryObject[cid]
        ? catagoryObject[cid].no + amount * productPrice[inv.productId].price
        : amount * productPrice[inv.productId].price;
      catagoryObject[cid] = {
        catagory: cid,
        no: cno,
        price: price,
      };
    });

    console.log(productObject);

    const Product = Object.values(productObject).map((pro) => {
      return {
        ...pro,
        price: productPrice[pro.productId].price * pro.no,
        product_name: productPrice[pro.productId].product_name,
      };
    });

    const Catagory = Object.values(catagoryObject);

    console.log(Catagory);

    console.log(Product);

    const TopByNo = Array.from({ length: No }, () => {
      return { price: 0, no: 0 };
    });
    const TopByPrice = Array.from({ length: No }, () => {
      return { price: 0, no: 0 };
    });

    Product.forEach((pro) => {
      for (let i = 0; i < TopByNo.length; i++) {
        if (pro.no >= TopByNo[i].no) {
          TopByNo.splice(i, 0, pro);
          TopByNo.pop();
          break;
        }
      }
    });

    Product.forEach((pro) => {
      for (let i = 0; i < TopByPrice.length; i++) {
        if (pro.price >= TopByPrice[i].price) {
          TopByPrice.splice(i, 0, pro);
          TopByPrice.pop();
          break;
        }
      }
    });

    console.log(TopByNo);
    console.log(TopByPrice);

    const TopByNoC = Array.from({ length: No }, () => {
      return { price: 0, no: 0 };
    });
    const TopByPriceC = Array.from({ length: No }, () => {
      return { price: 0, no: 0 };
    });

    Catagory.forEach((pro) => {
      for (let i = 0; i < TopByNoC.length; i++) {
        if (pro.no >= TopByNoC[i].no) {
          TopByNoC.splice(i, 0, pro);
          TopByNoC.pop();
          break;
        }
      }
    });

    Catagory.forEach((pro) => {
      for (let i = 0; i < TopByPriceC.length; i++) {
        if (pro.price >= TopByPriceC[i].price) {
          TopByPriceC.splice(i, 0, pro);
          TopByPriceC.pop();
          break;
        }
      }
    });

    console.log(TopByNoC);
    console.log(TopByPriceC);

    return new Response(
      JSON.stringify({
        result: {
          topByNo: TopByNo,
          topByPrice: TopByPrice,
          topByNoC: TopByNoC,
          topByPriceC: TopByPriceC,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
