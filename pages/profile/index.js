import Navbar from "@/components/Navbar";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [passwordUpdateData, setPasswordUpdateData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const response = await axios.post("/api/user", {
      id: session?.id,
    });
    setUserData(response.data);
    setIsLoading(false);
  };

  const updateUserData = async () => {
    const response = await axios.put("/api/user", {
      id: session.id,
      name: userData.name,
      surname: userData.surname,
      email_address: userData.email_address,
      phone_number: userData.phone_number,
      address: userData.address,
    });
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
            <div className="mt-5 space-y-10">
              <FormControl width={"20%"}>
                <FormLabel fontSize={18} ml={16}>
                  Informacija
                </FormLabel>
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
                <Input
                  type="text"
                  defaultValue={userData.surname}
                  mt={4}
                  id="surname"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      surname: e.target.value,
                    })
                  }
                />
                <Input
                  type="email"
                  defaultValue={userData.email_address}
                  mt={4}
                  id="email_address"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      email_address: e.target.value,
                    })
                  }
                />
                <Input
                  type="text"
                  defaultValue={userData.phone_number}
                  mt={4}
                  id="phone_number"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      phone_number: e.target.value,
                    })
                  }
                />
                <Input
                  type="text"
                  defaultValue={userData?.address}
                  mt={4}
                  id="address"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      address: e.target.value,
                    })
                  }
                />
                <Button
                  colorScheme="green"
                  className="w-full"
                  mt={4}
                  onClick={() => updateUserData()}
                >
                  Išsaugoti
                </Button>
              </FormControl>
              <FormControl width={"20%"}>
                <FormLabel fontSize={18} ml={6}>
                  Slaptažodžio keitimas
                </FormLabel>
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
                <Button colorScheme="green" className="w-full" mt={4}>
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
