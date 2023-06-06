import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ForgotPassword() {
  const [userEmail, setUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (userEmail === "") {
      setEmailError("* Neįvestas el. pašto adresas");
    } else if (validateEmail(userEmail) === false) {
      setEmailError("* El. paštas neatitinka formato!");
    } else {
      setEmailError("");
      try {
        const response = await axios.post("/api/user/forgot", {
          email: userEmail,
        });

        if (response.status !== 200) {
          toast({
            title: "Naudotojas tokiu el. pašto adresu nerastas!",
            status: "error",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
        toast({
          title:
            "Išsiųstas el. laiškas su nuoroda į slaptažodžio pakeitimą! Patikrinkite savo el. paštą.",
          status: "success",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        router.push("/auth/signin");
      } catch (error) {
        toast({
          title: "Naudotojas tokiu el. pašto adresu nerastas!",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }

  function validateEmail(email) {
    let regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regExp.test(email)) {
      return true;
    }
    return false;
  }

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-gray-100 flex flex-col rounded-2xl drop-shadow-md max-w-3xl p-5 items-center">
          <h2 className="font-bold text-2xl text-slate-900 text-center px-8">
            Slaptažodžio atkūrimas
          </h2>
          <div className="px-8">
            <div className="flex flex-col gap-4">
              <input
                className="p-2 mt-8 rounded-xl border text-slate-900 placeholder-slate-900 text-sm font-semibold border-none !outline-none"
                type="email"
                name="email"
                placeholder="El. paštas"
                autoComplete="email"
                onChange={(e) => setUserEmail(e.target.value)}
              />
              {emailError && (
                <span className="text-xs text-red-600 ml-1">{emailError}</span>
              )}
              <button
                className="bg-slate-900 rounded-xl text-gray-100 py-2 px-4 hover:scale-105 duration-300"
                onClick={handleSubmit}
              >
                Atkurti slaptažodį
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
