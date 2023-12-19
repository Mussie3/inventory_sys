import services from "@/services/connect";
import xlsx, { IJsonSheet } from "json-as-xlsx";

type Items = {
  no: number;
  productId: string;
};

type Sales = {
  customer: string;
  productId: string;
  datetime: string;
  docId: string;
  discounted: string;
  totalAmount: number;
  creditedAmount: number;
  paidIn: string;
  items: Items[];
};

function date(date: any) {
  return date.slice(0, 10);
  // return new Date(date).toLocaleDateString();
}
export async function downloadToExcel() {
  const Allsales = (await services.GetAllSeles()) as Sales[];
  if (!Allsales) return null;

  const FormatedSales = Allsales.map((sales) => {
    return {
      ...sales,
      items: "",
    };
  });

  let columns: IJsonSheet[] = [
    {
      sheet: "Sales",
      columns: [
        { label: "Document Id", value: "docId" },
        { label: "Customer Id", value: "customer" },
        { label: "Got Discount", value: "discounted" },
        { label: "Total Price", value: "totalAmount" },
        { label: "Paid In", value: "paidIn" },
        {
          label: "Sold Date",
          value: (row) => date(row.datetime),
        },
      ],
      content: FormatedSales,
    },
  ];
  let settings = {
    fileName: "Sales Data",
  };

  xlsx(columns, settings);
}

function getsalesdata(data: any, c: string, d: string) {
  const g = data?.[c];
  return g?.[d];
}

function getdata(data: any, d: any) {
  return data?.[d];
}

export async function SalseToExcel(ViewSale: any) {
  console.log(ViewSale);

  let columns: IJsonSheet[] = [
    {
      sheet: "Sales",
      columns: [
        // { label: "Document Id", value: "docId" },
        {
          label: "Customer FirstName",
          value: (row) => getsalesdata(row.original, "customerD", "first_name"),
        },
        {
          label: "Customer LastName",
          value: (row) => getsalesdata(row.original, "customerD", "last_name"),
        },
        {
          label: "Got Discount",
          value: (row) => getdata(row.original, "discounted"),
        },
        {
          label: "Total Price",
          value: (row) => getdata(row.original, "totalAmount"),
        },
        { label: "Paid In", value: (row) => getdata(row.original, "paidIn") },
        {
          label: "Credited Amount",
          value: (row) => getdata(row.original, "creditedAmount"),
        },
        {
          label: "Sold Date",
          value: (row) => date(getdata(row.original, "datetime")),
        },
      ],
      content: ViewSale,
    },
  ];
  let settings = {
    fileName: "Sales View Data",
  };

  xlsx(columns, settings);
}

export async function InventoryToExcel(Inventory: any) {
  console.log(Inventory);

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
          label: "Image of product",
          value: (row) => getdata(row.original, "image"),
        },
        {
          label: "Inventory Created Date",
          value: (row) => date(getdata(row.original, "datetime")),
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
