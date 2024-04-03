import services from "@/services/connect";
import xlsx, { IJsonSheet } from "json-as-xlsx";
import * as XLSX from "json-as-xlsx";

type Items = {
  no: number;
  discount_per_unit: number;
  productDocId: string;
  productId: string;
};

type ProductsD = {
  image: string;
  unit_price: string;
  docId: string;
  invId: string;
  catagory: string;
  product_name: string;
  id: string;
  datetime: string;
  details: string;
};

type CustomerD = {
  docId: string;
  email: string;
  first_name: string;
  gender: string;
  history: string[];
  phone_number: string;
  last_name: string;
  credit: { max: number; allowed: boolean; used: number };
};

type Sales = {
  paidIn: string;
  paidInPrices: PaidInPrice;
  cashId: string;
  datetime: string;
  items: Items[];
  totalAmount: number;
  customer: string;
  docId: string;
  productsD: ProductsD[];
  customerD: CustomerD;
  totalPrice?: number;
};

type PaidInPrice = {
  cash: number;
  credit: number;
  POS: number;
  transfer: number;
};

type Expanse = {
  docId: string;
  title: string;
  discription: string;
  amount: string;
  datetime: string;
  totalAmount?: number;
};

type Cash = {
  docId: string;
  type: string;
  amount: string;
  title: string;
  discription: string;
  datetime: string;
  totalAmount?: number;
};

type InventoryViewData = {
  product_name: string;
  catagory: string;
  image: string;
  productId: string;
  datetime: string;
  docId: string;
  currentAmount: number;
  history: [
    {
      addedAmount: number;
      datetime: string;
    }
  ];
};

type Sales2 = {
  customer: string;
  items: Items[];
  totalAmount: number;
  paidInPrices: PaidInPrice;
  docId: string;
  paidIn: string;
  cashId: string;
  datetime: string;
};

function dateHistory(data: any, d: any) {
  const history = data.history;
  const datetime = history[history.length - 1].datetime;
  return datetime.slice(0, 10);
}
function amountHistory(data: any, d: any) {
  const history = data.history;
  const addedAmount = history[history.length - 1].addedAmount;
  return addedAmount;
}

function date(data: any, d: any) {
  return data?.[d].slice(0, 10);
}

function getsalesdata(data: any, c: string, d: string) {
  const g = data?.[c];
  return g?.[d];
}

function getdata(data: any, d: any) {
  return data?.[d];
}

export async function SalseToExcel(ViewSale: any[]) {
  let totalPrice = 0;
  const data: any[] = ViewSale.map((View) => {
    totalPrice = totalPrice + Number(View.original.totalAmount);
    return View.original;
  });
  data[0] = { ...data[0], totalPrice: totalPrice };

  let columns: IJsonSheet[] = [
    {
      sheet: "Sales",
      columns: [
        // { label: "Document Id", value: "docId" },
        {
          label: "Sold Date",
          value: (row) => row["datetime"]?.toString().slice(0, 10) || "",
        },
        {
          label: "Customer FullName",
          value: (row) =>
            getsalesdata(row, "customerD", "first_name") &&
            getsalesdata(row, "customerD", "last_name")
              ? `${getsalesdata(row, "customerD", "first_name")} ${getsalesdata(
                  row,
                  "customerD",
                  "last_name"
                )}`
              : null,
        },
        {
          label: "Credited Amount",
          value: "creditedAmount",
        },
        { label: "Paid In", value: "paidIn" },
        {
          label: "Price",
          value: "totalAmount",
        },
        {
          label: "Total Price",
          value: "totalPrice",
        },
      ],
      content: [...data],
    },
  ];
  let settings = {
    fileName: "Sales View Data",
  };

  xlsx(columns, settings);
}

export async function SalseToExcel2(ViewSale: any[]) {
  let totalPrice = 0;

  const data: Sales[] = ViewSale.map((View) => {
    totalPrice = totalPrice + Number(View.original.totalAmount);
    return View.original;
  });

  data.sort((a, b) => {
    const paidInA = a.paidIn.toLowerCase();
    const paidInB = b.paidIn.toLowerCase();

    if (paidInA < paidInB) {
      return -1;
    }
    if (paidInA > paidInB) {
      return 1;
    }
    return 0;
  });

  // console.log(data);

  const flattenedData: any[] = [];
  data.forEach((sale: Sales, i) => {
    sale.items.forEach((item, index) => {
      const product = data[i].productsD.find(
        (pr) => pr.docId == item.productDocId
      );
      Object.entries(sale.paidInPrices).map((m) => console.log(m));

      const mixedText = [];
      sale.paidInPrices.cash > 0 && mixedText.push("cash");
      sale.paidInPrices.POS > 0 && mixedText.push("POS");
      sale.paidInPrices.credit > 0 && mixedText.push("credit");
      sale.paidInPrices.transfer > 0 && mixedText.push("transfer");

      const paidInText =
        sale.paidIn == "mixed" ? `mixed(${mixedText.join(",")})` : sale.paidIn;

      const subPrice =
        (Number(product?.unit_price) - item.discount_per_unit) * item.no;

      flattenedData.push({
        date: index == 0 ? sale.datetime.slice(0, 10) : "",
        name: index == 0 ? sale.customerD.first_name : "",
        item: product?.product_name || "",
        amount: item.no,
        price: product?.unit_price || "",
        dicountPerUnit: item.discount_per_unit || "",
        subTotalPrice: subPrice,
        total: index == 0 ? sale.totalAmount : "",
        paidIn: index == 0 ? paidInText : "",
        creditAmount:
          index == 0 && sale.paidInPrices.credit > 0
            ? sale.paidInPrices.credit
            : "",
      });
    });
  });

  flattenedData[0] = { ...flattenedData[0], totalPrice: totalPrice };

  let columns: IJsonSheet[] = [
    {
      sheet: "Sales",
      columns: [
        {
          label: "DateTime",
          value: "date",
        },
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Items",
          value: "item",
        },
        {
          label: "Amount",
          value: "amount",
        },
        {
          label: "Prices (birr)",
          value: "price",
        },
        {
          label: "Dicount Per Unit",
          value: "dicountPerUnit",
        },
        {
          label: "Sub-total Price",
          value: "subTotalPrice",
        },
        {
          label: "Total",
          value: "total",
        },
        {
          label: "Paid In",
          value: "paidIn",
        },
        {
          label: "Credit Amount",
          value: "creditAmount",
        },
        {
          label: "Total Price",
          value: "totalPrice",
        },
      ],
      content: [...flattenedData],
    },
  ];
  let settings = {
    fileName: "Sales item View Data",
  };

  xlsx(columns, settings);
}

export async function DailyReportToExcel(
  sales: any[],
  cash: Cash[],
  expanse: Expanse[]
) {
  let totalPrice = 0;
  let salesCash = 0;
  let cashNotSale = 0;
  let TotalCash = 0;
  let TotalExpanse = 0;

  let today = new Date();

  const data: Sales[] = sales.filter((Sa) => {
    const dateToCheck = new Date(Sa.datetime);
    if (
      dateToCheck.getFullYear() === today.getFullYear() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getDate() === today.getDate()
    ) {
      totalPrice = totalPrice + Number(Sa.totalAmount);
      return true;
    } else {
      return false;
    }
  });

  data.sort((a, b) => {
    const paidInA = a.paidIn.toLowerCase();
    const paidInB = b.paidIn.toLowerCase();

    if (paidInA < paidInB) {
      return -1;
    }
    if (paidInA > paidInB) {
      return 1;
    }
    return 0;
  });

  cash.forEach((Ca) => {
    const dateToCheck = new Date(Ca.datetime);
    if (
      dateToCheck.getFullYear() === today.getFullYear() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getDate() === today.getDate()
    ) {
      if (Ca.type == "sale") {
        salesCash = salesCash + Number(Ca.amount);
      } else {
        cashNotSale = cashNotSale + Number(Ca.amount);
      }
      TotalCash = TotalCash + Number(Ca.amount);
    }
  });

  expanse.forEach((Ex) => {
    const dateToCheck = new Date(Ex.datetime);
    if (
      dateToCheck.getFullYear() === today.getFullYear() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getDate() === today.getDate()
    ) {
      TotalExpanse = TotalExpanse + Number(Ex.amount);
    }
  });

  // console.log(data);
  let availableCash = TotalCash - TotalExpanse;

  const flattenedData: any[] = [];
  data.forEach((sale: Sales, i) => {
    sale.items.forEach((item, index) => {
      const product = data[i].productsD.find(
        (pr: ProductsD) => pr.docId == item.productDocId
      );

      const mixedText = [];
      sale.paidInPrices.cash > 0 && mixedText.push("cash");
      sale.paidInPrices.POS > 0 && mixedText.push("POS");
      sale.paidInPrices.credit > 0 && mixedText.push("credit");
      sale.paidInPrices.transfer > 0 && mixedText.push("transfer");

      const paidInText =
        sale.paidIn == "mixed" ? `mixed(${mixedText.join(",")})` : sale.paidIn;
      const subPrice =
        (Number(product?.unit_price) - item.discount_per_unit) * item.no;

      flattenedData.push({
        date: index == 0 ? sale.datetime.slice(0, 10) : "",
        name: index == 0 ? sale.customerD.first_name : "",
        item: product?.product_name || "",
        amount: item.no,
        price: product?.unit_price || "",
        dicountPerUnit: item.discount_per_unit || "",
        subTotalPrice: subPrice,
        total: index == 0 ? sale.totalAmount : "",
        paidIn: index == 0 ? paidInText : "",
        creditAmount:
          index == 0 && sale.paidInPrices.credit > 0
            ? sale.paidInPrices.credit
            : "",
      });
    });
  });

  flattenedData[0] = {
    ...flattenedData[0],
    salesCash: salesCash,
    cashNotSale: cashNotSale,
    TotalCash: TotalCash,
    TotalExpanse: TotalExpanse,
    availableCash: availableCash,
  };

  let columns: IJsonSheet[] = [
    {
      sheet: "Sales",
      columns: [
        {
          label: "DateTime",
          value: "date",
        },
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Items",
          value: "item",
        },
        {
          label: "Amount",
          value: "amount",
        },
        {
          label: "Prices (birr)",
          value: "price",
        },
        {
          label: "Dicount Per Unit",
          value: "dicountPerUnit",
        },
        {
          label: "Sub-total Price",
          value: "subTotalPrice",
        },
        {
          label: "Total",
          value: "total",
        },
        {
          label: "Paid In",
          value: "paidIn",
        },
        {
          label: "Credit Amount",
          value: "creditAmount",
        },
        {
          label: "Total cash From Sale",
          value: "salesCash",
        },
        {
          label: "Cash In",
          value: "cashNotSale",
        },
        {
          label: "Sub-total Cash",
          value: "TotalCash",
        },
        {
          label: "Expense",
          value: "TotalExpanse",
        },
        {
          label: "Total Available Cash",
          value: "availableCash",
        },
      ],
      content: [...flattenedData],
    },
  ];
  let settings = {
    fileName: "Sales item View Data",
  };

  xlsx(columns, settings);
}

export async function InventoryToExcel(Inventory: any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Inventory",
      columns: [
        {
          label: "Produt Name",
          value: (row) => getdata(row.original, "product_name"),
        },
        {
          label: "Amount In the Inventory",
          value: (row) => getdata(row.original, "currentAmount"),
        },
        {
          label: "Catagory",
          value: (row) => getdata(row.original, "catagory"),
        },
        {
          label: "Last Added Date",
          value: (row) => dateHistory(row.original, "datetime"),
        },
      ],
      content: Inventory,
    },
  ];
  let settings = {
    fileName: "Inventory Data",
  };

  xlsx(columns, settings);
}

export async function DailyInventoryToExcel(Inventory: any[], sales: any[]) {
  let today = new Date();

  console.log(Inventory, sales);

  const salesData: Sales2[] = sales.filter((Sa) => {
    const dateToCheck = new Date(Sa.datetime);
    if (
      dateToCheck.getFullYear() === today.getFullYear() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getDate() === today.getDate()
    ) {
      return true;
    } else {
      return false;
    }
  });

  const dataInv: InventoryViewData[] = Inventory.filter((In: any) => {
    const history = In.history;
    const dateToCheck = new Date(history[history.length - 1].datetime);
    if (
      dateToCheck.getFullYear() === today.getFullYear() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getDate() === today.getDate()
    ) {
      return true;
    } else {
      return false;
    }
  });

  const newInv: any[] = dataInv.map((Inv) => {
    let numberOfsold = 0;
    salesData.forEach((Sa) => {
      Sa.items.forEach((Item) => {
        if (Item.productDocId == Inv.productId) {
          numberOfsold = numberOfsold + Item.no;
        }
      });
    });

    return {
      ...Inv,
      numberOfsold: numberOfsold,
    };
  });

  let columns: IJsonSheet[] = [
    {
      sheet: "Inventory",
      columns: [
        {
          label: "Name",
          // value: (row) => getdata(row, "product_name"),
          value: "product_name",
        },
        {
          label: "Previous amount",
          value: (row) =>
            getdata(row, "currentAmount") +
            getdata(row, "numberOfsold") -
            amountHistory(row, "addedAmount"),
        },
        {
          label: "Added amount",
          value: (row) => amountHistory(row, "addedAmount"),
        },
        {
          label: "Sold amount",
          value: (row) => getdata(row, "numberOfsold"),
        },
        {
          label: "Remaining amount",
          value: (row) => getdata(row, "currentAmount"),
        },
      ],
      content: newInv,
    },
  ];
  let settings = {
    fileName: "Inventory Data",
  };

  xlsx(columns, settings);
}

export async function CashToExcel(ViewCa: any[]) {
  let totalCash = 0;
  const data: Cash[] = ViewCa.map((View) => {
    totalCash = totalCash + Number(View.original.amount);
    return View.original;
  });
  data[0] = { ...data[0], totalAmount: totalCash };
  let columns: IJsonSheet[] = [
    {
      sheet: "Cash Income",
      columns: [
        {
          label: "Title",
          value: "title",
        },

        {
          label: "Discription",
          value: "discription",
        },
        {
          label: "Type",
          value: "type",
        },
        {
          label: "Datetime",
          value: (row) =>
            row["datetime"] ? row["datetime"].toString().slice(0, 10) : "",
        },
        { label: "Amount", value: "amount" },
        { label: "Total Cash", value: "totalAmount" },
      ],
      content: [...data],
    },
  ];
  let settings = {
    fileName: "Cash View Data",
  };

  xlsx(columns, settings);
}

export async function ExapanseToExcel(ViewEX: any[]) {
  let totalExpanse = 0;
  const data: Expanse[] = ViewEX.map((View) => {
    totalExpanse = totalExpanse + Number(View.original.amount);
    return View.original;
  });
  data[0] = { ...data[0], totalAmount: totalExpanse };

  let columns: IJsonSheet[] = [
    {
      sheet: "Expanse",
      columns: [
        {
          label: "Title",
          value: "title",
        },

        {
          label: "Discription",
          value: "discription",
        },
        {
          label: "Datetime",
          value: (row) =>
            row["datetime"] ? row["datetime"].toString().slice(0, 10) : "",
        },
        { label: "Amount", value: "amount" },
        { label: "Total Cash", value: "totalAmount" },
      ],
      content: [...data],
    },
  ];
  let settings = {
    fileName: "Expanse View Data",
  };

  xlsx(columns, settings);
}
