"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BiSolidShow } from "react-icons/Bi";
import { BiSolidHide } from "react-icons/Bi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";
import Image from "next/image";
import UploadImageToStorage from "./UploadImg";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email().min(5, {
    message: "email must be at least 5 characters.",
  }),
  role: z.string().min(2, {
    message: "role must be at least 2 characters.",
  }),
});

type User = {
  role: string;
  username: string;
  image: string;
  email: string;
  docId: string;
};

type Props = {
  user: User;
};

export function EditUsers({ user }: Props) {
  const { users, setUsers, setUsersLoading } = useTodo();
  const [sending, setSending] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(user);
  const [changePassword, setChangePassword] = useState(false);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  console.log(user);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: user.role,
      username: user.username,
      email: user.email,
    },
  });

  function fetchUsersdata(id: string, newdata: any) {
    // setUsersLoading(true);
    // fetch("/api/getUsers")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setUsers(data.Users);
    //     setUsersLoading(false);
    //   })
    //   .catch((err) => {
    //     setUsersLoading(undefined);
    //     console.log(err);
    //   });
    const newUsers = users.map((Pro: User) => {
      if (Pro.docId == id) {
        const updatedUser = {
          docId: id,
          username: newdata.username,
          email: newdata.email,
          password: "",
          role: newdata.role,
          image: newdata.image ? newdata.image : "",
        };
        return {
          ...Pro,
          ...updatedUser,
        };
      }
      return Pro;
    });

    setUsers(newUsers);
  }

  async function EditUser(data: z.infer<typeof FormSchema>) {
    if (
      changePassword &&
      (currentPassword.length < 6 || newPassword.length < 6)
    ) {
      throw Error("Password length must be at least 6 catacters");
    }
    if (changePassword && currentPassword === newPassword) {
      throw Error("Current password and new password are the same");
    }
    const newdata = {
      ...data,
      image: currentUserData.image,
      docId: user.docId,
      changePassword: false,
      currentPassword: "",
      newPassword: "",
    };

    if (changePassword) {
      (newdata.changePassword = true),
        (newdata.currentPassword = currentPassword);
      newdata.newPassword = newPassword;
    }
    console.log(newdata);

    const Userexist = await fetch("/api/userExists", {
      method: "POST",
      body: JSON.stringify({ docId: user.docId, username: data.username }),
    });

    if (Userexist.ok) {
      const response = await Userexist.json();
      console.log(response.exist);
      if (response.exist) {
        throw Error(`Username '${data.username}' exists`);
      }
    }
    const res = await fetch("/api/editUser", {
      method: "POST",
      body: JSON.stringify(newdata),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response);
      if (!response.passwordMatch) {
        throw Error("Current Password Doesn't match");
      }
      if (response.updated) {
        fetchUsersdata(user.docId, newdata);
        router.push(`/users/`);
        return response.updated;
      }
    }

    throw Error("error");
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSending(true);
    toast.promise(EditUser(data), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `User "${data.username}" has been Edited`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  return (
    <div className="w-full max-w-xl m-4 flex flex-col gap-4 p-8 border rounded-md">
      <div className="text-xl mb-8">Edit Users</div>
      <div className=" relative w-[200px] h-[200px] max-h-full max-w-full bg-green-400">
        <div className=" absolute top-0 right-0 z-30">
          <FiEdit
            onClick={() => setEditImage((pre) => !pre)}
            size={30}
            color="green"
            className=" cursor-pointer p-1 hover:bg-gray-400"
          />
        </div>
        <Image
          src={currentUserData.image}
          alt={currentUserData.username}
          className="object-cover h-full"
          width={200}
          height={200}
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is a username that will be used to sign in.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is a username that will be used to sign in.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catagory</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Catagory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                {/* <FormDescription>
                This is a will access level of the user.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {changePassword ? (
            <div className="flex flex-col items-center gap-2 justify-center w-full">
              <Button
                variant="link"
                onClick={() => setChangePassword((pre) => !pre)}
              >
                keep old password
              </Button>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="text-sm">Current Password</label>

                <div className=" relative">
                  <div
                    className="absolute right-2 top-2 p-1 cursor-pointer"
                    onClick={() => setHideCurrentPassword((pre) => !pre)}
                  >
                    {hideCurrentPassword ? (
                      <BiSolidHide size={20} />
                    ) : (
                      <BiSolidShow size={20} />
                    )}
                  </div>
                  <Input
                    id="currentPassword"
                    type={hideCurrentPassword ? "password" : "text"}
                    placeholder="Current Password"
                    required
                    min={6}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <label htmlFor="text-sm">New Password</label>

                <div className=" relative">
                  <div
                    className="absolute right-2 top-2 p-1 cursor-pointer"
                    onClick={() => setHideNewPassword((pre) => !pre)}
                  >
                    {hideNewPassword ? (
                      <BiSolidHide size={20} />
                    ) : (
                      <BiSolidShow size={20} />
                    )}
                  </div>
                  <Input
                    id="newPassword"
                    type={hideNewPassword ? "password" : "text"}
                    placeholder="New Password"
                    required
                    min={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="link"
              onClick={() => setChangePassword((pre) => !pre)}
            >
              change password
            </Button>
          )}
          {editImage && (
            <UploadImageToStorage setURL={setCurrentUserData} path="image/" />
          )}
          <div className="flex justify-end items-center w-full mt-4">
            <Button disabled={sending} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
