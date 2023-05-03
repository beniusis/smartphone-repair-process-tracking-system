import Navbar from "@/components/Navbar";
import RepairAsAdministrator from "@/components/RepairAsAdministrator";
import RepairAsClient from "@/components/RepairAsClient";
import RepairAsEmployee from "@/components/RepairAsEmployee";
import { useSession } from "next-auth/react";

export default function Repairs() {
  const { data: session } = useSession();

  return (
    <>
      <main className="min-h-screen flex flex-row">
        <Navbar />
        <div className="w-full">
          {session?.role === "client" && <RepairAsClient />}
          {session?.role === "employee" && <RepairAsEmployee />}
          {session?.role === "client" && <RepairAsAdministrator />}
        </div>
      </main>
    </>
  );
}
