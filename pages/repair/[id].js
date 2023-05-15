import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { formatInTimeZone } from "date-fns-tz";
import { useSession } from "next-auth/react";
import RepairOffer from "@/components/RepairOffer";

export default function Repair() {
  const { data: session } = useSession();
  const router = useRouter();
  const repair_id = router.query.id;

  const [repairData, setRepairData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [changedStatus, setChangedStatus] = useState("registered");
  const [refresh, setRefresh] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newOfferData, setNewOfferData] = useState({
    title: "",
    description: "",
    cost: "",
  });
  const toast = useToast();
  const [offerFieldsErrors, setOfferFieldsErrors] = useState({
    title: "",
    description: "",
    cost: "",
  });
  const [offers, setOffers] = useState([]);
  const [client, setClient] = useState({});
  const [employee, setEmployee] = useState({});
  let clientId = 0;
  let employeeId = 0;

  const status = [
    { LT: "Užregistruotas", EN: "registered" },
    { LT: "Remontuojama", EN: "in_progress" },
    { LT: "Užbaigtas", EN: "finished" },
  ];

  useEffect(() => {
    if (!repair_id) {
      return;
    }
    // fetchRepairData();
    // fetchRepairOffers();
    fetchData();
  }, [repair_id, refresh]);

  const fetchData = async () => {
    await fetchRepairData();
    await fetchRepairOffers();
    await fetchClientName();
    await fetchEmployeeName().then(() => setIsLoading(false));
  };

  const fetchRepairData = async () => {
    const response = await axios.post("/api/repair", {
      id: parseInt(repair_id),
    });
    clientId = response.data.fk_user_client;
    employeeId = response.data.fk_user_employee;
    setRepairData(response.data);
  };

  const fetchRepairOffers = async () => {
    const response = await axios.post("/api/offer/by/repair", {
      repair_id: parseInt(repair_id),
    });
    setOffers(response.data);
  };

  const fetchClientName = async () => {
    const response = await axios.post("/api/repair/find/client", {
      client_id: clientId,
    });
    setClient(response.data);
  };

  const fetchEmployeeName = async () => {
    const response = await axios.post("/api/repair/find/employee", {
      employee_id: employeeId,
    });
    setEmployee(response.data);
  };

  const updateRepairData = async () => {
    let response;
    const currentDate = formatInTimeZone(
      new Date(),
      "+06:00",
      "yyyy-MM-dd kk:mm"
    );
    if (changedStatus === "finished") {
      response = await axios.put("/api/repair", {
        id: parseInt(repair_id),
        title: repairData.title,
        finished_at: new Date(currentDate),
        total_cost: repairData.total_cost,
        status: repairData.status,
      });
    } else if (changedStatus === "in_progress") {
      response = await axios.put("/api/repair", {
        id: parseInt(repair_id),
        title: repairData.title,
        started_at: new Date(
          formatInTimeZone(new Date(), "+06:00", "yyyy-MM-dd kk:mm")
        ),
        estimated_time: repairData.estimated_time,
        total_cost: repairData.total_cost,
        status: repairData.status,
      });
    } else if (repairData.status === "registered") {
      response = await axios.put("/api/repair", {
        id: parseInt(repair_id),
        title: repairData.title,
        total_cost: repairData.total_cost,
      });
    }

    if (response.status === 201) {
      // router.reload(window.location.pathname);
      setRefresh(!refresh);
      toast({
        title: "Remonto informacija atnaujinta!",
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
  };

  const checkSelectedStatus = () => {
    if (repairData.status === "registered") {
      return "Užregistruotas";
    } else if (repairData.status === "in_progress") {
      return "Remontuojama";
    } else if (repairData.status === "finished") {
      return "Užbaigtas";
    }
  };

  const lastDayOfYear = () => {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, 11, 31);
  };

  const createOffer = async () => {
    if (newOfferData.title === "") {
      setOfferFieldsErrors({ title: "* Neįvestas pasiūlymo pavadinimas!" });
    } else if (newOfferData.description === "") {
      setOfferFieldsErrors({
        description: "* Neįvestas pasiūlymo aprašymas!",
      });
    } else if (newOfferData.cost === "") {
      setOfferFieldsErrors({
        cost: "* Neįvestas pasiūlymo kaina!",
      });
    } else {
      setOfferFieldsErrors({ title: "", description: "", cost: "" });
      const response = await axios.post("/api/offer/create", {
        title: newOfferData.title,
        description: newOfferData.description,
        cost: newOfferData.cost,
        repair_id: parseInt(repair_id),
        repair_title: repairData.title,
      });

      if (response.status === 201) {
        setRefresh(!refresh);
        onClose();
        toast({
          title: "Pasiūlymas sėkmingai pateiktas!",
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
          <div className="w-full flex flex-row p-4">
            <div>
              <FormControl maxWidth="xs">
                {session?.role === "administrator" && (
                  <div className="flex flex-col">
                    <FormLabel>
                      <span className="font-normal">Klientas: </span>
                      {client.name} {client.surname}
                    </FormLabel>
                    <FormLabel mb={4}>
                      <span className="font-normal">Darbuotojas: </span>
                      {employee.name} {employee.surname}
                    </FormLabel>
                  </div>
                )}
                {session?.role === "employee" && (
                  <FormLabel>
                    <span className="font-normal">Klientas: </span>
                    {client.name} {client.surname}
                  </FormLabel>
                )}
                {session?.role === "client" && (
                  <FormLabel mb={4}>
                    <span className="font-normal">Darbuotojas: </span>
                    {employee.name} {employee.surname}
                  </FormLabel>
                )}
                <FormLabel>Pavadinimas</FormLabel>
                {session?.role === "employee" ? (
                  <Input
                    type="text"
                    value={repairData.title}
                    onChange={(e) =>
                      setRepairData({ ...repairData, title: e.target.value })
                    }
                  />
                ) : (
                  <Text>{repairData.title}</Text>
                )}
                <FormLabel mt={4}>Būsena</FormLabel>
                {session?.role === "employee" ? (
                  <Select
                    variant="filled"
                    placeholder={checkSelectedStatus()}
                    defaultValue={repairData.status}
                    onChange={(e) => {
                      setRepairData({ ...repairData, status: e.target.value });
                      setChangedStatus(e.target.value);
                    }}
                  >
                    {status.map((status) => {
                      if (status.LT !== checkSelectedStatus()) {
                        return (
                          <option value={status.EN} key={status.EN}>
                            {status.LT}
                          </option>
                        );
                      }
                    })}
                  </Select>
                ) : (
                  <Text>{checkSelectedStatus()}</Text>
                )}
                <FormLabel mt={4}>Remontas užregistruotas</FormLabel>
                <Text>
                  {formatInTimeZone(
                    repairData.registered_at,
                    "UTC",
                    "yyyy-MM-dd kk:mm"
                  )}
                </Text>
                {(repairData.status === "in_progress" ||
                  repairData.status === "finished") &&
                  repairData.started_at !== null &&
                  repairData.estimated_time !== null && (
                    <div>
                      <FormLabel mt={4}>Remontas pradėtas</FormLabel>
                      {formatInTimeZone(
                        repairData.started_at,
                        "UTC",
                        "yyyy-MM-dd kk:mm"
                      ) || ""}
                      <FormLabel mt={4}>Planuojama remonto pabaiga</FormLabel>
                      {formatInTimeZone(
                        repairData.estimated_time,
                        "UTC",
                        "yyyy-MM-dd kk:mm"
                      )}
                    </div>
                  )}
                {repairData.status === "finished" &&
                  repairData.started_at !== null &&
                  repairData.finished_at !== null && (
                    <div>
                      <FormLabel mt={4}>Remontas baigtas</FormLabel>
                      {formatInTimeZone(
                        repairData.finished_at,
                        "UTC",
                        "yyyy-MM-dd kk:mm"
                      ) || ""}
                    </div>
                  )}
                <FormLabel mt={4}>Kaina</FormLabel>
                <Text>{repairData.total_cost} &euro;</Text>
                {repairData.status === "finished" &&
                  repairData.started_at !== null &&
                  repairData.rating !== null && (
                    <>
                      <FormLabel mt={4}>Įvertinimas</FormLabel>
                      <Text>
                        Įvertis:{" "}
                        <strong>{repairData.rating || "neįvertinta"}</strong>
                      </Text>
                      <Text>
                        Atsiliepimas:{" "}
                        <strong>{repairData.review || "nėra"}</strong>
                      </Text>
                    </>
                  )}
                {changedStatus === "in_progress" && (
                  <div>
                    <FormLabel mt={4}>Numatoma suremontuoti iki</FormLabel>
                    <input
                      type="datetime-local"
                      defaultValue={new Date().toLocaleTimeString("lt-LT", {
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
                      max={lastDayOfYear().toLocaleString("lt-LT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      onChange={({ target }) => {
                        setRepairData({
                          ...repairData,
                          estimated_time: new Date(
                            new Date(target.valueAsNumber).toLocaleDateString(
                              "lt-LT",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                timeZone: "UTC",
                              }
                            )
                          ),
                        });
                      }}
                    />
                  </div>
                )}
                <div className="flex flex-row gap-4">
                  {session?.role === "employee" && (
                    <Button
                      colorScheme="green"
                      mt={4}
                      onClick={() => updateRepairData()}
                    >
                      Išsaugoti
                    </Button>
                  )}
                  <Button
                    colorScheme="red"
                    mt={4}
                    onClick={() => router.back()}
                  >
                    Grįžti atgal
                  </Button>
                </div>
              </FormControl>
            </div>
            <div className="ml-20 w-1/3">
              <FormLabel>Remonto pasiūlymai</FormLabel>
              {offers?.map((offer) => (
                <RepairOffer
                  key={offer.id}
                  id={offer.id}
                  title={offer.title}
                  description={offer.description}
                  cost={offer.cost}
                  userRole={session?.role}
                />
              ))}
              {offers.length === 0 && (
                <p className="text-red-300">Remonto pasiūlymų nėra</p>
              )}
              {session?.role === "employee" && (
                <Button mt={4} colorScheme="green" onClick={onOpen}>
                  Sukurti pasiūlymą
                </Button>
              )}
            </div>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              closeOnOverlayClick={false}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Remonto pasiūlymo pateikimas</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormLabel>Pavadinimas</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setNewOfferData({
                        ...newOfferData,
                        title: e.target.value,
                      })
                    }
                  />
                  {offerFieldsErrors.title && (
                    <span className="text-xs text-red-600 ml-1">
                      {offerFieldsErrors.title}
                    </span>
                  )}
                  <FormLabel mt={4}>Aprašymas</FormLabel>
                  <Textarea
                    maxLength={255}
                    height={"180px"}
                    maxHeight={"180px"}
                    onChange={(e) =>
                      setNewOfferData({
                        ...newOfferData,
                        description: e.target.value,
                      })
                    }
                  />
                  {offerFieldsErrors.description && (
                    <span className="text-xs text-red-600 ml-1">
                      {offerFieldsErrors.description}
                    </span>
                  )}
                  <FormLabel mt={4}>Kaina</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) =>
                      setNewOfferData({
                        ...newOfferData,
                        cost: parseFloat(e.target.value),
                      })
                    }
                  />
                  {offerFieldsErrors.cost && (
                    <span className="text-xs text-red-600 ml-1">
                      {offerFieldsErrors.cost}
                    </span>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="green" onClick={() => createOffer()}>
                    Pasiūlyti
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        )}
      </main>
    </>
  );
}
