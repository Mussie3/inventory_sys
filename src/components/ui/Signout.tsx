"use client";
// import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "./button";

export default function Signout() {
  // const router = useRouter();

  async function LogOutFun() {
    try {
      signOut();
      // router.push(`/auth/login`);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <Button variant="secondary" onClick={LogOutFun}>
      Sign out
    </Button>
  );
}
