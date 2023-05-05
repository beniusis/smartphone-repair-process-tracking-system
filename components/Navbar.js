import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  IoMenu,
  IoClose,
  IoHome,
  IoBuild,
  IoCalendarNumber,
  IoLogOut,
} from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { MdAccountBox } from "react-icons/md";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const openCloseMobileMenu = () => {
    document
      .getElementsByClassName("navbar-mobile-menu")[0]
      .classList.toggle("hidden");
  };

  return (
    <>
      <div className="md:hidden z-50">
        <button
          className="navbar-burger-button p-2"
          onClick={() => openCloseMobileMenu()}
        >
          <IoMenu className="block w-10 h-10 fill-slate-900" />
        </button>
        <div className="navbar-mobile-menu relative hidden">
          <nav className="fixed w-52 top-0 left-0 bottom-0 flex flex-col bg-gray-100 text-slate-900 antialiased overflow-y-auto">
            <div className="flex items-center p-2">
              <button
                className="navbar-mobile-close"
                onClick={() => openCloseMobileMenu()}
              >
                <IoClose className="fill-slate-900 w-10 h-10" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-regular tracking-wide text-slate-900">
                  {session?.role === "client" && <p>Klientas:</p>}
                  {session?.role === "employee" && <p>Darbuotojas:</p>}
                  {session?.role === "administrator" && (
                    <p>Administratorius:</p>
                  )}
                  <strong>
                    {session?.name} {session?.surname}
                  </strong>
                </div>
              </div>
            </div>
            <div className="flex flex-col py-4 space-y-1">
              <div>
                <a
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                    <IoHome className="w-5 h-5" />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Pagrindinis
                  </span>
                </a>
              </div>

              <div>
                <a
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                  onClick={() => router.push("/repairs")}
                >
                  <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                    <IoBuild className="w-5 h-5" />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Remontai
                  </span>
                </a>
              </div>

              {session?.role === "client" && (
                <div>
                  <a
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                    onClick={() => router.push("/reservation")}
                  >
                    <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                      <IoCalendarNumber className="w-5 h-5" />
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Rezervacija
                    </span>
                  </a>
                </div>
              )}

              <div className="px-5 pt-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-regular tracking-wide text-slate-900">
                    Nustatymai
                  </div>
                </div>
              </div>

              {session?.role === "administrator" && (
                <div>
                  <a
                    className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                    onClick={() => router.push("/users")}
                  >
                    <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                      <FaUsers className="w-5 h-5" />
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Naudotojai
                    </span>
                  </a>
                </div>
              )}
              <div>
                <a
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                    <MdAccountBox className="w-5 h-5" />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Paskyra
                  </span>
                </a>
              </div>

              <div>
                <a
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                  onClick={() => signOut()}
                >
                  <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                    <IoLogOut className="w-5 h-5" />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Atsijungti
                  </span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <nav className="md:block hidden min-h-screen w-52 flex-col flex-auto flex-shrink-0 antialiased bg-gray-100 text-slate-900">
        <div className="p-5">
          <div className="flex flex-row items-center h-8">
            <div className="text-sm font-regular tracking-wide text-slate-900">
              {session?.role === "client" && <p>Klientas:</p>}
              {session?.role === "employee" && <p>Darbuotojas:</p>}
              {session?.role === "administrator" && <p>Administratorius:</p>}
              <strong>
                {session?.name} {session?.surname}
              </strong>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          <div className="flex flex-col py-4 space-y-1">
            <div>
              <a
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                onClick={() => router.push("/")}
              >
                <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                  <IoHome className="w-5 h-5" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Pagrindinis
                </span>
              </a>
            </div>

            <div>
              <a
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                onClick={() => router.push("/repairs")}
              >
                <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                  <IoBuild className="w-5 h-5" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Remontai
                </span>
              </a>
            </div>

            {session?.role === "client" && (
              <div>
                <a
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                  onClick={() => router.push("/reservation")}
                >
                  <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                    <IoCalendarNumber className="w-5 h-5" />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Rezervacija
                  </span>
                </a>
              </div>
            )}

            <div className="px-5 pt-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-regular tracking-wide text-slate-900">
                  Nustatymai
                </div>
              </div>
            </div>

            {session?.role === "administrator" && (
              <div>
                <a
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                  onClick={() => router.push("/users")}
                >
                  <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                    <FaUsers className="w-5 h-5" />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Naudotojai
                  </span>
                </a>
              </div>
            )}

            <div>
              <a
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                  <MdAccountBox className="w-5 h-5" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Paskyra
                </span>
              </a>
            </div>

            <div>
              <a
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-200 text-slate-900 hover:text-slate-700 border-l-4 border-transparent hover:border-slate-900 pr-6 hover:cursor-pointer"
                onClick={() => signOut()}
              >
                <span className="inline-flex justify-center items-center ml-4 fill-slate-900">
                  <IoLogOut className="w-5 h-5" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Atsijungti
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
