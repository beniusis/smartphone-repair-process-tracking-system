import { IoEye, IoEyeOff } from "react-icons/io5";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [registrationInfo, setRegistrationInfo] = useState({
    email: "",
    password: "",
    repeatedPassword: "",
    name: "",
    surname: "",
    phoneNumber: "",
    address: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    emailError: "",
    passwordError: "",
    repeatedPasswordError: "",
    nameError: "",
    surnameError: "",
    phoneNumberError: "",
  });
  const [userExists, setUserExists] = useState(false);

  const openLoginView = (e) => {
    e.preventDefault();
    router.push("/");
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
    if (registrationInfo.email === "") {
      setFieldErrors({ emailError: "* Neįvestas el. pašto adresas!" });
    } else if (validateEmail() === false) {
      setFieldErrors({ emailError: "* Netinkamas el. pašto formatas!" });
    } else if (registrationInfo.password == "") {
      setFieldErrors({ passwordError: "* Neįvestas slaptažodis!" });
    } else if (registrationInfo.password.length < 8) {
      setFieldErrors({
        passwordError: "* Slaptažodis turi būti sudarytas bent iš 8 simbolių!",
      });
    } else if (registrationInfo.repeatedPassword == "") {
      setFieldErrors({
        repeatedPasswordError: "* Neįvestas pakartotinas slaptažodis!",
      });
    } else if (
      registrationInfo.password !== registrationInfo.repeatedPassword
    ) {
      setFieldErrors({
        repeatedPasswordError: "* Nesutampa įvesti slaptažodžiai!",
      });
    } else if (registrationInfo.name == "") {
      setFieldErrors({ nameError: "* Vardo laukas negali būti tuščias!" });
    } else if (registrationInfo.surname == "") {
      setFieldErrors({
        surnameError: "* Pavardės laukas negali būti tuščias!",
      });
    } else if (registrationInfo.phoneNumber == "") {
      setFieldErrors({ phoneNumberError: "* Neįvestas telefono numeris!" });
    } else if (validatePhoneNumber() === false) {
      setFieldErrors({
        phoneNumberError:
          "* Netinkamas telefono numeris! Tinkami formatai: 860000000 arba +37060000000",
      });
    } else {
      const response = await axios.post("/api/register", {
        name: registrationInfo.name,
        surname: registrationInfo.surname,
        email_address: registrationInfo.email,
        password: registrationInfo.password,
        phone_number: registrationInfo.phoneNumber,
        address: registrationInfo.address || null,
        role: "client",
      });

      console.log(response);

      if (response.status === 201) {
        router.push("/auth/signin");
      } else if (response.status === 200) {
        setUserExists(true);
      }
    }
  };

  const validateEmail = () => {
    let regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regExp.test(registrationInfo.email)) {
      return true;
    }
    return false;
  };

  const validatePhoneNumber = () => {
    let regExp = /(86|\+370)\d{3}\d{4}/;
    if (regExp.test(registrationInfo.phoneNumber)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {userExists && (
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
            <p className="ml-6">
              Naudotojas tokiu el. pašto adresu egzistuoja! Bandykite{" "}
              <a
                href="/auth/signin"
                className="font-semibold hover:text-red-400 hover:duration-300"
              >
                prisijungti
              </a>
              .
            </p>
          </div>
        </div>
      )}
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-gray-100 flex rounded-2xl drop-shadow-md max-w-3xl p-5 items-center space-x-10">
          <div className="px-8">
            <h2 className="font-bold text-2xl text-slate-900 text-center">
              Registracija
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
                  setRegistrationInfo({
                    ...registrationInfo,
                    email: target.value,
                  })
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
                  autoComplete="new-password"
                  onChange={({ target }) =>
                    setRegistrationInfo({
                      ...registrationInfo,
                      password: target.value,
                    })
                  }
                />
                {showPasswordIcon}
              </div>
              {fieldErrors.passwordError && (
                <span className="text-xs text-red-600 ml-1">
                  {fieldErrors.passwordError}
                </span>
              )}
              <input
                className="p-2 rounded-xl border w-full text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Pakartokite slaptažodį"
                autoComplete="new-password"
                onChange={({ target }) =>
                  setRegistrationInfo({
                    ...registrationInfo,
                    repeatedPassword: target.value,
                  })
                }
              />
              {fieldErrors.repeatedPasswordError && (
                <span className="text-xs text-red-600 ml-1">
                  {fieldErrors.repeatedPasswordError}
                </span>
              )}
              <input
                className="p-2 rounded-xl border text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                type="text"
                name="name"
                placeholder="Vardas"
                onChange={({ target }) =>
                  setRegistrationInfo({
                    ...registrationInfo,
                    name: target.value,
                  })
                }
              />
              {fieldErrors.nameError && (
                <span className="text-xs text-red-600 ml-1">
                  {fieldErrors.nameError}
                </span>
              )}
              <input
                className="p-2 rounded-xl border text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                type="text"
                name="surname"
                placeholder="Pavardė"
                onChange={({ target }) =>
                  setRegistrationInfo({
                    ...registrationInfo,
                    surname: target.value,
                  })
                }
              />
              {fieldErrors.surnameError && (
                <span className="text-xs text-red-600 ml-1">
                  {fieldErrors.surnameError}
                </span>
              )}
              <input
                className="p-2 rounded-xl border text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                type="text"
                name="phoneNumber"
                placeholder="Telefono numeris"
                onChange={({ target }) =>
                  setRegistrationInfo({
                    ...registrationInfo,
                    phoneNumber: target.value,
                  })
                }
              />
              {fieldErrors.phoneNumberError && (
                <span className="text-xs text-red-600 ml-1">
                  {fieldErrors.phoneNumberError}
                </span>
              )}
              <input
                className="p-2 rounded-xl border text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                type="text"
                name="address"
                placeholder="Adresas"
                onChange={({ target }) =>
                  setRegistrationInfo({
                    ...registrationInfo,
                    address: target.value,
                  })
                }
              />
              <button
                className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105 duration-300"
                type="submit"
              >
                Registruotis
              </button>
              <button
                className="rounded-xl text-slate-900 py-2 px-3 hover:scale-105 duration-300 border border-slate-900"
                onClick={openLoginView}
              >
                Grįžti atgal
              </button>
            </form>
          </div>
          <div className="md:block hidden w-1/2">
            <Image
              src="/phone-maintenance-2.svg"
              width="500"
              height="500"
              alt="phone repair illustration 2"
              priority
            />
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
