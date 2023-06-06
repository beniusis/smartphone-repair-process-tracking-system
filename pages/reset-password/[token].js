import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [showPassword, setShowPassword] = useState(false);
  const [newInfo, setNewInfo] = useState({
    newPassword: "",
    repeatedNewPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    newPasswordError: "",
    repeatedNewPasswordError: "",
  });
  const toast = useToast();

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
    if (newInfo.newPassword === "") {
      setFieldErrors({
        ...fieldErrors,
        newPasswordError: "* Neįvestas naujas slaptažodis!",
      });
    } else if (newInfo.newPassword.length < 8) {
      setFieldErrors({
        ...fieldErrors,
        newPasswordError:
          "* Slaptažodis turi būti sudarytas bent iš 8 simbolių!",
      });
    } else if (newInfo.repeatedNewPassword === "") {
      setFieldErrors({
        newPasswordError: "",
        repeatedNewPasswordError:
          "* Neįvestas naujas pakartotinas slaptažodis!",
      });
    } else if (newInfo.newPassword !== newInfo.repeatedNewPassword) {
      setFieldErrors({
        newPasswordError: "",
        repeatedNewPasswordError: "* Nesutampa įvesti slaptažodžiai!",
      });
    } else {
      try {
        const response = await axios.put(`/api/user/reset/${token}`, {
          newPassword: newInfo.newPassword,
        });

        if (response.status !== 200) {
          toast({
            title: "Įvyko klaida! Bandykite iš naujo.",
            status: "error",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
        toast({
          title: "Slaptažodis sėkmingai pakeistas! Bandykite prisijungti.",
          status: "success",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        router.push("/auth/signin");
      } catch (error) {
        toast({
          title:
            "Nuoroda nebegalioja! Grįžkite į atkūrimo langą ir per naujo įveskite el. paštą.",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-100 flex flex-col rounded-2xl drop-shadow-md max-w-3xl p-5 items-center">
        <h2 className="font-bold text-2xl text-slate-900 text-center px-8">
          Naujas slaptažodis
        </h2>
        <div className="px-8">
          <div className="flex flex-col gap-4">
            <div className="relative mt-8">
              <input
                className="p-2 rounded-xl border w-full text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Naujas slaptažodis"
                autoComplete="new-password"
                onChange={(e) =>
                  setNewInfo({ ...newInfo, newPassword: e.target.value })
                }
              />
              {showPasswordIcon}
            </div>
            {fieldErrors.newPasswordError && (
              <span className="text-xs text-red-600 ml-1">
                {fieldErrors.newPasswordError}
              </span>
            )}
            <input
              className="p-2 rounded-xl border w-full text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Pakartokite slaptažodį"
              autoComplete="new-password"
              onChange={(e) =>
                setNewInfo({ ...newInfo, repeatedNewPassword: e.target.value })
              }
            />
            {fieldErrors.repeatedNewPasswordError && (
              <span className="text-xs text-red-600 ml-1">
                {fieldErrors.repeatedNewPasswordError}
              </span>
            )}
            <button
              className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105 duration-300"
              onClick={handleSubmit}
            >
              Išsaugoti
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
