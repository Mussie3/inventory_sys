import { useTodo } from "@/hooks/useContextData";
import React from "react";
import { Button } from "./button";

export default function ReFetchAllDataButton() {
  const { fetchAllPagedata, setUsersLoading } = useTodo();
  function onClicked() {
    fetchAllPagedata();
  }
  return (
    <Button disabled={setUsersLoading} onClick={onClicked}>
      Refetch All Data
    </Button>
  );
}
