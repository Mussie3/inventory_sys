import services from "@/services/connect";

export const POST = async (request) => {
  const { min, max, No } = await request.json();

  try {
    const productData = await services.GetAllProducts();
    const salesData = await services.GetAllSeles();

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

    const productD = {};

    const catagoryObject = {};

    productData.forEach((item) => {
      productD[item.docId] = {
        price: item.unit_price,
        catagory: item.catagory,
      };
    });

    filteredSales.forEach((sale) => {
      const items = sale.items;
      items.forEach((item) => {
        const id = productD[item.productDocId].catagory;
        const no = catagoryObject[id]
          ? catagoryObject[id].no + item.no
          : item.no;
        const price = catagoryObject[id]
          ? catagoryObject[id].no + item.no * productD[item.productDocId].price
          : item.no * productD[item.productDocId].price;
        catagoryObject[id] = {
          catagory: id,
          no: no,
          price: price,
        };
      });
    });

    const Catagory = Object.values(catagoryObject);

    const TopByNo = Array.from({ length: No }, () => {
      return { price: 0, no: 0 };
    });
    const TopByPrice = Array.from({ length: No }, () => {
      return { price: 0, no: 0 };
    });

    Catagory.forEach((pro) => {
      for (let i = 0; i < TopByNo.length; i++) {
        if (pro.no >= TopByNo[i].no) {
          TopByNo.splice(i, 0, pro);
          TopByNo.pop();
          break;
        }
      }
    });

    Catagory.forEach((pro) => {
      for (let i = 0; i < TopByPrice.length; i++) {
        if (pro.price >= TopByPrice[i].price) {
          TopByPrice.splice(i, 0, pro);
          TopByPrice.pop();
          break;
        }
      }
    });

    return new Response(
      JSON.stringify({
        result: {
          topByNo: TopByNo.filter((p) => p.catagory),
          topByPrice: TopByPrice.filter((p) => p.catagory),
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
