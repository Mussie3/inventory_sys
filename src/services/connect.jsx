import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  arrayUnion,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../firebase.config";

//   import toast from "react-hot-toast";

const services = {
  AddUserWithARole: async (user) => {
    const usersref = collection(db, "Users");

    try {
      const id = await addDoc(usersref, { ...user });
      return id;
    } catch (err) {
      console.log(err);
      return "something went wrong";
    }
  },
  AddCustomer: async (customer) => {
    const customersref = collection(db, "Customers");

    try {
      const custemerid = await addDoc(customersref, { ...customer });
      const createdref = doc(db, "Customers", custemerid.id);
      await setDoc(
        createdref,
        {
          docId: custemerid.id,
        },
        { merge: true }
      );
      return custemerid.id;
    } catch (err) {
      console.log(err);
      return "something went wrong";
    }
  },
  AddProduct: async (product) => {
    const productsref = collection(db, "Products");

    try {
      const data = await addDoc(productsref, { ...product });
      const createdref = doc(db, "Products", data.id);
      await setDoc(
        createdref,
        {
          docId: data.id,
        },
        { merge: true }
      );
      return data.id;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  AddInventory: async (productId) => {
    console.log(productId);
    const inventoryref = collection(db, "Inventory");

    try {
      const data = await addDoc(inventoryref, {
        productId: productId,
        history: [],
        currentAmount: 0,
        datetime: new Date().toISOString(),
      });
      const created = doc(db, "Inventory", data.id);
      await setDoc(
        created,
        {
          docId: data.id,
        },
        { merge: true }
      );
      const product = doc(db, "Products", productId);
      await setDoc(
        product,
        {
          invId: data.id,
        },
        { merge: true }
      );
      return data.id;
    } catch (err) {
      console.log(err);
      return "something went wrong";
    }
  },
  AddSales: async (Sales) => {
    const productsref = collection(db, "Sales");

    try {
      const data = await addDoc(productsref, { ...Sales });
      const createdref = doc(db, "Sales", data.id);
      await setDoc(
        createdref,
        {
          docId: data.id,
        },
        { merge: true }
      );
      return data.id;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  AddUsers: async (Users) => {
    const productsref = collection(db, "Users");

    try {
      const data = await addDoc(productsref, { ...Users });
      const createdref = doc(db, "Users", data.id);
      await setDoc(
        createdref,
        {
          docId: data.id,
        },
        { merge: true }
      );
      return data.id;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  AddCatagory: async (Catagory) => {
    const productsref = collection(db, "Catagorys");

    try {
      const data = await addDoc(productsref, { ...Catagory });
      const createdref = doc(db, "Catagorys", data.id);
      await setDoc(
        createdref,
        {
          docId: data.id,
        },
        { merge: true }
      );
      return data.id;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  addCredit: async (newCredit, customerId) => {
    const createdref = doc(db, "Customers", customerId);
    try {
      await setDoc(
        createdref,
        {
          credit: newCredit,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  EditProduct: async (product, productId) => {
    const createdref = doc(db, "Products", productId);
    try {
      await setDoc(
        createdref,
        {
          ...product,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  EditCustomer: async (customer, customerId) => {
    const createdref = doc(db, "Customers", customerId);
    try {
      await setDoc(
        createdref,
        {
          ...customer,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  EditUserById: async (id, updatedUser) => {
    const userref = doc(db, "Users", id);

    try {
      await setDoc(
        userref,
        {
          ...updatedUser,
        },
        { merge: true }
      );

      return true;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  EditToInventory: async (id, history, currentAmount) => {
    const productsref = doc(db, "Inventory", id);

    try {
      await setDoc(
        productsref,
        {
          currentAmount: currentAmount,
          history: history,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  EditSales: async (id, newsales) => {
    const salesref = doc(db, "Sales", id);

    try {
      await setDoc(
        salesref,
        {
          ...newsales,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  EditCatagory: async (id, catagoryName) => {
    const salesref = doc(db, "Catagorys", id);

    try {
      await setDoc(
        salesref,
        {
          catagoryName: catagoryName,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  AddToInventory: async (id, addedAmount, currentAmount) => {
    console.log(id, addedAmount);
    const productsref = doc(db, "Inventory", id);

    try {
      await setDoc(
        productsref,
        {
          currentAmount: currentAmount,
          history: arrayUnion(
            ...[
              { addedAmount: addedAmount, datetime: new Date().toISOString() },
            ]
          ),
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  GetAllUsers: async () => {
    const usersref = collection(db, "Users");
    try {
      const data = await getDocs(usersref);
      const allusers = data.docs.map((doc) => doc.data());
      console.log(allusers);
      return allusers;
    } catch (err) {
      throw Error;
    }
  },
  GetAllCatagorys: async () => {
    console.log("g");
    const catagorysref = collection(db, "Catagorys");
    try {
      const data = await getDocs(catagorysref);
      console.log("g");
      const allcatagorys = data.docs.map((doc) => doc.data());
      return allcatagorys;
    } catch (err) {
      console.log(err);
      throw Error;
    }
  },
  GetAllCustomers: async () => {
    const customersref = collection(db, "Customers");
    try {
      const data = await getDocs(customersref);
      const allcustomers = data.docs.map((doc) => doc.data());
      return allcustomers;
    } catch (err) {
      throw Error;
    }
  },
  GetAllProducts: async () => {
    const productssref = collection(db, "Products");
    try {
      const data = await getDocs(productssref);
      const allproducts = data.docs.map((doc) => doc.data());
      return allproducts;
    } catch (err) {
      throw Error;
    }
  },
  GetAllInventorys: async () => {
    const inventorysref = collection(db, "Inventory");
    try {
      const data = await getDocs(inventorysref);
      const allinventorys = data.docs.map((doc) => doc.data());
      return allinventorys;
    } catch (err) {
      throw Error;
    }
  },
  GetAllSeles: async () => {
    const salesref = collection(db, "Sales");
    try {
      const data = await getDocs(salesref);
      const allsales = data.docs.map((doc) => doc.data());
      return allsales;
    } catch (err) {
      throw Error;
    }
  },
  DeleteCustomer: async (Id) => {
    const customerref = doc(db, "Customers", Id);
    try {
      await deleteDoc(customerref);
      return true;
    } catch (err) {
      console.log(err);
      return "something went wrong";
    }
  },
  DeleteProduct: async (Id) => {
    const productref = doc(db, "Products", Id);
    console.log(Id);
    try {
      await deleteDoc(productref);
      return true;
    } catch (err) {
      console.log(err);
      return "something went wrong";
    }
  },
  DeleteInventory: async (Id, productId) => {
    const invenntoryref = doc(db, "Inventory", Id);
    try {
      await deleteDoc(invenntoryref);

      const productsref = doc(db, "Products", productId);
      await setDoc(
        productsref,
        {
          invId: "",
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  DeleteSales: async (Id) => {
    const salesref = doc(db, "Sales", Id);
    try {
      await deleteDoc(salesref);
      return true;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  DeleteUser: async (Id) => {
    const userref = doc(db, "Users", Id);
    try {
      await deleteDoc(userref);
      return true;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  UploadImage: async (file) => {
    console.log(file);
    const name = file.name;
    const storageRef = ref(storage, `image/${name}`);
    console.log(storage);
    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      let url;
      console.log(uploadTask);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // const progress =
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          // switch (snapshot.state) {
          //   case "paused":
          //     console.log("Upload is paused");
          //     break;
          //   case "running":
          //     console.log("Upload is running");
          //     break;
          // }
        },
        (err) => {
          console.log(err);
          // Handle unsuccessful uploads
        },
        () => {
          console.log("uploaded?");
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            url = downloadURL;
            console.log("File available at", downloadURL);
          });
        }
      );
      return url;
    } catch (err) {
      console.log(err);
      return "something went wrong";
    }
  },
  GetProductById: async (id) => {
    const productsref = doc(db, "Products", id);

    try {
      const product = await getDoc(productsref);

      return product.data();
    } catch (err) {
      return null;
    }
  },
  GetCustomerById: async (id) => {
    const customersref = doc(db, "Customers", id);

    try {
      const product = await getDoc(customersref);

      return product.data();
    } catch (err) {
      return null;
    }
  },
  GetInventoryById: async (id) => {
    const invenntoryref = doc(db, "Inventory", id);

    try {
      const inventory = await getDoc(invenntoryref);

      return inventory.data();
    } catch (err) {
      return null;
    }
  },
  GetUserById: async (id) => {
    const userref = doc(db, "Users", id);

    try {
      const user = await getDoc(userref);

      return user.data();
    } catch (err) {
      return null;
    }
  },
  GetSalesById: async (id) => {
    const salesref = doc(db, "Sales", id);

    try {
      const sales = await getDoc(salesref);

      return sales.data();
    } catch (err) {
      return null;
    }
  },
  SubInventory: async (id, currentAmount) => {
    const productsref = doc(db, "Inventory", id);

    try {
      await setDoc(
        productsref,
        {
          currentAmount: currentAmount,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
  AddSalesToCustomer: async (customerId, cuData) => {
    const customersref = doc(db, "Customers", customerId);

    try {
      await setDoc(
        customersref,
        {
          // history: arrayUnion(
          //   ...[{ salesId: salesId, datetime: new Date().toISOString() }]
          // ),
          ...cuData,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return "something went wrong";
    }
  },
  EditSalesOfCustomer: async (customerId, cuData) => {
    const customersref = doc(db, "Customers", customerId);

    try {
      await setDoc(
        customersref,
        {
          ...cuData,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.log(err);
      return "something went wrong";
    }
  },

  // EditAllSales2: async () => {
  //   const productssref = collection(db, "Products");
  //   try {
  //     const data = await getDocs(productssref);
  //     const allproducts = data.docs.map((doc) => doc.data());

  //     for (let i = 0; i < allproducts.length; i++) {
  //       const created = doc(db, "Products", allproducts[i].docId);

  //       await setDoc(
  //         created,
  //         {
  //           unit_price: Number(allproducts[i].unit_price),
  //         },
  //         { merge: true }
  //       );
  //     }
  //     return true;
  //   } catch (err) {
  //     console.log(err);
  //     return undefined;
  //   }
  // },
};

export default services;
