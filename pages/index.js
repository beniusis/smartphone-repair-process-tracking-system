import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/auth/signin");
  }

  if (session) {
    return (
      <>
        <main className="min-h-screen">
          <Navbar />
        </main>
      </>
    );
  }
}
