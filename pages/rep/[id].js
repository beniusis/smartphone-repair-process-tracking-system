import Navbar from "@/components/Navbar";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns-tz";
import RepairOffer from "@/components/RepairOffer";

export default function Rep() {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();

  const repairID = router.query.id;
  let clientID = 0;
  let employeeID = 0;
  const status = [
    { LT: "Užregistruotas", EN: "registered" },
    { LT: "Remontuojama", EN: "in_progress" },
    { LT: "Užbaigtas", EN: "finished" },
  ];

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [repair, setRepair] = useState({});
  const [offers, setOffers] = useState([]);
  const [client, setClient] = useState({});
  const [employee, setEmployee] = useState({});
  const [updatedRepair, setUpdatedRepair] = useState({
    title: "",
    estimated_time: "",
    status: "",
  });
  const [newOffer, setNewOffer] = useState({
    title: "Apsauginio ekrano stikliuko uždėjimas",
    description:
      "Papildomai telefono stiklo apsaugai galime uždėti apsauginį stikliuką. Ar to norėtumėte?",
    cost: 9.99,
  });
  const [repairErrors, setRepairErrors] = useState({
    title: "",
  });
  const [offerErrors, setOfferErrors] = useState({
    title: "",
    description: "",
    cost: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!session) {
      return;
    } else if (!repairID) {
      return;
    }
    fetchAllData();
  }, [session, repairID, refresh]);

  async function fetchAllData() {
    await getRepairData();
    await getRepairOffers();
    await getClient();
    await getEmployee().then(() => setLoading(false));
  }

  async function getRepairData() {
    try {
      const response = await axios.post("/api/repair", {
        id: parseInt(repairID),
      });

      if (response.status !== 200) {
        toast({
          title: "Įvyko klaida! Bandykite iš naujo.",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        router.back();
        return;
      }
      clientID = response.data.fk_user_client;
      employeeID = response.data.fk_user_employee;
      setRepair(response.data);
    } catch (error) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
      router.back();
    }
  }

  async function getRepairOffers() {
    try {
      const response = await axios.post("/api/offer/by/repair", {
        repair_id: parseInt(repairID),
      });

      if (response.status !== 200) {
        toast({
          title: "Įvyko klaida! Bandykite iš naujo.",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        router.back();
        return;
      }
      setOffers(response.data);
    } catch (error) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
      router.back();
    }
  }

  async function getClient() {
    try {
      const response = await axios.post("/api/repair/find/client", {
        client_id: clientID,
      });

      if (response.status !== 200) {
        toast({
          title: "Įvyko klaida! Bandykite iš naujo.",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        router.back();
        return;
      }
      setClient(response.data);
    } catch (error) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
      router.back();
    }
  }

  async function getEmployee() {
    try {
      const response = await axios.post("/api/repair/find/employee", {
        employee_id: employeeID,
      });

      if (response.status !== 200) {
        toast({
          title: "Įvyko klaida! Bandykite iš naujo.",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        router.back();
        return;
      }
      setEmployee(response.data);
    } catch (error) {
      toast({
        title: "Įvyko klaida! Bandykite iš naujo.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
      router.back();
    }
  }

  async function updateRepair() {
    const currentDate = format(new Date(), "yyyy-MM-dd kk:mm", {
      timeZone: "Europe/Vilnius",
    });

    if (repairErrors.title) {
      toast({
        title: "Neįvesti reikiami duomenys!",
        status: "warning",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (
      repair.status === "in_progress" &&
      (updatedRepair.status.length === 0 ||
        updatedRepair.status === "in_progress")
    ) {
      if (updatedRepair.title.length !== 0) {
        try {
          const response = await axios.post("/api/repair/update", {
            title: updatedRepair.title || repair.title,
            id: parseInt(repairID),
          });

          if (response.status !== 201) {
            toast({
              title: "Įvyko klaida! Bandykite iš naujo.",
              status: "error",
              position: "top-right",
              duration: 2000,
              isClosable: true,
            });
            return;
          }

          setRefresh(!refresh);
          toast({
            title: "Remonto informacija sėkmingai atnaujinta!",
            status: "success",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
          setUpdatedRepair({
            ...updatedRepair,
            title: "",
            estimated_time: "",
            status: "",
          });
        } catch (error) {
          toast({
            title: "Įvyko klaida! Bandykite iš naujo.",
            status: "error",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Neatliekami jokie pakeitimai!",
          status: "warning",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    } else if (updatedRepair.status.length !== 0) {
      if (updatedRepair.status === "in_progress") {
        const estimatedDate = format(
          new Date(updatedRepair.estimated_time),
          "yyyy-MM-dd kk:mm",
          { timeZone: "Europe/Vilnius" }
        );
        try {
          const response = await axios.post("/api/repair/update", {
            title: updatedRepair.title || repair.title,
            started_at: new Date(currentDate),
            estimated_time: new Date(estimatedDate),
            status: updatedRepair.status,
            id: parseInt(repairID),
          });

          if (response.status !== 201) {
            toast({
              title: "Įvyko klaida! Bandykite iš naujo.",
              status: "error",
              position: "top-right",
              duration: 2000,
              isClosable: true,
            });
            return;
          }

          setRefresh(!refresh);
          toast({
            title: "Remonto informacija sėkmingai atnaujinta!",
            status: "success",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
          setUpdatedRepair({
            ...updatedRepair,
            title: "",
            estimated_time: "",
            status: "",
          });
        } catch (error) {
          toast({
            title: "Įvyko klaida! Bandykite iš naujo.",
            status: "error",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
        }
      } else if (updatedRepair.status === "finished") {
        try {
          const response = await axios.post("/api/repair/update", {
            title: updatedRepair.title || repair.title,
            finished_at: new Date(currentDate),
            status: updatedRepair.status,
            id: parseInt(repairID),
          });

          if (response.status !== 201) {
            toast({
              title: "Įvyko klaida! Bandykite iš naujo.",
              status: "error",
              position: "top-right",
              duration: 2000,
              isClosable: true,
            });
            return;
          }

          setRefresh(!refresh);
          toast({
            title: "Remonto informacija sėkmingai atnaujinta!",
            status: "success",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
          setUpdatedRepair({
            ...updatedRepair,
            title: "",
            estimated_time: "",
            status: "",
          });
        } catch (error) {
          toast({
            title: "Įvyko klaida! Bandykite iš naujo.",
            status: "error",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    } else if (updatedRepair.title.length !== 0) {
      if (
        updatedRepair.status === "registered" ||
        updatedRepair.status.length === 0
      ) {
        try {
          const response = await axios.post("/api/repair/update", {
            title: updatedRepair.title,
            id: parseInt(repairID),
          });

          if (response.status !== 201) {
            toast({
              title: "Įvyko klaida! Bandykite iš naujo.",
              status: "error",
              position: "top-right",
              duration: 2000,
              isClosable: true,
            });
            return;
          }

          setRefresh(!refresh);
          toast({
            title: "Remonto informacija sėkmingai atnaujinta!",
            status: "success",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
          setUpdatedRepair({
            ...updatedRepair,
            title: "",
            estimated_time: "",
            status: "",
          });
        } catch (error) {
          toast({
            title: "Įvyko klaida! Bandykite iš naujo.",
            status: "error",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    } else {
      toast({
        title: "Neatliekami jokie pakeitimai!",
        status: "warning",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  async function createOffer() {
    if (newOffer.title === "") {
      setOfferErrors({
        title: "* Neįvestas pasiūlymo pavadinimas!",
      });
    } else if (newOffer.description === "") {
      setOfferErrors({
        title: "",
        description: "* Neįvestas pasiūlymo aprašymas!",
      });
    } else if (isNaN(newOffer.cost)) {
      setOfferErrors({
        title: "",
        description: "",
        cost: "* Neįvesta pasiūlymo kaina!",
      });
    } else if (newOffer.cost === 0) {
      setOfferErrors({
        title: "",
        description: "",
        cost: "* Pasiūlymo kaina negali būti lygi 0!",
      });
    } else {
      setOfferErrors({ title: "", description: "", cost: "" });
      try {
        const response = await axios.post("/api/offer/create", {
          title: newOffer.title,
          description: newOffer.description,
          cost: newOffer.cost,
          repair_id: parseInt(repairID),
          repair_title: repair.title,
          client_email: client.email_address,
          client_name: client.name,
        });

        if (response.status !== 201) {
          toast({
            title: "Įvyko klaida! Bandykite iš naujo.",
            status: "error",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
          return;
        }

        setRefresh(!refresh);
        onClose();
        toast({
          title:
            "Pasiūlymas sėkmingai pateiktas! Išsiųsta el. laiškas klientui.",
          status: "success",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
        setNewOffer({ title: "", description: "", cost: "" });
      } catch (error) {
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

  function checkSelectedStatus() {
    if (repair.status === "registered") {
      return "Užregistruotas";
    } else if (repair.status === "in_progress") {
      return "Remontuojama";
    } else if (repair.status === "finished") {
      return "Užbaigtas";
    }
  }

  return (
    <>
      {loading ? (
        <main className="min-h-screen">loading...</main>
      ) : (
        <main className="min-h-screen flex flex-row">
          <Navbar />
          <div className="w-full flex flex-row p-4">
            <div>
              {session?.role === "administrator" && (
                <div className="flex flex-col">
                  <span className="font-normal text-xl">
                    Klientas:{" "}
                    <strong>
                      {client.name} {client.surname}
                    </strong>
                  </span>
                  <span className="font-normal text-xl">
                    Darbuotojas:{" "}
                    <strong>
                      {employee.name} {employee.surname}
                    </strong>
                  </span>
                </div>
              )}
              {session?.role === "employee" && (
                <span className="font-normal text-xl">
                  Klientas:{" "}
                  <strong>
                    {client.name} {client.surname}
                  </strong>
                </span>
              )}
              {session?.role === "client" && (
                <span className="font-normal text-xl">
                  Darbuotojas:{" "}
                  <strong>
                    {employee.name} {employee.surname}
                  </strong>
                </span>
              )}
              <FormControl mt={4} width={"xs"}>
                <FormLabel fontSize={"xl"}>Pavadinimas</FormLabel>
                {session?.role === "employee" ? (
                  <div className="flex flex-col">
                    <Input
                      type="text"
                      defaultValue={repair.title}
                      onChange={(e) => {
                        setUpdatedRepair({
                          ...updatedRepair,
                          title: e.target.value,
                        });

                        if (e.target.value.length === 0) {
                          setRepairErrors({
                            ...repairErrors,
                            title: "* Privaloma įvesti remonto pavadinimą!",
                          });
                        } else {
                          setRepairErrors({
                            ...repairErrors,
                            title: "",
                          });
                        }
                      }}
                    />
                    {repairErrors.title && (
                      <span className="text-xs text-red-600 ml-1 mt-1">
                        * Privaloma įvesti remonto pavadinimą!
                      </span>
                    )}
                  </div>
                ) : (
                  <Text>{repair.title}</Text>
                )}
                <FormLabel fontSize={"xl"} mt={4}>
                  Būsena
                </FormLabel>
                {session?.role === "employee" ? (
                  <Select
                    variant="filled"
                    placeholder={checkSelectedStatus()}
                    defaultValue={repair.status}
                    onChange={(e) => {
                      setUpdatedRepair({
                        ...updatedRepair,
                        status: e.target.value,
                      });
                    }}
                  >
                    {status.map((s) => {
                      if (s.LT !== checkSelectedStatus()) {
                        return (
                          <option value={s.EN} key={s.EN}>
                            {s.LT}
                          </option>
                        );
                      }
                    })}
                  </Select>
                ) : (
                  <Text>{checkSelectedStatus()}</Text>
                )}
                <FormLabel fontSize={"xl"} mt={4}>
                  Remontas užregistruotas
                </FormLabel>
                <Text>
                  {format(new Date(repair.registered_at), "yyyy-MM-dd kk:mm", {
                    timeZone: "Europe/Vilnius",
                  })}
                </Text>
                {(repair.status === "in_progress" ||
                  repair.status === "finished") && (
                  <div className="flex flex-col">
                    <FormLabel fontSize={"xl"} mt={4}>
                      Remontas pradėtas
                    </FormLabel>
                    <Text>
                      {format(new Date(repair.started_at), "yyyy-MM-dd kk:mm", {
                        timeZone: "Europe/Vilnius",
                      })}
                    </Text>
                    <FormLabel fontSize={"xl"} mt={4}>
                      Numatoma remonto pabaiga
                    </FormLabel>
                    <Text>
                      {format(
                        new Date(repair.estimated_time),
                        "yyyy-MM-dd kk:mm",
                        {
                          timeZone: "Europe/Vilnius",
                        }
                      )}
                    </Text>
                  </div>
                )}
                {repair.status === "finished" && (
                  <div className="flex flex-col">
                    <FormLabel fontSize={"xl"} mt={4}>
                      Remontas baigtas
                    </FormLabel>
                    <Text>
                      {format(
                        new Date(repair.finished_at),
                        "yyyy-MM-dd kk:mm",
                        {
                          timeZone: "Europe/Vilnius",
                        }
                      )}
                    </Text>
                  </div>
                )}
                <FormLabel fontSize={"xl"} mt={4}>
                  Kaina
                </FormLabel>
                <Text>{repair.total_cost} &euro;</Text>
                {repair.status === "finished" && (
                  <div className="flex flex-col">
                    <FormLabel fontSize={"xl"} mt={4}>
                      Įvertinimas
                    </FormLabel>
                    <Text>
                      Įvertis: <strong>{repair.rating || "neįvertinta"}</strong>
                    </Text>
                    <Text>
                      Atsiliepimas:{" "}
                      <strong>{repair.review || "atsiliepimo nėra"}</strong>
                    </Text>
                  </div>
                )}
                {session?.role === "employee" &&
                  updatedRepair.status === "in_progress" && (
                    <div className="flex flex-col">
                      <FormLabel fontSize={"xl"} mt={4}>
                        Numatoma suremontuoti iki
                      </FormLabel>
                      <input
                        type="datetime-local"
                        defaultValue={new Date(
                          "2023-05-31 12:00"
                        ).toLocaleTimeString("lt-LT", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        min={new Date().toLocaleTimeString("lt-LT", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        onChange={({ target }) =>
                          setUpdatedRepair({
                            ...updatedRepair,
                            estimated_time: new Date(target.value),
                          })
                        }
                      />
                    </div>
                  )}
                <div className="flex flex-row gap-4 mt-10">
                  {session?.role === "employee" && (
                    <Button colorScheme="green" onClick={() => updateRepair()}>
                      Išsaugoti
                    </Button>
                  )}
                  <Button colorScheme="red" onClick={() => router.back()}>
                    Grįžti atgal
                  </Button>
                </div>
              </FormControl>
            </div>
            <div className="ml-20 w-1/3">
              <FormLabel fontSize={"2xl"}>Remonto pasiūlymai</FormLabel>
              {offers?.map((offer) => (
                <RepairOffer
                  key={offer.id}
                  id={offer.id}
                  title={offer.title}
                  desription={offer.description}
                  cost={offer.cost}
                  userRole={session?.role}
                />
              ))}
              {offers.length === 0 && (
                <p className="text-red-300">Remontui pasiūlymų nėra</p>
              )}
              {session?.role === "employee" && (
                <Button mt={4} colorScheme="green" onClick={onOpen}>
                  Sukurti pasiūlymą
                </Button>
              )}
            </div>
            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader fontSize={"2xl"}>
                  Remonto pasiūlymo pateikimas
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel fontSize={"xl"}>Pavadinimas</FormLabel>
                    <Input
                      type="text"
                      defaultValue={newOffer.title}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, title: e.target.value })
                      }
                    />
                    {offerErrors.title && (
                      <span className="text-xs text-red-600 ml-1 mt-1">
                        {offerErrors.title}
                      </span>
                    )}
                    <FormLabel fontSize={"xl"} mt={4}>
                      Aprašymas
                    </FormLabel>
                    <Textarea
                      maxLength={255}
                      height={"180px"}
                      maxHeight={"180px"}
                      defaultValue={newOffer.description}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          description: e.target.value,
                        })
                      }
                    />
                    {offerErrors.description && (
                      <span className="text-xs text-red-600 ml-1 mt-1">
                        {offerErrors.description}
                      </span>
                    )}
                    <FormLabel fontSize={"xl"} mt={4}>
                      Kaina
                    </FormLabel>
                    <Input
                      type="number"
                      defaultValue={newOffer.cost}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          cost: parseFloat(e.target.value),
                        })
                      }
                    />
                    {offerErrors.cost && (
                      <span className="text-xs text-red-600 ml-1 mt-1">
                        {offerErrors.cost}
                      </span>
                    )}
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="green" onClick={() => createOffer()}>
                    Pasiūlyti
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </main>
      )}
    </>
  );
}
