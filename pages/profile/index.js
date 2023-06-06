import Navbar from "@/components/Navbar";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [passwordUpdateData, setPasswordUpdateData] = useState({
    old_password: "",
    new_password: "",
    repeated_new_password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    nameError: "* Vardo laukas negali būti tuščias!",
    surnameError: "* Pavardės laukas negali būti tuščias!",
    emailError: "* Neįvestas el. pašto adresas!",
    phoneNumberError: "* Neįvestas telefono numeris!",
    oldPasswordError: "",
    newPasswordError: "",
    repeatedNewPasswordError: "",
  });
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }
    getUserData();
  }, [refresh, session]);

  const getUserData = async () => {
    const response = await axios.post("/api/user", {
      id: session?.id,
    });
    setUserData(response.data);
    setIsLoading(false);
  };

  const validateEmail = () => {
    let regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regExp.test(userData.email_address)) {
      return true;
    }
    return false;
  };

  const validatePhoneNumber = () => {
    let regExp = /(86|\+3706)\d{3}\d{4}/;
    if (regExp.test(userData.phone_number)) {
      return true;
    }
    return false;
  };

  const updateUserData = async () => {
    if (
      userData.name !== "" &&
      userData.surname !== "" &&
      userData.email_address !== "" &&
      userData.phone_number !== ""
    ) {
      if (validateEmail() === false) {
        setFieldErrors({
          ...fieldErrors,
          emailError: "* Netinkamas el. pašto formatas!",
        });
      } else if (validatePhoneNumber() === false) {
        setFieldErrors({
          ...fieldErrors,
          phoneNumberError:
            "* Netinkamas telefono numeris! Tinkami formatai: 860000000 arba +37060000000",
        });
      } else {
        try {
          await axios.post("/api/compare/emails", {
            email_address: userData.email_address,
          });
        } catch (error) {
          if (error.response.status === 302) {
            toast({
              title: "Naudotojas tokiu el. paštu jau egzistuoja!",
              status: "error",
              position: "top-right",
              duration: 2000,
              isClosable: true,
            });
            return;
          } else if (error.response.status === 404) {
            const response = await axios.put("/api/user", {
              id: session.id,
              name: userData.name,
              surname: userData.surname,
              email_address: userData.email_address,
              phone_number: userData.phone_number,
              address: userData.address || null,
            });

            if (response.status === 200) {
              setRefresh(!refresh);
              toast({
                title: "Paskyros informacija sėkmingai atnaujinta!",
                status: "success",
                position: "top-right",
                duration: 2000,
                isClosable: true,
              });
              router.push("/");
            } else {
              toast({
                title: "Įvyko klaida! Bandykite iš naujo.",
                status: "error",
                position: "top-right",
                duration: 2000,
                isClosable: true,
              });
            }
          }
        }
      }
    } else {
      toast({
        title: "Neužpildyti visi privalomi laukai!",
        status: "warning",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const updateUserPassword = async () => {
    if (passwordUpdateData.old_password === "") {
      setFieldErrors({
        ...fieldErrors,
        oldPasswordError: "* Neįvestas senasis slaptažodis!",
      });
    } else if (passwordUpdateData.new_password === "") {
      setFieldErrors({
        ...fieldErrors,
        oldPasswordError: "",
        newPasswordError: "* Neįvestas naujasis slaptažodis!",
      });
    } else if (passwordUpdateData.new_password.length < 8) {
      setFieldErrors({
        ...fieldErrors,
        oldPasswordError: "",
        newPasswordError:
          "* Slaptažodis turi būti sudarytas bent iš 8 simbolių!",
      });
    } else if (passwordUpdateData.repeated_new_password === "") {
      setFieldErrors({
        ...fieldErrors,
        oldPasswordError: "",
        newPasswordError: "",
        repeatedNewPasswordError:
          "* Neįvestas pakartotinas naujasis slaptažodis!",
      });
    } else if (
      passwordUpdateData.new_password !==
      passwordUpdateData.repeated_new_password
    ) {
      setFieldErrors({
        ...fieldErrors,
        oldPasswordError: "",
        newPasswordError:
          "* Naujasis slaptažodis nesutampa su pakartotinu slaptažodžiu!",
      });
    } else {
      setFieldErrors({
        ...fieldErrors,
        oldPasswordError: "",
        newPasswordError: "",
        repeatedNewPasswordError: "",
      });
      try {
        const compareResponse = await axios.post("/api/compare", {
          user_id: session.id,
          password: passwordUpdateData.old_password,
        });
        if (compareResponse.status === 200) {
          const response = await axios.post("/api/user/password", {
            password: passwordUpdateData.new_password,
            user_id: session.id,
          });

          if (response.status === 200) {
            setRefresh(!refresh);
            toast({
              title: "Paskyros slaptažodis sėkmingai pakeistas!",
              status: "success",
              position: "top-right",
              duration: 2000,
              isClosable: true,
            });
            router.push("/");
          } else {
            toast({
              title: "Įvyko klaida! Bandykite iš naujo.",
              status: "error",
              position: "top-right",
              duration: 2000,
              isClosable: true,
            });
          }
        }
      } catch (error) {
        toast({
          title: "Neteisingas senasis slaptažodis!",
          status: "warning",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    }
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

  return (
    <>
      {isLoading ? (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <main className="min-h-screen flex flex-row">
          <Navbar />
          <div className="w-full flex flex-col ml-10">
            <div className="mt-5 space-y-10 w-[90%] md:w-[25%]">
              <FormControl>
                <FormLabel fontSize={"3xl"} textAlign={"center"}>
                  Informacija
                </FormLabel>
                <FormControl isRequired>
                  <FormLabel fontSize={"2xl"}>Vardas</FormLabel>
                  <Input
                    type="text"
                    fontSize={"xl"}
                    defaultValue={userData.name}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        name: e.target.value,
                      })
                    }
                  />
                  {!userData.name && (
                    <span className="text-xs text-red-600">
                      {fieldErrors.nameError}
                    </span>
                  )}
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={"2xl"} mt={4}>
                    Pavardė
                  </FormLabel>
                  <Input
                    type="text"
                    fontSize={"xl"}
                    defaultValue={userData.surname}
                    id="surname"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        surname: e.target.value,
                      })
                    }
                  />
                  {!userData.surname && (
                    <span className="text-xs text-red-600">
                      {fieldErrors.surnameError}
                    </span>
                  )}
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={"2xl"} mt={4}>
                    El. paštas
                  </FormLabel>
                  <Input
                    type="email"
                    fontSize={"xl"}
                    defaultValue={userData.email_address}
                    id="email_address"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        email_address: e.target.value,
                      })
                    }
                  />
                  {!validateEmail() && (
                    <span className="text-xs text-red-600">
                      {fieldErrors.emailError}
                    </span>
                  )}
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={"2xl"} mt={4}>
                    Telefono numeris
                  </FormLabel>
                  <Input
                    type="text"
                    fontSize={"xl"}
                    defaultValue={userData.phone_number}
                    id="phone_number"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        phone_number: e.target.value,
                      })
                    }
                  />
                  {!validatePhoneNumber() && (
                    <span className="text-xs text-red-600">
                      {fieldErrors.phoneNumberError}
                    </span>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"2xl"} mt={4}>
                    Adresas
                  </FormLabel>
                  <Input
                    type="text"
                    fontSize={"xl"}
                    defaultValue={userData?.address}
                    id="address"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        address: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <Button
                  colorScheme="green"
                  className="w-full"
                  fontSize={"xl"}
                  mt={4}
                  onClick={() => updateUserData()}
                >
                  Išsaugoti
                </Button>
              </FormControl>
              <FormControl>
                <FormLabel fontSize={"3xl"} textAlign={"center"}>
                  Slaptažodžio keitimas
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      fontSize={"xl"}
                      placeholder="Senasis slaptažodis"
                      defaultValue=""
                      id="oldpassword"
                      onChange={(e) =>
                        setPasswordUpdateData({
                          ...passwordUpdateData,
                          old_password: e.target.value,
                        })
                      }
                    />
                    {showPasswordIcon}
                  </div>
                  {!passwordUpdateData.old_password && (
                    <span className="text-xs text-red-600">
                      {fieldErrors.oldPasswordError}
                    </span>
                  )}
                </FormControl>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    fontSize={"xl"}
                    placeholder="Naujasis slaptažodis"
                    defaultValue={""}
                    mt={4}
                    id="newpassword"
                    onChange={(e) =>
                      setPasswordUpdateData({
                        ...passwordUpdateData,
                        new_password: e.target.value,
                      })
                    }
                  />
                  {
                    <span className="text-xs text-red-600">
                      {fieldErrors.newPasswordError}
                    </span>
                  }
                </FormControl>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    fontSize={"xl"}
                    placeholder="Pakartotinas naujasis slaptažodis"
                    mt={4}
                    id="newrepeatedpassword"
                    onChange={(e) =>
                      setPasswordUpdateData({
                        ...passwordUpdateData,
                        repeated_new_password: e.target.value,
                      })
                    }
                  />
                  {!passwordUpdateData.repeated_new_password && (
                    <span className="text-xs text-red-600">
                      {fieldErrors.repeatedNewPasswordError}
                    </span>
                  )}
                </FormControl>
                <Button
                  colorScheme="green"
                  fontSize={"xl"}
                  className="w-full"
                  mt={4}
                  onClick={() => updateUserPassword()}
                >
                  Pakeisti
                </Button>
              </FormControl>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
