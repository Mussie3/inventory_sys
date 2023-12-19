"use client";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { FiEdit } from "react-icons/fi";
import UploadImageToStorage from "./UploadImg";
import Image from "next/image";
import { BiSolidHide, BiSolidShow } from "react-icons/Bi";
import { useRouter } from "next/navigation";
import { useTodo } from "@/hooks/useContextData";
import { toast } from "sonner";
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
export default function Profile({ user }: Props) {
  const { users, setUsers, setUsersLoading } = useTodo();
  const [sending, setSending] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(user);
  const [editMail, setEditMail] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [editImage, setEditImage] = useState(false);

  const [changePassword, setChangePassword] = useState(false);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  console.log(currentUserData);

  const router = useRouter();

  function fetchUsersdata(newdata: any) {
    // setUsersLoading(true);
    // fetch("/api/getUsers")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setUsers(data.Users);
    //     setUsersLoading(false);
    //     router.push(`/profile/${currentUserData.username}`);
    //   })
    //   .catch((err) => {
    //     setUsersLoading(undefined);
    //     console.log(err);
    //   });
    // {
    //   role: 'admin',
    //   username: 'jane doe',
    //   image:
    //     'https://firebasestorage.googleapis.com/v0/b/inventory-app-b78f3.appspot.com/o/image%2Floading_image.png?alt=media&token=79b09057-34ff-4533-b2bf-f7b101e1ecd8',
    //   email: 'janedoe@ggg.com',
    //   docId: 'ocHVgp9dYmOZm0803qO9'
    // }
    const newUsers = users.map((Pro: User) => {
      if (Pro.docId == newdata.docId) {
        return {
          ...Pro,
          ...newdata,
        };
      }
      return Pro;
    });

    setUsers(newUsers);
  }

  async function EditProfile() {
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
      ...currentUserData,
      changePassword: false,
      currentPassword: "",
      newPassword: "",
    };

    if (changePassword) {
      (newdata.changePassword = true),
        (newdata.currentPassword = currentPassword);
      newdata.newPassword = newPassword;
    }

    const Userexist = await fetch("/api/userExists", {
      method: "POST",
      body: JSON.stringify({
        docId: currentUserData.docId,
        username: currentUserData.username,
      }),
    });

    if (Userexist.ok) {
      const response = await Userexist.json();
      if (response.exist) {
        throw Error(`Username '${currentUserData.username}' exists`);
      }
    }
    console.log(newdata);
    const res = await fetch("/api/editUser", {
      method: "POST",
      body: JSON.stringify(newdata),
    });

    if (res.ok) {
      const response = await res.json();
      console.log(response);
      if (!response.passwordMatch) {
        alert("Current Password Doesn't match");
      }
      if (response.updated) {
        fetchUsersdata(newdata);
        return response.updated;
      }
    }
    throw Error("error");
  }

  async function onSave() {
    setSending(true);
    toast.promise(EditProfile(), {
      loading: "sending data ...",
      success: (res) => {
        setSending(false);
        return `User Profile has been updated`;
      },
      error: (err) => {
        setSending(false);
        return err.message;
      },
    });
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 md:py-24 md:px-24 gap-8">
      <div className="flex flex-col gap-8 md:w-1/2 md:h-1/2 max-h-full max-w-full">
        <div className="flex flex-wrap gap-8">
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
              alt={currentUserData.image}
              className="object-cover h-full"
              width={200}
              height={200}
            />
          </div>
          <div className="w-full">
            {editUsername ? (
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex w-fit items-center gap-2">
                  <Input
                    type="text"
                    value={currentUserData.username}
                    placeholder="Username"
                    onChange={(e) =>
                      setCurrentUserData((pre) => {
                        return { ...pre, username: e.target.value };
                      })
                    }
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setEditUsername((pre) => !pre)}
                >
                  submit
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-4xl">{currentUserData.username}</div>
                <Button
                  variant="ghost"
                  onClick={() => setEditUsername((pre) => !pre)}
                >
                  <FiEdit size={20} color="green" />
                </Button>
              </div>
            )}
            {editMail ? (
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex w-fit items-center gap-2">
                  <Input
                    type="email"
                    value={currentUserData.email}
                    placeholder="email"
                    onChange={(e) =>
                      setCurrentUserData((pre) => {
                        return { ...pre, email: e.target.value };
                      })
                    }
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setEditMail((pre) => !pre)}
                >
                  submit
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl text-gray-400">
                  {currentUserData.email}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setEditMail((pre) => !pre)}
                >
                  <FiEdit size={20} color="green" />
                </Button>
              </div>
            )}
            <div className="text-2xl text-gray-400">{user.role}</div>
          </div>
        </div>

        {editImage && (
          <UploadImageToStorage setURL={setCurrentUserData} path="image/" />
        )}

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

        <div className="flex justify-end">
          <Button disabled={sending} variant="secondary" onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
