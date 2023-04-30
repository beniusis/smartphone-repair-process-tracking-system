import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/auth/signin");
  }

  if (session) {
    console.log("session", session);
    return (
      <>
        <h1>Protected Page</h1>
        <p>You can view this page because you are signed in.</p>
        <button
          className="bg-red-500 p-2 rounded-xl text-white"
          onClick={() => signOut()}
        >
          Atsijungti
        </button>
      </>
    );
  }
}
