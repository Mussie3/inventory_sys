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
import { db, fetchCache, storage } from "../firebase.config";

//   import toast from "react-hot-toast";

const services = {
  AddUserWithARole: async (user) => {
    const usersref = collection(db, "Users");

    try {
      const id = await addDoc(usersref, { ...user });
      return id;
    } catch (err) {
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
      return undefined;
    }
  },
  AddInventory: async (productId) => {
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
      return undefined;
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
      return undefined;
    }
  },
  AddExpanse: async (expanse) => {
    const expanseref = collection(db, "Expanse");

    try {
      const expanseid = await addDoc(expanseref, { ...expanse });
      const createdref = doc(db, "Expanse", expanseid.id);
      await setDoc(
        createdref,
        {
          docId: expanseid.id,
        },
        { merge: true }
      );
      return expanseid.id;
    } catch (err) {
      return undefined;
    }
  },
  AddCash: async (cash) => {
    const cashref = collection(db, "Cash");

    try {
      const cashid = await addDoc(cashref, { ...cash });
      const createdref = doc(db, "Cash", cashid.id);
      await setDoc(
        createdref,
        {
          docId: cashid.id,
        },
        { merge: true }
      );
      return cashid.id;
    } catch (err) {
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
      return undefined;
    }
  },
  EditExpanse: async (expanse, expanseId) => {
    const createdref = doc(db, "Expanse", expanseId);
    try {
      await setDoc(
        createdref,
        {
          ...expanse,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      return false;
    }
  },
  EditCash: async (cash, cashId) => {
    const createdref = doc(db, "Cash", cashId);
    try {
      await setDoc(
        createdref,
        {
          ...cash,
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      return false;
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
      return undefined;
    }
  },
  AddToInventory: async (id, addedAmount, currentAmount) => {
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
      return undefined;
    }
  },
  GetAllUsers: async () => {
    const usersref = collection(db, "Users");
    try {
      const data = await getDocs(usersref);
      const allusers = data.docs.map((doc) => doc.data());
      return allusers;
    } catch (err) {
      throw Error;
    }
  },
  GetAllCatagorys: async () => {
    const catagorysref = collection(db, "Catagorys");
    try {
      const data = await getDocs(catagorysref, fetchCache);
      const allcatagorys = data.docs.map((doc) => doc.data());
      return allcatagorys;
    } catch (err) {
      throw Error;
    }
  },
  GetAllCustomers: async () => {
    const customersref = collection(db, "Customers");
    try {
      const data = await getDocs(customersref, fetchCache);
      const allcustomers = data.docs.map((doc) => doc.data());
      return allcustomers;
    } catch (err) {
      throw Error;
    }
  },
  GetAllProducts: async () => {
    const productssref = collection(db, "Products");
    try {
      const data = await getDocs(productssref, fetchCache);
      const allproducts = data.docs.map((doc) => doc.data());
      return allproducts;
    } catch (err) {
      throw Error;
    }
  },
  GetAllInventorys: async () => {
    const inventorysref = collection(db, "Inventory");
    try {
      const data = await getDocs(inventorysref, fetchCache);
      const allinventorys = data.docs.map((doc) => doc.data());
      return allinventorys;
    } catch (err) {
      throw Error;
    }
  },
  GetAllSeles: async () => {
    const salesref = collection(db, "Sales");
    try {
      const data = await getDocs(salesref, fetchCache);
      const allsales = data.docs.map((doc) => doc.data());
      return allsales;
    } catch (err) {
      throw Error;
    }
  },
  GetAllExapase: async () => {
    const expanseref = collection(db, "Expanse");
    try {
      const data = await getDocs(expanseref, fetchCache);
      const allexpanse = data.docs.map((doc) => doc.data());
      return allexpanse;
    } catch (err) {
      throw Error;
    }
  },
  GetAllCash: async () => {
    const Cashref = collection(db, "Cash");
    try {
      const data = await getDocs(Cashref, fetchCache);
      const allcash = data.docs.map((doc) => doc.data());
      return allcash;
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
      return undefined;
    }
  },
  DeleteProduct: async (Id) => {
    const productref = doc(db, "Products", Id);
    try {
      await deleteDoc(productref);
      return true;
    } catch (err) {
      return undefined;
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
      return undefined;
    }
  },
  DeleteSales: async (Id) => {
    const salesref = doc(db, "Sales", Id);
    try {
      await deleteDoc(salesref);
      return true;
    } catch (err) {
      return undefined;
    }
  },
  DeleteExpanse: async (Id) => {
    const expanseref = doc(db, "Expanse", Id);
    try {
      await deleteDoc(expanseref);
      return true;
    } catch (err) {
      return undefined;
    }
  },
  DeleteCash: async (Id) => {
    const cashref = doc(db, "Cash", Id);
    try {
      await deleteDoc(cashref);
      return true;
    } catch (err) {
      return undefined;
    }
  },
  DeleteUser: async (Id) => {
    const userref = doc(db, "Users", Id);
    try {
      await deleteDoc(userref);
      return true;
    } catch (err) {
      return undefined;
    }
  },
  UploadImage: async (file) => {
    const name = file.name;
    const storageRef = ref(storage, `image/${name}`);
    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      let url;
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
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            url = downloadURL;
          });
        }
      );
      return url;
    } catch (err) {
      return "something went wrong";
    }
  },
  GetProductById: async (id) => {
    const productsref = doc(db, "Products", id);

    try {
      const product = await getDoc(productsref, fetchCache);

      return product.data();
    } catch (err) {
      return null;
    }
  },
  GetCustomerById: async (id) => {
    const customersref = doc(db, "Customers", id);

    try {
      const product = await getDoc(customersref, fetchCache);

      return product.data();
    } catch (err) {
      return null;
    }
  },
  GetInventoryById: async (id) => {
    const invenntoryref = doc(db, "Inventory", id);

    try {
      const inventory = await getDoc(invenntoryref, fetchCache);

      return inventory.data();
    } catch (err) {
      return null;
    }
  },
  GetUserById: async (id) => {
    const userref = doc(db, "Users", id);

    try {
      const user = await getDoc(userref, fetchCache);

      return user.data();
    } catch (err) {
      return null;
    }
  },
  GetSalesById: async (id) => {
    const salesref = doc(db, "Sales", id);

    try {
      const sales = await getDoc(salesref, fetchCache);

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
      return "something went wrong";
    }
  },
};

export default services;
