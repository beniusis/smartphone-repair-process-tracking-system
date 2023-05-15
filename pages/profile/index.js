import Navbar from "@/components/Navbar";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const toast = useToast();

  useEffect(() => {
    getUserData();
  }, [refresh]);

  const getUserData = async () => {
    const response = await axios.post("/api/user", {
      id: session?.id,
    });
    setUserData(response.data);
    setIsLoading(false);
  };

  const updateUserData = async () => {
    if (
      userData.name !== "" &&
      userData.surname !== "" &&
      userData.email_address !== "" &&
      userData.phone_number !== ""
    ) {
      const response = await axios.put("/api/user", {
        id: session.id,
        name: userData.name,
        surname: userData.surname,
        email_address: userData.email_address,
        phone_number: userData.phone_number,
        address: userData.address,
      });

      if (response.status === 200) {
        setRefresh(!refresh);
        toast({
          title: "Paskyros informacija sėkmingai atnaujinta!",
          status: "success",
          position: "top-right",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Įvyko klaida! Bandykite iš naujo.",
          status: "error",
          position: "top-right",
          duration: 5000,
          isClosable: true,
        });
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
    if (
      passwordUpdateData.old_password !== "" &&
      passwordUpdateData.new_password !== "" &&
      passwordUpdateData.repeated_new_password !== ""
    ) {
      if (
        passwordUpdateData.new_password !==
        passwordUpdateData.repeated_new_password
      ) {
        toast({
          title: "Naujasis slaptažodis nesutampa su pakartotinu slaptažodžiu!",
          status: "warning",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      } else {
        const response = await axios.post("/api/user/password", {
          password: passwordUpdateData.new_password,
          user_id: session.id,
        });

        if (response.status === 200) {
          toast({
            title: "Paskyros slaptažodis sėkmingai pakeistas!",
            status: "success",
            position: "top-right",
            duration: 5000,
            isClosable: true,
          });
          setRefresh(!refresh);
        } else {
          toast({
            title: "Įvyko klaida! Bandykite iš naujo.",
            status: "error",
            position: "top-right",
            duration: 5000,
            isClosable: true,
          });
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

  return (
    <>
      <main className="min-h-screen flex flex-row">
        <Navbar />
        {isLoading ? (
          <div className="w-full">
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className="w-full flex flex-col ml-10">
            <div className="mt-5 space-y-10 w-[90%] md:w-[20%]">
              <FormControl>
                <FormLabel fontSize={24} textAlign={"center"}>
                  Informacija
                </FormLabel>
                <FormControl isRequired>
                  <FormLabel>Vardas</FormLabel>
                  <Input
                    type="text"
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
                      Vardo laukas negali būti tuščias
                    </span>
                  )}
                </FormControl>
                <FormControl isRequired>
                  <FormLabel mt={4}>Pavardė</FormLabel>
                  <Input
                    type="text"
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
                      Pavardės laukas negali būti tuščias
                    </span>
                  )}
                </FormControl>
                <FormControl isRequired>
                  <FormLabel mt={4}>El. paštas</FormLabel>
                  <Input
                    type="email"
                    defaultValue={userData.email_address}
                    id="email_address"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        email_address: e.target.value,
                      })
                    }
                  />
                  {!userData.email_address && (
                    <span className="text-xs text-red-600">
                      El. pašto adreso laukas negali būti tuščias
                    </span>
                  )}
                </FormControl>
                <FormControl isRequired>
                  <FormLabel mt={4}>Telefono numeris</FormLabel>
                  <Input
                    type="text"
                    defaultValue={userData.phone_number}
                    id="phone_number"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        phone_number: e.target.value,
                      })
                    }
                  />
                  {!userData.phone_number && (
                    <span className="text-xs text-red-600">
                      Telefono numerio laukas negali būti tuščias
                    </span>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel mt={4}>Adresas</FormLabel>
                  <Input
                    type="text"
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
                  mt={4}
                  onClick={() => updateUserData()}
                >
                  Išsaugoti
                </Button>
              </FormControl>
              <FormControl>
                <FormLabel fontSize={24} textAlign={"center"}>
                  Slaptažodžio keitimas
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Senasis slaptažodis"
                    id="oldpassword"
                    onChange={(e) =>
                      setPasswordUpdateData({
                        ...passwordUpdateData,
                        old_password: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Naujasis slaptažodis"
                    mt={4}
                    id="newpassword"
                    onChange={(e) =>
                      setPasswordUpdateData({
                        ...passwordUpdateData,
                        new_password: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="password"
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
                </FormControl>
                <Button
                  colorScheme="green"
                  className="w-full"
                  mt={4}
                  onClick={() => updateUserPassword()}
                >
                  Pakeisti
                </Button>
              </FormControl>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
