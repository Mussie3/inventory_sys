import services from "@/services/connect";

export const POST = async (request) => {
  const { min, max, No } = await request.json();

  try {
    console.log(min, max, No);

    const productData = await services.GetAllProducts();
    const salesData = await services.GetAllSeles();

    console.log(productData);
    console.log(salesData);

    const filteredSales = salesData.filter((sale) => {
      const date = sale.datetime;
      if (min && !max) {
        return Date.parse(date) >= Date.parse(min);
      } else if (!min && max) {
        return Date.parse(date) <= Date.parse(end);
      } else if (min && max) {
        return (
          Date.parse(date) >= Date.parse(min) &&
          Date.parse(date) <= Date.parse(max)
        );
      } else return true;
    });

    console.log(filteredSales);

    const productPrice = {};

    const productObject = {};

    productData.forEach((item) => {
      productPrice[item.docId] = {
        price: item.unit_price,
        product_name: item.product_name,
      };
    });

    filteredSales.forEach((sale) => {
      const items = sale.items;
      items.forEach((item) => {
        const id = item.productId;
        const no = productObject[id] ? productObject[id].no + item.no : item.no;
        productObject[id] = {
          productId: id,
          no: no,
        };
      });
    });

    const Product = Object.values(productObject).map((pro) => {
      return {
        ...pro,
        price: productPrice[pro.productId].price * pro.no,
        product_name: productPrice[pro.productId].product_name,
      };
    });

    console.log(Product);

    const TopByNo = Array.from({ length: No ? No : 5 }, () => {
      return { price: 0, no: 0 };
    });
    const TopByPrice = Array.from({ length: No ? No : 5 }, () => {
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

    return new Response(
      JSON.stringify({
        result: {
          topByNo: TopByNo.filter((p) => p.productId),
          topByPrice: TopByPrice.filter((p) => p.productId),
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
