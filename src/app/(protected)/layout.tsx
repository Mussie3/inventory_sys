import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { DataProvider } from "../../hooks/useContextData";
import AuthProvider from "@/hooks/useAuthProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  // if (!session) return;

  return (
    <>
      <AuthProvider session={session}>
        <div className="flex w-full">
          <SideNavbar />
          <div className="min-h-screen w-full">
            <div className="sticky top-0 z-50">
              <Navbar />
            </div>
            <DataProvider>
              <div className="w-full z-40">{children}</div>
            </DataProvider>
          </div>
        </div>
      </AuthProvider>
    </>
  );
}
