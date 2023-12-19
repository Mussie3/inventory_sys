import Link from "next/link";
import Signout from "./Signout";
import { ModeToggle } from "./toggle-mode";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import GetCurrentPath from "./getCurrentPath";

export default async function Navbar() {
  const session: any = await getServerSession(options);
  // const session = {
  //   user: {
  //     name: "jane doe",
  //     email: "hhh@ggg.com",
  //     image:
  //       "https://firebasestorage.googleapis.com/v0/b/inventory-app-b78f3.appspot.com/o/image%2Floading_image.png?alt=media&token=79b09057-34ff-4533-b2bf-f7b101e1ecd8",
  //     role: "admin",
  //   },
  // };
  console.log(session);

  return (
    <div className="flex items-center justify-between px-8 min-h-[8vh] border-b shadow-sm bg-white dark:bg-black z-100">
      <div className="">
        <GetCurrentPath />
      </div>
      <div className="flex gap-6 items-center">
        <div className="">
          <ModeToggle />
        </div>
        <Link href={`/profile/${session?.user.name}`}>
          <Avatar>
            <AvatarImage
              src={session?.user.image as string}
              alt={session?.user.name}
            />
            <AvatarFallback>
              {session?.user.name.slice(0, 2).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Signout />
      </div>
    </div>
  );
}
