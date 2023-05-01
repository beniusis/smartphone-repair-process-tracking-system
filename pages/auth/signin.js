import { IoEye, IoEyeOff } from "react-icons/io5";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function Signin() {
  const { data: session } = useSession();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({
    emailError: "",
    passwordError: "",
  });
  const [loginError, setLoginError] = useState("");

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
        setLoginError("Neteisingi prisijungimo duomenys! Bandykite dar kartą.");
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
      {loginError && (
        <div className="flex justify-center p-2 items-center">
          <div
            className="relative px-4 py-3 leading-normal text-red-700 bg-red-100 rounded-lg max-w-xl"
            role="alert"
          >
            <span className="absolute inset-y-0 left-0 flex items-center ml-4">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                ></path>
              </svg>
            </span>
            <p className="ml-6">{loginError}</p>
          </div>
        </div>
      )}
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
