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
  const Users = await services.GetAllUsers();

  if(!Users) return null

  return (
    <div className="flex w-full">
      <DataProvider>
        <SideNavbar Admin={session?.user.role === "admin"} session={session} users={Users} />
        <div className="min-h-screen w-full">
          <div className="sticky top-0 z-50">
            <Navbar session={session} users={Users}/>
          </div>

          <div className="w-full z-40">{children}</div>
        </div>
      </DataProvider>
    </div>
  );
}
