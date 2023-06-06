import { IoEye, IoEyeOff } from "react-icons/io5";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useToast } from "@chakra-ui/react";

export default function Signin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({
    emailError: "",
    passwordError: "",
  });
  const toast = useToast();

  const openRegisterView = (e) => {
    e.preventDefault();
    router.push("/register");
  };

  const eyeOn = (
    <IoEye
      className="absolute top-1/2 right-3 -translate-y-1/2 fill-slate-900 hover:cursor-pointer"
      onClick={() => setShowPassword(!showPassword)}
    />
  );

  const eyeOff = (
    <IoEyeOff
      className="absolute top-1/2 right-3 -translate-y-1/2 fill-slate-900 hover:cursor-pointer"
      onClick={() => setShowPassword(!showPassword)}
    />
  );

  const showPasswordIcon = showPassword ? eyeOn : eyeOff;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.email === "") {
      setFieldErrors({ emailError: "* Neįvestas el. pašto adresas!" });
    } else if (validateEmail() === false) {
      setFieldErrors({ emailError: "* El. paštas neatitinka formato!" });
    } else if (userInfo.password == "") {
      setFieldErrors({ passwordError: "* Neįvestas slaptažodis!" });
    } else {
      setFieldErrors({ emailError: "", passwordError: "" });

      const res = await signIn("credentials", {
        email: userInfo.email,
        password: userInfo.password,
        redirect: false,
      });

      if (res.status === 200) {
        router.push("/");
      } else {
        toast({
          title: "Neteisingi prisijungimo duomenys!",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const validateEmail = () => {
    let regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regExp.test(userInfo.email)) {
      return true;
    }
    return false;
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-gray-100 flex rounded-2xl drop-shadow-md max-w-3xl p-5 items-center">
          <div className="md:block hidden w-1/2">
            <Image
              src="/phone-maintenance.svg"
              width="500"
              height="500"
              alt="phone repair illustration"
              priority
            />
          </div>
          <div className="px-8">
            <h2 className="font-bold text-2xl text-slate-900 text-center">
              Prisijunkite
            </h2>

            <form
              className="flex flex-col gap-4"
              method="POST"
              noValidate
              onSubmit={handleSubmit}
            >
              <input
                className="p-2 mt-8 rounded-xl border text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                type="email"
                name="email"
                placeholder="El. paštas"
                autoComplete="email"
                onChange={({ target }) =>
                  setUserInfo({ ...userInfo, email: target.value })
                }
              />
              {fieldErrors.emailError && (
                <span className="text-xs text-red-600 ml-1">
                  {fieldErrors.emailError}
                </span>
              )}
              <div className="relative">
                <input
                  className="p-2 rounded-xl border w-full text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Slaptažodis"
                  autoComplete="current-password"
                  onChange={({ target }) =>
                    setUserInfo({ ...userInfo, password: target.value })
                  }
                />
                {showPasswordIcon}
              </div>
              {fieldErrors.passwordError && (
                <span className="text-xs text-red-600 ml-1">
                  {fieldErrors.passwordError}
                </span>
              )}
              <button
                className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105 duration-300"
                type="submit"
              >
                Prisijungti
              </button>
              <div className="mt-3 border-b border-slate-900"></div>
              <div className="mt-3 text-sm flex justify-between items-center gap-4 text-slate-900">
                <p>Neturite paskyros?</p>
                <button
                  className="rounded-xl text-slate-900 py-2 px-3 hover:scale-105 duration-300 border border-slate-900"
                  onClick={openRegisterView}
                >
                  Registracija
                </button>
              </div>
              <p className="text-sm text-slate-900">
                Pamiršote slaptažodį?{" "}
                <a
                  className="font-semibold hover:text-slate-500"
                  href="/forgot-password"
                >
                  Atkurti
                </a>
              </p>
            </form>
          </div>
        </div>
        <a
          href="https://storyset.com/technology"
          className="md:inline hidden absolute bottom-0 mb-2 text-xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Technology illustrations by <strong>Storyset</strong>
        </a>
      </main>
    </>
  );
}
