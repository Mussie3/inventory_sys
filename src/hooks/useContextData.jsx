"use client";
import React, { useContext, useEffect, useState } from "react";

export const TodoDataContext = React.createContext();

export function useTodo() {
  return useContext(TodoDataContext);
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [catagory, setCatagory] = useState([]);
  const [catagoryLoading, setCatagoryLoading] = useState(true);
  const [customer, setCustomer] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [expanse, setExpanse] = useState([]);
  const [expanseLoading, setExpanseLoading] = useState(true);
  const [cash, setCash] = useState([]);
  const [cashLoading, setCashLoading] = useState(true);

  function fetchAllPagedata() {
    setProductsLoading(true);
    setCatagoryLoading(true);
    setCustomerLoading(true);
    setInventoryLoading(true);
    setSalesLoading(true);
    setUsersLoading(true);
    setExpanseLoading(true);
    setCashLoading(true);
    fetch("/api/getAllPagesData", {
      method: "POST",
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((alldata) => {
        const data = alldata.AllResults;
        if (data[0].status == "fulfilled") {
          setProducts(data[0].value);
          setProductsLoading(false);
        } else {
          setProductsLoading(undefined);
        }
        if (data[1].status == "fulfilled") {
          setCustomer(data[1].value);
          setCustomerLoading(false);
        } else {
          setCustomerLoading(undefined);
        }
        if (data[2].status == "fulfilled") {
          setCatagory(data[2].value);
          setCatagoryLoading(false);
        } else {
          setCatagoryLoading(undefined);
        }
        if (data[3].status == "fulfilled") {
          setInventory(data[3].value);
          setInventoryLoading(false);
        } else {
          setInventoryLoading(undefined);
        }
        if (data[4].status == "fulfilled") {
          setSales(data[4].value);
          setSalesLoading(false);
        } else {
          setSalesLoading(undefined);
        }
        if (data[5].status == "fulfilled") {
          setUsers(data[5].value);
          setUsersLoading(false);
        } else {
          setUsersLoading(undefined);
        }
        if (data[6].status == "fulfilled") {
          setExpanse(data[6].value);
          setExpanseLoading(false);
        } else {
          setExpanseLoading(undefined);
        }
        if (data[6].status == "fulfilled") {
          setCash(data[7].value);
          setCashLoading(false);
        } else {
          setCashLoading(undefined);
        }
      })
      .catch((err) => {
        setProductsLoading(undefined);
        setCatagoryLoading(undefined);
        setCustomerLoading(undefined);
        setInventoryLoading(undefined);
        setSalesLoading(undefined);
        setUsersLoading(undefined);
        setExpanseLoading(undefined);
        setCashLoading(undefined);
      });
  }

  useEffect(() => {
    fetchAllPagedata();
  }, []);

  return (
    <TodoDataContext.Provider
      value={{
        products,
        setProducts,
        productsLoading,
        setProductsLoading,
        catagory,
        setCatagory,
        catagoryLoading,
        setCatagoryLoading,
        customer,
        setCustomer,
        customerLoading,
        setCustomerLoading,
        inventory,
        setInventory,
        inventoryLoading,
        setInventoryLoading,
        sales,
        setSales,
        salesLoading,
        setSalesLoading,
        users,
        setUsers,
        usersLoading,
        setUsersLoading,
        expanse,
        setExpanse,
        expanseLoading,
        setExpanseLoading,
        cash,
        setCash,
        cashLoading,
        setCashLoading,
        fetchAllPagedata,
      }}
    >
      {children}
    </TodoDataContext.Provider>
  );
}
