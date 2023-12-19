import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { DataProvider } from "../../hooks/useContextData";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  // const session = {
  //   user: {
  //     name: "jane doe",
  //     email: "hhh@ggg.com",
  //     image:
  //       "https://firebasestorage.googleapis.com/v0/b/inventory-app-b78f3.appspot.com/o/image%2Floading_image.png?alt=media&token=79b09057-34ff-4533-b2bf-f7b101e1ecd8",
  //     role: "admin",
  //   },
  // };

  return (
    <div className="flex w-full">
      <DataProvider>
        <SideNavbar Admin={session?.user.role === "admin"} session={session} />
        <div className="min-h-screen w-full">
          <div className="sticky top-0 z-50">
            <Navbar session={session} />
          </div>

          <div className="w-full z-40">{children}</div>
        </div>
      </DataProvider>
    </div>
  );
}
